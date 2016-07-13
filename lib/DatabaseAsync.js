//imports
import assert from "assert";
import {Driver, Namespace, Store, Collection} from "elisa";
import {suite, test, init, fin} from "justo";

//suite
export default suite("Asynchronous Connection", function() {
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

  init({title: "Open connection and get database"}, function(done) {
    drv.openConnection(cxOpts, function(err, con) {
      cx = con;
      db = cx.db;
      done();
    });
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
    test("hasNamespace(name, callback) => true", function(done) {
      db.hasNamespace("test", function(err, has) {
        assert(err === undefined);
        has.must.be.eq(true);
        done();
      });
    });

    test("hasNamespace(name, callback) => false", function(done) {
      db.hasNamespace("unknown", function(err, has) {
        assert(err === undefined);
        has.must.be.eq(false);
        done();
      });
    });
  });

  suite("#findNamespace()", function() {
    test("findNamespace(name, callback) => Namespace", function(done) {
      db.findNamespace("test", function(err, ns) {
        assert(err === undefined);
        ns.must.be.instanceOf(Namespace);
        ns.name.must.be.eq("test");
        ns.db.must.be.same(db);
        ns.connection.must.be.same(cx);
        ns.driver.must.be.same(drv);
        done();
      });
    });

    test("findNamespace(name, callback) => undefined", function(done) {
      db.findNamespace("unknown", function(err, ns) {
        assert(err === undefined);
        assert(ns === undefined);
        done();
      });
    });

    test("findNamespace(name, opts, callback) => Namespace", function(done) {
      db.findNamespace("test", {}, function(err, ns) {
        assert(err === undefined);
        ns.must.be.instanceOf(Namespace);
        ns.name.must.be.eq("test");
        ns.db.must.be.same(db);
        ns.connection.must.be.same(cx);
        ns.driver.must.be.same(drv);
        done();
      });

    });

    test("findNamespace(name, opts, callback) => undefined", function(done) {
      db.findNamespace("unknown", {}, function(err, ns) {
        assert(err === undefined);
        assert(ns === undefined);
        done();
      });
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
      test("findStore(store, callback) => Store", function(done) {
        db.findStore("bandits", function(err, store) {
          assert(err === undefined);
          store.must.be.instanceOf(Store);
          store.must.have({
            name: "bandits",
            qn: "bandits",
            fqn: "elisa.bandits",
            inject: undefined
          });
          store.db.must.be.same(db);
          done();
        });

      });

      test("findStore('unknown', callback) => undefined", function(done) {
        db.findStore("unknown", function(err, store) {
          assert(err === undefined);
          assert(store === undefined);
          done();
        });
      });

      test("findStore(store, {inject}, callback) => Store", function(done) {
        db.findStore("bandits", {inject: {userId: 123}}, function(err, store) {
          assert(err === undefined);
          store.must.be.instanceOf(Store);
          store.must.have({
            name: "bandits",
            qn: "bandits",
            fqn: "elisa.bandits",
            inject: {userId: 123}
          });
          store.db.must.be.same(db);
          done();
        });
      });

      test("findStore('unknown', {inject}, callback) => undefined", function(done) {
        db.findStore("unknown", {inject: {userId: 123}}, function(err, store) {
          assert(err === undefined);
          assert(store === undefined);
          done();
        });
      });

      test("findStore(ns, store, callback) => Store", function(done) {
        db.findStore("test", "bands", function(err, store) {
          assert(err === undefined);
          store.must.be.instanceOf(Store);
          store.must.have({
            name: "bands",
            qn: "test.bands",
            fqn: "elisa.test.bands",
            inject: undefined
          });
          store.db.must.be.same(db);
          done();
        });

      });

      test("findStore('unknown', 'unknown', callback) => undefined", function(done) {
        db.findStore("unkNs", "unkStore", function(err, store) {
          assert(err === undefined);
          assert(store === undefined);
          done();
        });
      });

      test("findStore('unknown', store, callback) => undefined", function(done) {
        db.findStore("unknown", "bands", function(err, store) {
          assert(err === undefined);
          assert(store === undefined);
          done();
        });
      });

      test("findStore(ns, 'unknown', callback) => undefined", function(done) {
        db.findStore("test", "unknown", function(err, store) {
          assert(err === undefined);
          assert(store === undefined);
          done();
        });
      });

      test("findStore(ns, store, {inject}, callback) => Store", function(done) {
        db.findStore("test", "bands", {inject: {userId: 321}}, function(err, store) {
          assert(err === undefined);
          store.must.be.instanceOf(Store);
          store.must.have({
            name: "bands",
            qn: "test.bands",
            fqn: "elisa.test.bands",
            inject: {userId: 321}
          });
          store.db.must.be.same(db);
          done();
        });
      });

      test("findStore('ns.store', callback) => Store", function(done) {
        db.findStore("test.bands", function(err, store) {
          assert(err === undefined);
          store.must.be.instanceOf(Store);
          store.must.have({
            name: "bands",
            qn: "test.bands",
            fqn: "elisa.test.bands",
            inject: undefined
          });
          store.db.must.be.same(db);
          done();
        });
      });

      test("findStore('unknown.unknown', callback) => undefined", function(done) {
        db.findStore("unkNs.unkStore", function(err, store) {
          assert(err === undefined);
          assert(store === undefined);
          done();
        });
      });

      test("findStore('unknown.store', callback) => undefined", function(done) {
        db.findStore("unknown.bandits", function(err, store) {
          assert(err === undefined);
          assert(store === undefined);
          done();
        });
      });

      test("findStore('ns.unknown', callback) => undefined", function(done) {
        db.findStore("test.unknown", function(err, store) {
          assert(err === undefined);
          assert(store === undefined);
          done();
        });
      });

      test("findStore('ns.store', {inject}, calllback) => Store", function(done) {
        db.findStore("test.bands", {inject: {userId: 123}}, function(err, store) {
          assert(err === undefined);
          store.must.be.instanceOf(Store);
          store.must.have({
            name: "bands",
            qn: "test.bands",
            fqn: "elisa.test.bands",
            inject: {userId: 123}
          });
          store.db.must.be.same(db);
          done();
        });

      });

      test("findStore('unknown.unknown', {inject}, callback) => undefined", function(done) {
        db.findStore("unkNs.unkStore", {inject: {userId: 123}}, function(err, store) {
          assert(err === undefined);
          assert(store === undefined);
          done();
        });
      });

      test("findStore('unknown.store', {inject}, callback) => undefined", function(done) {
        db.findStore("unknown.bandits", {inject: {userId: 123}}, function(err, store) {
          assert(err === undefined);
          assert(store === undefined);
          done();
        });
      });

      test("findStore('ns.unknown', {inject}, callback) => undefined", function(done) {
        db.findStore("test.unknown", {inject: {userId: 123}}, function(err, store) {
          assert(err === undefined);
          assert(store === undefined);
          done();
        });
      });
    });

    suite("#hasStore()", function() {
      test("hasStore(store, callback) => true", function(done) {
        db.hasStore("bandits", function(err, has) {
          assert(err === undefined);
          has.must.be.eq(true);
          done();
        });
      });

      test("hasStore(store, callback) => false", function(done) {
        db.hasStore("unknown", function(err, has) {
          assert(err === undefined);
          has.must.be.eq(false);
          done();
        });
      });

      test("hasStore('ns.store', callback) => true", function(done) {
        db.hasStore("test.bands", function(err, has) {
          assert(err === undefined);
          has.must.be.eq(true);
          done();
        });
      });

      test("hasStore('unknown.unknown', callback) => false", function(done) {
        db.hasStore("unknown.unknown", function(err, has) {
          assert(err === undefined);
          has.must.be.eq(false);
          done();
        });
      });

      test("hasStore('unknown.store', callback) => false", function(done) {
        db.hasStore("unknown.bands", function(err, has) {
          assert(err === undefined);
          has.must.be.eq(false);
          done();
        });
      });

      test("hasStore('ns.unknown', callback) => false", function(done) {
        db.hasStore("test.unknown", function(err, has) {
          assert(err === undefined);
          has.must.be.eq(false);
          done();
        });
      });

      test("hasStore(ns, store, callback) => true", function(done) {
        db.hasStore("test", "bands", function(err, has) {
          assert(err === undefined);
          has.must.be.eq(true);
          done();
        });
      });

      test("hasStore(unknown, unknown, callback) => false", function(done) {
        db.hasStore("unknown", "unknown", function(err, has) {
          assert(err === undefined);
          has.must.be.eq(false);
          done();
        });
      });

      test("hasStore(unknown, store, callback) => false", function(done) {
        db.hasStore("unknown", "bands", function(err, has) {
          assert(err === undefined);
          has.must.be.eq(false);
          done();
        });
      });

      test("hasStore(ns, unknown, callback) => false", function(done) {
        db.hasStore("test", "unknown", function(err, has) {
          assert(err === undefined);
          has.must.be.eq(false);
          done();
        });
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
      test("findCollection(coll, callback) => Collection", function(done) {
        db.findCollection("bandits", function(err, ds) {
          assert(err === undefined);
          ds.must.be.instanceOf(Collection);
          ds.must.have({
            name: "bandits",
            qn: "bandits",
            fqn: "elisa.bandits",
            inject: undefined
          });
          ds.db.must.be.same(db);
          done();
        });

      });

      test("findCollection('unknown', callback) => undefined", function(done) {
        db.findCollection("unknown", function(err, ds) {
          assert(err === undefined);
          assert(ds === undefined);
          done();
        });
      });

      test("findCollection(coll, {inject}, callback) => Collection", function(done) {
        db.findCollection("bandits", {inject: {userId: 123}}, function(err, ds) {
          assert(err === undefined);
          ds.must.be.instanceOf(Collection);
          ds.must.have({
            name: "bandits",
            qn: "bandits",
            fqn: "elisa.bandits",
            inject: {userId: 123}
          });
          ds.db.must.be.same(db);
          done();
        });
      });

      test("findCollection('unknown', {inject}, callback) => undefined", function(done) {
        db.findCollection("unknown", {inject: {userId: 123}}, function(err, ds) {
          assert(err === undefined);
          assert(ds === undefined);
          done();
        });
      });

      test("findCollection(ns, coll, callback) => Collection", function(done) {
        db.findCollection("test", "bands", function(err, ds) {
          assert(err === undefined);
          ds.must.be.instanceOf(Collection);
          ds.must.have({
            name: "bands",
            qn: "test.bands",
            fqn: "elisa.test.bands",
            inject: undefined
          });
          ds.db.must.be.same(db);
          done();
        });

      });

      test("findCollection('unknown', 'unknown', callback) => undefined", function(done) {
        db.findCollection("unknown", "unknown", function(err, ds) {
          assert(err === undefined);
          assert(ds === undefined);
          done();
        });
      });

      test("findCollection('unknown', store, callback) => undefined", function(done) {
        db.findCollection("unknown", "bands", function(err, ds) {
          assert(err === undefined);
          assert(ds === undefined);
          done();
        });
      });

      test("findCollection(ns, 'unknown', callback) => undefined", function(done) {
        db.findCollection("test", "unknown", function(err, ds) {
          assert(err === undefined);
          assert(ds === undefined);
          done();
        });
      });

      test("findCollection(ns, coll, {inject}, callback) => Collection", function(done) {
        db.findCollection("test", "bands", {inject: {userId: 321}}, function(err, ds) {
          assert(err === undefined);
          ds.must.be.instanceOf(Collection);
          ds.must.have({
            name: "bands",
            qn: "test.bands",
            fqn: "elisa.test.bands",
            inject: {userId: 321}
          });
          ds.db.must.be.same(db);
          done();
        });

      });

      test("findCollection('ns.coll', callback) => Collection", function(done) {
        db.findCollection("test.bands", function(err, ds) {
          assert(err === undefined);
          ds.must.be.instanceOf(Collection);
          ds.must.have({
            name: "bands",
            qn: "test.bands",
            fqn: "elisa.test.bands",
            inject: undefined
          });
          ds.db.must.be.same(db);
          done();
        });
      });

      test("findCollection('unknown.unknown', callback) => undefined", function(done) {
        db.findCollection("unkNs.unkStore", function(err, ds) {
          assert(err === undefined);
          assert(ds === undefined);
          done();
        });
      });

      test("findCollection('unknown.store', callback) => undefined", function(done) {
        db.findCollection("unknown.bandits", function(err, ds) {
          assert(err === undefined);
          assert(ds === undefined);
          done();
        });
      });

      test("findCollection('ns.unknown', callback) => undefined", function(done) {
        db.findCollection("test.unknown", function(err, ds) {
          assert(err === undefined);
          assert(ds === undefined);
          done();
        });
      });

      test("findCollection('ns.store', {inject}, callback) => Collection", function(done) {
        db.findCollection("test.bands", {inject: {userId: 123}}, function(err, ds) {
          assert(err === undefined);
          ds.must.be.instanceOf(Collection);
          ds.must.have({
            name: "bands",
            qn: "test.bands",
            fqn: "elisa.test.bands",
            inject: {userId: 123}
          });
          ds.db.must.be.same(db);
          done();
        });

      });

      test("findCollection('unknown.unknown', {inject}, callback) => undefined", function(done) {
        db.findCollection("unknown.unknown", {inject: {userId: 123}}, function(err, ds) {
          assert(err === undefined);
          assert(ds === undefined);
          done();
        });
      });

      test("findCollection('unknown.ds', {inject}, callback) => undefined", function(done) {
        db.findCollection("unknown.bandits", {inject: {userId: 123}}, function(err, ds) {
          assert(err === undefined);
          assert(ds === undefined);
          done();
        });
      });

      test("findCollection('ns.unknown', {inject}, callback) => undefined", function(done) {
        db.findCollection("test.unknown", {inject: {userId: 123}}, function(err, ds) {
          assert(err === undefined);
          assert(ds === undefined);
          done();
        });
      });
    });

    suite("#hasCollection()", function() {
      test("hasCollection(ds, callback) => true", function(done) {
        db.hasCollection("bandits", function(err, has) {
          assert(err === undefined);
          has.must.be.eq(true);
          done();
        });
      });

      test("hasCollection(ds, callback) => false", function(done) {
        db.hasCollection("unknown", function(err, has) {
          assert(err === undefined);
          has.must.be.eq(false);
          done();
        });
      });

      test("hasCollection('ns.ds', callback) => true", function(done) {
        db.hasCollection("test.bands", function(err, has) {
          assert(err === undefined);
          has.must.be.eq(true);
          done();
        });
      });

      test("hasCollection('unknown.unknown', callback) => false", function(done) {
        db.hasCollection("unknown.unknown", function(err, has) {
          assert(err === undefined);
          has.must.be.eq(false);
          done();
        });
      });

      test("hasCollection('unknown.ds', callback) => false", function(done) {
        db.hasCollection("unknown.bands", function(err, has) {
          assert(err === undefined);
          has.must.be.eq(false);
          done();
        });
      });

      test("hasCollection('ns.unknown', callback) => false", function(done) {
        db.hasCollection("test.unknown", function(err, has) {
          assert(err === undefined);
          has.must.be.eq(false);
          done();
        });
      });

      test("hasCollection(ns, ds, callback) => true", function(done) {
        db.hasCollection("test", "bands", function(err, has) {
          assert(err === undefined);
          has.must.be.eq(true);
          done();
        });
      });

      test("hasCollection(unknown, unknown, callback) => false", function(done) {
        db.hasCollection("unknown", "unknown", function(err, has) {
          assert(err === undefined);
          has.must.be.eq(false);
          done();
        });
      });

      test("hasCollection(unknown, ds, callback) => false", function(done) {
        db.hasCollection("unknown", "bands", function(err, has) {
          assert(err === undefined);
          has.must.be.eq(false);
          done();
        });
      });

      test("hasCollection(ns, unknown, callback) => false", function(done) {
        db.hasCollection("test", "unknown", function(err, has) {
          assert(err === undefined);
          has.must.be.eq(false);
          done();
        });
      });
    });
  });
});
