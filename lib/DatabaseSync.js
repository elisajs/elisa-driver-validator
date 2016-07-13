//imports
import assert from "assert";
import {Driver, Namespace, Store, Collection} from "elisa";
import {suite, test, init, fin} from "justo";

//suite
export default suite("Synchronous Connection", function() {
  var drv, drvName, db, cx, cxOpts, store, createStores, dropStores;

  init({title: "Initialize suite from params"}, function(params) {
    params = params[0];

    drvName = params.name;
    cxOpts = params.cxOpts;
    createStores = params.createStores;
    dropStores = params.dropStores;
  });

  init({title: "Get driver"}, function() {
    drv = Driver.getDriver(drvName);
  });

  init({title: "Open connection and get database"}, function() {
    cx = drv.openConnection({type: "sync"}, cxOpts);
    db = cx.db;
  });

  init({name: "*", title: "Create stores"}, function(done) {
    createStores(
      cxOpts,
      [
        {name: "test.bands", docs: []},
        {name: "bandits", docs: []}
      ],
      done
    );
  });

  fin({name: "*", title: "Drop stores"}, function(done) {
    dropStores(cxOpts, ["test.bands", "bandits"], done);
  });

  fin({title: "Close connection"}, function() {
    cx.close();
  });

  test("Attributes", function() {
    db.name.must.be.eq("elisa");
    db.connection.must.be.same(cx);
    db.driver.must.be.same(drv);
  });

  suite("#getNamespace()", function() {
    test("getNamespace(name) : Namespace", function() {
      var ns = db.getNamespace("test");

      ns.must.be.instanceOf(Namespace);
      ns.name.must.be.eq("test");
      ns.db.must.be.same(db);
      ns.connection.must.be.same(cx);
    });

    test("getNamespace('unknown') : Namespace", function() {
      var ns = db.getNamespace("unknown");

      ns.must.be.instanceOf(Namespace);
      ns.name.must.be.eq("unknown");
      ns.db.must.be.same(db);
      ns.connection.must.be.same(cx);
    });

    test("getNamespace(name, opts) : Namespace", function() {
      var ns = db.getNamespace("test", {});

      ns.must.be.instanceOf(Namespace);
      ns.name.must.be.eq("test");
      ns.db.must.be.same(db);
      ns.connection.must.be.same(cx);
    });

    test("getNamespace('unknown', opts) : Namespace", function() {
      var ns = db.getNamespace("unknown", {});

      ns.must.be.instanceOf(Namespace);
      ns.name.must.be.eq("unknown");
      ns.db.must.be.same(db);
      ns.connection.must.be.same(cx);
    });
  });

  suite("#hasNamespace()", function() {
    test("hasNamespace(name) : true", function() {
      db.hasNamespace("test").must.be.eq(true);
    });

    test("hasNamespace(name) : false", function() {
      db.hasNamespace("unknown").must.be.eq(false);
    });
  });

  suite("#findNamespace()", function() {
    test("findNamespace(name) : Namespace", function() {
      var ns = db.findNamespace("test");

      ns.must.be.instanceOf(Namespace);
      ns.name.must.be.eq("test");
      ns.db.must.be.same(db);
      ns.connection.must.be.same(cx);
      ns.driver.must.be.same(drv);
    });

    test("findNamespace(name) : undefined", function() {
      assert(db.findNamespace("unknown") === undefined);
    });

    test("findNamespace(name, opts) : Namespace", function() {
      var ns = db.findNamespace("test", {});

      ns.must.be.instanceOf(Namespace);
      ns.name.must.be.eq("test");
      ns.db.must.be.same(db);
      ns.connection.must.be.same(cx);
      ns.driver.must.be.same(drv);
    });

    test("findNamespace(name, opts) : undefined", function() {
      assert(db.findNamespace("unknown", {}) === undefined);
    });
  });

  suite("Store", function() {
    suite("#getStore()", function() {
      test("getStore(name) : Store", function() {
        const store = db.getStore("bandits");

        store.must.be.instanceOf(Store);
        store.must.have({
          name: "bandits",
          qn: "bandits",
          fqn: "elisa.bandits",
          inject: undefined
        });
        store.db.must.be.same(db);
      });

      test("getStore('unknown') : Store", function() {
        const store = db.getStore("unknown");

        store.must.be.instanceOf(Store);
        store.must.have({
          name: "unknown",
          qn: "unknown",
          fqn: "elisa.unknown",
          inject: undefined
        });
        store.db.must.be.same(db);
      });

      test("getStore(store, {inject}) : Store", function() {
        const store = db.getStore("bandits", {inject: {userId: 123}});

        store.must.be.instanceOf(Store);
        store.must.have({
          name: "bandits",
          qn: "bandits",
          fqn: "elisa.bandits",
          inject: {userId: 123}
        });
        store.db.must.be.same(db);
      });

      test("getStore('unknown', {inject}) : Store", function() {
        const store = db.getStore("unknown", {inject: {userId: 123}});

        store.must.be.instanceOf(Store);
        store.must.have({
          name: "unknown",
          qn: "unknown",
          fqn: "elisa.unknown",
          inject: {userId: 123}
        });
        store.db.must.be.same(db);
      });

      test("getStore(ns, store) : Store", function() {
        const store = db.getStore("test", "bands");

        store.must.be.instanceOf(Store);
        store.must.have({
          name: "bands",
          qn: "test.bands",
          fqn: "elisa.test.bands",
          inject: undefined
        });
        store.db.must.be.same(db);
      });

      test("getStore('unknown', 'unknown') : Store", function() {
        const store = db.getStore("unkNs", "unkStore");

        store.must.be.instanceOf(Store);
        store.must.have({
          name: "unkStore",
          qn: "unkNs.unkStore",
          fqn: "elisa.unkNs.unkStore",
          inject: undefined
        });
        store.db.must.be.same(db);
      });

      test("getStore('unknown', store) : Store", function() {
        const store = db.getStore("unknown", "bands");

        store.must.be.instanceOf(Store);
        store.must.have({
          name: "bands",
          qn: "unknown.bands",
          fqn: "elisa.unknown.bands",
          inject: undefined
        });
        store.db.must.be.same(db);
      });

      test("getStore(ns, 'unknown') : Store", function() {
        const store = db.getStore("test", "unknown");

        store.must.be.instanceOf(Store);
        store.must.have({
          name: "unknown",
          qn: "test.unknown",
          fqn: "elisa.test.unknown",
          inject: undefined
        });
        store.db.must.be.same(db);
      });

      test("getStore(ns, store, {inject}) : Store", function() {
        const store = db.getStore("test", "bands", {inject: {userId: 321}});

        store.must.be.instanceOf(Store);
        store.must.have({
          name: "bands",
          qn: "test.bands",
          fqn: "elisa.test.bands",
          inject: {userId: 321}
        });
        store.db.must.be.same(db);
      });

      test("getStore(qn) : Store", function() {
        const store = db.getStore("test.bands");

        store.must.be.instanceOf(Store);
        store.must.have({
          name: "bands",
          qn: "test.bands",
          fqn: "elisa.test.bands",
          inject: undefined
        });
        store.db.must.be.same(db);
      });

      test("getStore(qn, {inject}) : Store", function() {
        const store = db.getStore("test.bands", {inject: {userId: 123}});

        store.must.be.instanceOf(Store);
        store.must.have({
          name: "bands",
          qn: "test.bands",
          fqn: "elisa.test.bands",
          inject: {userId: 123}
        });
        store.db.must.be.same(db);
      });
    });

    suite("#findStore()", function() {
      test("findStore(store) : Store", function() {
        const store = db.findStore("bandits");

        store.must.be.instanceOf(Store);
        store.must.have({
          name: "bandits",
          qn: "bandits",
          fqn: "elisa.bandits",
          inject: undefined
        });
        store.db.must.be.same(db);
      });

      test("findStore('unknown') : undefined", function() {
        assert(db.findStore("unknown") === undefined);
      });

      test("findStore(store, {inject}) : Store", function() {
        const store = db.findStore("bandits", {inject: {userId: 123}});

        store.must.be.instanceOf(Store);
        store.must.have({
          name: "bandits",
          qn: "bandits",
          fqn: "elisa.bandits",
          inject: {userId: 123}
        });
        store.db.must.be.same(db);
      });

      test("findStore('unknown', {inject}) : undefined", function() {
        assert(db.findStore("unknown", {inject: {userId: 123}}) === undefined);
      });

      test("findStore(ns, store) : Store", function() {
        const store = db.findStore("test", "bands");

        store.must.be.instanceOf(Store);
        store.must.have({
          name: "bands",
          qn: "test.bands",
          fqn: "elisa.test.bands",
          inject: undefined
        });
        store.db.must.be.same(db);
      });

      test("findStore('unknown', 'unknown') : undefined", function() {
        assert(db.findStore("unkNs", "unkStore") === undefined);
      });

      test("findStore('unknown', store) : undefined", function() {
        assert(db.findStore("unknown", "bands") === undefined);
      });

      test("findStore(ns, 'unknown') : undefined", function() {
        assert(db.findStore("test", "unknown") === undefined);
      });

      test("findStore(ns, store, {inject}) : Store", function() {
        const store = db.findStore("test", "bands", {inject: {userId: 321}});

        store.must.be.instanceOf(Store);
        store.must.have({
          name: "bands",
          qn: "test.bands",
          fqn: "elisa.test.bands",
          inject: {userId: 321}
        });
        store.db.must.be.same(db);
      });

      test("findStore('ns.store') : Store", function() {
        const store = db.findStore("test.bands");

        store.must.be.instanceOf(Store);
        store.must.have({
          name: "bands",
          qn: "test.bands",
          fqn: "elisa.test.bands",
          inject: undefined
        });
        store.db.must.be.same(db);
      });

      test("findStore('unknown.unknown') : undefined", function() {
        assert(db.findStore("unkNs.unkStore") === undefined);
      });

      test("findStore('unknown.store') : undefined", function() {
        assert(db.findStore("unknown.bandits") === undefined);
      });

      test("findStore('ns.unknown') : undefined", function() {
        assert(db.findStore("test.unknown") === undefined);
      });

      test("findStore('ns.store', {inject}) : Store", function() {
        const store = db.findStore("test.bands", {inject: {userId: 123}});

        store.must.be.instanceOf(Store);
        store.must.have({
          name: "bands",
          qn: "test.bands",
          fqn: "elisa.test.bands",
          inject: {userId: 123}
        });
        store.db.must.be.same(db);
      });

      test("findStore('unknown.unknown', {inject}) : undefined", function() {
        assert(db.findStore("unkNs.unkStore", {inject: {userId: 123}}) === undefined);
      });

      test("findStore('unknown.store', {inject}) : undefined", function() {
        assert(db.findStore("unknown.bandits", {inject: {userId: 123}}) === undefined);
      });

      test("findStore('ns.unknown', {inject}) : undefined", function() {
        assert(db.findStore("test.unknown", {inject: {userId: 123}}) === undefined);
      });
    });

    suite("#hasStore()", function() {
      test("hasStore(store) : true", function() {
        db.hasStore("bandits").must.be.eq(true);
      });

      test("hasStore(store) : false", function() {
        db.hasStore("unknown").must.be.eq(false);
      });

      test("hasStore('ns.store') : true", function() {
        db.hasStore("test.bands").must.be.eq(true);
      });

      test("hasStore('unknown.unknown') : false", function() {
        db.hasStore("unknown.unknown").must.be.eq(false);
      });

      test("hasStore('unknown.store') : false", function() {
        db.hasStore("unknown.bands").must.be.eq(false);
      });

      test("hasStore('ns.unknown') : false", function() {
        db.hasStore("test.unknown").must.be.eq(false);
      });

      test("hasStore(ns, store) : true", function() {
        db.hasStore("test", "bands").must.be.eq(true);
      });

      test("hasStore(unknown, unknown) : false", function() {
        db.hasStore("unknown", "unknown").must.be.eq(false);
      });

      test("hasStore(unknown, store) : false", function() {
        db.hasStore("unknown", "bands").must.be.eq(false);
      });

      test("hasStore(ns, unknown) : false", function() {
        db.hasStore("test", "unknown").must.be.eq(false);
      });
    });
  });

  suite("Collection", function() {
    suite("#getCollection()", function() {
      test("getCollection(name) : Collection", function() {
        const ds = db.getCollection("bandits");

        ds.must.be.instanceOf(Collection);
        ds.must.have({
          name: "bandits",
          qn: "bandits",
          fqn: "elisa.bandits",
          inject: undefined
        });
        ds.db.must.be.same(db);
      });

      test("getCollection('unknown') : Collection", function() {
        const ds = db.getCollection("unknown");

        ds.must.be.instanceOf(Collection);
        ds.must.have({
          name: "unknown",
          qn: "unknown",
          fqn: "elisa.unknown",
          inject: undefined
        });
        ds.db.must.be.same(db);
      });

      test("getCollection(collection, {inject}) : Collection", function() {
        const ds = db.getCollection("bandits", {inject: {userId: 123}});

        ds.must.be.instanceOf(Collection);
        ds.must.have({
          name: "bandits",
          qn: "bandits",
          fqn: "elisa.bandits",
          inject: {userId: 123}
        });
        ds.db.must.be.same(db);
      });

      test("getCollection('unknown', {inject}) : Collection", function() {
        const ds = db.getCollection("unknown", {inject: {userId: 123}});

        ds.must.be.instanceOf(Collection);
        ds.must.have({
          name: "unknown",
          qn: "unknown",
          fqn: "elisa.unknown",
          inject: {userId: 123}
        });
        ds.db.must.be.same(db);
      });

      test("getCollection(ns, store) : Collection", function() {
        const ds = db.getCollection("test", "bands");

        ds.must.be.instanceOf(Collection);
        ds.must.have({
          name: "bands",
          qn: "test.bands",
          fqn: "elisa.test.bands",
          inject: undefined
        });
        ds.db.must.be.same(db);
      });

      test("getCollection('unknown', 'unknown') : Collection", function() {
        const ds = db.getCollection("unknown", "unknown");

        ds.must.be.instanceOf(Collection);
        ds.must.have({
          name: "unknown",
          qn: "unknown.unknown",
          fqn: "elisa.unknown.unknown",
          inject: undefined
        });
        ds.db.must.be.same(db);
      });

      test("getCollection('unknown', coll) : Collection", function() {
        const ds = db.getCollection("unknown", "bands");

        ds.must.be.instanceOf(Collection);
        ds.must.have({
          name: "bands",
          qn: "unknown.bands",
          fqn: "elisa.unknown.bands",
          inject: undefined
        });
        ds.db.must.be.same(db);
      });

      test("getCollection(ns, 'unknown') : Collection", function() {
        const ds = db.getCollection("test", "unknown");

        ds.must.be.instanceOf(Collection);
        ds.must.have({
          name: "unknown",
          qn: "test.unknown",
          fqn: "elisa.test.unknown",
          inject: undefined
        });
        ds.db.must.be.same(db);
      });

      test("getCollection(ns, coll, {inject}) : Collection", function() {
        const ds = db.getCollection("test", "bands", {inject: {userId: 321}});

        ds.must.be.instanceOf(Collection);
        ds.must.have({
          name: "bands",
          qn: "test.bands",
          fqn: "elisa.test.bands",
          inject: {userId: 321}
        });
        ds.db.must.be.same(db);
      });

      test("getCollection(qn) : Collection", function() {
        const ds = db.getCollection("test.bands");

        ds.must.be.instanceOf(Collection);
        ds.must.have({
          name: "bands",
          qn: "test.bands",
          fqn: "elisa.test.bands",
          inject: undefined
        });
        ds.db.must.be.same(db);
      });

      test("getCollection(qn, {inject}) : Collection", function() {
        const ds = db.getCollection("test.bands", {inject: {userId: 123}});

        ds.must.be.instanceOf(Collection);
        ds.must.have({
          name: "bands",
          qn: "test.bands",
          fqn: "elisa.test.bands",
          inject: {userId: 123}
        });
        ds.db.must.be.same(db);
      });
    });

    suite("#findCollection()", function() {
      test("findCollection(coll) : Collection", function() {
        const ds = db.findCollection("bandits");

        ds.must.be.instanceOf(Collection);
        ds.must.have({
          name: "bandits",
          qn: "bandits",
          fqn: "elisa.bandits",
          inject: undefined
        });
        ds.db.must.be.same(db);
      });

      test("findCollection('unknown') : undefined", function() {
        assert(db.findCollection("unknown") === undefined);
      });

      test("findCollection(coll, {inject}) : Collection", function() {
        const ds = db.findCollection("bandits", {inject: {userId: 123}});

        ds.must.be.instanceOf(Collection);
        ds.must.have({
          name: "bandits",
          qn: "bandits",
          fqn: "elisa.bandits",
          inject: {userId: 123}
        });
        ds.db.must.be.same(db);
      });

      test("findCollection('unknown', {inject}) : undefined", function() {
        assert(db.findCollection("unknown", {inject: {userId: 123}}) === undefined);
      });

      test("findCollection(ns, coll) : Collection", function() {
        const ds = db.findCollection("test", "bands");

        ds.must.be.instanceOf(Collection);
        ds.must.have({
          name: "bands",
          qn: "test.bands",
          fqn: "elisa.test.bands",
          inject: undefined
        });
        ds.db.must.be.same(db);
      });

      test("findCollection('unknown', 'unknown') : undefined", function() {
        assert(db.findCollection("unknown", "unknown") === undefined);
      });

      test("findCollection('unknown', store) : undefined", function() {
        assert(db.findCollection("unknown", "bands") === undefined);
      });

      test("findCollection(ns, 'unknown') : undefined", function() {
        assert(db.findCollection("test", "unknown") === undefined);
      });

      test("findCollection(ns, coll, {inject}) : Collection", function() {
        const ds = db.findCollection("test", "bands", {inject: {userId: 321}});

        ds.must.be.instanceOf(Collection);
        ds.must.have({
          name: "bands",
          qn: "test.bands",
          fqn: "elisa.test.bands",
          inject: {userId: 321}
        });
        ds.db.must.be.same(db);
      });

      test("findCollection('ns.coll') : Collection", function() {
        const ds = db.findCollection("test.bands");

        ds.must.be.instanceOf(Collection);
        ds.must.have({
          name: "bands",
          qn: "test.bands",
          fqn: "elisa.test.bands",
          inject: undefined
        });
        ds.db.must.be.same(db);
      });

      test("findCollection('unknown.unknown') : undefined", function() {
        assert(db.findCollection("unkNs.unkStore") === undefined);
      });

      test("findCollection('unknown.store') : undefined", function() {
        assert(db.findCollection("unknown.bandits") === undefined);
      });

      test("findCollection('ns.unknown') : undefined", function() {
        assert(db.findCollection("test.unknown") === undefined);
      });

      test("findCollection('ns.store', {inject}) : Collection", function() {
        const ds = db.findCollection("test.bands", {inject: {userId: 123}});

        ds.must.be.instanceOf(Collection);
        ds.must.have({
          name: "bands",
          qn: "test.bands",
          fqn: "elisa.test.bands",
          inject: {userId: 123}
        });
        ds.db.must.be.same(db);
      });

      test("findCollection('unknown.unknown', {inject}) : undefined", function() {
        assert(db.findCollection("unknown.unknown", {inject: {userId: 123}}) === undefined);
      });

      test("findCollection('unknown.coll', {inject}) : undefined", function() {
        assert(db.findCollection("unknown.bandits", {inject: {userId: 123}}) === undefined);
      });

      test("findCollection('ns.unknown', {inject}) : undefined", function() {
        assert(db.findCollection("test.unknown", {inject: {userId: 123}}) === undefined);
      });
    });

    suite("#hasCollection()", function() {
      test("hasCollection(ds) : true", function() {
        db.hasCollection("bandits").must.be.eq(true);
      });

      test("hasCollection(ds) : false", function() {
        db.hasCollection("unknown").must.be.eq(false);
      });

      test("hasCollection('ns.ds') : true", function() {
        db.hasCollection("test.bands").must.be.eq(true);
      });

      test("hasCollection('unknown.unknown') : false", function() {
        db.hasCollection("unknown.unknown").must.be.eq(false);
      });

      test("hasCollection('unknown.ds') : false", function() {
        db.hasCollection("unknown.bands").must.be.eq(false);
      });

      test("hasCollection('ns.unknown') : false", function() {
        db.hasCollection("test.unknown").must.be.eq(false);
      });

      test("hasCollection(ns, ds) : true", function() {
        db.hasCollection("test", "bands").must.be.eq(true);
      });

      test("hasCollection(unknown, unknown) : false", function() {
        db.hasCollection("unknown", "unknown").must.be.eq(false);
      });

      test("hasCollection(unknown, ds) : false", function() {
        db.hasCollection("unknown", "bands").must.be.eq(false);
      });

      test("hasCollection(ns, unknown) : false", function() {
        db.hasCollection("test", "unknown").must.be.eq(false);
      });
    });
  });
});
