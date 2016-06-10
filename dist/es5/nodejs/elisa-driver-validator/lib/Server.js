"use strict";Object.defineProperty(exports, "__esModule", { value: true });
var _elisa = require("elisa");
var _justo = require("justo");exports.default = 


(0, _justo.suite)("Server by Validator", function () {
  var drv, cx, cxOpts, svr;

  (0, _justo.init)({ title: "Get driver" }, function (params) {
    drv = _elisa.Driver.getDriver(params[0].name);});


  (0, _justo.init)({ title: "Open connection and get server" }, function (params, done) {
    cxOpts = params[0].cxOpts;

    drv.openConnection(cxOpts, function (error, con) {
      cx = con;
      svr = cx.server;
      done();});});



  (0, _justo.fin)({ title: "Close connection" }, function (done) {
    cx.close(done);});


  (0, _justo.test)("#host", function () {
    svr.host.must.be.eq(cxOpts.host);});


  (0, _justo.test)("#port", function () {
    svr.port.must.be.eq(cxOpts.port);});


  (0, _justo.test)("#version", function () {
    svr.version.must.be.instanceOf(String);});});