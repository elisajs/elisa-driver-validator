"use strict";Object.defineProperty(exports, "__esModule", { value: true });
var _assert = require("assert");var _assert2 = _interopRequireDefault(_assert);
var _elisa = require("elisa");
var _justo = require("justo");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}exports.default = 


(0, _justo.suite)("Asynchronous Connection", function () {
  var drv, drvName, db, cx, cxOpts, store, createStores, dropStores;

  (0, _justo.init)({ title: "Initialize suite from params" }, function (params) {
    params = params[0];

    drvName = params.name;
    cxOpts = params.cxOpts;
    createStores = params.createStores;
    dropStores = params.dropStores;});


  (0, _justo.init)({ title: "Get driver" }, function () {
    drv = _elisa.Driver.getDriver(drvName);});


  (0, _justo.init)({ title: "Open connection and get database" }, function (done) {
    drv.openConnection(cxOpts, function (err, con) {
      cx = con;
      db = cx.db;
      done();});});



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
    (0, _justo.test)("hasNamespace(name, callback) => true", function (done) {
      db.hasNamespace("test", function (err, has) {
        (0, _assert2.default)(err === undefined);
        has.must.be.eq(true);
        done();});});



    (0, _justo.test)("hasNamespace(name, callback) => false", function (done) {
      db.hasNamespace("unknown", function (err, has) {
        (0, _assert2.default)(err === undefined);
        has.must.be.eq(false);
        done();});});});




  (0, _justo.suite)("#findNamespace()", function () {
    (0, _justo.test)("findNamespace(name, callback) => Namespace", function (done) {
      db.findNamespace("test", function (err, ns) {
        (0, _assert2.default)(err === undefined);
        ns.must.be.instanceOf(_elisa.Namespace);
        ns.name.must.be.eq("test");
        ns.db.must.be.same(db);
        ns.connection.must.be.same(cx);
        ns.driver.must.be.same(drv);
        done();});});



    (0, _justo.test)("findNamespace(name, callback) => undefined", function (done) {
      db.findNamespace("unknown", function (err, ns) {
        (0, _assert2.default)(err === undefined);
        (0, _assert2.default)(ns === undefined);
        done();});});



    (0, _justo.test)("findNamespace(name, opts, callback) => Namespace", function (done) {
      db.findNamespace("test", {}, function (err, ns) {
        (0, _assert2.default)(err === undefined);
        ns.must.be.instanceOf(_elisa.Namespace);
        ns.name.must.be.eq("test");
        ns.db.must.be.same(db);
        ns.connection.must.be.same(cx);
        ns.driver.must.be.same(drv);
        done();});});




    (0, _justo.test)("findNamespace(name, opts, callback) => undefined", function (done) {
      db.findNamespace("unknown", {}, function (err, ns) {
        (0, _assert2.default)(err === undefined);
        (0, _assert2.default)(ns === undefined);
        done();});});});




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
      (0, _justo.test)("findStore(store, callback) => Store", function (done) {
        db.findStore("bandits", function (err, store) {
          (0, _assert2.default)(err === undefined);
          store.must.be.instanceOf(_elisa.Store);
          store.must.have({ 
            name: "bandits", 
            qn: "bandits", 
            fqn: "elisa.bandits", 
            inject: undefined });

          store.db.must.be.same(db);
          done();});});




      (0, _justo.test)("findStore('unknown', callback) => undefined", function (done) {
        db.findStore("unknown", function (err, store) {
          (0, _assert2.default)(err === undefined);
          (0, _assert2.default)(store === undefined);
          done();});});



      (0, _justo.test)("findStore(store, {inject}, callback) => Store", function (done) {
        db.findStore("bandits", { inject: { userId: 123 } }, function (err, store) {
          (0, _assert2.default)(err === undefined);
          store.must.be.instanceOf(_elisa.Store);
          store.must.have({ 
            name: "bandits", 
            qn: "bandits", 
            fqn: "elisa.bandits", 
            inject: { userId: 123 } });

          store.db.must.be.same(db);
          done();});});



      (0, _justo.test)("findStore('unknown', {inject}, callback) => undefined", function (done) {
        db.findStore("unknown", { inject: { userId: 123 } }, function (err, store) {
          (0, _assert2.default)(err === undefined);
          (0, _assert2.default)(store === undefined);
          done();});});



      (0, _justo.test)("findStore(ns, store, callback) => Store", function (done) {
        db.findStore("test", "bands", function (err, store) {
          (0, _assert2.default)(err === undefined);
          store.must.be.instanceOf(_elisa.Store);
          store.must.have({ 
            name: "bands", 
            qn: "test.bands", 
            fqn: "elisa.test.bands", 
            inject: undefined });

          store.db.must.be.same(db);
          done();});});




      (0, _justo.test)("findStore('unknown', 'unknown', callback) => undefined", function (done) {
        db.findStore("unkNs", "unkStore", function (err, store) {
          (0, _assert2.default)(err === undefined);
          (0, _assert2.default)(store === undefined);
          done();});});



      (0, _justo.test)("findStore('unknown', store, callback) => undefined", function (done) {
        db.findStore("unknown", "bands", function (err, store) {
          (0, _assert2.default)(err === undefined);
          (0, _assert2.default)(store === undefined);
          done();});});



      (0, _justo.test)("findStore(ns, 'unknown', callback) => undefined", function (done) {
        db.findStore("test", "unknown", function (err, store) {
          (0, _assert2.default)(err === undefined);
          (0, _assert2.default)(store === undefined);
          done();});});



      (0, _justo.test)("findStore(ns, store, {inject}, callback) => Store", function (done) {
        db.findStore("test", "bands", { inject: { userId: 321 } }, function (err, store) {
          (0, _assert2.default)(err === undefined);
          store.must.be.instanceOf(_elisa.Store);
          store.must.have({ 
            name: "bands", 
            qn: "test.bands", 
            fqn: "elisa.test.bands", 
            inject: { userId: 321 } });

          store.db.must.be.same(db);
          done();});});



      (0, _justo.test)("findStore('ns.store', callback) => Store", function (done) {
        db.findStore("test.bands", function (err, store) {
          (0, _assert2.default)(err === undefined);
          store.must.be.instanceOf(_elisa.Store);
          store.must.have({ 
            name: "bands", 
            qn: "test.bands", 
            fqn: "elisa.test.bands", 
            inject: undefined });

          store.db.must.be.same(db);
          done();});});



      (0, _justo.test)("findStore('unknown.unknown', callback) => undefined", function (done) {
        db.findStore("unkNs.unkStore", function (err, store) {
          (0, _assert2.default)(err === undefined);
          (0, _assert2.default)(store === undefined);
          done();});});



      (0, _justo.test)("findStore('unknown.store', callback) => undefined", function (done) {
        db.findStore("unknown.bandits", function (err, store) {
          (0, _assert2.default)(err === undefined);
          (0, _assert2.default)(store === undefined);
          done();});});



      (0, _justo.test)("findStore('ns.unknown', callback) => undefined", function (done) {
        db.findStore("test.unknown", function (err, store) {
          (0, _assert2.default)(err === undefined);
          (0, _assert2.default)(store === undefined);
          done();});});



      (0, _justo.test)("findStore('ns.store', {inject}, calllback) => Store", function (done) {
        db.findStore("test.bands", { inject: { userId: 123 } }, function (err, store) {
          (0, _assert2.default)(err === undefined);
          store.must.be.instanceOf(_elisa.Store);
          store.must.have({ 
            name: "bands", 
            qn: "test.bands", 
            fqn: "elisa.test.bands", 
            inject: { userId: 123 } });

          store.db.must.be.same(db);
          done();});});




      (0, _justo.test)("findStore('unknown.unknown', {inject}, callback) => undefined", function (done) {
        db.findStore("unkNs.unkStore", { inject: { userId: 123 } }, function (err, store) {
          (0, _assert2.default)(err === undefined);
          (0, _assert2.default)(store === undefined);
          done();});});



      (0, _justo.test)("findStore('unknown.store', {inject}, callback) => undefined", function (done) {
        db.findStore("unknown.bandits", { inject: { userId: 123 } }, function (err, store) {
          (0, _assert2.default)(err === undefined);
          (0, _assert2.default)(store === undefined);
          done();});});



      (0, _justo.test)("findStore('ns.unknown', {inject}, callback) => undefined", function (done) {
        db.findStore("test.unknown", { inject: { userId: 123 } }, function (err, store) {
          (0, _assert2.default)(err === undefined);
          (0, _assert2.default)(store === undefined);
          done();});});});




    (0, _justo.suite)("#hasStore()", function () {
      (0, _justo.test)("hasStore(store, callback) => true", function (done) {
        db.hasStore("bandits", function (err, has) {
          (0, _assert2.default)(err === undefined);
          has.must.be.eq(true);
          done();});});



      (0, _justo.test)("hasStore(store, callback) => false", function (done) {
        db.hasStore("unknown", function (err, has) {
          (0, _assert2.default)(err === undefined);
          has.must.be.eq(false);
          done();});});



      (0, _justo.test)("hasStore('ns.store', callback) => true", function (done) {
        db.hasStore("test.bands", function (err, has) {
          (0, _assert2.default)(err === undefined);
          has.must.be.eq(true);
          done();});});



      (0, _justo.test)("hasStore('unknown.unknown', callback) => false", function (done) {
        db.hasStore("unknown.unknown", function (err, has) {
          (0, _assert2.default)(err === undefined);
          has.must.be.eq(false);
          done();});});



      (0, _justo.test)("hasStore('unknown.store', callback) => false", function (done) {
        db.hasStore("unknown.bands", function (err, has) {
          (0, _assert2.default)(err === undefined);
          has.must.be.eq(false);
          done();});});



      (0, _justo.test)("hasStore('ns.unknown', callback) => false", function (done) {
        db.hasStore("test.unknown", function (err, has) {
          (0, _assert2.default)(err === undefined);
          has.must.be.eq(false);
          done();});});



      (0, _justo.test)("hasStore(ns, store, callback) => true", function (done) {
        db.hasStore("test", "bands", function (err, has) {
          (0, _assert2.default)(err === undefined);
          has.must.be.eq(true);
          done();});});



      (0, _justo.test)("hasStore(unknown, unknown, callback) => false", function (done) {
        db.hasStore("unknown", "unknown", function (err, has) {
          (0, _assert2.default)(err === undefined);
          has.must.be.eq(false);
          done();});});



      (0, _justo.test)("hasStore(unknown, store, callback) => false", function (done) {
        db.hasStore("unknown", "bands", function (err, has) {
          (0, _assert2.default)(err === undefined);
          has.must.be.eq(false);
          done();});});



      (0, _justo.test)("hasStore(ns, unknown, callback) => false", function (done) {
        db.hasStore("test", "unknown", function (err, has) {
          (0, _assert2.default)(err === undefined);
          has.must.be.eq(false);
          done();});});});});});