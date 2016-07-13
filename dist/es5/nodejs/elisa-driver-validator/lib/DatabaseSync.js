"use strict";Object.defineProperty(exports, "__esModule", { value: true });
var _assert = require("assert");var _assert2 = _interopRequireDefault(_assert);
var _elisa = require("elisa");
var _justo = require("justo");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}exports.default = 


(0, _justo.suite)("Synchronous Connection", function () {
  var drv, drvName, db, cx, cxOpts, store, createStores, dropStores;

  (0, _justo.init)({ title: "Initialize suite from params" }, function (params) {
    params = params[0];

    drvName = params.name;
    cxOpts = params.cxOpts;
    createStores = params.createStores;
    dropStores = params.dropStores;});


  (0, _justo.init)({ title: "Get driver" }, function () {
    drv = _elisa.Driver.getDriver(drvName);});


  (0, _justo.init)({ title: "Open connection and get database" }, function () {
    cx = drv.openConnection({ type: "sync" }, cxOpts);
    db = cx.db;});


  (0, _justo.init)({ name: "*", title: "Create stores" }, function (done) {
    createStores(
    cxOpts, 
    [
    { name: "test.bands", docs: [] }, 
    { name: "bandits", docs: [] }], 

    done);});



  (0, _justo.fin)({ name: "*", title: "Drop stores" }, function (done) {
    dropStores(cxOpts, ["test.bands", "bandits"], done);});


  (0, _justo.fin)({ title: "Close connection" }, function () {
    cx.close();});


  (0, _justo.test)("Attributes", function () {
    db.name.must.be.eq("elisa");
    db.connection.must.be.same(cx);
    db.driver.must.be.same(drv);});


  (0, _justo.suite)("#getNamespace()", function () {
    (0, _justo.test)("getNamespace(name) : Namespace", function () {
      var ns = db.getNamespace("test");

      ns.must.be.instanceOf(_elisa.Namespace);
      ns.name.must.be.eq("test");
      ns.db.must.be.same(db);
      ns.connection.must.be.same(cx);});


    (0, _justo.test)("getNamespace('unknown') : Namespace", function () {
      var ns = db.getNamespace("unknown");

      ns.must.be.instanceOf(_elisa.Namespace);
      ns.name.must.be.eq("unknown");
      ns.db.must.be.same(db);
      ns.connection.must.be.same(cx);});


    (0, _justo.test)("getNamespace(name, opts) : Namespace", function () {
      var ns = db.getNamespace("test", {});

      ns.must.be.instanceOf(_elisa.Namespace);
      ns.name.must.be.eq("test");
      ns.db.must.be.same(db);
      ns.connection.must.be.same(cx);});


    (0, _justo.test)("getNamespace('unknown', opts) : Namespace", function () {
      var ns = db.getNamespace("unknown", {});

      ns.must.be.instanceOf(_elisa.Namespace);
      ns.name.must.be.eq("unknown");
      ns.db.must.be.same(db);
      ns.connection.must.be.same(cx);});});



  (0, _justo.suite)("#hasNamespace()", function () {
    (0, _justo.test)("hasNamespace(name) : true", function () {
      db.hasNamespace("test").must.be.eq(true);});


    (0, _justo.test)("hasNamespace(name) : false", function () {
      db.hasNamespace("unknown").must.be.eq(false);});});



  (0, _justo.suite)("#findNamespace()", function () {
    (0, _justo.test)("findNamespace(name) : Namespace", function () {
      var ns = db.findNamespace("test");

      ns.must.be.instanceOf(_elisa.Namespace);
      ns.name.must.be.eq("test");
      ns.db.must.be.same(db);
      ns.connection.must.be.same(cx);
      ns.driver.must.be.same(drv);});


    (0, _justo.test)("findNamespace(name) : undefined", function () {
      (0, _assert2.default)(db.findNamespace("unknown") === undefined);});


    (0, _justo.test)("findNamespace(name, opts) : Namespace", function () {
      var ns = db.findNamespace("test", {});

      ns.must.be.instanceOf(_elisa.Namespace);
      ns.name.must.be.eq("test");
      ns.db.must.be.same(db);
      ns.connection.must.be.same(cx);
      ns.driver.must.be.same(drv);});


    (0, _justo.test)("findNamespace(name, opts) : undefined", function () {
      (0, _assert2.default)(db.findNamespace("unknown", {}) === undefined);});});



  (0, _justo.suite)("Store", function () {
    (0, _justo.suite)("#getStore()", function () {
      (0, _justo.test)("getStore(name) : Store", function () {
        var store = db.getStore("bandits");

        store.must.be.instanceOf(_elisa.Store);
        store.must.have({ 
          name: "bandits", 
          qn: "bandits", 
          fqn: "elisa.bandits", 
          inject: undefined });

        store.db.must.be.same(db);});


      (0, _justo.test)("getStore('unknown') : Store", function () {
        var store = db.getStore("unknown");

        store.must.be.instanceOf(_elisa.Store);
        store.must.have({ 
          name: "unknown", 
          qn: "unknown", 
          fqn: "elisa.unknown", 
          inject: undefined });

        store.db.must.be.same(db);});


      (0, _justo.test)("getStore(store, {inject}) : Store", function () {
        var store = db.getStore("bandits", { inject: { userId: 123 } });

        store.must.be.instanceOf(_elisa.Store);
        store.must.have({ 
          name: "bandits", 
          qn: "bandits", 
          fqn: "elisa.bandits", 
          inject: { userId: 123 } });

        store.db.must.be.same(db);});


      (0, _justo.test)("getStore('unknown', {inject}) : Store", function () {
        var store = db.getStore("unknown", { inject: { userId: 123 } });

        store.must.be.instanceOf(_elisa.Store);
        store.must.have({ 
          name: "unknown", 
          qn: "unknown", 
          fqn: "elisa.unknown", 
          inject: { userId: 123 } });

        store.db.must.be.same(db);});


      (0, _justo.test)("getStore(ns, store) : Store", function () {
        var store = db.getStore("test", "bands");

        store.must.be.instanceOf(_elisa.Store);
        store.must.have({ 
          name: "bands", 
          qn: "test.bands", 
          fqn: "elisa.test.bands", 
          inject: undefined });

        store.db.must.be.same(db);});


      (0, _justo.test)("getStore('unknown', 'unknown') : Store", function () {
        var store = db.getStore("unkNs", "unkStore");

        store.must.be.instanceOf(_elisa.Store);
        store.must.have({ 
          name: "unkStore", 
          qn: "unkNs.unkStore", 
          fqn: "elisa.unkNs.unkStore", 
          inject: undefined });

        store.db.must.be.same(db);});


      (0, _justo.test)("getStore('unknown', store) : Store", function () {
        var store = db.getStore("unknown", "bands");

        store.must.be.instanceOf(_elisa.Store);
        store.must.have({ 
          name: "bands", 
          qn: "unknown.bands", 
          fqn: "elisa.unknown.bands", 
          inject: undefined });

        store.db.must.be.same(db);});


      (0, _justo.test)("getStore(ns, 'unknown') : Store", function () {
        var store = db.getStore("test", "unknown");

        store.must.be.instanceOf(_elisa.Store);
        store.must.have({ 
          name: "unknown", 
          qn: "test.unknown", 
          fqn: "elisa.test.unknown", 
          inject: undefined });

        store.db.must.be.same(db);});


      (0, _justo.test)("getStore(ns, store, {inject}) : Store", function () {
        var store = db.getStore("test", "bands", { inject: { userId: 321 } });

        store.must.be.instanceOf(_elisa.Store);
        store.must.have({ 
          name: "bands", 
          qn: "test.bands", 
          fqn: "elisa.test.bands", 
          inject: { userId: 321 } });

        store.db.must.be.same(db);});


      (0, _justo.test)("getStore(qn) : Store", function () {
        var store = db.getStore("test.bands");

        store.must.be.instanceOf(_elisa.Store);
        store.must.have({ 
          name: "bands", 
          qn: "test.bands", 
          fqn: "elisa.test.bands", 
          inject: undefined });

        store.db.must.be.same(db);});


      (0, _justo.test)("getStore(qn, {inject}) : Store", function () {
        var store = db.getStore("test.bands", { inject: { userId: 123 } });

        store.must.be.instanceOf(_elisa.Store);
        store.must.have({ 
          name: "bands", 
          qn: "test.bands", 
          fqn: "elisa.test.bands", 
          inject: { userId: 123 } });

        store.db.must.be.same(db);});});



    (0, _justo.suite)("#findStore()", function () {
      (0, _justo.test)("findStore(store) : Store", function () {
        var store = db.findStore("bandits");

        store.must.be.instanceOf(_elisa.Store);
        store.must.have({ 
          name: "bandits", 
          qn: "bandits", 
          fqn: "elisa.bandits", 
          inject: undefined });

        store.db.must.be.same(db);});


      (0, _justo.test)("findStore('unknown') : undefined", function () {
        (0, _assert2.default)(db.findStore("unknown") === undefined);});


      (0, _justo.test)("findStore(store, {inject}) : Store", function () {
        var store = db.findStore("bandits", { inject: { userId: 123 } });

        store.must.be.instanceOf(_elisa.Store);
        store.must.have({ 
          name: "bandits", 
          qn: "bandits", 
          fqn: "elisa.bandits", 
          inject: { userId: 123 } });

        store.db.must.be.same(db);});


      (0, _justo.test)("findStore('unknown', {inject}) : undefined", function () {
        (0, _assert2.default)(db.findStore("unknown", { inject: { userId: 123 } }) === undefined);});


      (0, _justo.test)("findStore(ns, store) : Store", function () {
        var store = db.findStore("test", "bands");

        store.must.be.instanceOf(_elisa.Store);
        store.must.have({ 
          name: "bands", 
          qn: "test.bands", 
          fqn: "elisa.test.bands", 
          inject: undefined });

        store.db.must.be.same(db);});


      (0, _justo.test)("findStore('unknown', 'unknown') : undefined", function () {
        (0, _assert2.default)(db.findStore("unkNs", "unkStore") === undefined);});


      (0, _justo.test)("findStore('unknown', store) : undefined", function () {
        (0, _assert2.default)(db.findStore("unknown", "bands") === undefined);});


      (0, _justo.test)("findStore(ns, 'unknown') : undefined", function () {
        (0, _assert2.default)(db.findStore("test", "unknown") === undefined);});


      (0, _justo.test)("findStore(ns, store, {inject}) : Store", function () {
        var store = db.findStore("test", "bands", { inject: { userId: 321 } });

        store.must.be.instanceOf(_elisa.Store);
        store.must.have({ 
          name: "bands", 
          qn: "test.bands", 
          fqn: "elisa.test.bands", 
          inject: { userId: 321 } });

        store.db.must.be.same(db);});


      (0, _justo.test)("findStore('ns.store') : Store", function () {
        var store = db.findStore("test.bands");

        store.must.be.instanceOf(_elisa.Store);
        store.must.have({ 
          name: "bands", 
          qn: "test.bands", 
          fqn: "elisa.test.bands", 
          inject: undefined });

        store.db.must.be.same(db);});


      (0, _justo.test)("findStore('unknown.unknown') : undefined", function () {
        (0, _assert2.default)(db.findStore("unkNs.unkStore") === undefined);});


      (0, _justo.test)("findStore('unknown.store') : undefined", function () {
        (0, _assert2.default)(db.findStore("unknown.bandits") === undefined);});


      (0, _justo.test)("findStore('ns.unknown') : undefined", function () {
        (0, _assert2.default)(db.findStore("test.unknown") === undefined);});


      (0, _justo.test)("findStore('ns.store', {inject}) : Store", function () {
        var store = db.findStore("test.bands", { inject: { userId: 123 } });

        store.must.be.instanceOf(_elisa.Store);
        store.must.have({ 
          name: "bands", 
          qn: "test.bands", 
          fqn: "elisa.test.bands", 
          inject: { userId: 123 } });

        store.db.must.be.same(db);});


      (0, _justo.test)("findStore('unknown.unknown', {inject}) : undefined", function () {
        (0, _assert2.default)(db.findStore("unkNs.unkStore", { inject: { userId: 123 } }) === undefined);});


      (0, _justo.test)("findStore('unknown.store', {inject}) : undefined", function () {
        (0, _assert2.default)(db.findStore("unknown.bandits", { inject: { userId: 123 } }) === undefined);});


      (0, _justo.test)("findStore('ns.unknown', {inject}) : undefined", function () {
        (0, _assert2.default)(db.findStore("test.unknown", { inject: { userId: 123 } }) === undefined);});});



    (0, _justo.suite)("#hasStore()", function () {
      (0, _justo.test)("hasStore(store) : true", function () {
        db.hasStore("bandits").must.be.eq(true);});


      (0, _justo.test)("hasStore(store) : false", function () {
        db.hasStore("unknown").must.be.eq(false);});


      (0, _justo.test)("hasStore('ns.store') : true", function () {
        db.hasStore("test.bands").must.be.eq(true);});


      (0, _justo.test)("hasStore('unknown.unknown') : false", function () {
        db.hasStore("unknown.unknown").must.be.eq(false);});


      (0, _justo.test)("hasStore('unknown.store') : false", function () {
        db.hasStore("unknown.bands").must.be.eq(false);});


      (0, _justo.test)("hasStore('ns.unknown') : false", function () {
        db.hasStore("test.unknown").must.be.eq(false);});


      (0, _justo.test)("hasStore(ns, store) : true", function () {
        db.hasStore("test", "bands").must.be.eq(true);});


      (0, _justo.test)("hasStore(unknown, unknown) : false", function () {
        db.hasStore("unknown", "unknown").must.be.eq(false);});


      (0, _justo.test)("hasStore(unknown, store) : false", function () {
        db.hasStore("unknown", "bands").must.be.eq(false);});


      (0, _justo.test)("hasStore(ns, unknown) : false", function () {
        db.hasStore("test", "unknown").must.be.eq(false);});});});




  (0, _justo.suite)("Collection", function () {
    (0, _justo.suite)("#getCollection()", function () {
      (0, _justo.test)("getCollection(name) : Collection", function () {
        var ds = db.getCollection("bandits");

        ds.must.be.instanceOf(_elisa.Collection);
        ds.must.have({ 
          name: "bandits", 
          qn: "bandits", 
          fqn: "elisa.bandits", 
          inject: undefined });

        ds.db.must.be.same(db);});


      (0, _justo.test)("getCollection('unknown') : Collection", function () {
        var ds = db.getCollection("unknown");

        ds.must.be.instanceOf(_elisa.Collection);
        ds.must.have({ 
          name: "unknown", 
          qn: "unknown", 
          fqn: "elisa.unknown", 
          inject: undefined });

        ds.db.must.be.same(db);});


      (0, _justo.test)("getCollection(collection, {inject}) : Collection", function () {
        var ds = db.getCollection("bandits", { inject: { userId: 123 } });

        ds.must.be.instanceOf(_elisa.Collection);
        ds.must.have({ 
          name: "bandits", 
          qn: "bandits", 
          fqn: "elisa.bandits", 
          inject: { userId: 123 } });

        ds.db.must.be.same(db);});


      (0, _justo.test)("getCollection('unknown', {inject}) : Collection", function () {
        var ds = db.getCollection("unknown", { inject: { userId: 123 } });

        ds.must.be.instanceOf(_elisa.Collection);
        ds.must.have({ 
          name: "unknown", 
          qn: "unknown", 
          fqn: "elisa.unknown", 
          inject: { userId: 123 } });

        ds.db.must.be.same(db);});


      (0, _justo.test)("getCollection(ns, store) : Collection", function () {
        var ds = db.getCollection("test", "bands");

        ds.must.be.instanceOf(_elisa.Collection);
        ds.must.have({ 
          name: "bands", 
          qn: "test.bands", 
          fqn: "elisa.test.bands", 
          inject: undefined });

        ds.db.must.be.same(db);});


      (0, _justo.test)("getCollection('unknown', 'unknown') : Collection", function () {
        var ds = db.getCollection("unknown", "unknown");

        ds.must.be.instanceOf(_elisa.Collection);
        ds.must.have({ 
          name: "unknown", 
          qn: "unknown.unknown", 
          fqn: "elisa.unknown.unknown", 
          inject: undefined });

        ds.db.must.be.same(db);});


      (0, _justo.test)("getCollection('unknown', coll) : Collection", function () {
        var ds = db.getCollection("unknown", "bands");

        ds.must.be.instanceOf(_elisa.Collection);
        ds.must.have({ 
          name: "bands", 
          qn: "unknown.bands", 
          fqn: "elisa.unknown.bands", 
          inject: undefined });

        ds.db.must.be.same(db);});


      (0, _justo.test)("getCollection(ns, 'unknown') : Collection", function () {
        var ds = db.getCollection("test", "unknown");

        ds.must.be.instanceOf(_elisa.Collection);
        ds.must.have({ 
          name: "unknown", 
          qn: "test.unknown", 
          fqn: "elisa.test.unknown", 
          inject: undefined });

        ds.db.must.be.same(db);});


      (0, _justo.test)("getCollection(ns, coll, {inject}) : Collection", function () {
        var ds = db.getCollection("test", "bands", { inject: { userId: 321 } });

        ds.must.be.instanceOf(_elisa.Collection);
        ds.must.have({ 
          name: "bands", 
          qn: "test.bands", 
          fqn: "elisa.test.bands", 
          inject: { userId: 321 } });

        ds.db.must.be.same(db);});


      (0, _justo.test)("getCollection(qn) : Collection", function () {
        var ds = db.getCollection("test.bands");

        ds.must.be.instanceOf(_elisa.Collection);
        ds.must.have({ 
          name: "bands", 
          qn: "test.bands", 
          fqn: "elisa.test.bands", 
          inject: undefined });

        ds.db.must.be.same(db);});


      (0, _justo.test)("getCollection(qn, {inject}) : Collection", function () {
        var ds = db.getCollection("test.bands", { inject: { userId: 123 } });

        ds.must.be.instanceOf(_elisa.Collection);
        ds.must.have({ 
          name: "bands", 
          qn: "test.bands", 
          fqn: "elisa.test.bands", 
          inject: { userId: 123 } });

        ds.db.must.be.same(db);});});



    (0, _justo.suite)("#findCollection()", function () {
      (0, _justo.test)("findCollection(coll) : Collection", function () {
        var ds = db.findCollection("bandits");

        ds.must.be.instanceOf(_elisa.Collection);
        ds.must.have({ 
          name: "bandits", 
          qn: "bandits", 
          fqn: "elisa.bandits", 
          inject: undefined });

        ds.db.must.be.same(db);});


      (0, _justo.test)("findCollection('unknown') : undefined", function () {
        (0, _assert2.default)(db.findCollection("unknown") === undefined);});


      (0, _justo.test)("findCollection(coll, {inject}) : Collection", function () {
        var ds = db.findCollection("bandits", { inject: { userId: 123 } });

        ds.must.be.instanceOf(_elisa.Collection);
        ds.must.have({ 
          name: "bandits", 
          qn: "bandits", 
          fqn: "elisa.bandits", 
          inject: { userId: 123 } });

        ds.db.must.be.same(db);});


      (0, _justo.test)("findCollection('unknown', {inject}) : undefined", function () {
        (0, _assert2.default)(db.findCollection("unknown", { inject: { userId: 123 } }) === undefined);});


      (0, _justo.test)("findCollection(ns, coll) : Collection", function () {
        var ds = db.findCollection("test", "bands");

        ds.must.be.instanceOf(_elisa.Collection);
        ds.must.have({ 
          name: "bands", 
          qn: "test.bands", 
          fqn: "elisa.test.bands", 
          inject: undefined });

        ds.db.must.be.same(db);});


      (0, _justo.test)("findCollection('unknown', 'unknown') : undefined", function () {
        (0, _assert2.default)(db.findCollection("unknown", "unknown") === undefined);});


      (0, _justo.test)("findCollection('unknown', store) : undefined", function () {
        (0, _assert2.default)(db.findCollection("unknown", "bands") === undefined);});


      (0, _justo.test)("findCollection(ns, 'unknown') : undefined", function () {
        (0, _assert2.default)(db.findCollection("test", "unknown") === undefined);});


      (0, _justo.test)("findCollection(ns, coll, {inject}) : Collection", function () {
        var ds = db.findCollection("test", "bands", { inject: { userId: 321 } });

        ds.must.be.instanceOf(_elisa.Collection);
        ds.must.have({ 
          name: "bands", 
          qn: "test.bands", 
          fqn: "elisa.test.bands", 
          inject: { userId: 321 } });

        ds.db.must.be.same(db);});


      (0, _justo.test)("findCollection('ns.coll') : Collection", function () {
        var ds = db.findCollection("test.bands");

        ds.must.be.instanceOf(_elisa.Collection);
        ds.must.have({ 
          name: "bands", 
          qn: "test.bands", 
          fqn: "elisa.test.bands", 
          inject: undefined });

        ds.db.must.be.same(db);});


      (0, _justo.test)("findCollection('unknown.unknown') : undefined", function () {
        (0, _assert2.default)(db.findCollection("unkNs.unkStore") === undefined);});


      (0, _justo.test)("findCollection('unknown.store') : undefined", function () {
        (0, _assert2.default)(db.findCollection("unknown.bandits") === undefined);});


      (0, _justo.test)("findCollection('ns.unknown') : undefined", function () {
        (0, _assert2.default)(db.findCollection("test.unknown") === undefined);});


      (0, _justo.test)("findCollection('ns.store', {inject}) : Collection", function () {
        var ds = db.findCollection("test.bands", { inject: { userId: 123 } });

        ds.must.be.instanceOf(_elisa.Collection);
        ds.must.have({ 
          name: "bands", 
          qn: "test.bands", 
          fqn: "elisa.test.bands", 
          inject: { userId: 123 } });

        ds.db.must.be.same(db);});


      (0, _justo.test)("findCollection('unknown.unknown', {inject}) : undefined", function () {
        (0, _assert2.default)(db.findCollection("unknown.unknown", { inject: { userId: 123 } }) === undefined);});


      (0, _justo.test)("findCollection('unknown.coll', {inject}) : undefined", function () {
        (0, _assert2.default)(db.findCollection("unknown.bandits", { inject: { userId: 123 } }) === undefined);});


      (0, _justo.test)("findCollection('ns.unknown', {inject}) : undefined", function () {
        (0, _assert2.default)(db.findCollection("test.unknown", { inject: { userId: 123 } }) === undefined);});});



    (0, _justo.suite)("#hasCollection()", function () {
      (0, _justo.test)("hasCollection(ds) : true", function () {
        db.hasCollection("bandits").must.be.eq(true);});


      (0, _justo.test)("hasCollection(ds) : false", function () {
        db.hasCollection("unknown").must.be.eq(false);});


      (0, _justo.test)("hasCollection('ns.ds') : true", function () {
        db.hasCollection("test.bands").must.be.eq(true);});


      (0, _justo.test)("hasCollection('unknown.unknown') : false", function () {
        db.hasCollection("unknown.unknown").must.be.eq(false);});


      (0, _justo.test)("hasCollection('unknown.ds') : false", function () {
        db.hasCollection("unknown.bands").must.be.eq(false);});


      (0, _justo.test)("hasCollection('ns.unknown') : false", function () {
        db.hasCollection("test.unknown").must.be.eq(false);});


      (0, _justo.test)("hasCollection(ns, ds) : true", function () {
        db.hasCollection("test", "bands").must.be.eq(true);});


      (0, _justo.test)("hasCollection(unknown, unknown) : false", function () {
        db.hasCollection("unknown", "unknown").must.be.eq(false);});


      (0, _justo.test)("hasCollection(unknown, ds) : false", function () {
        db.hasCollection("unknown", "bands").must.be.eq(false);});


      (0, _justo.test)("hasCollection(ns, unknown) : false", function () {
        db.hasCollection("test", "unknown").must.be.eq(false);});});});});