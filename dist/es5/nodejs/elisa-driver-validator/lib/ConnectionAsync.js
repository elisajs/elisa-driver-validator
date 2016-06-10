"use strict";Object.defineProperty(exports, "__esModule", { value: true });
var _assert = require("assert");var _assert2 = _interopRequireDefault(_assert);
var _elisa = require("elisa");
var _justo = require("justo");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}exports.default = 


(0, _justo.suite)("Connection (Asynchronous Connection)", function () {
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
      cx = drv.createConnection(cxOpts);});


    (0, _justo.test)("open()", function (done) {
      cx.open();

      setTimeout(function () {
        cx.opened.must.be.eq(true);
        cx.closed.must.be.eq(false);
        done();}, 
      1500);});


    (0, _justo.test)("open(callback)", function (done) {
      cx.open(function (err) {
        (0, _assert2.default)(err === undefined);
        cx.opened.must.be.eq(true);
        cx.closed.must.be.eq(false);
        done();});});});




  (0, _justo.suite)("#close()", function () {
    var cx;

    (0, _justo.init)({ name: "*", title: "Open connection" }, function (done) {
      drv.openConnection(cxOpts, function (err, con) {
        cx = con;
        done();});});



    (0, _justo.test)("close()", function (done) {
      cx.close();

      setTimeout(function () {
        cx.closed.must.be.eq(true);
        cx.opened.must.be.eq(false);
        done();}, 
      1000);});


    (0, _justo.test)("close(callback)", function (done) {
      cx.close(function (err) {
        (0, _assert2.default)(err === undefined);
        cx.closed.must.be.eq(true);
        cx.opened.must.be.eq(false);
        done();});});});




  (0, _justo.suite)("#connected()", function () {
    var cx;

    (0, _justo.init)({ name: "*", title: "Open connection" }, function (done) {
      drv.openConnection(cxOpts, function (err, con) {
        cx = con;
        done();});});



    (0, _justo.test)("connected(callback) - with opened connection", function (done) {
      cx.connected(function (error, con) {
        (0, _assert2.default)(error === undefined);
        con.must.be.eq(true);
        done();});});



    (0, _justo.test)("connected(callback) - with closed connection", function (done) {
      cx.close();

      setTimeout(function () {
        cx.connected(function (error, con) {
          (0, _assert2.default)(error === undefined);
          con.must.be.eq(false);
          done();});}, 

      500);});});



  (0, _justo.suite)("#ping()", function () {
    (0, _justo.test)("ping() - opened connection", function (done) {
      drv.openConnection(cxOpts, function (err, cx) {
        cx.ping(function (err) {
          (0, _assert2.default)(err === undefined);
          done();});});});




    (0, _justo.test)("ping() - closed connection", function (done) {
      var cx = drv.createConnection({});

      cx.ping(function (err) {
        err.must.be.instanceOf(Error);
        err.message.must.be.eq("Connection closed.");
        done();});});});});