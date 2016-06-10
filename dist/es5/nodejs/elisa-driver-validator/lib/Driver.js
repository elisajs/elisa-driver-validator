"use strict";Object.defineProperty(exports, "__esModule", { value: true });
var _elisa = require("elisa");
var _assert = require("assert");var _assert2 = _interopRequireDefault(_assert);
var _justo = require("justo");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}exports.default = 


(0, _justo.suite)("Validator: Driver", function () {
  var drv, cxOpts;

  (0, _justo.init)({ title: "Get options from params.opts" }, function (params) {
    cxOpts = params[0].cxOpts;});


  (0, _justo.init)({ title: "Get driver using params.name" }, function (params) {
    drv = _elisa.Driver.getDriver(params[0].name);});


  (0, _justo.test)("Check whether the driver is registered", function () {
    drv.must.be.instanceOf(_elisa.Driver);});


  (0, _justo.suite)("#createConnection()", function () {
    (0, _justo.test)("#createConnection(opts)", function () {
      var cx = drv.createConnection(cxOpts);

      cx.must.be.instanceOf(_elisa.Connection);
      cx.driver.must.be.same(drv);
      cx.opened.must.be.eq(false);
      cx.closed.must.be.eq(true);});});



  (0, _justo.suite)("#openConnection()", function () {
    (0, _justo.suite)("Asynchronous connection", function () {
      (0, _justo.test)("openConnection(opts, callback)", function (done) {
        drv.openConnection(cxOpts, function (err, cx) {
          (0, _assert2.default)(err === undefined);
          cx.must.be.instanceOf(_elisa.Connection);
          cx.driver.must.be.same(drv);
          cx.type.must.be.eq("async");
          cx.opened.must.be.eq(true);
          cx.closed.must.be.eq(false);
          done();});});



      (0, _justo.test)("openConnection({type: 'async'}, opts, callback)", function (done) {
        drv.openConnection({ type: "async" }, cxOpts, function (err, cx) {
          (0, _assert2.default)(err === undefined);
          cx.must.be.instanceOf(_elisa.Connection);
          cx.driver.must.be.same(drv);
          cx.type.must.be.eq("async");
          cx.opened.must.be.eq(true);
          cx.closed.must.be.eq(false);
          done();});});});




    (0, _justo.suite)("Synchronous connection", function () {
      (0, _justo.test)("openConnection({type: 'sync', opts) : Connection", function () {
        var cx = drv.openConnection({ type: "sync" }, cxOpts);
        cx.must.be.instanceOf(_elisa.Connection);
        cx.driver.must.be.same(drv);
        cx.type.must.be.eq("sync");
        cx.opened.must.be.eq(true);
        cx.closed.must.be.eq(false);});});});});