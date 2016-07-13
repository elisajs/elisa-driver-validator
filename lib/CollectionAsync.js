//imports
import assert from "assert";
import {Driver, Result, CollectionQuery} from "elisa";
import {suite, test, init, fin} from "justo";
import {
  ECHO, JESUS, DAWES, BANDS, DISBANDED, NON_DISBANDED,
  YEAR_GE_2000, YEAR_GT_2000, YEAR_LE_2000, YEAR_LT_2000,
  YEAR_NOT_BETWEEN_1990_AND_1999, YEAR_BETWEEN_1990_AND_1999,
  ID_LIKE_A, ID_NOT_LIKE_A, ORIGIN_LIKE_L, ORIGIN_NOT_LIKE_L,
  ID_GE_M, ID_GT_M, ID_LE_M, ID_LT_M,
  ID_BETWEEN_L_AND_O, ID_NOT_BETWEEN_L_AND_O,
  ID_NOT_CONTAIN_W, ID_CONTAIN_W,
  ORIGIN_CONTAIN_LONDON, ORIGIN_NOT_CONTAIN_LONDON,
  TAGS_CONTAIN_FOLK, TAGS_NOT_CONTAIN_FOLK
} from "../data/collection";

//suite
export default suite("Asynchronous Connection", function() {
  var drv, drvName, db, cx, cxOpts, coll, bandsColl, emptyColl, createCollections, dropCollections;

  init({title: "Initialize suite from params"}, function(params) {
    params = params[0];
    if (params.type == "collection") {
      bandsColl = "bands";
      emptyColl = "empty";
    } else {
      bandsColl = "test.bands";
      emptyColl = "test.empty";
    }

    drvName = params.name;
    cxOpts = params.cxOpts;
    createCollections = params.createCollections;
    dropCollections = params.dropCollections;
  });

  init({title: "Get driver"}, function() {
    drv = Driver.getDriver(drvName);
  });

  init({name: "*", title: "Open connection and get collection"}, function(done) {
    drv.openConnection(cxOpts, function(err, con) {
      cx = con;
      db = cx.db;
      coll = db.getCollection(bandsColl);
      done();
    });
  });

  init({name: "*", title: "Create collections and data"}, function(done) {
    createCollections(
      cxOpts,
      [
        {name: bandsColl, docs: BANDS},
        {name: emptyColl, docs: []}
      ],
      done
    );
  });

  fin({name: "*", title: "Drop collections"}, function(done) {
    dropCollections(cxOpts, [bandsColl, emptyColl], done);
  });

  fin({name: "*", title: "Close connection"}, function(params) {
    cx.close();
  });

  test("Attributes", function() {
    coll.qn.must.be.eq(bandsColl);
    coll.fqn.must.be.eq("elisa." + bandsColl);
    coll.must.have({inject: undefined});
  });

  test("#q()", function() {
    var q = coll.q();
    q.must.be.instanceOf(CollectionQuery);
    q.source.must.be.same(coll);
  });

  suite("#hasId()", function() {
    test("hasId(id, callback) => true", function(done) {
      coll.hasId(BANDS[0].id, function(err, has) {
        assert(err === undefined);
        has.must.be.eq(true);
        done();
      });
    });

    test("hasId(id, callback) => false", function(done) {
      coll.hasId("unknown", function(err, has) {
        assert(err === undefined);
        has.must.be.eq(false);
        done();
      });
    });
  });

  suite("#findAll()", function() {
    test("findAll(callback) => Result with data", function(done) {
      coll.findAll(function(err, res) {
        assert(err === undefined);
        res.must.be.instanceOf(Result);
        res.length.must.be.eq(BANDS.length);
        res.docs.must.be.similarTo(BANDS);
        done();
      });
    });

    test("findAll(callback) => Result without data", function(done) {
      db.getCollection(emptyColl).findAll(function(err, res) {
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
      test("count(callback) => number", function(done) {
        db.getCollection(emptyColl).count(function(err, count) {
          assert(err === undefined);
          count.must.be.eq(0);
          done();
        });
      });

      test("count(opts, callback) => number", function(done) {
        db.getCollection(emptyColl).count(function(err, count) {
          assert(err === undefined);
          count.must.be.eq(0);
          done();
        });
      });
    });

    suite("With documents", function() {
      test("count(callback) => number", function(done) {
        coll.count(function(err, count) {
          assert(err === undefined);
          count.must.be.eq(BANDS.length);
          done();
        });
      });

      test("count(opts, callback) => number", function(done) {
        coll.count({}, function(err, count) {
          assert(err === undefined);
          count.must.be.eq(BANDS.length);
          done();
        });
      });
    });
  });

  suite("#insert()", function() {
    suite("One document", function() {
      suite("Id doesn't exist", function() {
        test("insert(doc)", function(done) {
          coll.insert(ECHO);

          setTimeout(function() {
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo(BANDS.concat([ECHO]));
              done();
            });
          }, 500);
        });

        test("insert(doc, opts)", function(done) {
          coll.insert(ECHO, {});

          setTimeout(function() {
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo(BANDS.concat([ECHO]));
              done();
            });
          }, 500);
        });

        test("insert(doc, callback)", function(done) {
          coll.insert(ECHO, function(err) {
            assert(err === undefined);
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo(BANDS.concat([ECHO]));
              done();
            });
          });
        });

        test("insert(doc, opts, callback)", function(done) {
          coll.insert(ECHO, {}, function(err) {
            assert(err === undefined);
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo(BANDS.concat([ECHO]));
              done();
            });
          });
        });
      });

      suite("Id exists", function() {
        test("insert(doc) - nothing inserted", function(done) {
          coll.insert({id: BANDS[0].id, x: 1, y: 2, z: 3});

          setTimeout(function() {
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo(BANDS);
              done();
            });
          }, 500);
        });

        test("insert(doc, opts) - nothing inserted", function(done) {
          coll.insert({id: BANDS[0].id, x: 1, y: 2, z: 3}, {});

          setTimeout(function() {
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo(BANDS);
              done();
            });
          }, 500);
        });

        test("insert(doc, callback) => error", function(done) {
          coll.insert({id: BANDS[0].id, x: 1, y: 2, z: 3}, function(err) {
            err.must.be.instanceOf(Error);
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo(BANDS);
              done();
            });
          });
        });

        test("insert(doc, opts, callback) => error", function(done) {
          coll.insert({id: BANDS[0].id, x: 1, y: 2, z: 3}, {}, function(err) {
            err.must.be.instanceOf(Error);
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo(BANDS);
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

          coll.insert(DOCS);

          setTimeout(function() {
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo(BANDS.concat(DOCS));
              done();
            });
          }, 500);
        });

        test("insert(docs, opts)", function(done) {
          const DOCS = [{id: "one", x: 1}, {id: "two", x: 2}];

          coll.insert(DOCS, {});

          setTimeout(function() {
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo(BANDS.concat(DOCS));
              done();
            });
          }, 500);
        });

        test("insert(docs, callback)", function(done) {
          const DOCS = [{id: "one", x: 1}, {id: "two", x: 2}];

          coll.insert(DOCS, function(err) {
            assert(err === undefined);
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo(BANDS.concat(DOCS));
              done();
            });
          });
        });

        test("insert(docs, opts, callback)", function(done) {
          const DOCS = [{id: "one", x: 1}, {id: "two", x: 2}];

          coll.insert(DOCS, {}, function(err) {
            assert(err === undefined);
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo(BANDS.concat(DOCS));
              done();
            });
          });
        });
      });

      suite("Some document exists", function() {
        test("insert(docs)", function(done) {
          const DOCS = [{id: "one", x: 1}, {id: "two", x: 2}, BANDS[0]];

          coll.insert(DOCS);

          setTimeout(function() {
            coll.count(function(err, count) {
              assert(err === undefined);
              count.must.be.eq(BANDS.length + 2);
              done();
            });
          }, 500);
        });

        test("insert(docs, opts)", function(done) {
          const DOCS = [{id: "one", x: 1}, {id: "two", x: 2}, BANDS[0]];

          coll.insert(DOCS, {});

          setTimeout(function() {
            coll.count(function(err, count) {
              assert(err === undefined);
              count.must.be.eq(BANDS.length + 2);
              done();
            });
          }, 500);
        });

        test("insert(docs, callback)", function(done) {
          const DOCS = [{id: "one", x: 1}, {id: "two", x: 2}, BANDS[0]];

          coll.insert(DOCS, function(err) {
            err.must.be.instanceOf(Error);

            coll.count(function(err, count) {
              assert(err === undefined);
              count.must.be.eq(BANDS.length + 2);
              done();
            });
          });
        });

        test("insert(docs, opts, callback)", function(done) {
          const DOCS = [{id: "one", x: 1}, {id: "two", x: 2}, BANDS[0]];

          coll.insert(DOCS, {}, function(err) {
            err.must.be.instanceOf(Error);

            coll.count(function(err, count) {
              assert(err === undefined);
              count.must.be.eq(BANDS.length + 2);
              done();
            });
          });
        });
      });
    });

    test("Inserting fields with values of different types", function(done) {
      const doc = {id: "123", a: ["one", 2, "three"], b: true, n: 1234321, o: {x: 111, y: 222, z: 333}, s: "string"};
      coll.insert(doc, function(err) {
        assert(err === undefined);
        coll.findAll(function(err, res) {
          assert(err === undefined);
          res.docs.must.be.similarTo(BANDS.concat(doc));
          done();
        });
      });
    });
  });

  suite("#remove()", function() {
    test("remove({}) - nop", function(done) {
      coll.remove({});

      setTimeout(function() {
        coll.findAll(function(err, res) {
          assert(err === undefined);
          res.docs.must.be.similarTo(BANDS);
          done();
        });
      }, 500);
    });

    test("remove({}, callback) - nop", function(done) {
      coll.remove({}, function(err) {
        assert(err === undefined);
        coll.findAll(function(err, res) {
          assert(err === undefined);
          res.docs.must.be.similarTo(BANDS);
          done();
        });
      });
    });

    suite("remove({id})", function() {
      test("remove({id}) - id not existing", function(done) {
        coll.remove({id: "unknown"});

        setTimeout(function() {
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(BANDS);
            done();
          });
        }, 500);
      });

      test("remove({id}, callback) - id not existing", function(done) {
        coll.remove({id: "unknown"}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(BANDS);
            done();
          });
        });
      });

      test("remove({id}) - id existing", function(done) {
        coll.remove({id: BANDS[0].id});

        setTimeout(function() {
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(BANDS.slice(1));
            done();
          });
        }, 500);
      });

      test("remove({id}, callback) - id existing", function(done) {
        coll.remove({id: BANDS[0].id}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(BANDS.slice(1));
            done();
          });
        });
      });
    });

    suite("remove(query)", function() {
      test("remove(simple) - removing", function(done) {
        coll.remove({disbanded: true});

        setTimeout(function() {
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(NON_DISBANDED);
            done();
          });
        }, 500);
      });

      test("remove(simple, callback) - removing", function(done) {
        coll.remove({disbanded: true}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(NON_DISBANDED);
            done();
          });
        });
      });

      test("remove(simple) - not removing", function(done) {
        coll.remove({active: false});

        setTimeout(function() {
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(BANDS);
            done();
          });
        }, 500);
      });

      test("remove(simple, callback) - not removing", function(done) {
        coll.remove({active: false}, function(err) {
          assert(err === undefined);

          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(BANDS);
            done();
          });
        });
      });

      test("remove(compound) - removing", function(done) {
        coll.remove({active: true, disbanded: false});

        setTimeout(function() {
          coll.findAll(function(err, res) {
            res.docs.must.be.similarTo(DISBANDED);
            done();
          });
        }, 500);
      });

      test("remove(compound, callback) - removing", function(done) {
        coll.remove({active: true, disbanded: false}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            res.docs.must.be.similarTo(DISBANDED);
            done();
          });
        });
      });

      test("remove(compound) - not removing", function(done) {
        coll.remove({active: false, disbanded: true});

        setTimeout(function() {
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(BANDS);
            done();
          });
        }, 500);
      });

      test("remove(compound, callback) - not removing", function(done) {
        coll.remove({active: false, disbanded: true}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(BANDS);
            done();
          });
        });
      });
    });

    suite("WHERE operators", function() {
      test("remove({id: value}, callback)", function(done) {
        coll.remove({id: BANDS[0].id}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(BANDS.slice(1));
            done();
          });
        });
      });

      test("remove({field: value}, callback)", function(done) {
        coll.remove({disbanded: true}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(NON_DISBANDED);
            done();
          });
        });
      });

      test("remove({id: {$eq: value}}, callback)", function(done) {
        coll.remove({id: {$eq: BANDS[0].id}}, function(err) {
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(BANDS.slice(1));
            done();
          });
        });
      });

      test("remove({field: {$eq: value}}, callback)", function(done) {
        coll.remove({disbanded: {$eq: true}}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(NON_DISBANDED);
            done();
          });
        });
      });

      test("remove({id: {$ne: value}}, callback)", function(params, done) {
        coll.remove({id: {[params[0]]: BANDS[0].id}}, function(err, res) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo([BANDS[0]]);
            done();
          });
        });
      }).params("$ne", "$neq");

      test("remove({field: {$ne: value}}, callback)", function(params, done) {
        coll.remove({disbanded: {[params[0]]: true}}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(DISBANDED);
            done();
          });
        });
      }).params("$ne", "$neq");

      test("remove({id: {$lt: value}}, callback)", function(done) {
        coll.remove({id: {$lt: "M"}}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(ID_GE_M);
            done();
          });
        });
      });

      test("remove({field: {$lt: value}}, callback)", function(done) {
        coll.remove({year: {$lt: 2000}}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(YEAR_GE_2000);
            done();
          });
        });
      });

      test("remove({id: {$le: value}}, callback)", function(params, done) {
        coll.remove({id: {[params[0]]: "M"}}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(ID_GT_M);
            done();
          });
        });
      }).params("$le", "$lte");

      test("remove({field: {$le: value}}, callback)", function(params, done) {
        coll.remove({year: {[params[0]]: 1999}}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(YEAR_GT_2000);
            done();
          });
        });
      }).params("$le", "$lte");

      test("remove({id: {$gt: value}}, callback)", function(done) {
        coll.remove({id: {$gt: "M"}}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(ID_LE_M);
            done();
          });
        });
      });

      test("remove({field: {$gt: value}}, callback)", function(done) {
        coll.remove({year: {$gt: 2000}}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(YEAR_LE_2000);
            done();
          });
        });
      });

      test("remove({id: {$ge: value}}, callback)", function(params, done) {
        coll.remove({id: {[params[0]]: "M"}}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(ID_LT_M);
            done();
          });
        });
      }).params("$ge", "$gte");

      test("remove({field: {$ge: value}}, callback)", function(params, done) {
        coll.remove({year: {[params[0]]: 2000}}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(YEAR_LT_2000);
            done();
          });
        });
      }).params("$ge", "$gte");

      test("remove({id: {$between: [one, two]}}, callback)", function(done) {
        coll.remove({id: {$between: ["L", "O"]}}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(ID_NOT_BETWEEN_L_AND_O);
            done();
          });
        });
      });

      test("remove({field: {$between: [one, two]}}, callback)", function(done) {
        coll.remove({year: {$between: [1990, 1999]}}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(YEAR_NOT_BETWEEN_1990_AND_1999);
            done();
          });
        });
      });

      test("remove({id: {$nbetween: [one, two]}}, callback)", function(params, done) {
        coll.remove({id: {[params[0]]: ["L", "O"]}}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(ID_BETWEEN_L_AND_O);
            done();
          });
        });
      }).params("$nbetween", "$notBetween");

      test("remove({field: {$nbetween: [one, two]}}, callback)", function(params, done) {
        coll.remove({year: {[params[0]]: [1990, 1999]}}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(YEAR_BETWEEN_1990_AND_1999);
            done();
          });
        });
      }).params("$nbetween", "$notBetween");

      test("remove({id: {$like: value}}, callback)", function(done) {
        coll.remove({id: {$like: "%a%"}}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(ID_NOT_LIKE_A);
            done();
          });
        });
      });

      test("remove({field: {$like: value}}, callback)", function(done) {
        coll.remove({origin: {$like: "%L%"}}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(ORIGIN_NOT_LIKE_L);
            done();
          });
        });
      });

      test("remove({id: {$nlike: value}}, callback)", function(params, done) {
        coll.remove({id: {[params[0]]: "%a%"}}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(ID_LIKE_A);
            done();
          });
        });
      }).params("$nlike", "$notLike");

      test("remove({field: {$nlike: value}}, callback)", function(params, done) {
        coll.remove({origin: {[params[0]]: "%L%"}}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(ORIGIN_LIKE_L);
            done();
          });
        });
      }).params("$nlike", "$notLike");

      test("remove({id: {$in: array}}, callback)", function(done) {
        coll.remove({id: {$in: [BANDS[0].id, BANDS[1].id]}}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(BANDS.slice(2));
            done();
          });
        });
      });

      test("remove({id: {$in: []}}, callback)", function(done) {
        coll.remove({id: {$in: []}}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(BANDS);
            done();
          });
        });
      });

      test("remove({field: {$nin: array}}, callback)", function(params, done) {
        coll.remove({origin: {[params[0]]: [BANDS[0].origin, BANDS[1].origin]}}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(BANDS.slice(0, 2));
            done();
          });
        });
      }).params("$nin", "$notIn");

      test("remove({field: {$nin: []}}, callback)", function(params, done) {
        coll.remove({origin: {[params[0]]: []}}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo([]);
            done();
          });
        });
      }).params("$nin", "$notIn");

      test("remove({id: {$contains: value}}, callback)", function(params, done) {
        coll.remove({id: {[params[0]]: "w"}}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(ID_NOT_CONTAIN_W);
            done();
          });
        });
      }).params("$contain", "$contains");

      test("remove({field: {$contains: value}}, callback) - field as string", function(params, done) {
        coll.remove({origin: {[params[0]]: "London"}}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(ORIGIN_NOT_CONTAIN_LONDON);
            done();
          });
        });
      }).params("$contain", "$contains");

      test("remove({field: {$contains: value}}, callback) - field as array", function(params, done) {
        coll.remove({tags: {[params[0]]: "folk"}}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(TAGS_NOT_CONTAIN_FOLK);
            done();
          });
        });
      }).params("$contain", "$contains");

      test("remove({id: {$ncontains: value}}, vlaue)", function(params, done) {
        coll.remove({id: {[params[0]]: "w"}}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(ID_CONTAIN_W);
            done();
          });
        });
      }).params("$ncontains", "$notContains", "$ncontain", "$notContain");

      test("remove({field: {$ncontains: value}}, callback) - field as string", function(params, done) {
        coll.remove({origin: {[params[0]]: "London"}}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(ORIGIN_CONTAIN_LONDON);
            done();
          });
        });
      }).params("$ncontains", "$notContains", "$ncontain", "$notContain");

      test("remove({field: {$ncontains: value}}, callback) - field as array", function(params, done) {
        coll.remove({tags: {[params[0]]: "folk"}}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(TAGS_CONTAIN_FOLK);
            done();
          });
        });
      }).params("$ncontains", "$notContains", "$ncontain", "$notContain");
    });
  });

  suite("#truncate()", function() {
    test("truncate()", function(done) {
      coll.truncate();

      setTimeout(function() {
        coll.count(function(err, cnt) {
          assert(err === undefined);
          cnt.must.be.eq(0);
          done();
        });
      }, 500);
    });

    test("truncate(opts)", function(done) {
      coll.truncate({});

      setTimeout(function() {
        coll.count(function(err, cnt) {
          assert(err === undefined);
          cnt.must.be.eq(0);
          done();
        });
      }, 500);
    });

    test("truncate(callback)", function(done) {
      coll.truncate(function(err) {
        assert(err === undefined);
        coll.count(function(err, cnt) {
          assert(err === undefined);
          cnt.must.be.eq(0);
          done();
        });
      });
    });

    test("truncate(opts, callback)", function(done) {
      coll.truncate({}, function(err) {
        assert(err === undefined);
        coll.count(function(err, cnt) {
          assert(err === undefined);
          cnt.must.be.eq(0);
          done();
        });
      });
    });
  });

  suite("#update()", function() {
    suite("update({id})", function() {
      test("update({id}, fields) - id not existing", function(done) {
        coll.update({id: "unknown"}, {x: 123});

        setTimeout(function() {
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(BANDS);
            done();
          });
        }, 500);
      });

      test("update({id}, fields, callback) - id not existing", function(done) {
        coll.update({id: "unknown"}, {x: 123}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(BANDS);
            done();
          });
        });
      });

      test("update({id}, fields) - id existing", function(done) {
        coll.update({id: BANDS[0].id}, {x: 123, year: {$inc: 1}});

        setTimeout(function() {
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo([Object.assign({}, BANDS[0], {x: 123, year: BANDS[0].year + 1})].concat(BANDS.slice(1)));
            done();
          });
        }, 500);
      });

      test("update({id}, fields, callback) - id existing", function(done) {
        coll.update({id: BANDS[0].id}, {x: 123, year: {$inc: 1}}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo([Object.assign({}, BANDS[0], {x: 123, year: BANDS[0].year + 1})].concat(BANDS.slice(1)));
            done();
          });
        });
      });
    });

    suite("Update operators", function() {
      suite("{field: value}", function() {
        test("{field: value}", function(done) {
          const band = Object.assign({}, BANDS[0], {year: 1234});
          coll.update({id: band.id}, {year: {$set: 1234}}, function(err) {
            assert(err === undefined);
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo([band].concat(BANDS.slice(1)));
              done();
            });
          });
        });

        test("{field: value} - string", function(done) {
          const band = Object.assign({}, BANDS[0], {x: "an string"});
          coll.update({id: band.id}, {x: "an string"}, function(err) {
            assert(err === undefined);
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo([band].concat(BANDS.slice(1)));
              done();
            });
          });
        });

        test("{field: value} - number", function(done) {
          const band = Object.assign({}, BANDS[0], {x: 123});
          coll.update({id: band.id}, {x: 123}, function(err) {
            assert(err === undefined);
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo([band].concat(BANDS.slice(1)));
              done();
            });
          });
        });

        test("{field: value} - boolean", function(done) {
          const band = Object.assign({}, BANDS[0], {x: true});
          coll.update({id: band.id}, {x: true}, function(err) {
            assert(err === undefined);
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo([band].concat(BANDS.slice(1)));
              done();
            });
          });
        });

        test("{field: value} - array", function(done) {
          const band = Object.assign({}, BANDS[0], {x: ["one", 2, "three"]});
          coll.update({id: band.id}, {x: ["one", 2, "three"]}, function(err) {
            assert(err === undefined);
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo([band].concat(BANDS.slice(1)));
              done();
            });
          });
        });

        test("{field: value} - object", function(done) {
          const band = Object.assign({}, BANDS[0], {x: {x: "one", y: [0, 1, 2], z: {a: "one", b: "two"}}});
          coll.update({id: band.id}, {x: {x: "one", y: [0, 1, 2], z: {a: "one", b: "two"}}}, function(err) {
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo([band].concat(BANDS.slice(1)));
              done();
            });
          });
        });
      });

      test("{field: {$set: value}}", function(done) {
        const band = Object.assign({}, BANDS[0], {year: 1234});
        coll.update({id: band.id}, {year: {$set: 1234}}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo([band].concat(BANDS.slice(1)));
            done();
          });
        });
      });

      test("{field: {$inc: value}}", function(done) {
        const band = Object.assign({}, BANDS[0], {year: BANDS[0].year + 1234});
        coll.update({id: band.id}, {year: {$inc: 1234}}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo([band].concat(BANDS.slice(1)));
            done();
          });
        });
      });

      test("{field: {$dec: value}}", function(done) {
        const band = Object.assign({}, BANDS[0], {year: BANDS[0].year - 1234});
        coll.update({id: band.id}, {year: {$dec: 1234}}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo([band].concat(BANDS.slice(1)));
            done();
          });
        });
      });

      test("{field: {$mul: value}}", function(done) {
        const band = Object.assign({}, BANDS[0], {year: BANDS[0].year * 2});
        coll.update({id: band.id}, {year: {$mul: 2}}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo([band].concat(BANDS.slice(1)));
            done();
          });
        });
      });

      test("{field: {$div: value}}", function(done) {
        const band = Object.assign({}, BANDS[0], {year: BANDS[0].year / 2});
        coll.update({id: band.id}, {year: {$div: 2}}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo([band].concat(BANDS.slice(1)));
            done();
          });
        });
      });

      suite("{field: {$add: value}}", function() {
        test("{field: {$add: value}} - with field not existing", function(done) {
          const band = Object.assign({}, BANDS[0], {labels: ["Creation"]});
          coll.update({id: band.id}, {labels: {$add: "Creation"}}, function(err) {
            assert(err === undefined);
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo([band].concat(BANDS.slice(1)));
              done();
            });
          });
        });

        test("{field: {$add: value}} - with field being null", function(done) {
          const band = Object.assign({}, BANDS[1], {tags: ["alternative"]});
          coll.update({id: band.id}, {tags: {$add: "alternative"}}, function(err) {
            assert(err === undefined);
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo([BANDS[0], band].concat(BANDS.slice(2)));
              done();
            });
          });
        });

        test("{field: {$add: value}} - with empty array", function(done) {
          const band = Object.assign({}, BANDS[0], {tags: ["alternative"]});
          coll.update({id: band.id}, {tags: {$add: "alternative"}}, function(err) {
            assert(err === undefined);
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo([band].concat(BANDS.slice(1)));
              done();
            });
          });
        });

        test("{field: {$add: value}} - with non-empty array", function(done) {
          const band = Object.assign({}, BANDS[2], {tags: BANDS[2].tags.concat("indie")});
          coll.update({id: band.id}, {tags: {$add: "indie"}}, function(err) {
            assert(err === undefined);
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo(BANDS.slice(0, 2).concat([band]).concat(BANDS.slice(3)));
              done();
            });
          });
        });

        test("{field: {$add: value}} - item existing", function(done) {
          const band = BANDS[2];

          coll.update({id: band.id}, {tags: {$add: band.tags[0]}}, function(err) {
            assert(err === undefined);
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo(BANDS);
              done();
            });
          });
        });
      });

      suite("{field: {$remove: value}}", function() {
        test("{field: {$remove: value}} - with field not existing", function(done) {
          coll.update({id: BANDS[0].id}, {unknown: {$remove: "value"}}, function(err) {
            assert(err === undefined);
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo(BANDS);
              done();
            });
          });
        });

        test("{field: {$remove: value}} - with field being null", function(done) {
          coll.update({id: BANDS[1].id}, {tags: {$remove: "value"}}, function(err) {
            assert(err === undefined);
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo(BANDS);
              done();
            });
          });
        });

        test("{field: {$remove: value}} - with empty array", function(done) {
          coll.update({id: BANDS[0].id}, {tags: {$remove: "value"}}, function(err) {
            assert(err === undefined);
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo(BANDS);
              done();
            });
          });
        });

        test("{field: {$remove: value}} - item in the start", function(done) {
          const band = Object.assign({}, BANDS[2], {tags: ["folk rock", "folk"]});

          coll.update({id: band.id}, {tags: {$remove: "alternative"}}, function(err) {
            assert(err === undefined);
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo([band].concat(BANDS.slice(0, 2)).concat(BANDS.slice(3)));
              done();
            });
          });
        });

        test("{field: {$remove: value}} - item in the end", function(done) {
          const band = Object.assign({}, BANDS[2], {tags: ["alternative", "folk rock"]});

          coll.update({id: band.id}, {tags: {$remove: "folk"}}, function(err) {
            assert(err === undefined);
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo([band].concat(BANDS.slice(0, 2)).concat(BANDS.slice(3)));
              done();
            });
          });
        });

        test("{field: {$remove: value}} - item in the middle", function(done) {
          const band = Object.assign({}, BANDS[2], {tags: ["alternative", "folk"]});

          coll.update({id: band.id}, {tags: {$remove: "folk rock"}}, function(err) {
            assert(err === undefined);
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo([band].concat(BANDS.slice(0, 2)).concat(BANDS.slice(3)));
              done();
            });
          });
        });

        test("{field: {$remove: value}} - the only item", function(done) {
          const band = Object.assign({}, BANDS[3], {tags: []});

          coll.update({id: band.id}, {tags: {$remove: "alternative"}}, function(err) {
            assert(err === undefined);
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo([band].concat(BANDS.slice(0, 3).concat(BANDS.slice(4))));
              done();
            });
          });
        });
      });

      suite("{field: {$push: value}}", function() {
        test("{field: {$push: value}} - with field not existing", function(done) {
          const band = Object.assign({}, BANDS[0], {labels: ["Creation"]});

          coll.update({id: band.id}, {labels: {$push: "Creation"}}, function(err) {
            assert(err === undefined);
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo([band].concat(BANDS.slice(1)));
              done();
            });
          });
        });

        test("{field: {$push: value}} - with field being null", function(done) {
          const band = Object.assign({}, BANDS[1], {tags: ["alternative"]});

          coll.update({id: band.id}, {tags: {$push: "alternative"}}, function(err) {
            assert(err === undefined);
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo([BANDS[0], band].concat(BANDS.slice(2)));
              done();
            });
          });
        });

        test("{field: {$push: value}} - with empty array", function(done) {
          const band = Object.assign({}, BANDS[0], {tags: ["alternative"]});

          coll.update({id: band.id}, {tags: {$push: "alternative"}}, function(err) {
            assert(err === undefined);
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo([band].concat(BANDS.slice(1)));
              done();
            });
          });
        });

        test("{field: {$push: value}} - with non-empty array", function(done) {
          const band = Object.assign({}, BANDS[2], {tags: BANDS[2].tags.concat("indie")});

          coll.update({id: band.id}, {tags: {$push: "indie"}}, function(err) {
            assert(err === undefined);
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo(BANDS.slice(0, 2).concat([band]).concat(BANDS.slice(3)));
              done();
            });
          });
        });
      });

      suite("{field: {$pop: value}} - with field not existing", function() {
        test("{field: {$pop: value}} - with field not existing", function(done) {
          coll.update({id: BANDS[0].id}, {labels: {$pop: 1}}, function(err) {
            assert(err === undefined);
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo(BANDS);
              done();
            });
          });
        });

        test("{field: {$pop: value}} - with field is null", function(done) {
          coll.update({id: BANDS[1].id}, {tags: {$pop: 1}}, function(err) {
            assert(err === undefined);
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo(BANDS);
              done();
            });
          });
        });

        test("{field: {$pop: value}} - array.length == 0", function(done) {
          coll.update({id: BANDS[0].id}, {tags: {$pop: 1}}, function(err) {
            assert(err === undefined);
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo(BANDS);
              done();
            });
          });
        });

        test("{field: {$pop: value}} - array.length == 1", function(done) {
          const band = Object.assign({}, BANDS[3], {tags: []});

          coll.update({id: band.id}, {tags: {$pop: 1}}, function(err) {
            assert(err === undefined);
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo(BANDS.slice(0, 3).concat(band).concat(BANDS.slice(4)));
              done();
            });
          });
        });

        test("{field: {$pop: value}} - array.length == 2", function(done) {
          const band = Object.assign({}, BANDS[4], {tags: [BANDS[4].tags[0]]});

          coll.update({id: band.id}, {tags: {$pop: 1}}, function(err) {
            assert(err === undefined);
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo(BANDS.slice(0, 4).concat(band));
              done();
            });
          });
        });

        test("{field: {$pop: value}} - array.length > 2", function(done) {
          const band = Object.assign({}, BANDS[2], {tags: BANDS[2].tags.slice(0, 2)});

          coll.update({id: band.id}, {tags: {$pop: 1}}, function(err) {
            assert(err === undefined);
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo(BANDS.slice(0, 2).concat(band).concat(BANDS.slice(3)));
              done();
            });
          });
        });
      });

      suite("{field: {$concat: value}}", function() {
        test("{field: {$concat: value}} - with field not existing", function(done) {
          const band = Object.assign({}, BANDS[0], {unknown: "Great!"});

          coll.update({id: band.id}, {unknown: {$concat: "Great!"}}, function(err) {
            assert(err === undefined);
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo([band].concat(BANDS.slice(1)));
              done();
            });
          });
        });

        test("{field: {$concat: value}} - with field being null", function(done) {
          const band = Object.assign({}, BANDS[1], {tags: "Great!"});

          coll.update({id: band.id}, {tags: {$concat: "Great!"}}, function(err) {
            assert(err === undefined);
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo([BANDS[0], band].concat(BANDS.slice(2)));
              done();
            });
          });
        });

        test("{field: {$concat: value}} - with empty string", function(done) {
          const band = Object.assign({}, BANDS[3], {origin: "New York, United States"});

          coll.update({id: band.id}, {origin: {$concat: "New York, United States"}}, function(err) {
            assert(err === undefined);
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo(BANDS.slice(0, 3).concat(band).concat(BANDS.slice(4)));
              done();
            });
          });
        });

        test("{field: {$concat: value}} - with non-empty string", function(done) {
          const band = Object.assign({}, BANDS[0], {origin: BANDS[0].origin + "Great!"});

          coll.update({id: band.id}, {origin: {$concat: "Great!"}}, function(err) {
            assert(err === undefined);
            coll.findAll(function(err, res) {
              assert(err === undefined);
              res.docs.must.be.similarTo([band].concat(BANDS.slice(1)));
              done();
            });
          });
        });
      });
    });
  });

  suite("#save()", function() {
    suite("Error handler", function() {
      test("save(doc) - without id", function() {
        coll.save.bind(coll).must.raise(Error, [{x: 1, y: 2}]);
      });

      test("save(doc, opts) - without id", function() {
        coll.save.bind(coll).must.raise(Error, [{x: 1, y: 2}, {}]);
      });

      test("save(doc, opts, callback) - without id", function() {
        coll.save.bind(coll).must.raise(Error, [{x: 1, y: 2}, {}, function() {}]);
      });
    });

    suite("Insert", function() {
      test("save(doc)", function(done) {
        coll.save(ECHO);
        setTimeout(function() {
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(BANDS.concat(ECHO));
            done();
          });
        }, 500);
      });

      test("save(doc, opts)", function(done) {
        coll.save(ECHO, {});
        setTimeout(function() {
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(BANDS.concat(ECHO));
            done();
          });
        }, 500);
      });

      test("save(doc, callback)", function(done) {
        coll.save(ECHO, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(BANDS.concat(ECHO));
            done();
          });
        });
      });

      test("save(doc, opts, callback)", function(done) {
        coll.save(ECHO, {}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo(BANDS.concat(ECHO));
            done();
          });
        });
      });
    });

    suite("Update", function() {
      test("save(doc)", function(done) {
        const band = Object.assign({}, BANDS[0], {origin: "Jamaica"});

        coll.save(band);

        setTimeout(function() {
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo([band].concat(BANDS.slice(1)));
            done();
          });
        }, 500);
      });

      test("save(doc, opts)", function(done) {
        const band = Object.assign({}, BANDS[0], {origin: "Jamaica"});

        coll.save(band, {});

        setTimeout(function() {
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo([band].concat(BANDS.slice(1)));
            done();
          });
        }, 500);
      });

      test("save(doc, callback)", function(done) {
        const band = Object.assign({}, BANDS[0], {origin: "Jamaica"});

        coll.save(band, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
            assert(err === undefined);
            res.docs.must.be.similarTo([band].concat(BANDS.slice(1)));
            done();
          });
        });
      });

      test("save(doc, opts, callback)", function(done) {
        const band = Object.assign({}, BANDS[0], {origin: "Jamaica"});

        coll.save(band, {}, function(err) {
          assert(err === undefined);
          coll.findAll(function(err, res) {
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
      var ic = db.getCollection(bandsColl, {inject: {author: "elisa"}});
      ic.insert(ECHO, function(err) {
        assert(err === undefined);
        coll.findAll(function(err, res) {
          assert(err === undefined);
          res.docs.must.be.similarTo(BANDS.concat([Object.assign({}, ECHO, {author: "elisa"})]));
          done();
        });
      });
    });

    test("save(doc, callback)", function(done) {
      var ids = db.getCollection(bandsColl, {inject: {author: "elisa"}});
      ids.save(ECHO, function(err) {
        assert(err === undefined);
        coll.findAll(function(err, res) {
          assert(err === undefined);
          res.docs.must.be.similarTo(BANDS.concat([Object.assign({}, ECHO, {author: "elisa"})]));
          done();
        });
      });
    });

    test("update(query, update, callback)", function(done) {
      const doc = Object.assign({}, BANDS[0], {origin: "GIRO"});
      var ic = db.getCollection(bandsColl, {inject: {id: doc.id}});
      ic.update({}, {origin: "GIRO"}, function(err) {
        assert(err === undefined);
        coll.findAll(function(err, res) {
          assert(err === undefined);
          res.docs.must.be.similarTo([doc].concat(BANDS.slice(1)));
          done();
        });
      });
    });

    test("remove(query, callback)", function(done) {
      var ic = db.getCollection(bandsColl, {inject: {id: BANDS[0].id}});
      ic.remove({}, function(err) {
        assert(err === undefined);
        coll.findAll(function(err, res) {
          assert(err === undefined);
          res.docs.must.be.similarTo(BANDS.slice(1));
          done();
        });
      });
    });

    test("truncate(callback)", function(done) {
      var ic = db.getCollection(bandsColl, {inject: {id: BANDS[0].id}});
      ic.truncate(function(err) {
        assert(err === undefined);
        coll.findAll(function(err, res) {
          assert(err === undefined);
          res.docs.must.be.similarTo(BANDS.slice(1));
          done();
        });
      });
    });

    test("find(query, callback)", function(done) {
      var ic = db.getCollection(bandsColl, {inject: {id: BANDS[2].id}});
      ic.find({}, function(err, res) {
        assert(err === undefined);
        res.docs.must.be.eq(BANDS.slice(2, 3));
        done();
      });
    });

    test("findAll(callback)", function(done) {
      var ic = db.getCollection(bandsColl, {inject: {id: BANDS[2].id}});
      ic.findAll(function(err, res) {
        assert(err === undefined);
        res.docs.must.be.eq(BANDS.slice(2, 3));
        done();
      });
    });

    test("findOne(query, callback)", function(done) {
      var ic = db.getCollection(bandsColl, {inject: {id: BANDS[2].id}});
      ic.findOne({}, function(err, doc) {
        assert(err === undefined);
        doc.must.be.eq(BANDS[2]);
        done();
      });
    });
  });
});
