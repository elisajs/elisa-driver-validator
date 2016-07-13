//imports
import assert from "assert";
import {Driver, Result} from "elisa";
import {suite, test, init, fin} from "justo";
import {ECHO, BANDS} from "../data/store";

//suite
export default suite("Synchronous Connection", function() {
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

  init({name: "*", title: "Open connection and get store"}, function() {
    cx = drv.openConnection({type: "sync"}, cxOpts);
    db = cx.db;
    store = db.getStore(bandsStore);
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

  fin({name: "*", title: "Close connection"}, function(params) {
    cx.close();
  });

  test("Attributes", function() {
    store.qn.must.be.eq(bandsStore);
    store.fqn.must.be.eq("elisa." + bandsStore);
    store.must.have({inject: undefined});
  });

  suite("#hasId()", function() {
    test("hasId(id) : true", function() {
      store.hasId(BANDS[0].id).must.be.eq(true);
    });

    test("hasId(id) : false", function() {
      store.hasId("unknown").must.be.eq(false);
    });
  });

  suite("#find()", function() {
    test("find({id}) : undefined", function() {
      assert(store.find({id: "unknown"}) === undefined);
    });

    test("find({id}) : object", function() {
      store.find({id: BANDS[0].id}).must.have(BANDS[0]);
    });
  });

  suite("#findAll()", function() {
    test("findAll() : Result with data", function() {
      const res = store.findAll();

      res.must.be.instanceOf(Result);
      res.length.must.be.eq(BANDS.length);
      res.docs.must.be.similarTo(BANDS);
    });

    test("findAll() : Result without data", function() {
      const res = db.getStore(emptyStore).findAll();

      res.must.be.instanceOf(Result);
      res.length.must.be.eq(0);
      res.docs.must.be.eq([]);
    });
  });

  suite("#count()", function() {
    suite("Without documents", function() {
      test("count() : number", function() {
        db.getStore(emptyStore).count().must.be.eq(0);
      });

      test("count(opts) : number", function() {
        db.getStore(emptyStore).count({}).must.be.eq(0);
      });
    });

    suite("With documents", function() {
      test("count() : number", function() {
        store.count().must.be.eq(BANDS.length);
      });

      test("count(opts) : number", function() {
        store.count({}).must.be.eq(BANDS.length);
      });
    });
  });

  suite("#insert()", function() {
    suite("One document", function() {
      suite("Id doesn't exist", function() {
        test("insert(doc) - key doesn't exist", function() {
          store.insert(ECHO);
          store.count().must.be.eq(BANDS.length + 1);
          store.findAll().docs.must.be.similarTo(BANDS.concat([ECHO]));
        });
      });

      suite("Id exists", function(console) {
        test("insert(doc) - key exists", function() {
          const id = BANDS[0].id;

          store.insert({id, x: 1, y: 2, z: 3});
          store.count().must.be.eq(BANDS.length);
          store.findAll().docs.must.be.similarTo(BANDS.slice(1).concat([{id, x: 1, y: 2, z: 3}]));
        });
      });
    });

    suite("Several documents", function() {
      suite("No document exists", function() {
        test("insert(docs)", function() {
          const DOCS = [{id: "one", x: 1}, {id: "two", x: 2}];
          const store = db.getStore(emptyStore);

          store.insert(DOCS);
          store.count().must.be.eq(2);
          store.findAll().docs.must.be.similarTo(DOCS);
        });
      });

      suite("Some document exists", function() {
        test("insert(docs)", function() {
          const DOCS = [BANDS[0], {id: "one", x: 1}, {id: "two", x: 2}];

          store.insert(DOCS);
          store.count().must.be.eq(BANDS.length + 2);
          store.findAll().docs.must.be.similarTo(BANDS.slice(1).concat(DOCS));
        });
      });
    });
  });

  suite("#remove()", function() {
    test("remove({id}) - id not existing", function() {
      store.remove({id: "unknown"});
      store.findAll().docs.must.be.similarTo(BANDS);
    });

    test("remove({id}) - id existing", function() {
      store.remove({id: BANDS[0].id});
      store.count().must.be.eq(BANDS.length - 1);
      store.findAll().docs.must.be.similarTo(BANDS.slice(1));
    });
  });

  suite("#truncate()", function() {
    test("truncate()", function() {
      store.truncate();
      store.count().must.be.eq(0);
    });
  });

  suite("#update()", function() {
    test("update({id}, fields) - id not existing", function() {
      store.update({id: "unknown"}, {x: 123});
      store.count().must.be.eq(BANDS.length);
      store.findAll().docs.must.be.similarTo(BANDS);
    });

    test("update({id}, fields) - id existing", function() {
      store.update({id: BANDS[0].id}, {x: 123, year: {$inc: 1}});
      store.count().must.be.eq(BANDS.length);
      store.findAll().docs.must.be.similarTo([Object.assign({}, BANDS[0], {x: 123, year: BANDS[0].year + 1})].concat(BANDS.slice(1)));
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
      test("save(doc)", function() {
        store.save(ECHO);
        store.findAll().docs.must.be.similarTo(BANDS.concat(ECHO));
      });

      test("save(doc, opts)", function() {
        store.save(ECHO, {});
        store.findAll().docs.must.be.similarTo(BANDS.concat(ECHO));
      });
    });

    suite("Update", function() {
      test("save(doc)", function() {
        const band = Object.assign({}, BANDS[0], {origin: "Jamaica"});
        store.save(band);
        store.findAll().docs.must.be.similarTo([band].concat(BANDS.slice(1)));
      });

      test("save(doc, opts)", function() {
        const band = Object.assign({}, BANDS[0], {origin: "Jamaica"});
        store.save(band, {});
        store.findAll().docs.must.be.similarTo([band].concat(BANDS.slice(1)));
      });
    });
  });

  suite("Injection", function() {
    test("insert(doc)", function() {
      const band = Object.assign({}, ECHO, {author: "elisa"});
      db.getStore(bandsStore, {inject: {author: "elisa"}}).insert(band);
      store.findAll().docs.must.be.similarTo(BANDS.concat([band]));
    });

    test("save(doc)", function() {
      const band = Object.assign({}, ECHO, {author: "elisa"});
      db.getStore(bandsStore, {inject: {author: "elisa"}}).save(band);
      store.findAll().docs.must.be.similarTo(BANDS.concat([band]));
    });
  });
});
