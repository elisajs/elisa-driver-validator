//imports
import assert from "assert";
import {Driver, Result} from "elisa";
import {suite, test, init, fin} from "justo";
import {ECHO, BANDS} from "../data/store";

//suite
export default suite("Asynchronous Connection", function() {
  var drv, drvName, db, cx, cxOpts, store, bandsStore, emptyStore, createStores, dropStores;

  init({title: "Initialize suite from params"}, function(params) {
    params = params[0];

    if (params.type == "store") {
      bandsStore = "bands";
      emptyStore = "empty";
    } else {
      bandsStore = "test.bands";
      emptyStore = "test.empty";
    }

    drvName = params.name;
    cxOpts = params.cxOpts;
    createStores = params.createStores;
    dropStores = params.dropStores;
  });

  init({title: "Get driver"}, function() {
    drv = Driver.getDriver(drvName);
  });

  init({name: "*", title: "Open connection and get store"}, function(done) {
    drv.openConnection(cxOpts, function(err, con) {
      cx = con;
      db = cx.db;
      store = db.getStore(bandsStore);

      done();
    });
  });

  init({name: "*", title: "Create stores and data"}, function(done) {
    createStores(
      cxOpts,
      [
        {name: bandsStore, docs: BANDS},
        {name: emptyStore, docs: []}
      ],
      done
    );
  });

  fin({name: "*", title: "Drop stores"}, function(done) {
    dropStores(cxOpts, [bandsStore, emptyStore], done);
  });

  fin({name: "*", title: "Close connection"}, function(done) {
    cx.close(done);
  });

  test("#qn", function() {
    store.qn.must.be.eq(bandsStore);
  });

  test("#fqn", function() {
    store.fqn.must.be.eq("elisa." + bandsStore);
  });

  suite("#hasId()", function() {
    test("hasId(id, callback) - existing", function(done) {
      store.hasId(BANDS[0].id, function(err, exist) {
        assert(err === undefined);
        exist.must.be.eq(true);
        done();
      });
    });

    test("hasId(id, callback) - not existing", function(done) {
      store.hasId("unknown", function(err, exist) {
        assert(err === undefined);
        exist.must.be.eq(false);
        done();
      });
    });
  });

  suite("#find()", function() {
    test("find({id}, callback) => undefined", function(done) {
      store.find({id: "unknown"}, function(err, doc) {
        assert(err === undefined);
        assert(doc === undefined);
        done();
      });
    });

    test("find({id}, callback) => object", function(done) {
      store.find({id: BANDS[0].id}, function(err, doc) {
        assert(err === undefined);
        doc.must.have(BANDS[0]);
        done();
      });
    });
  });

  suite("#findAll()", function() {
    test("findAll(callback) => Result - with data", function(done) {
      store.findAll(function(err, res) {
        assert(err === undefined);
        res.must.be.instanceOf(Result);
        res.length.must.be.eq(BANDS.length);
        res.docs.must.be.similarTo(BANDS);
        done();
      });
    });

    test("findAll(callback) => Result - without data", function(done) {
      db.getStore(emptyStore).findAll(function(err, res) {
        assert(err === undefined);
        res.must.be.instanceOf(Result);
        res.length.must.be.eq(0);
        res.docs.must.be.eq([]);
        done();
      });
    });
  });

  suite("#count()", function() {
    suite("Without documents", function() {
      test("count(callback) => 0", function(done) {
        db.getStore(emptyStore).count(function(err, cnt) {
          assert(err === undefined);
          cnt.must.be.eq(0);
          done();
        });
      });

      test("count(opts, callback) => 0", function(done) {
        db.getStore(emptyStore).count({}, function(err, cnt) {
          assert(err === undefined);
          cnt.must.be.eq(0);
          done();
        });
      });
    });

    suite("With documents", function() {
      test("count(callback) => number", function(done) {
        store.count(function(err, cnt) {
          assert(err === undefined);
          cnt.must.be.eq(BANDS.length);
          done();
        });
      });

      test("count(opts, callback) => number", function(done) {
        store.count({}, function(err, cnt) {
          assert(err === undefined);
          cnt.must.be.eq(BANDS.length);
          done();
        });
      });
    });
  });

  suite("#insert()", function() {
    suite("One document", function() {
      suite("Id doesn't exist", function() {
        test("insert(doc) - key doesn't exist", function(done) {
          store.insert(ECHO);

          setTimeout(function() {
            store.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo(BANDS.concat([ECHO]));
              done();
            });
          }, 500);
        });

        test("insert(doc, callback) - key doesn't exist", function(done) {
          store.insert(ECHO, function(err) {
            assert(err === undefined);

            store.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo(BANDS.concat([ECHO]));
              done();
            });
          });
        });
      });

      suite("Id exists", function() {
        test("insert(doc) - key exists", function(done) {
          const id = BANDS[0].id;

          store.insert({id, x: 1, y: 2, z: 3});

          setTimeout(function() {
            store.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo(BANDS.slice(1).concat([{id, x: 1, y: 2, z: 3}]));
              done();
            });
          }, 500);
        });

        test("insert(doc, callback) - key exists", function(done) {
          const id = BANDS[0].id;

          store.insert({id, x: 1, y: 2, z: 3}, function(err) {
            assert(err === undefined);

            store.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo(BANDS.slice(1).concat([{id, x: 1, y: 2, z: 3}]));
              done();
            });
          });
        });
      });
    });

    suite("Several documents", function() {
      suite("No document exists", function() {
        test("insert(docs)", function(done) {
          const DOCS = [{id: "one", x: 1}, {id: "two", x: 2}];
          const store = db.getStore(emptyStore);

          store.insert(DOCS);

          setTimeout(function() {
            store.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo(DOCS);
              done();
            });
          }, 500);
        });

        test("insert(docs, callback)", function(done) {
          const DOCS = [{id: "one", x: 1}, {id: "two", x: 2}];
          const store = db.getStore(emptyStore);

          store.insert(DOCS, function(err) {
            assert(err === undefined);

            store.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo(DOCS);
              done();
            });
          });
        });
      });

      suite("Some document exists", function() {
        test("insert(docs)", function(done) {
          const DOCS = [BANDS[0], {id: "one", x: 1}, {id: "two", x: 2}];

          store.insert(DOCS);

          setTimeout(function() {
            store.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo(BANDS.slice(1).concat(DOCS));
              done();
            });
          }, 500);
        });

        test("insert(docs, callback)", function(done) {
          const DOCS = [BANDS[0], {id: "one", x: 1}, {id: "two", x: 2}];

          store.insert(DOCS, function(err) {
            assert(err === undefined);

            store.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo(BANDS.slice(1).concat(DOCS));
              done();
            });
          });
        });
      });
    });
  });

  suite("#remove()", function() {
    test("remove({id}) - id not existing", function(done) {
      store.remove({id: "unknown"});

      setTimeout(function() {
        store.findAll(function(err, res) {
          assert(err === undefined);
          res.docs.must.be.similarTo(BANDS);
          done();
        });
      }, 500);
    });

    test("remove({id}, callback) - id not existing", function(done) {
      store.remove({id: "unknown"}, function(err) {
        assert(err === undefined);

        store.findAll(function(err, res) {
          assert(err === undefined);
          res.docs.must.be.similarTo(BANDS);
          done();
        });
      });
    });

    test("remove({id}) - id existing", function(done) {
      store.remove({id: BANDS[0].id});

      setTimeout(function() {
        store.findAll(function(err, res) {
          assert(err === undefined);
          res.docs.must.be.similarTo(BANDS.slice(1));
          done();
        });
      }, 500);
    });

    test("remove({id}, callback) - id existing", function(done) {
      store.remove({id: BANDS[0].id}, function(err) {
        assert(err === undefined);

        store.findAll(function(err, res) {
          assert(err === undefined);
          res.docs.must.be.similarTo(BANDS.slice(1));
          done();
        });
      });
    });
  });

  suite("#truncate()", function() {
    test("truncate()", function(done) {
      store.truncate();

      setTimeout(function() {
        store.count(function(err, cnt) {
          assert(err === undefined);
          cnt.must.be.eq(0);
          done();
        });
      }, 500);
    });

    test("truncate(callback)", function(done) {
      store.truncate(function(err) {
        assert(err === undefined);

        store.count(function(err, cnt) {
          assert(err === undefined);
          cnt.must.be.eq(0);
          done();
        });
      });
    });
  });

  suite("#update()", function() {
    test("update({id}, fields) - id not existing", function(done) {
      store.update({id: "unknown"}, {x: 123});

      setTimeout(function() {
        store.findAll(function(err, res) {
          assert(err === undefined);
          res.docs.must.be.similarTo(BANDS);
          done();
        });
      }, 500);
    });

    test("update({id}, fields) - id existing", function(done) {
      store.update({id: BANDS[0].id}, {x: 123, year: {$inc: 1}}, function(err) {
        assert(err === undefined);

        store.findAll(function(err, res) {
          assert(err === undefined);
          res.docs.must.be.similarTo([Object.assign({}, BANDS[0], {x: 123, year: BANDS[0].year + 1})].concat(BANDS.slice(1)));
          done();
        });
      });
    });
  });

  suite("#save()", function() {
    suite("Error handler", function() {
      test("save(doc) - without id", function() {
        store.save.bind(store).must.raise(Error, [{x: 1, y: 2}]);
      });

      test("save(doc, opts) - without id", function() {
        store.save.bind(store).must.raise(Error, [{x: 1, y: 2}, {}]);
      });
    });

    suite("Insert", function() {
      test("save(doc, callback)", function(done) {
        store.save(ECHO, function(err) {
          assert(err === undefined);
          store.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(BANDS.concat(ECHO));
            done();
          });
        });
      });

      test("save(doc, opts)", function(done) {
        store.save(ECHO, {}, function(err) {
          assert(err === undefined);
          store.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(BANDS.concat(ECHO));
            done();
          });
        });
      });
    });

    suite("Update", function() {
      test("save(doc, callback)", function(done) {
        const band = Object.assign({}, BANDS[0], {origin: "Jamaica"});
        store.save(band, function(err) {
          assert(err === undefined);
          store.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo([band].concat(BANDS.slice(1)));
            done();
          });
        });
      });

      test("save(doc, opts, callback)", function(done) {
        const band = Object.assign({}, BANDS[0], {origin: "Jamaica"});
        store.save(band, {}, function(err) {
          assert(err === undefined);
          store.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo([band].concat(BANDS.slice(1)));
            done();
          });
        });
      });
    });
  });

  suite("Injection", function() {
    test("insert(doc, callback)", function(done) {
      const band = Object.assign({}, ECHO, {author: "elisa"});
      db.getStore(bandsStore, {inject: {author: "elisa"}}).insert(band, function(err) {
        assert(err === undefined);
        store.findAll(function(err, res) {
          assert(err === undefined);
          res.docs.must.be.similarTo(BANDS.concat([band]));
          done();
        });
      });
    });

    test("save(doc, callback)", function(done) {
      const band = Object.assign({}, ECHO, {author: "elisa"});
      db.getStore(bandsStore, {inject: {author: "elisa"}}).save(band, function(err) {
        assert(err === undefined);
        store.findAll(function(err, res) {
          assert(err === undefined);
          res.docs.must.be.similarTo(BANDS.concat([band]));
          done();
        });
      });
    });
  });
});
