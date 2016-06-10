//imports
import assert from "assert";
import {Driver, Namespace, Store, Collection} from "elisa";
import {suite, test, init, fin} from "justo";

//suite
export default suite("Namespace (Asynchronous Connection)", function() {
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

  init({title: "Open connection and get namespace"}, function(done) {
    drv.openConnection(cxOpts, function(err, con) {
      cx = con;
      db = cx.db;
      ns = db.getNamespace("test");
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
      test("findStore(name, callback) => Store", function(done) {
        ns.findStore("bands", function(err, store) {
          assert(err === undefined);
          store.must.be.instanceOf(Store);
          store.must.have({
            name: "bands",
            qn: "test.bands",
            fqn: "elisa.test.bands",
            inject: undefined
          });
          store.ns.must.be.same(ns);
          done();
        });
      });

      test("findStore('unknown', callback) => undefined", function(done) {
        ns.findStore("unknown", function(err, store) {
          assert(err === undefined);
          assert(store === undefined);
          done();
        });
      });

      test("findStore(name, {inject}, callback) => Store", function(done) {
        ns.findStore("bands", {inject: {userId: 123}}, function(err, store) {
          assert(err === undefined);
          store.must.be.instanceOf(Store);
          store.must.have({
            name: "bands",
            qn: "test.bands",
            fqn: "elisa.test.bands",
            inject: {userId: 123}
          });
          store.ns.must.be.same(ns);
          done();
        });
      });

      test("findStore('unknown', {inject}, callback) => undefined", function(done) {
        ns.findStore("unknown", {inject: {userId: 123}}, function(err, store) {
          assert(err === undefined);
          assert(store === undefined);
          done();
        });
      });
    });

    suite("#hasStore()", function() {
      test("hasStore(name, callback) => true", function(done) {
        ns.hasStore("bands", function(err, has) {
          assert(err === undefined);
          has.must.be.eq(true);
          done();
        });
      });

      test("hasStore(name, callback) => false", function(done) {
        ns.hasStore("unknown", function(err, has) {
          assert(err === undefined);
          has.must.be.eq(false);
          done();
        });
      });
    });
  });
});
