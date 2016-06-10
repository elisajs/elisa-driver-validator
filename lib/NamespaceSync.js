//imports
import assert from "assert";
import {Driver, Namespace, Store, Collection} from "elisa";
import {suite, test, init, fin} from "justo";

//suite
export default suite("Namespace (Synchronous Connection)", function() {
  var drv, drvName, db, ns, cx, cxOpts, store, createStores, dropStores;

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

  init({title: "Open connection and get namespace"}, function() {
    cx = drv.openConnection({type: "sync"}, cxOpts);
    db = cx.db;
    ns = db.getNamespace("test");
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
    ns.name.must.be.eq("test");
    ns.qn.must.be.eq("test");
    ns.fqn.must.be.eq("elisa.test");
    ns.connection.must.be.same(cx);
    ns.driver.must.be.same(drv);
  });

  test("#getQn(ds) : string", function() {
    ns.getQn("hello").must.be.eq("test.hello");
  });

  suite("Store", function() {
    suite("#getStore()", function() {
      test("getStore(name) : Store", function() {
        var store = ns.getStore("bands");

        store.must.be.instanceOf(Store);
        store.must.have({
          name: "bands",
          qn: "test.bands",
          fqn: "elisa.test.bands",
          inject: undefined
        });
        store.ns.must.be.same(ns);
      });

      test("getStore('unknown') : Store", function() {
        var store = ns.getStore("unknown");

        store.must.be.instanceOf(Store);
        store.must.have({
          name: "unknown",
          qn: "test.unknown",
          fqn: "elisa.test.unknown",
          inject: undefined
        });
        store.ns.must.be.same(ns);
      });

      test("getStore(name, {inject}) : Store", function() {
        var store = ns.getStore("bands", {inject: {userId: 123}});

        store.must.be.instanceOf(Store);
        store.must.have({
          name: "bands",
          qn: "test.bands",
          fqn: "elisa.test.bands",
          inject: {userId: 123}
        });
        store.ns.must.be.same(ns);
      });

      test("getStore('unknown', {inject}) : Store", function() {
        var store = ns.getStore("unknown", {inject: {userId: 321}});

        store.must.be.instanceOf(Store);
        store.must.have({
          name: "unknown",
          qn: "test.unknown",
          fqn: "elisa.test.unknown",
          inject: {userId: 321}
        });
        store.ns.must.be.same(ns);
      });
    });

    suite("#findStore()", function() {
      test("findStore(name) : Store", function() {
        const store = ns.findStore("bands");

        store.must.be.instanceOf(Store);
        store.must.have({
          name: "bands",
          qn: "test.bands",
          fqn: "elisa.test.bands",
          inject: undefined
        });
        store.ns.must.be.same(ns);
      });

      test("findStore('unknown') : undefined", function() {
        assert(ns.findStore("unknown") === undefined);
      });

      test("findStore(name, {inject}) : Store", function() {
        const store = ns.findStore("bands", {inject: {userId: 123}});

        store.must.be.instanceOf(Store);
        store.must.have({
          name: "bands",
          qn: "test.bands",
          fqn: "elisa.test.bands",
          inject: {userId: 123}
        });
        store.ns.must.be.same(ns);
      });

      test("findStore('unknown', {inject}) : undefined", function() {
        assert(ns.findStore("unknown", {inject: {userId: 123}}) === undefined);
      });
    });

    suite("#hasStore()", function() {
      test("hasStore(name) : true", function() {
        ns.hasStore("bands").must.be.eq(true);
      });

      test("hasStore(name) : false", function() {
        ns.hasStore("unknown").must.be.eq(false);
      });
    });
  });

  // suite("Collection", function() {
  //   suite("#getCollection()", function() {
  //     test("getCollection(name)", function() {
  //       var coll = ns.getCollection("bands");
  //
  //       coll.must.be.instanceOf(Collection);
  //       coll.must.have({
  //         name: "mycoll",
  //         qn: "myns.mycoll",
  //         fqn: "elisa.myns.mycoll",
  //         inject: undefined
  //       });
  //     });
  //
  //     test("getCollection(name, opts)", function() {
  //       var coll = ns.getCollection("mycoll", {});
  //
  //       coll.must.be.instanceOf(Collection);
  //       coll.must.have({
  //         name: "mycoll",
  //         qn: "myns.mycoll",
  //         fqn: "elisa.myns.mycoll"
  //       });
  //     });
  //   });
  //
  //   suite("#hasCollection()", function() {
  //     test("hasCollection(name) : true", function() {
  //       ns.hasCollection("mycoll").must.be.eq(true);
  //     });
  //   });
  //
  //   suite("#readCollection()", function() {
  //     test("readCollection(name, callback)", function(done) {
  //       ns.readCollection("mycoll", function(error, coll) {
  //         coll.must.be.instanceOf(Collection);
  //         coll.must.have({
  //           name: "mycoll",
  //           qn: "myns.mycoll",
  //           fqn: "elisa.myns.mycoll"
  //         });
  //         done();
  //       });
  //     });
  //
  //     test("readCollection(name, opts, callback)", function(done) {
  //       ns.readCollection("mycoll", {}, function(error, coll) {
  //         coll.must.be.instanceOf(Collection);
  //         coll.must.have({
  //           name: "mycoll",
  //           qn: "myns.mycoll",
  //           fqn: "elisa.myns.mycoll"
  //         });
  //         done();
  //       });
  //     });
  //   });
  //
  //   suite("#findCollection()", function() {
  //     test("findCollection(name) : Collection", function() {
  //       const coll = ns.findCollection("mycoll");
  //
  //       coll.must.be.instanceOf(Collection);
  //       coll.must.have({
  //         name: "mycoll",
  //         qn: "myns.mycoll",
  //         fqn: "elisa.myns.mycoll"
  //       });
  //     });
  //
  //     test("findCollection(name, opts) : Collection", function() {
  //       const coll = ns.findCollection("mycoll", {});
  //
  //       coll.must.be.instanceOf(Collection);
  //       coll.must.have({
  //         name: "mycoll",
  //         qn: "myns.mycoll",
  //         fqn: "elisa.myns.mycoll"
  //       });
  //     });
  //   });
  // });
});
