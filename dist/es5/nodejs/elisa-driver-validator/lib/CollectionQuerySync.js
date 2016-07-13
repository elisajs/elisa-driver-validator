"use strict";Object.defineProperty(exports, "__esModule", { value: true });
var _assert = require("assert");var _assert2 = _interopRequireDefault(_assert);
var _elisa = require("elisa");
var _justo = require("justo");
var _collection = require("../data/collection");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}exports.default = 







(0, _justo.suite)("Synchronous Connection", function () {
  var drv, drvName, db, cx, cxOpts, coll, bandsColl, emptyColl, createCollections, dropCollections, q;

  (0, _justo.init)({ title: "Initialize suite from params" }, function (params) {
    params = params[0];

    if (params.type == "collection") {
      bandsColl = "bands";
      emptyColl = "empty";} else 
    {
      bandsColl = "test.bands";
      emptyColl = "test.empty";}


    drvName = params.name;
    cxOpts = params.cxOpts;
    createCollections = params.createCollections;
    dropCollections = params.dropCollections;});


  (0, _justo.init)({ title: "Get driver" }, function () {
    drv = _elisa.Driver.getDriver(drvName);});


  (0, _justo.init)("*", function () {
    cx = drv.openConnection({ type: "sync" }, cxOpts);
    db = cx.db;
    coll = db.getCollection(bandsColl);}).
  title("Open connection and get collection");

  (0, _justo.init)("*", function (done) {
    createCollections(
    cxOpts, 
    [
    { name: bandsColl, docs: _collection.BANDS }, 
    { name: emptyColl, docs: [] }], 

    done);}).

  title("Create collections and data");

  (0, _justo.init)("*", function () {
    q = coll.q();}).
  title("Get query");

  (0, _justo.fin)("*", function (done) {
    dropCollections(cxOpts, [bandsColl, emptyColl], done);}).
  title("Drop collections");

  (0, _justo.fin)("*", function (params) {
    cx.close();}).
  title("Close connection");

  (0, _justo.suite)("#find()", function () {
    (0, _justo.test)("find() : Result", function () {
      var res = q.find();
      res.must.be.instanceOf(_elisa.Result);
      res.docs.must.be.similarTo(_collection.BANDS);});


    (0, _justo.test)("find(query) : Result", function () {
      var res = q.find({ disbanded: false });
      res.must.be.instanceOf(_elisa.Result);
      res.docs.must.be.similarTo(_collection.NON_DISBANDED);});


    (0, _justo.test)("find(query, opts) : Result", function () {
      var res = q.find({ disbanded: false }, {});
      res.must.be.instanceOf(_elisa.Result);
      res.docs.must.be.similarTo(_collection.NON_DISBANDED);});});



  (0, _justo.suite)("#findOne()", function () {
    (0, _justo.test)("findOne() : object", function () {
      q.findOne().must.be.insideOf(_collection.BANDS);});


    (0, _justo.test)("findOne(query) : object", function () {
      q.findOne({ id: _collection.BANDS[0].id }).must.be.eq(_collection.BANDS[0]);});


    (0, _justo.test)("findOne(query, opts) : object", function () {
      q.findOne({ origin: _collection.BANDS[1].origin }, {}).must.be.eq(_collection.BANDS[1]);});});



  (0, _justo.test)("#limit(l)", function (params) {
    var res;

    q.limit(params[0]).must.be.same(q);

    res = q.run();
    res.must.be.instanceOf(_elisa.Result);
    res.length.must.be.eq(params[0]);var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {
      for (var _iterator = res.docs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var doc = _step.value;doc.must.be.insideOf(_collection.BANDS);}} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator.return) {_iterator.return();}} finally {if (_didIteratorError) {throw _iteratorError;}}}}).
  params(1, 2, 3);

  (0, _justo.suite)("#offset()", function () {
    (0, _justo.test)("offset(o) - without limit", function (params) {
      var res;

      q.offset(params[0]).must.be.same(q);

      res = q.run();
      res.must.be.instanceOf(_elisa.Result);
      res.length.must.be.eq(_collection.BANDS.length - params[0]);}).
    params(1, 2, 3);

    (0, _justo.test)("offset(o) - with limit", function (params) {
      var res;

      q.offset(params[0]).limit(2);

      res = q.run();
      res.must.be.instanceOf(_elisa.Result);
      res.length.must.be.eq(2);}).
    params(1, 2, 3);});


  (0, _justo.suite)("#filter()", function () {
    (0, _justo.test)("filter(query)", function () {
      var res;

      q.filter({ disbanded: false }).must.be.same(q);

      res = q.run();
      res.must.be.instanceOf(_elisa.Result);
      res.docs.must.be.similarTo(_collection.NON_DISBANDED);});});



  (0, _justo.suite)("#sort()", function () {
    (0, _justo.suite)("By id", function () {
      (0, _justo.test)("sort(id)", function (params) {
        var res;

        q.sort(params[0]).must.be.same(q);
        res = q.run();
        res.must.be.instanceOf(_elisa.Result);
        res.docs.must.be.eq(_collection.SORTED_ASC_BY_ID);}).
      params("id", { id: "ASC" });

      (0, _justo.test)("sort({id: 'DESC'})", function () {
        var res;

        q.sort({ id: "DESC" }).must.be.same(q);
        res = q.run();
        res.must.be.instanceOf(_elisa.Result);
        res.docs.must.be.eq(_collection.SORTED_DESC_BY_ID);});});



    (0, _justo.suite)("By field", function () {
      (0, _justo.test)("sort(field)", function (params) {
        var res;

        q.sort(params[0]).must.be.same(q);
        res = q.run();
        res.must.be.instanceOf(_elisa.Result);
        res.docs.must.be.eq(_collection.SORTED_ASC_BY_YEAR);}).
      params("year", { year: "ASC" });

      (0, _justo.test)("sort({field: 'DESC'})", function () {
        var res;

        q.sort({ year: "DESC" }).must.be.same(q);
        res = q.run();
        res.must.be.instanceOf(_elisa.Result);
        res.docs.must.be.eq(_collection.SORTED_DESC_BY_YEAR);});});



    (0, _justo.suite)("Several", function () {
      (0, _justo.test)("sort(field, field)", function () {
        var res;

        q.sort("id", "year").must.be.same(q);
        res = q.run();
        res.must.be.instanceOf(_elisa.Result);
        res.docs.must.be.eq(_collection.SORTED_ASC_BY_ID);});


      (0, _justo.test)("sort({field, field})", function () {
        var res;

        q.sort({ id: "ASC", year: "ASC" }).must.be.same(q);
        res = q.run();
        res.must.be.instanceOf(_elisa.Result);
        res.docs.must.be.eq(_collection.SORTED_ASC_BY_ID);});});});




  (0, _justo.suite)("#run()", function () {
    (0, _justo.test)("run() : Result - find all", function () {
      var res = q.run();
      res.must.be.instanceOf(_elisa.Result);
      res.docs.must.be.similarTo(_collection.BANDS);});


    (0, _justo.test)("run() : Result - filter", function () {
      var res = q.filter({ disbanded: false }).run();
      res.must.be.instanceOf(_elisa.Result);
      res.docs.must.be.similarTo(_collection.NON_DISBANDED);});


    (0, _justo.test)("run() : Result - filter|sort", function () {
      var res = q.filter({ disbanded: false }).sort("id").run();
      res.must.be.instanceOf(_elisa.Result);
      res.docs.must.be.eq(_collection.NON_DISBANDED_SORTED_BY_ID);});


    (0, _justo.test)("run() : Result - filter|sort|limit", function () {
      var res = q.filter({ disbanded: false }).sort("id").limit(2).run();
      res.must.be.instanceOf(_elisa.Result);
      res.docs.must.be.eq(_collection.NON_DISBANDED_SORTED_BY_ID.slice(0, 2));});


    (0, _justo.test)("run() : Result - filter|sort|offset", function () {
      var res = q.filter({ disbanded: false }).sort("id").offset(2).run();
      res.must.be.instanceOf(_elisa.Result);
      res.docs.must.be.eq(_collection.NON_DISBANDED_SORTED_BY_ID.slice(2));});


    (0, _justo.test)("run() : Result - filter|sort|offset|limit", function () {
      var res = q.filter({ disbanded: false }).sort("id").offset(1).limit(2).run();
      res.must.be.instanceOf(_elisa.Result);
      res.docs.must.be.eq(_collection.NON_DISBANDED_SORTED_BY_ID.slice(1, 3));});});



  (0, _justo.suite)("Injection", function () {
    (0, _justo.test)("filter(query)", function () {
      db.getCollection(bandsColl, { inject: { id: _collection.BANDS[2].id } }).q().filter({}).run().docs.must.be.eq(_collection.BANDS.slice(2, 3));});


    (0, _justo.test)("find(query)", function () {
      db.getCollection(bandsColl, { inject: { id: _collection.BANDS[2].id } }).q().find({}).docs.must.be.eq(_collection.BANDS.slice(2, 3));});


    (0, _justo.test)("findOne(query)", function () {
      db.getCollection(bandsColl, { inject: { id: _collection.BANDS[2].id } }).q().findOne({}).must.be.eq(_collection.BANDS[2]);});});});