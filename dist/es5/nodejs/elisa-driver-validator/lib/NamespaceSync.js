"use strict";Object.defineProperty(exports, "__esModule", { value: true });
var _assert = require("assert");var _assert2 = _interopRequireDefault(_assert);
var _elisa = require("elisa");
var _justo = require("justo");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}exports.default = 


(0, _justo.suite)("Namespace (Synchronous Connection)", function () {
  var drv, drvName, db, ns, cx, cxOpts, store, createStores, dropStores;

  (0, _justo.init)({ title: "Initialize suite from params" }, function (params) {
    params = params[0];

    drvName = params.name;
    cxOpts = params.cxOpts;
    createStores = params.createStores;
    dropStores = params.dropStores;});


  (0, _justo.init)({ title: "Get driver" }, function () {
    drv = _elisa.Driver.getDriver(drvName);});


  (0, _justo.init)({ title: "Open connection and get namespace" }, function () {
    cx = drv.openConnection({ type: "sync" }, cxOpts);
    db = cx.db;
    ns = db.getNamespace("test");});


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
    ns.name.must.be.eq("test");
    ns.qn.must.be.eq("test");
    ns.fqn.must.be.eq("elisa.test");
    ns.connection.must.be.same(cx);
    ns.driver.must.be.same(drv);});


  (0, _justo.test)("#getQn(ds) : string", function () {
    ns.getQn("hello").must.be.eq("test.hello");});


  (0, _justo.suite)("Store", function () {
    (0, _justo.suite)("#getStore()", function () {
      (0, _justo.test)("getStore(name) : Store", function () {
        var store = ns.getStore("bands");

        store.must.be.instanceOf(_elisa.Store);
        store.must.have({ 
          name: "bands", 
          qn: "test.bands", 
          fqn: "elisa.test.bands", 
          inject: undefined });

        store.ns.must.be.same(ns);});


      (0, _justo.test)("getStore('unknown') : Store", function () {
        var store = ns.getStore("unknown");

        store.must.be.instanceOf(_elisa.Store);
        store.must.have({ 
          name: "unknown", 
          qn: "test.unknown", 
          fqn: "elisa.test.unknown", 
          inject: undefined });

        store.ns.must.be.same(ns);});


      (0, _justo.test)("getStore(name, {inject}) : Store", function () {
        var store = ns.getStore("bands", { inject: { userId: 123 } });

        store.must.be.instanceOf(_elisa.Store);
        store.must.have({ 
          name: "bands", 
          qn: "test.bands", 
          fqn: "elisa.test.bands", 
          inject: { userId: 123 } });

        store.ns.must.be.same(ns);});


      (0, _justo.test)("getStore('unknown', {inject}) : Store", function () {
        var store = ns.getStore("unknown", { inject: { userId: 321 } });

        store.must.be.instanceOf(_elisa.Store);
        store.must.have({ 
          name: "unknown", 
          qn: "test.unknown", 
          fqn: "elisa.test.unknown", 
          inject: { userId: 321 } });

        store.ns.must.be.same(ns);});});



    (0, _justo.suite)("#findStore()", function () {
      (0, _justo.test)("findStore(name) : Store", function () {
        var store = ns.findStore("bands");

        store.must.be.instanceOf(_elisa.Store);
        store.must.have({ 
          name: "bands", 
          qn: "test.bands", 
          fqn: "elisa.test.bands", 
          inject: undefined });

        store.ns.must.be.same(ns);});


      (0, _justo.test)("findStore('unknown') : undefined", function () {
        (0, _assert2.default)(ns.findStore("unknown") === undefined);});


      (0, _justo.test)("findStore(name, {inject}) : Store", function () {
        var store = ns.findStore("bands", { inject: { userId: 123 } });

        store.must.be.instanceOf(_elisa.Store);
        store.must.have({ 
          name: "bands", 
          qn: "test.bands", 
          fqn: "elisa.test.bands", 
          inject: { userId: 123 } });

        store.ns.must.be.same(ns);});


      (0, _justo.test)("findStore('unknown', {inject}) : undefined", function () {
        (0, _assert2.default)(ns.findStore("unknown", { inject: { userId: 123 } }) === undefined);});});



    (0, _justo.suite)("#hasStore()", function () {
      (0, _justo.test)("hasStore(name) : true", function () {
        ns.hasStore("bands").must.be.eq(true);});


      (0, _justo.test)("hasStore(name) : false", function () {
        ns.hasStore("unknown").must.be.eq(false);});});});});