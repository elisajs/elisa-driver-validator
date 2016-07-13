"use strict";Object.defineProperty(exports, "__esModule", { value: true });
var _assert = require("assert");var _assert2 = _interopRequireDefault(_assert);
var _elisa = require("elisa");
var _justo = require("justo");
var _collection = require("../data/collection");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}exports.default = 












(0, _justo.suite)("Synchronous Connection", function () {
  var drv, drvName, db, cx, cxOpts, coll, bandsColl, emptyColl, createCollections, dropCollections;

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


  (0, _justo.init)({ name: "*", title: "Open connection and get collection" }, function () {
    cx = drv.openConnection({ type: "sync" }, cxOpts);
    db = cx.db;
    coll = db.getCollection(bandsColl);});


  (0, _justo.init)({ name: "*", title: "Create collections and data" }, function (done) {
    createCollections(
    cxOpts, 
    [
    { name: bandsColl, docs: _collection.BANDS }, 
    { name: emptyColl, docs: [] }], 

    done);});



  (0, _justo.fin)({ name: "*", title: "Drop collections" }, function (done) {
    dropCollections(cxOpts, [bandsColl, emptyColl], done);});


  (0, _justo.fin)({ name: "*", title: "Close connection" }, function (params) {
    cx.close();});


  (0, _justo.test)("Attributes", function () {
    coll.qn.must.be.eq(bandsColl);
    coll.fqn.must.be.eq("elisa." + bandsColl);
    coll.must.have({ inject: undefined });});


  (0, _justo.test)("#q()", function () {
    var q = coll.q();
    q.must.be.instanceOf(_elisa.CollectionQuery);
    q.source.must.be.same(coll);});


  (0, _justo.suite)("#hasId()", function () {
    (0, _justo.test)("hasId(id) : true", function () {
      coll.hasId(_collection.BANDS[0].id).must.be.eq(true);});


    (0, _justo.test)("hasId(id) : false", function () {
      coll.hasId("unknown").must.be.eq(false);});});



  (0, _justo.suite)("#findAll()", function () {
    (0, _justo.test)("findAll() : Result with data", function () {
      var res = coll.findAll();

      res.must.be.instanceOf(_elisa.Result);
      res.length.must.be.eq(_collection.BANDS.length);
      res.docs.must.be.similarTo(_collection.BANDS);});


    (0, _justo.test)("findAll() : Result without data", function () {
      var res = db.getCollection(emptyColl).findAll();

      res.must.be.instanceOf(_elisa.Result);
      res.length.must.be.eq(0);
      res.docs.must.be.eq([]);});});



  (0, _justo.suite)("#count()", function () {
    (0, _justo.suite)("Without documents", function () {
      (0, _justo.test)("count() : number", function () {
        db.getCollection(emptyColl).count().must.be.eq(0);});


      (0, _justo.test)("count(opts) : number", function () {
        db.getCollection(emptyColl).count({}).must.be.eq(0);});});



    (0, _justo.suite)("With documents", function () {
      (0, _justo.test)("count() : number", function () {
        coll.count().must.be.eq(_collection.BANDS.length);});


      (0, _justo.test)("count(opts) : number", function () {
        coll.count({}).must.be.eq(_collection.BANDS.length);});});});




  (0, _justo.suite)("#insert()", function () {
    (0, _justo.suite)("One document", function () {
      (0, _justo.suite)("Id doesn't exist", function () {
        (0, _justo.test)("insert(doc)", function () {
          coll.insert(_collection.ECHO);
          coll.findAll().docs.must.be.similarTo(_collection.BANDS.concat([_collection.ECHO]));});


        (0, _justo.test)("insert(doc, opts)", function () {
          coll.insert(_collection.ECHO, {});
          coll.findAll().docs.must.be.similarTo(_collection.BANDS.concat([_collection.ECHO]));});});



      (0, _justo.suite)("Id exists", function () {
        (0, _justo.test)("insert(doc) => error", function () {
          coll.insert.bind(coll).must.raise(Error, [{ id: _collection.BANDS[0].id, x: 1, y: 2, z: 3 }]);
          coll.findAll().docs.must.be.similarTo(_collection.BANDS);});


        (0, _justo.test)("insert(doc, opts) => error", function () {
          coll.insert.bind(coll).must.raise(Error, [{ id: _collection.BANDS[0].id, x: 1, y: 2, z: 3 }, {}]);
          coll.findAll().docs.must.be.similarTo(_collection.BANDS);});});});




    (0, _justo.suite)("Several documents", function () {
      (0, _justo.suite)("No document exists", function () {
        (0, _justo.test)("insert(docs)", function () {
          var DOCS = [{ id: "one", x: 1 }, { id: "two", x: 2 }];

          coll.insert(DOCS);
          coll.findAll().docs.must.be.similarTo(_collection.BANDS.concat(DOCS));});


        (0, _justo.test)("insert(docs, opts)", function () {
          var DOCS = [{ id: "one", x: 1 }, { id: "two", x: 2 }];

          coll.insert(DOCS, {});
          coll.findAll().docs.must.be.similarTo(_collection.BANDS.concat(DOCS));});});



      (0, _justo.suite)("Some document exists", function () {
        (0, _justo.test)("insert(docs)", function () {
          var DOCS = [{ id: "one", x: 1 }, { id: "two", x: 2 }, _collection.BANDS[0]];

          coll.insert.bind(coll).must.raise(Error, [DOCS]);
          coll.count().must.be.eq(_collection.BANDS.length + 2);});


        (0, _justo.test)("insert(docs, opts)", function () {
          var DOCS = [{ id: "one", x: 1 }, { id: "two", x: 2 }, _collection.BANDS[0]];

          coll.insert.bind(coll).must.raise(Error, [DOCS, {}]);
          coll.count().must.be.eq(_collection.BANDS.length + 2);});});});




    (0, _justo.test)("Inserting fields with values of different types", function () {
      var doc = { id: "123", a: ["one", 2, "three"], b: true, n: 1234321, o: { x: 111, y: 222, z: 333 }, s: "string" };
      coll.insert(doc);
      coll.findAll().docs.must.be.similarTo(_collection.BANDS.concat(doc));});});



  (0, _justo.suite)("#remove()", function () {
    (0, _justo.test)("remove({}) - nop", function () {
      coll.remove({});
      coll.findAll().docs.must.be.similarTo(_collection.BANDS);});


    (0, _justo.suite)("remove({id})", function () {
      (0, _justo.test)("remove({id}) - id not existing", function () {
        coll.remove({ id: "unknown" });
        coll.findAll().docs.must.be.similarTo(_collection.BANDS);});


      (0, _justo.test)("remove({id}) - id existing", function () {
        coll.remove({ id: _collection.BANDS[0].id });
        coll.count().must.be.eq(_collection.BANDS.length - 1);
        coll.findAll().docs.must.be.similarTo(_collection.BANDS.slice(1));});});



    (0, _justo.suite)("remove(query)", function () {
      (0, _justo.test)("remove(simple) - removing", function () {
        coll.remove({ disbanded: true });
        coll.findAll().docs.must.be.similarTo(_collection.NON_DISBANDED);});


      (0, _justo.test)("remove(simple) - not removing", function () {
        coll.remove({ active: false });
        coll.findAll().docs.must.be.similarTo(_collection.BANDS);});


      (0, _justo.test)("remove(compound) - removing", function () {
        coll.remove({ active: true, disbanded: false });
        coll.findAll().docs.must.be.similarTo(_collection.DISBANDED);});


      (0, _justo.test)("remove(compound) - not removing", function () {
        coll.remove({ active: false, disbanded: true });
        coll.findAll().docs.must.be.similarTo(_collection.BANDS);});});



    (0, _justo.suite)("WHERE operators", function () {
      (0, _justo.test)("remove({id: value})", function () {
        coll.remove({ id: _collection.BANDS[0].id });
        coll.findAll().docs.must.be.similarTo(_collection.BANDS.slice(1));});


      (0, _justo.test)("remove({field: value})", function () {
        coll.remove({ disbanded: true });
        coll.findAll().docs.must.be.similarTo(_collection.NON_DISBANDED);});


      (0, _justo.test)("remove({id: {$eq: value}})", function () {
        coll.remove({ id: { $eq: _collection.BANDS[0].id } });
        coll.findAll().docs.must.be.similarTo(_collection.BANDS.slice(1));});


      (0, _justo.test)("remove({field: {$eq: value}})", function () {
        coll.remove({ disbanded: { $eq: true } });
        coll.findAll().docs.must.be.similarTo(_collection.NON_DISBANDED);});


      (0, _justo.test)("remove({id: {$ne: value}})", function (params) {
        coll.remove({ id: _defineProperty({}, params[0], _collection.BANDS[0].id) });
        coll.findAll().docs.must.be.similarTo([_collection.BANDS[0]]);}).
      params("$ne", "$neq");

      (0, _justo.test)("remove({field: {$ne: value}})", function (params) {
        coll.remove({ disbanded: _defineProperty({}, params[0], true) });
        coll.findAll().docs.must.be.similarTo(_collection.DISBANDED);}).
      params("$ne", "$neq");

      (0, _justo.test)("remove({id: {$lt: value}})", function () {
        coll.remove({ id: { $lt: "M" } });
        coll.findAll().docs.must.be.similarTo(_collection.ID_GE_M);});


      (0, _justo.test)("remove({field: {$lt: value}})", function () {
        coll.remove({ year: { $lt: 2000 } });
        coll.findAll().docs.must.be.similarTo(_collection.YEAR_GE_2000);});


      (0, _justo.test)("remove({id: {$le: value}})", function (params) {
        coll.remove({ id: _defineProperty({}, params[0], "M") });
        coll.findAll().docs.must.be.similarTo(_collection.ID_GT_M);}).
      params("$le", "$lte");

      (0, _justo.test)("remove({field: {$le: value}})", function (params) {
        coll.remove({ year: _defineProperty({}, params[0], 1999) });
        coll.findAll().docs.must.be.similarTo(_collection.YEAR_GT_2000);}).
      params("$le", "$lte");

      (0, _justo.test)("remove({id: {$gt: value}})", function () {
        coll.remove({ id: { $gt: "M" } });
        coll.findAll().docs.must.be.similarTo(_collection.ID_LE_M);});


      (0, _justo.test)("remove({field: {$gt: value}})", function () {
        coll.remove({ year: { $gt: 2000 } });
        coll.findAll().docs.must.be.similarTo(_collection.YEAR_LE_2000);});


      (0, _justo.test)("remove({id: {$ge: value}})", function (params) {
        coll.remove({ id: _defineProperty({}, params[0], "M") });
        coll.findAll().docs.must.be.similarTo(_collection.ID_LT_M);}).
      params("$ge", "$gte");

      (0, _justo.test)("remove({field: {$ge: value}})", function (params) {
        coll.remove({ year: _defineProperty({}, params[0], 2000) });
        coll.findAll().docs.must.be.similarTo(_collection.YEAR_LT_2000);}).
      params("$ge", "$gte");

      (0, _justo.test)("remove({id: {$between: [one, two]}})", function () {
        coll.remove({ id: { $between: ["L", "O"] } });
        coll.findAll().docs.must.be.similarTo(_collection.ID_NOT_BETWEEN_L_AND_O);});


      (0, _justo.test)("remove({field: {$between: [one, two]}})", function () {
        coll.remove({ year: { $between: [1990, 1999] } });
        coll.findAll().docs.must.be.similarTo(_collection.YEAR_NOT_BETWEEN_1990_AND_1999);});


      (0, _justo.test)("remove({id: {$nbetween: [one, two]}})", function (params) {
        coll.remove({ id: _defineProperty({}, params[0], ["L", "O"]) });
        coll.findAll().docs.must.be.similarTo(_collection.ID_BETWEEN_L_AND_O);}).
      params("$nbetween", "$notBetween");

      (0, _justo.test)("remove({field: {$nbetween: [one, two]}})", function (params) {
        coll.remove({ year: _defineProperty({}, params[0], [1990, 1999]) });
        coll.findAll().docs.must.be.similarTo(_collection.YEAR_BETWEEN_1990_AND_1999);}).
      params("$nbetween", "$notBetween");

      (0, _justo.test)("remove({id: {$like: value}})", function () {
        coll.remove({ id: { $like: "%a%" } });
        coll.findAll().docs.must.be.similarTo(_collection.ID_NOT_LIKE_A);});


      (0, _justo.test)("remove({field: {$like: value}})", function () {
        coll.remove({ origin: { $like: "%L%" } });
        coll.findAll().docs.must.be.similarTo(_collection.ORIGIN_NOT_LIKE_L);});


      (0, _justo.test)("remove({id: {$nlike: value}})", function (params) {
        coll.remove({ id: _defineProperty({}, params[0], "%a%") });
        coll.findAll().docs.must.be.similarTo(_collection.ID_LIKE_A);}).
      params("$nlike", "$notLike");

      (0, _justo.test)("remove({field: {$nlike: value}})", function (params) {
        coll.remove({ origin: _defineProperty({}, params[0], "%L%") });
        coll.findAll().docs.must.be.similarTo(_collection.ORIGIN_LIKE_L);}).
      params("$nlike", "$notLike");

      (0, _justo.test)("remove({id: {$in: array}})", function () {
        coll.remove({ id: { $in: [_collection.BANDS[0].id, _collection.BANDS[1].id] } });
        coll.findAll().docs.must.be.similarTo(_collection.BANDS.slice(2));});


      (0, _justo.test)("remove({id: {$in: []}})", function () {
        coll.remove({ id: { $in: [] } });
        coll.findAll().docs.must.be.similarTo(_collection.BANDS);});


      (0, _justo.test)("remove({field: {$nin: array}})", function (params) {
        coll.remove({ origin: _defineProperty({}, params[0], [_collection.BANDS[0].origin, _collection.BANDS[1].origin]) });
        coll.findAll().docs.must.be.similarTo(_collection.BANDS.slice(0, 2));}).
      params("$nin", "$notIn");

      (0, _justo.test)("remove({field: {$nin: []}})", function (params) {
        coll.remove({ origin: _defineProperty({}, params[0], []) });
        coll.findAll().docs.must.be.similarTo([]);}).
      params("$nin", "$notIn");

      (0, _justo.test)("remove({id: {$contains: value}})", function (params) {
        coll.remove({ id: _defineProperty({}, params[0], "w") });
        coll.findAll().docs.must.be.similarTo(_collection.ID_NOT_CONTAIN_W);}).
      params("$contain", "$contains");

      (0, _justo.test)("remove({field: {$contains: value}}) - field as string", function (params) {
        coll.remove({ origin: _defineProperty({}, params[0], "London") });
        coll.findAll().docs.must.be.similarTo(_collection.ORIGIN_NOT_CONTAIN_LONDON);}).
      params("$contain", "$contains");

      (0, _justo.test)("remove({field: {$contains: value}}) - field as array", function (params) {
        coll.remove({ tags: _defineProperty({}, params[0], "folk") });
        coll.findAll().docs.must.be.similarTo(_collection.TAGS_NOT_CONTAIN_FOLK);}).
      params("$contain", "$contains");

      (0, _justo.test)("remove({id: {$ncontains: value}})", function (params) {
        coll.remove({ id: _defineProperty({}, params[0], "w") });
        coll.findAll().docs.must.be.similarTo(_collection.ID_CONTAIN_W);}).
      params("$ncontains", "$notContains", "$ncontain", "$notContain");

      (0, _justo.test)("remove({field: {$ncontains: value}}) - field as string", function (params) {
        coll.remove({ origin: _defineProperty({}, params[0], "London") });
        coll.findAll().docs.must.be.similarTo(_collection.ORIGIN_CONTAIN_LONDON);}).
      params("$ncontains", "$notContains", "$ncontain", "$notContain");

      (0, _justo.test)("remove({field: {$ncontains: value}}) - field as array", function (params) {
        coll.remove({ tags: _defineProperty({}, params[0], "folk") });
        coll.findAll().docs.must.be.similarTo(_collection.TAGS_CONTAIN_FOLK);}).
      params("$ncontains", "$notContains", "$ncontain", "$notContain");});});



  (0, _justo.suite)("#truncate()", function () {
    (0, _justo.test)("truncate()", function () {
      coll.truncate();
      coll.count().must.be.eq(0);});


    (0, _justo.test)("truncate(opts)", function () {
      coll.truncate({});
      coll.count().must.be.eq(0);});});



  (0, _justo.suite)("#update()", function () {
    (0, _justo.suite)("update({id})", function () {
      (0, _justo.test)("update({id}, fields) - id not existing", function () {
        coll.update({ id: "unknown" }, { x: 123 });
        coll.findAll().docs.must.be.similarTo(_collection.BANDS);});


      (0, _justo.test)("update({id}, fields) - id existing", function () {
        coll.update({ id: _collection.BANDS[0].id }, { x: 123, year: { $inc: 1 } });
        coll.findAll().docs.must.be.similarTo([Object.assign({}, _collection.BANDS[0], { x: 123, year: _collection.BANDS[0].year + 1 })].concat(_collection.BANDS.slice(1)));});});



    (0, _justo.suite)("Update operators", function () {
      (0, _justo.suite)("{field: value}", function () {
        (0, _justo.test)("{field: value}", function () {
          var band = Object.assign({}, _collection.BANDS[0], { year: 1234 });
          coll.update({ id: band.id }, { year: { $set: 1234 } });
          coll.findAll().docs.must.be.similarTo([band].concat(_collection.BANDS.slice(1)));});


        (0, _justo.test)("{field: value} - string", function () {
          var band = Object.assign({}, _collection.BANDS[0], { x: "an string" });
          coll.update({ id: band.id }, { x: "an string" });
          coll.findAll().docs.must.be.similarTo([band].concat(_collection.BANDS.slice(1)));});


        (0, _justo.test)("{field: value} - number", function () {
          var band = Object.assign({}, _collection.BANDS[0], { x: 123 });
          coll.update({ id: band.id }, { x: 123 });
          coll.findAll().docs.must.be.similarTo([band].concat(_collection.BANDS.slice(1)));});


        (0, _justo.test)("{field: value} - boolean", function () {
          var band = Object.assign({}, _collection.BANDS[0], { x: true });
          coll.update({ id: band.id }, { x: true });
          coll.findAll().docs.must.be.similarTo([band].concat(_collection.BANDS.slice(1)));});


        (0, _justo.test)("{field: value} - array", function () {
          var band = Object.assign({}, _collection.BANDS[0], { x: ["one", 2, "three"] });
          coll.update({ id: band.id }, { x: ["one", 2, "three"] });
          coll.findAll().docs.must.be.similarTo([band].concat(_collection.BANDS.slice(1)));});


        (0, _justo.test)("{field: value} - object", function () {
          var band = Object.assign({}, _collection.BANDS[0], { x: { x: "one", y: [0, 1, 2], z: { a: "one", b: "two" } } });
          coll.update({ id: band.id }, { x: { x: "one", y: [0, 1, 2], z: { a: "one", b: "two" } } });
          coll.findAll().docs.must.be.similarTo([band].concat(_collection.BANDS.slice(1)));});});



      (0, _justo.test)("{field: {$set: value}}", function () {
        var band = Object.assign({}, _collection.BANDS[0], { year: 1234 });
        coll.update({ id: band.id }, { year: { $set: 1234 } });
        coll.findAll().docs.must.be.similarTo([band].concat(_collection.BANDS.slice(1)));});


      (0, _justo.test)("{field: {$inc: value}}", function () {
        var band = Object.assign({}, _collection.BANDS[0], { year: _collection.BANDS[0].year + 1234 });
        coll.update({ id: band.id }, { year: { $inc: 1234 } });
        coll.findAll().docs.must.be.similarTo([band].concat(_collection.BANDS.slice(1)));});


      (0, _justo.test)("{field: {$dec: value}}", function () {
        var band = Object.assign({}, _collection.BANDS[0], { year: _collection.BANDS[0].year - 1234 });
        coll.update({ id: band.id }, { year: { $dec: 1234 } });
        coll.findAll().docs.must.be.similarTo([band].concat(_collection.BANDS.slice(1)));});


      (0, _justo.test)("{field: {$mul: value}}", function () {
        var band = Object.assign({}, _collection.BANDS[0], { year: _collection.BANDS[0].year * 2 });
        coll.update({ id: band.id }, { year: { $mul: 2 } });
        coll.findAll().docs.must.be.similarTo([band].concat(_collection.BANDS.slice(1)));});


      (0, _justo.test)("{field: {$div: value}}", function () {
        var band = Object.assign({}, _collection.BANDS[0], { year: _collection.BANDS[0].year / 2 });
        coll.update({ id: band.id }, { year: { $div: 2 } });
        coll.findAll().docs.must.be.similarTo([band].concat(_collection.BANDS.slice(1)));});


      (0, _justo.suite)("{field: {$add: value}}", function () {
        (0, _justo.test)("{field: {$add: value}} - with field not existing", function () {
          var band = Object.assign({}, _collection.BANDS[0], { labels: ["Creation"] });
          coll.update({ id: band.id }, { labels: { $add: "Creation" } });
          coll.findAll().docs.must.be.similarTo([band].concat(_collection.BANDS.slice(1)));});


        (0, _justo.test)("{field: {$add: value}} - with field being null", function () {
          var band = Object.assign({}, _collection.BANDS[1], { tags: ["alternative"] });
          coll.update({ id: band.id }, { tags: { $add: "alternative" } });
          coll.findAll().docs.must.be.similarTo([_collection.BANDS[0], band].concat(_collection.BANDS.slice(2)));});


        (0, _justo.test)("{field: {$add: value}} - with empty array", function () {
          var band = Object.assign({}, _collection.BANDS[0], { tags: ["alternative"] });
          coll.update({ id: band.id }, { tags: { $add: "alternative" } });
          coll.findAll().docs.must.be.similarTo([band].concat(_collection.BANDS.slice(1)));});


        (0, _justo.test)("{field: {$add: value}} - with non-empty array", function () {
          var band = Object.assign({}, _collection.BANDS[2], { tags: _collection.BANDS[2].tags.concat("indie") });
          coll.update({ id: band.id }, { tags: { $add: "indie" } });
          coll.findAll().docs.must.be.similarTo(_collection.BANDS.slice(0, 2).concat([band]).concat(_collection.BANDS.slice(3)));});


        (0, _justo.test)("{field: {$add: value}} - item existing", function () {
          var band = _collection.BANDS[2];
          coll.update({ id: band.id }, { tags: { $add: band.tags[0] } });
          coll.findAll().docs.must.be.similarTo(_collection.BANDS);});});



      (0, _justo.suite)("{field: {$remove: value}}", function () {
        (0, _justo.test)("{field: {$remove: value}} - with field not existing", function () {
          coll.update({ id: _collection.BANDS[0].id }, { unknown: { $remove: "value" } });
          coll.findAll().docs.must.be.similarTo(_collection.BANDS);});


        (0, _justo.test)("{field: {$remove: value}} - with field being null", function () {
          coll.update({ id: _collection.BANDS[1].id }, { tags: { $remove: "value" } });
          coll.findAll().docs.must.be.similarTo(_collection.BANDS);});


        (0, _justo.test)("{field: {$remove: value}} - with empty array", function () {
          coll.update({ id: _collection.BANDS[0].id }, { tags: { $remove: "value" } });
          coll.findAll().docs.must.be.similarTo(_collection.BANDS);});


        (0, _justo.test)("{field: {$remove: value}} - item in the start", function () {
          var band = Object.assign({}, _collection.BANDS[2], { tags: ["folk rock", "folk"] });
          coll.update({ id: band.id }, { tags: { $remove: "alternative" } });
          coll.findAll().docs.must.be.similarTo([band].concat(_collection.BANDS.slice(0, 2)).concat(_collection.BANDS.slice(3)));});


        (0, _justo.test)("{field: {$remove: value}} - item in the end", function () {
          var band = Object.assign({}, _collection.BANDS[2], { tags: ["alternative", "folk rock"] });
          coll.update({ id: band.id }, { tags: { $remove: "folk" } });
          coll.findAll().docs.must.be.similarTo([band].concat(_collection.BANDS.slice(0, 2)).concat(_collection.BANDS.slice(3)));});


        (0, _justo.test)("{field: {$remove: value}} - item in the middle", function () {
          var band = Object.assign({}, _collection.BANDS[2], { tags: ["alternative", "folk"] });
          coll.update({ id: band.id }, { tags: { $remove: "folk rock" } });
          coll.findAll().docs.must.be.similarTo([band].concat(_collection.BANDS.slice(0, 2)).concat(_collection.BANDS.slice(3)));});


        (0, _justo.test)("{field: {$remove: value}} - the only item", function () {
          var band = Object.assign({}, _collection.BANDS[3], { tags: [] });
          coll.update({ id: band.id }, { tags: { $remove: "alternative" } });
          coll.findAll().docs.must.be.similarTo([band].concat(_collection.BANDS.slice(0, 3).concat(_collection.BANDS.slice(4))));});});



      (0, _justo.suite)("{field: {$push: value}}", function () {
        (0, _justo.test)("{field: {$push: value}} - with field not existing", function () {
          var band = Object.assign({}, _collection.BANDS[0], { labels: ["Creation"] });
          coll.update({ id: band.id }, { labels: { $push: "Creation" } });
          coll.findAll().docs.must.be.similarTo([band].concat(_collection.BANDS.slice(1)));});


        (0, _justo.test)("{field: {$push: value}} - with field being null", function () {
          var band = Object.assign({}, _collection.BANDS[1], { tags: ["alternative"] });
          coll.update({ id: band.id }, { tags: { $push: "alternative" } });
          coll.findAll().docs.must.be.similarTo([_collection.BANDS[0], band].concat(_collection.BANDS.slice(2)));});


        (0, _justo.test)("{field: {$push: value}} - with empty array", function () {
          var band = Object.assign({}, _collection.BANDS[0], { tags: ["alternative"] });
          coll.update({ id: band.id }, { tags: { $push: "alternative" } });
          coll.findAll().docs.must.be.similarTo([band].concat(_collection.BANDS.slice(1)));});


        (0, _justo.test)("{field: {$push: value}} - with non-empty array", function () {
          var band = Object.assign({}, _collection.BANDS[2], { tags: _collection.BANDS[2].tags.concat("indie") });
          coll.update({ id: band.id }, { tags: { $push: "indie" } });
          coll.findAll().docs.must.be.similarTo(_collection.BANDS.slice(0, 2).concat([band]).concat(_collection.BANDS.slice(3)));});});



      (0, _justo.suite)("{field: {$pop: value}} - with field not existing", function () {
        (0, _justo.test)("{field: {$pop: value}} - with field not existing", function () {
          coll.update({ id: _collection.BANDS[0].id }, { labels: { $pop: 1 } });
          coll.findAll().docs.must.be.similarTo(_collection.BANDS);});


        (0, _justo.test)("{field: {$pop: value}} - with field is null", function () {
          coll.update({ id: _collection.BANDS[1].id }, { tags: { $pop: 1 } });
          coll.findAll().docs.must.be.similarTo(_collection.BANDS);});


        (0, _justo.test)("{field: {$pop: value}} - array.length == 0", function () {
          coll.update({ id: _collection.BANDS[0].id }, { tags: { $pop: 1 } });
          coll.findAll().docs.must.be.similarTo(_collection.BANDS);});


        (0, _justo.test)("{field: {$pop: value}} - array.length == 1", function () {
          var band = Object.assign({}, _collection.BANDS[3], { tags: [] });
          coll.update({ id: band.id }, { tags: { $pop: 1 } });
          coll.findAll().docs.must.be.similarTo(_collection.BANDS.slice(0, 3).concat(band).concat(_collection.BANDS.slice(4)));});


        (0, _justo.test)("{field: {$pop: value}} - array.length == 2", function () {
          var band = Object.assign({}, _collection.BANDS[4], { tags: [_collection.BANDS[4].tags[0]] });
          coll.update({ id: band.id }, { tags: { $pop: 1 } });
          coll.findAll().docs.must.be.similarTo(_collection.BANDS.slice(0, 4).concat(band));});


        (0, _justo.test)("{field: {$pop: value}} - array.length > 2", function () {
          var band = Object.assign({}, _collection.BANDS[2], { tags: _collection.BANDS[2].tags.slice(0, 2) });
          coll.update({ id: band.id }, { tags: { $pop: 1 } });
          coll.findAll().docs.must.be.similarTo(_collection.BANDS.slice(0, 2).concat(band).concat(_collection.BANDS.slice(3)));});});



      (0, _justo.suite)("{field: {$concat: value}}", function () {
        (0, _justo.test)("{field: {$concat: value}} - with field not existing", function () {
          var band = Object.assign({}, _collection.BANDS[0], { unknown: "Great!" });
          coll.update({ id: band.id }, { unknown: { $concat: "Great!" } });
          coll.findAll().docs.must.be.similarTo([band].concat(_collection.BANDS.slice(1)));});


        (0, _justo.test)("{field: {$concat: value}} - with field being null", function () {
          var band = Object.assign({}, _collection.BANDS[1], { tags: "Great!" });
          coll.update({ id: band.id }, { tags: { $concat: "Great!" } });
          coll.findAll().docs.must.be.similarTo([_collection.BANDS[0], band].concat(_collection.BANDS.slice(2)));});


        (0, _justo.test)("{field: {$concat: value}} - with empty string", function () {
          var band = Object.assign({}, _collection.BANDS[3], { origin: "New York, United States" });
          coll.update({ id: band.id }, { origin: { $concat: "New York, United States" } });
          coll.findAll().docs.must.be.similarTo(_collection.BANDS.slice(0, 3).concat(band).concat(_collection.BANDS.slice(4)));});


        (0, _justo.test)("{field: {$concat: value}} - with non-empty string", function () {
          var band = Object.assign({}, _collection.BANDS[0], { origin: _collection.BANDS[0].origin + "Great!" });
          coll.update({ id: band.id }, { origin: { $concat: "Great!" } });
          coll.findAll().docs.must.be.similarTo([band].concat(_collection.BANDS.slice(1)));});});});});





  (0, _justo.suite)("#save()", function () {
    (0, _justo.suite)("Error handler", function () {
      (0, _justo.test)("save(doc) - without id", function () {
        coll.save.bind(coll).must.raise(Error, [{ x: 1, y: 2 }]);});


      (0, _justo.test)("save(doc, opts) - without id", function () {
        coll.save.bind(coll).must.raise(Error, [{ x: 1, y: 2 }, {}]);});});



    (0, _justo.suite)("Insert", function () {
      (0, _justo.test)("save(doc)", function () {
        coll.save(_collection.ECHO);
        coll.findAll().docs.must.be.similarTo(_collection.BANDS.concat(_collection.ECHO));});


      (0, _justo.test)("save(doc, opts)", function () {
        coll.save(_collection.ECHO, {});
        coll.findAll().docs.must.be.similarTo(_collection.BANDS.concat(_collection.ECHO));});});



    (0, _justo.suite)("Update", function () {
      (0, _justo.test)("save(doc)", function () {
        var band = Object.assign({}, _collection.BANDS[0], { origin: "Jamaica" });
        coll.save(band);
        coll.findAll().docs.must.be.similarTo([band].concat(_collection.BANDS.slice(1)));});


      (0, _justo.test)("save(doc, opts)", function () {
        var band = Object.assign({}, _collection.BANDS[0], { origin: "Jamaica" });
        coll.save(band, {});
        coll.findAll().docs.must.be.similarTo([band].concat(_collection.BANDS.slice(1)));});});});




  (0, _justo.suite)("Injection", function () {
    (0, _justo.test)("insert(doc)", function () {
      var ic = db.getCollection(bandsColl, { inject: { author: "elisa" } });
      ic.insert(_collection.ECHO);
      coll.findAll().docs.must.be.similarTo(_collection.BANDS.concat([Object.assign({}, _collection.ECHO, { author: "elisa" })]));});


    (0, _justo.test)("save(doc)", function () {
      var ids = db.getCollection(bandsColl, { inject: { author: "elisa" } });
      ids.save(_collection.ECHO);
      coll.findAll().docs.must.be.similarTo(_collection.BANDS.concat([Object.assign({}, _collection.ECHO, { author: "elisa" })]));});


    (0, _justo.test)("update(query, update)", function () {
      var doc = Object.assign({}, _collection.BANDS[0], { origin: "GIRO" });
      var ic = db.getCollection(bandsColl, { inject: { id: doc.id } });
      ic.update({}, { origin: "GIRO" });
      coll.findAll().docs.must.be.similarTo([doc].concat(_collection.BANDS.slice(1)));});


    (0, _justo.test)("remove(query)", function () {
      var ic = db.getCollection(bandsColl, { inject: { id: _collection.BANDS[0].id } });
      ic.remove({});
      coll.findAll().docs.must.be.similarTo(_collection.BANDS.slice(1));});


    (0, _justo.test)("truncate()", function () {
      var ic = db.getCollection(bandsColl, { inject: { id: _collection.BANDS[0].id } });
      ic.truncate();
      coll.findAll().docs.must.be.similarTo(_collection.BANDS.slice(1));});


    (0, _justo.test)("find(query)", function () {
      var ic = db.getCollection(bandsColl, { inject: { id: _collection.BANDS[2].id } });
      ic.find({}).docs.must.be.eq(_collection.BANDS.slice(2, 3));});


    (0, _justo.test)("findAll()", function () {
      var ic = db.getCollection(bandsColl, { inject: { id: _collection.BANDS[2].id } });
      ic.findAll().docs.must.be.eq(_collection.BANDS.slice(2, 3));});


    (0, _justo.test)("findOne(query)", function () {
      var ic = db.getCollection(bandsColl, { inject: { id: _collection.BANDS[2].id } });
      ic.findOne({}).must.be.eq(_collection.BANDS[2]);});});});