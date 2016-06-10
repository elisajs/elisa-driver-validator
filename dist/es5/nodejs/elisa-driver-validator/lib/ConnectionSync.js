"use strict";Object.defineProperty(exports, "__esModule", { value: true });
var _assert = require("assert");var _assert2 = _interopRequireDefault(_assert);
var _elisa = require("elisa");
var _justo = require("justo");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}exports.default = 


(0, _justo.suite)("Connection (Synchronous Connection)", function () {
  var drv, cxOpts;

  (0, _justo.init)({ title: "Get driver" }, function (params) {
    drv = _elisa.Driver.getDriver(params[0].name);});


  (0, _justo.init)({ title: "Get connection options from params" }, function (params) {
    cxOpts = params[0].cxOpts;});


  (0, _justo.suite)("#db", function () {
    var cx;

    (0, _justo.init)({ name: "*", title: "Open connection" }, function (done) {
      drv.openConnection(cxOpts, function (err, con) {
        cx = con;
        done();});});



    (0, _justo.test)("db", function () {
      cx.db.must.be.instanceOf(_elisa.Database);
      cx.db.name.must.be.instanceOf(String);
      cx.db.connection.must.be.same(cx);
      cx.db.driver.must.be.same(drv);});});



  (0, _justo.suite)("#open()", function () {
    var cx;

    (0, _justo.init)({ name: "*", title: "Create connection" }, function () {
      cx = drv.createConnection({ type: "sync" }, cxOpts);});


    (0, _justo.test)("open()", function () {
      cx.open();
      cx.opened.must.be.eq(true);
      cx.closed.must.be.eq(false);});});



  (0, _justo.suite)("#close()", function () {
    var cx;

    (0, _justo.init)({ name: "*", title: "Open connection" }, function () {
      cx = drv.openConnection({ type: "sync" }, cxOpts);});


    (0, _justo.test)("close()", function () {
      cx.close();
      cx.closed.must.be.eq(true);
      cx.opened.must.be.eq(false);});});



  (0, _justo.suite)("#connected()", function () {
    var cx;

    (0, _justo.init)({ name: "*", title: "Open connection" }, function () {
      cx = drv.openConnection({ type: "sync" }, cxOpts);});


    (0, _justo.test)("connected() - with opened connection", function () {
      cx.connected().must.be.eq(true);});


    (0, _justo.test)("connected() - with closed connection", function () {
      cx.close();
      cx.connected().must.be.eq(false);});});



  (0, _justo.suite)("#ping()", function () {
    (0, _justo.test)("ping() - opened connection", function () {
      drv.openConnection({ type: "sync" }, cxOpts).ping();});


    (0, _justo.test)("ping() - closed connection", function () {
      var cx = drv.createConnection({ type: "sync" }, cxOpts);
      cx.ping.bind(cx).must.raise(Error);});});});