"use strict";Object.defineProperty(exports, "__esModule", { value: true });
var _assert = require("assert");var _assert2 = _interopRequireDefault(_assert);
var _elisa = require("elisa");
var _justo = require("justo");
var _collection = require("../data/collection");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}exports.default = 












(0, _justo.suite)("Asynchronous Connection", function () {
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


  (0, _justo.init)({ name: "*", title: "Open connection and get collection" }, function (done) {
    drv.openConnection(cxOpts, function (err, con) {
      cx = con;
      db = cx.db;
      coll = db.getCollection(bandsColl);
      done();});});



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
    (0, _justo.test)("hasId(id, callback) => true", function (done) {
      coll.hasId(_collection.BANDS[0].id, function (err, has) {
        (0, _assert2.default)(err === undefined);
        has.must.be.eq(true);
        done();});});



    (0, _justo.test)("hasId(id, callback) => false", function (done) {
      coll.hasId("unknown", function (err, has) {
        (0, _assert2.default)(err === undefined);
        has.must.be.eq(false);
        done();});});});




  (0, _justo.suite)("#findAll()", function () {
    (0, _justo.test)("findAll(callback) => Result with data", function (done) {
      coll.findAll(function (err, res) {
        (0, _assert2.default)(err === undefined);
        res.must.be.instanceOf(_elisa.Result);
        res.length.must.be.eq(_collection.BANDS.length);
        res.docs.must.be.similarTo(_collection.BANDS);
        done();});});



    (0, _justo.test)("findAll(callback) => Result without data", function (done) {
      db.getCollection(emptyColl).findAll(function (err, res) {
        (0, _assert2.default)(err === undefined);
        res.must.be.instanceOf(_elisa.Result);
        res.length.must.be.eq(0);
        res.docs.must.be.eq([]);
        done();});});});




  (0, _justo.suite)("#count()", function () {
    (0, _justo.suite)("Without documents", function () {
      (0, _justo.test)("count(callback) => number", function (done) {
        db.getCollection(emptyColl).count(function (err, count) {
          (0, _assert2.default)(err === undefined);
          count.must.be.eq(0);
          done();});});



      (0, _justo.test)("count(opts, callback) => number", function (done) {
        db.getCollection(emptyColl).count(function (err, count) {
          (0, _assert2.default)(err === undefined);
          count.must.be.eq(0);
          done();});});});




    (0, _justo.suite)("With documents", function () {
      (0, _justo.test)("count(callback) => number", function (done) {
        coll.count(function (err, count) {
          (0, _assert2.default)(err === undefined);
          count.must.be.eq(_collection.BANDS.length);
          done();});});



      (0, _justo.test)("count(opts, callback) => number", function (done) {
        coll.count({}, function (err, count) {
          (0, _assert2.default)(err === undefined);
          count.must.be.eq(_collection.BANDS.length);
          done();});});});});





  (0, _justo.suite)("#insert()", function () {
    (0, _justo.suite)("One document", function () {
      (0, _justo.suite)("Id doesn't exist", function () {
        (0, _justo.test)("insert(doc)", function (done) {
          coll.insert(_collection.ECHO);

          setTimeout(function () {
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo(_collection.BANDS.concat([_collection.ECHO]));
              done();});}, 

          500);});


        (0, _justo.test)("insert(doc, opts)", function (done) {
          coll.insert(_collection.ECHO, {});

          setTimeout(function () {
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo(_collection.BANDS.concat([_collection.ECHO]));
              done();});}, 

          500);});


        (0, _justo.test)("insert(doc, callback)", function (done) {
          coll.insert(_collection.ECHO, function (err) {
            (0, _assert2.default)(err === undefined);
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo(_collection.BANDS.concat([_collection.ECHO]));
              done();});});});




        (0, _justo.test)("insert(doc, opts, callback)", function (done) {
          coll.insert(_collection.ECHO, {}, function (err) {
            (0, _assert2.default)(err === undefined);
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo(_collection.BANDS.concat([_collection.ECHO]));
              done();});});});});





      (0, _justo.suite)("Id exists", function () {
        (0, _justo.test)("insert(doc) - nothing inserted", function (done) {
          coll.insert({ id: _collection.BANDS[0].id, x: 1, y: 2, z: 3 });

          setTimeout(function () {
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo(_collection.BANDS);
              done();});}, 

          500);});


        (0, _justo.test)("insert(doc, opts) - nothing inserted", function (done) {
          coll.insert({ id: _collection.BANDS[0].id, x: 1, y: 2, z: 3 }, {});

          setTimeout(function () {
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo(_collection.BANDS);
              done();});}, 

          500);});


        (0, _justo.test)("insert(doc, callback) => error", function (done) {
          coll.insert({ id: _collection.BANDS[0].id, x: 1, y: 2, z: 3 }, function (err) {
            err.must.be.instanceOf(Error);
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo(_collection.BANDS);
              done();});});});




        (0, _justo.test)("insert(doc, opts, callback) => error", function (done) {
          coll.insert({ id: _collection.BANDS[0].id, x: 1, y: 2, z: 3 }, {}, function (err) {
            err.must.be.instanceOf(Error);
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo(_collection.BANDS);
              done();});});});});});






    (0, _justo.suite)("Several documents", function () {
      (0, _justo.suite)("No document exists", function () {
        (0, _justo.test)("insert(docs)", function (done) {
          var DOCS = [{ id: "one", x: 1 }, { id: "two", x: 2 }];

          coll.insert(DOCS);

          setTimeout(function () {
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo(_collection.BANDS.concat(DOCS));
              done();});}, 

          500);});


        (0, _justo.test)("insert(docs, opts)", function (done) {
          var DOCS = [{ id: "one", x: 1 }, { id: "two", x: 2 }];

          coll.insert(DOCS, {});

          setTimeout(function () {
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo(_collection.BANDS.concat(DOCS));
              done();});}, 

          500);});


        (0, _justo.test)("insert(docs, callback)", function (done) {
          var DOCS = [{ id: "one", x: 1 }, { id: "two", x: 2 }];

          coll.insert(DOCS, function (err) {
            (0, _assert2.default)(err === undefined);
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo(_collection.BANDS.concat(DOCS));
              done();});});});




        (0, _justo.test)("insert(docs, opts, callback)", function (done) {
          var DOCS = [{ id: "one", x: 1 }, { id: "two", x: 2 }];

          coll.insert(DOCS, {}, function (err) {
            (0, _assert2.default)(err === undefined);
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo(_collection.BANDS.concat(DOCS));
              done();});});});});





      (0, _justo.suite)("Some document exists", function () {
        (0, _justo.test)("insert(docs)", function (done) {
          var DOCS = [{ id: "one", x: 1 }, { id: "two", x: 2 }, _collection.BANDS[0]];

          coll.insert(DOCS);

          setTimeout(function () {
            coll.count(function (err, count) {
              (0, _assert2.default)(err === undefined);
              count.must.be.eq(_collection.BANDS.length + 2);
              done();});}, 

          500);});


        (0, _justo.test)("insert(docs, opts)", function (done) {
          var DOCS = [{ id: "one", x: 1 }, { id: "two", x: 2 }, _collection.BANDS[0]];

          coll.insert(DOCS, {});

          setTimeout(function () {
            coll.count(function (err, count) {
              (0, _assert2.default)(err === undefined);
              count.must.be.eq(_collection.BANDS.length + 2);
              done();});}, 

          500);});


        (0, _justo.test)("insert(docs, callback)", function (done) {
          var DOCS = [{ id: "one", x: 1 }, { id: "two", x: 2 }, _collection.BANDS[0]];

          coll.insert(DOCS, function (err) {
            err.must.be.instanceOf(Error);

            coll.count(function (err, count) {
              (0, _assert2.default)(err === undefined);
              count.must.be.eq(_collection.BANDS.length + 2);
              done();});});});




        (0, _justo.test)("insert(docs, opts, callback)", function (done) {
          var DOCS = [{ id: "one", x: 1 }, { id: "two", x: 2 }, _collection.BANDS[0]];

          coll.insert(DOCS, {}, function (err) {
            err.must.be.instanceOf(Error);

            coll.count(function (err, count) {
              (0, _assert2.default)(err === undefined);
              count.must.be.eq(_collection.BANDS.length + 2);
              done();});});});});});






    (0, _justo.test)("Inserting fields with values of different types", function (done) {
      var doc = { id: "123", a: ["one", 2, "three"], b: true, n: 1234321, o: { x: 111, y: 222, z: 333 }, s: "string" };
      coll.insert(doc, function (err) {
        (0, _assert2.default)(err === undefined);
        coll.findAll(function (err, res) {
          (0, _assert2.default)(err === undefined);
          res.docs.must.be.similarTo(_collection.BANDS.concat(doc));
          done();});});});});





  (0, _justo.suite)("#remove()", function () {
    (0, _justo.test)("remove({}) - nop", function (done) {
      coll.remove({});

      setTimeout(function () {
        coll.findAll(function (err, res) {
          (0, _assert2.default)(err === undefined);
          res.docs.must.be.similarTo(_collection.BANDS);
          done();});}, 

      500);});


    (0, _justo.test)("remove({}, callback) - nop", function (done) {
      coll.remove({}, function (err) {
        (0, _assert2.default)(err === undefined);
        coll.findAll(function (err, res) {
          (0, _assert2.default)(err === undefined);
          res.docs.must.be.similarTo(_collection.BANDS);
          done();});});});




    (0, _justo.suite)("remove({id})", function () {
      (0, _justo.test)("remove({id}) - id not existing", function (done) {
        coll.remove({ id: "unknown" });

        setTimeout(function () {
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.BANDS);
            done();});}, 

        500);});


      (0, _justo.test)("remove({id}, callback) - id not existing", function (done) {
        coll.remove({ id: "unknown" }, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.BANDS);
            done();});});});




      (0, _justo.test)("remove({id}) - id existing", function (done) {
        coll.remove({ id: _collection.BANDS[0].id });

        setTimeout(function () {
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.BANDS.slice(1));
            done();});}, 

        500);});


      (0, _justo.test)("remove({id}, callback) - id existing", function (done) {
        coll.remove({ id: _collection.BANDS[0].id }, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.BANDS.slice(1));
            done();});});});});





    (0, _justo.suite)("remove(query)", function () {
      (0, _justo.test)("remove(simple) - removing", function (done) {
        coll.remove({ disbanded: true });

        setTimeout(function () {
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.NON_DISBANDED);
            done();});}, 

        500);});


      (0, _justo.test)("remove(simple, callback) - removing", function (done) {
        coll.remove({ disbanded: true }, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.NON_DISBANDED);
            done();});});});




      (0, _justo.test)("remove(simple) - not removing", function (done) {
        coll.remove({ active: false });

        setTimeout(function () {
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.BANDS);
            done();});}, 

        500);});


      (0, _justo.test)("remove(simple, callback) - not removing", function (done) {
        coll.remove({ active: false }, function (err) {
          (0, _assert2.default)(err === undefined);

          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.BANDS);
            done();});});});




      (0, _justo.test)("remove(compound) - removing", function (done) {
        coll.remove({ active: true, disbanded: false });

        setTimeout(function () {
          coll.findAll(function (err, res) {
            res.docs.must.be.similarTo(_collection.DISBANDED);
            done();});}, 

        500);});


      (0, _justo.test)("remove(compound, callback) - removing", function (done) {
        coll.remove({ active: true, disbanded: false }, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            res.docs.must.be.similarTo(_collection.DISBANDED);
            done();});});});




      (0, _justo.test)("remove(compound) - not removing", function (done) {
        coll.remove({ active: false, disbanded: true });

        setTimeout(function () {
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.BANDS);
            done();});}, 

        500);});


      (0, _justo.test)("remove(compound, callback) - not removing", function (done) {
        coll.remove({ active: false, disbanded: true }, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.BANDS);
            done();});});});});





    (0, _justo.suite)("WHERE operators", function () {
      (0, _justo.test)("remove({id: value}, callback)", function (done) {
        coll.remove({ id: _collection.BANDS[0].id }, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.BANDS.slice(1));
            done();});});});




      (0, _justo.test)("remove({field: value}, callback)", function (done) {
        coll.remove({ disbanded: true }, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.NON_DISBANDED);
            done();});});});




      (0, _justo.test)("remove({id: {$eq: value}}, callback)", function (done) {
        coll.remove({ id: { $eq: _collection.BANDS[0].id } }, function (err) {
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.BANDS.slice(1));
            done();});});});




      (0, _justo.test)("remove({field: {$eq: value}}, callback)", function (done) {
        coll.remove({ disbanded: { $eq: true } }, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.NON_DISBANDED);
            done();});});});




      (0, _justo.test)("remove({id: {$ne: value}}, callback)", function (params, done) {
        coll.remove({ id: _defineProperty({}, params[0], _collection.BANDS[0].id) }, function (err, res) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo([_collection.BANDS[0]]);
            done();});});}).


      params("$ne", "$neq");

      (0, _justo.test)("remove({field: {$ne: value}}, callback)", function (params, done) {
        coll.remove({ disbanded: _defineProperty({}, params[0], true) }, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.DISBANDED);
            done();});});}).


      params("$ne", "$neq");

      (0, _justo.test)("remove({id: {$lt: value}}, callback)", function (done) {
        coll.remove({ id: { $lt: "M" } }, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.ID_GE_M);
            done();});});});




      (0, _justo.test)("remove({field: {$lt: value}}, callback)", function (done) {
        coll.remove({ year: { $lt: 2000 } }, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.YEAR_GE_2000);
            done();});});});




      (0, _justo.test)("remove({id: {$le: value}}, callback)", function (params, done) {
        coll.remove({ id: _defineProperty({}, params[0], "M") }, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.ID_GT_M);
            done();});});}).


      params("$le", "$lte");

      (0, _justo.test)("remove({field: {$le: value}}, callback)", function (params, done) {
        coll.remove({ year: _defineProperty({}, params[0], 1999) }, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.YEAR_GT_2000);
            done();});});}).


      params("$le", "$lte");

      (0, _justo.test)("remove({id: {$gt: value}}, callback)", function (done) {
        coll.remove({ id: { $gt: "M" } }, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.ID_LE_M);
            done();});});});




      (0, _justo.test)("remove({field: {$gt: value}}, callback)", function (done) {
        coll.remove({ year: { $gt: 2000 } }, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.YEAR_LE_2000);
            done();});});});




      (0, _justo.test)("remove({id: {$ge: value}}, callback)", function (params, done) {
        coll.remove({ id: _defineProperty({}, params[0], "M") }, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.ID_LT_M);
            done();});});}).


      params("$ge", "$gte");

      (0, _justo.test)("remove({field: {$ge: value}}, callback)", function (params, done) {
        coll.remove({ year: _defineProperty({}, params[0], 2000) }, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.YEAR_LT_2000);
            done();});});}).


      params("$ge", "$gte");

      (0, _justo.test)("remove({id: {$between: [one, two]}}, callback)", function (done) {
        coll.remove({ id: { $between: ["L", "O"] } }, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.ID_NOT_BETWEEN_L_AND_O);
            done();});});});




      (0, _justo.test)("remove({field: {$between: [one, two]}}, callback)", function (done) {
        coll.remove({ year: { $between: [1990, 1999] } }, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.YEAR_NOT_BETWEEN_1990_AND_1999);
            done();});});});




      (0, _justo.test)("remove({id: {$nbetween: [one, two]}}, callback)", function (params, done) {
        coll.remove({ id: _defineProperty({}, params[0], ["L", "O"]) }, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.ID_BETWEEN_L_AND_O);
            done();});});}).


      params("$nbetween", "$notBetween");

      (0, _justo.test)("remove({field: {$nbetween: [one, two]}}, callback)", function (params, done) {
        coll.remove({ year: _defineProperty({}, params[0], [1990, 1999]) }, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.YEAR_BETWEEN_1990_AND_1999);
            done();});});}).


      params("$nbetween", "$notBetween");

      (0, _justo.test)("remove({id: {$like: value}}, callback)", function (done) {
        coll.remove({ id: { $like: "%a%" } }, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.ID_NOT_LIKE_A);
            done();});});});




      (0, _justo.test)("remove({field: {$like: value}}, callback)", function (done) {
        coll.remove({ origin: { $like: "%L%" } }, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.ORIGIN_NOT_LIKE_L);
            done();});});});




      (0, _justo.test)("remove({id: {$nlike: value}}, callback)", function (params, done) {
        coll.remove({ id: _defineProperty({}, params[0], "%a%") }, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.ID_LIKE_A);
            done();});});}).


      params("$nlike", "$notLike");

      (0, _justo.test)("remove({field: {$nlike: value}}, callback)", function (params, done) {
        coll.remove({ origin: _defineProperty({}, params[0], "%L%") }, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.ORIGIN_LIKE_L);
            done();});});}).


      params("$nlike", "$notLike");

      (0, _justo.test)("remove({id: {$in: array}}, callback)", function (done) {
        coll.remove({ id: { $in: [_collection.BANDS[0].id, _collection.BANDS[1].id] } }, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.BANDS.slice(2));
            done();});});});




      (0, _justo.test)("remove({id: {$in: []}}, callback)", function (done) {
        coll.remove({ id: { $in: [] } }, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.BANDS);
            done();});});});




      (0, _justo.test)("remove({field: {$nin: array}}, callback)", function (params, done) {
        coll.remove({ origin: _defineProperty({}, params[0], [_collection.BANDS[0].origin, _collection.BANDS[1].origin]) }, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.BANDS.slice(0, 2));
            done();});});}).


      params("$nin", "$notIn");

      (0, _justo.test)("remove({field: {$nin: []}}, callback)", function (params, done) {
        coll.remove({ origin: _defineProperty({}, params[0], []) }, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo([]);
            done();});});}).


      params("$nin", "$notIn");

      (0, _justo.test)("remove({id: {$contains: value}}, callback)", function (params, done) {
        coll.remove({ id: _defineProperty({}, params[0], "w") }, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.ID_NOT_CONTAIN_W);
            done();});});}).


      params("$contain", "$contains");

      (0, _justo.test)("remove({field: {$contains: value}}, callback) - field as string", function (params, done) {
        coll.remove({ origin: _defineProperty({}, params[0], "London") }, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.ORIGIN_NOT_CONTAIN_LONDON);
            done();});});}).


      params("$contain", "$contains");

      (0, _justo.test)("remove({field: {$contains: value}}, callback) - field as array", function (params, done) {
        coll.remove({ tags: _defineProperty({}, params[0], "folk") }, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.TAGS_NOT_CONTAIN_FOLK);
            done();});});}).


      params("$contain", "$contains");

      (0, _justo.test)("remove({id: {$ncontains: value}}, vlaue)", function (params, done) {
        coll.remove({ id: _defineProperty({}, params[0], "w") }, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.ID_CONTAIN_W);
            done();});});}).


      params("$ncontains", "$notContains", "$ncontain", "$notContain");

      (0, _justo.test)("remove({field: {$ncontains: value}}, callback) - field as string", function (params, done) {
        coll.remove({ origin: _defineProperty({}, params[0], "London") }, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.ORIGIN_CONTAIN_LONDON);
            done();});});}).


      params("$ncontains", "$notContains", "$ncontain", "$notContain");

      (0, _justo.test)("remove({field: {$ncontains: value}}, callback) - field as array", function (params, done) {
        coll.remove({ tags: _defineProperty({}, params[0], "folk") }, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.TAGS_CONTAIN_FOLK);
            done();});});}).


      params("$ncontains", "$notContains", "$ncontain", "$notContain");});});



  (0, _justo.suite)("#truncate()", function () {
    (0, _justo.test)("truncate()", function (done) {
      coll.truncate();

      setTimeout(function () {
        coll.count(function (err, cnt) {
          (0, _assert2.default)(err === undefined);
          cnt.must.be.eq(0);
          done();});}, 

      500);});


    (0, _justo.test)("truncate(opts)", function (done) {
      coll.truncate({});

      setTimeout(function () {
        coll.count(function (err, cnt) {
          (0, _assert2.default)(err === undefined);
          cnt.must.be.eq(0);
          done();});}, 

      500);});


    (0, _justo.test)("truncate(callback)", function (done) {
      coll.truncate(function (err) {
        (0, _assert2.default)(err === undefined);
        coll.count(function (err, cnt) {
          (0, _assert2.default)(err === undefined);
          cnt.must.be.eq(0);
          done();});});});




    (0, _justo.test)("truncate(opts, callback)", function (done) {
      coll.truncate({}, function (err) {
        (0, _assert2.default)(err === undefined);
        coll.count(function (err, cnt) {
          (0, _assert2.default)(err === undefined);
          cnt.must.be.eq(0);
          done();});});});});





  (0, _justo.suite)("#update()", function () {
    (0, _justo.suite)("update({id})", function () {
      (0, _justo.test)("update({id}, fields) - id not existing", function (done) {
        coll.update({ id: "unknown" }, { x: 123 });

        setTimeout(function () {
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.BANDS);
            done();});}, 

        500);});


      (0, _justo.test)("update({id}, fields, callback) - id not existing", function (done) {
        coll.update({ id: "unknown" }, { x: 123 }, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.BANDS);
            done();});});});




      (0, _justo.test)("update({id}, fields) - id existing", function (done) {
        coll.update({ id: _collection.BANDS[0].id }, { x: 123, year: { $inc: 1 } });

        setTimeout(function () {
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo([Object.assign({}, _collection.BANDS[0], { x: 123, year: _collection.BANDS[0].year + 1 })].concat(_collection.BANDS.slice(1)));
            done();});}, 

        500);});


      (0, _justo.test)("update({id}, fields, callback) - id existing", function (done) {
        coll.update({ id: _collection.BANDS[0].id }, { x: 123, year: { $inc: 1 } }, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo([Object.assign({}, _collection.BANDS[0], { x: 123, year: _collection.BANDS[0].year + 1 })].concat(_collection.BANDS.slice(1)));
            done();});});});});





    (0, _justo.suite)("Update operators", function () {
      (0, _justo.suite)("{field: value}", function () {
        (0, _justo.test)("{field: value}", function (done) {
          var band = Object.assign({}, _collection.BANDS[0], { year: 1234 });
          coll.update({ id: band.id }, { year: { $set: 1234 } }, function (err) {
            (0, _assert2.default)(err === undefined);
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo([band].concat(_collection.BANDS.slice(1)));
              done();});});});




        (0, _justo.test)("{field: value} - string", function (done) {
          var band = Object.assign({}, _collection.BANDS[0], { x: "an string" });
          coll.update({ id: band.id }, { x: "an string" }, function (err) {
            (0, _assert2.default)(err === undefined);
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo([band].concat(_collection.BANDS.slice(1)));
              done();});});});




        (0, _justo.test)("{field: value} - number", function (done) {
          var band = Object.assign({}, _collection.BANDS[0], { x: 123 });
          coll.update({ id: band.id }, { x: 123 }, function (err) {
            (0, _assert2.default)(err === undefined);
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo([band].concat(_collection.BANDS.slice(1)));
              done();});});});




        (0, _justo.test)("{field: value} - boolean", function (done) {
          var band = Object.assign({}, _collection.BANDS[0], { x: true });
          coll.update({ id: band.id }, { x: true }, function (err) {
            (0, _assert2.default)(err === undefined);
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo([band].concat(_collection.BANDS.slice(1)));
              done();});});});




        (0, _justo.test)("{field: value} - array", function (done) {
          var band = Object.assign({}, _collection.BANDS[0], { x: ["one", 2, "three"] });
          coll.update({ id: band.id }, { x: ["one", 2, "three"] }, function (err) {
            (0, _assert2.default)(err === undefined);
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo([band].concat(_collection.BANDS.slice(1)));
              done();});});});




        (0, _justo.test)("{field: value} - object", function (done) {
          var band = Object.assign({}, _collection.BANDS[0], { x: { x: "one", y: [0, 1, 2], z: { a: "one", b: "two" } } });
          coll.update({ id: band.id }, { x: { x: "one", y: [0, 1, 2], z: { a: "one", b: "two" } } }, function (err) {
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo([band].concat(_collection.BANDS.slice(1)));
              done();});});});});





      (0, _justo.test)("{field: {$set: value}}", function (done) {
        var band = Object.assign({}, _collection.BANDS[0], { year: 1234 });
        coll.update({ id: band.id }, { year: { $set: 1234 } }, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo([band].concat(_collection.BANDS.slice(1)));
            done();});});});




      (0, _justo.test)("{field: {$inc: value}}", function (done) {
        var band = Object.assign({}, _collection.BANDS[0], { year: _collection.BANDS[0].year + 1234 });
        coll.update({ id: band.id }, { year: { $inc: 1234 } }, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo([band].concat(_collection.BANDS.slice(1)));
            done();});});});




      (0, _justo.test)("{field: {$dec: value}}", function (done) {
        var band = Object.assign({}, _collection.BANDS[0], { year: _collection.BANDS[0].year - 1234 });
        coll.update({ id: band.id }, { year: { $dec: 1234 } }, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo([band].concat(_collection.BANDS.slice(1)));
            done();});});});




      (0, _justo.test)("{field: {$mul: value}}", function (done) {
        var band = Object.assign({}, _collection.BANDS[0], { year: _collection.BANDS[0].year * 2 });
        coll.update({ id: band.id }, { year: { $mul: 2 } }, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo([band].concat(_collection.BANDS.slice(1)));
            done();});});});




      (0, _justo.test)("{field: {$div: value}}", function (done) {
        var band = Object.assign({}, _collection.BANDS[0], { year: _collection.BANDS[0].year / 2 });
        coll.update({ id: band.id }, { year: { $div: 2 } }, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo([band].concat(_collection.BANDS.slice(1)));
            done();});});});




      (0, _justo.suite)("{field: {$add: value}}", function () {
        (0, _justo.test)("{field: {$add: value}} - with field not existing", function (done) {
          var band = Object.assign({}, _collection.BANDS[0], { labels: ["Creation"] });
          coll.update({ id: band.id }, { labels: { $add: "Creation" } }, function (err) {
            (0, _assert2.default)(err === undefined);
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo([band].concat(_collection.BANDS.slice(1)));
              done();});});});




        (0, _justo.test)("{field: {$add: value}} - with field being null", function (done) {
          var band = Object.assign({}, _collection.BANDS[1], { tags: ["alternative"] });
          coll.update({ id: band.id }, { tags: { $add: "alternative" } }, function (err) {
            (0, _assert2.default)(err === undefined);
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo([_collection.BANDS[0], band].concat(_collection.BANDS.slice(2)));
              done();});});});




        (0, _justo.test)("{field: {$add: value}} - with empty array", function (done) {
          var band = Object.assign({}, _collection.BANDS[0], { tags: ["alternative"] });
          coll.update({ id: band.id }, { tags: { $add: "alternative" } }, function (err) {
            (0, _assert2.default)(err === undefined);
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo([band].concat(_collection.BANDS.slice(1)));
              done();});});});




        (0, _justo.test)("{field: {$add: value}} - with non-empty array", function (done) {
          var band = Object.assign({}, _collection.BANDS[2], { tags: _collection.BANDS[2].tags.concat("indie") });
          coll.update({ id: band.id }, { tags: { $add: "indie" } }, function (err) {
            (0, _assert2.default)(err === undefined);
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo(_collection.BANDS.slice(0, 2).concat([band]).concat(_collection.BANDS.slice(3)));
              done();});});});




        (0, _justo.test)("{field: {$add: value}} - item existing", function (done) {
          var band = _collection.BANDS[2];

          coll.update({ id: band.id }, { tags: { $add: band.tags[0] } }, function (err) {
            (0, _assert2.default)(err === undefined);
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo(_collection.BANDS);
              done();});});});});





      (0, _justo.suite)("{field: {$remove: value}}", function () {
        (0, _justo.test)("{field: {$remove: value}} - with field not existing", function (done) {
          coll.update({ id: _collection.BANDS[0].id }, { unknown: { $remove: "value" } }, function (err) {
            (0, _assert2.default)(err === undefined);
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo(_collection.BANDS);
              done();});});});




        (0, _justo.test)("{field: {$remove: value}} - with field being null", function (done) {
          coll.update({ id: _collection.BANDS[1].id }, { tags: { $remove: "value" } }, function (err) {
            (0, _assert2.default)(err === undefined);
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo(_collection.BANDS);
              done();});});});




        (0, _justo.test)("{field: {$remove: value}} - with empty array", function (done) {
          coll.update({ id: _collection.BANDS[0].id }, { tags: { $remove: "value" } }, function (err) {
            (0, _assert2.default)(err === undefined);
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo(_collection.BANDS);
              done();});});});




        (0, _justo.test)("{field: {$remove: value}} - item in the start", function (done) {
          var band = Object.assign({}, _collection.BANDS[2], { tags: ["folk rock", "folk"] });

          coll.update({ id: band.id }, { tags: { $remove: "alternative" } }, function (err) {
            (0, _assert2.default)(err === undefined);
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo([band].concat(_collection.BANDS.slice(0, 2)).concat(_collection.BANDS.slice(3)));
              done();});});});




        (0, _justo.test)("{field: {$remove: value}} - item in the end", function (done) {
          var band = Object.assign({}, _collection.BANDS[2], { tags: ["alternative", "folk rock"] });

          coll.update({ id: band.id }, { tags: { $remove: "folk" } }, function (err) {
            (0, _assert2.default)(err === undefined);
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo([band].concat(_collection.BANDS.slice(0, 2)).concat(_collection.BANDS.slice(3)));
              done();});});});




        (0, _justo.test)("{field: {$remove: value}} - item in the middle", function (done) {
          var band = Object.assign({}, _collection.BANDS[2], { tags: ["alternative", "folk"] });

          coll.update({ id: band.id }, { tags: { $remove: "folk rock" } }, function (err) {
            (0, _assert2.default)(err === undefined);
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo([band].concat(_collection.BANDS.slice(0, 2)).concat(_collection.BANDS.slice(3)));
              done();});});});




        (0, _justo.test)("{field: {$remove: value}} - the only item", function (done) {
          var band = Object.assign({}, _collection.BANDS[3], { tags: [] });

          coll.update({ id: band.id }, { tags: { $remove: "alternative" } }, function (err) {
            (0, _assert2.default)(err === undefined);
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo([band].concat(_collection.BANDS.slice(0, 3).concat(_collection.BANDS.slice(4))));
              done();});});});});





      (0, _justo.suite)("{field: {$push: value}}", function () {
        (0, _justo.test)("{field: {$push: value}} - with field not existing", function (done) {
          var band = Object.assign({}, _collection.BANDS[0], { labels: ["Creation"] });

          coll.update({ id: band.id }, { labels: { $push: "Creation" } }, function (err) {
            (0, _assert2.default)(err === undefined);
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo([band].concat(_collection.BANDS.slice(1)));
              done();});});});




        (0, _justo.test)("{field: {$push: value}} - with field being null", function (done) {
          var band = Object.assign({}, _collection.BANDS[1], { tags: ["alternative"] });

          coll.update({ id: band.id }, { tags: { $push: "alternative" } }, function (err) {
            (0, _assert2.default)(err === undefined);
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo([_collection.BANDS[0], band].concat(_collection.BANDS.slice(2)));
              done();});});});




        (0, _justo.test)("{field: {$push: value}} - with empty array", function (done) {
          var band = Object.assign({}, _collection.BANDS[0], { tags: ["alternative"] });

          coll.update({ id: band.id }, { tags: { $push: "alternative" } }, function (err) {
            (0, _assert2.default)(err === undefined);
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo([band].concat(_collection.BANDS.slice(1)));
              done();});});});




        (0, _justo.test)("{field: {$push: value}} - with non-empty array", function (done) {
          var band = Object.assign({}, _collection.BANDS[2], { tags: _collection.BANDS[2].tags.concat("indie") });

          coll.update({ id: band.id }, { tags: { $push: "indie" } }, function (err) {
            (0, _assert2.default)(err === undefined);
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo(_collection.BANDS.slice(0, 2).concat([band]).concat(_collection.BANDS.slice(3)));
              done();});});});});





      (0, _justo.suite)("{field: {$pop: value}} - with field not existing", function () {
        (0, _justo.test)("{field: {$pop: value}} - with field not existing", function (done) {
          coll.update({ id: _collection.BANDS[0].id }, { labels: { $pop: 1 } }, function (err) {
            (0, _assert2.default)(err === undefined);
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo(_collection.BANDS);
              done();});});});




        (0, _justo.test)("{field: {$pop: value}} - with field is null", function (done) {
          coll.update({ id: _collection.BANDS[1].id }, { tags: { $pop: 1 } }, function (err) {
            (0, _assert2.default)(err === undefined);
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo(_collection.BANDS);
              done();});});});




        (0, _justo.test)("{field: {$pop: value}} - array.length == 0", function (done) {
          coll.update({ id: _collection.BANDS[0].id }, { tags: { $pop: 1 } }, function (err) {
            (0, _assert2.default)(err === undefined);
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo(_collection.BANDS);
              done();});});});




        (0, _justo.test)("{field: {$pop: value}} - array.length == 1", function (done) {
          var band = Object.assign({}, _collection.BANDS[3], { tags: [] });

          coll.update({ id: band.id }, { tags: { $pop: 1 } }, function (err) {
            (0, _assert2.default)(err === undefined);
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo(_collection.BANDS.slice(0, 3).concat(band).concat(_collection.BANDS.slice(4)));
              done();});});});




        (0, _justo.test)("{field: {$pop: value}} - array.length == 2", function (done) {
          var band = Object.assign({}, _collection.BANDS[4], { tags: [_collection.BANDS[4].tags[0]] });

          coll.update({ id: band.id }, { tags: { $pop: 1 } }, function (err) {
            (0, _assert2.default)(err === undefined);
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo(_collection.BANDS.slice(0, 4).concat(band));
              done();});});});




        (0, _justo.test)("{field: {$pop: value}} - array.length > 2", function (done) {
          var band = Object.assign({}, _collection.BANDS[2], { tags: _collection.BANDS[2].tags.slice(0, 2) });

          coll.update({ id: band.id }, { tags: { $pop: 1 } }, function (err) {
            (0, _assert2.default)(err === undefined);
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo(_collection.BANDS.slice(0, 2).concat(band).concat(_collection.BANDS.slice(3)));
              done();});});});});





      (0, _justo.suite)("{field: {$concat: value}}", function () {
        (0, _justo.test)("{field: {$concat: value}} - with field not existing", function (done) {
          var band = Object.assign({}, _collection.BANDS[0], { unknown: "Great!" });

          coll.update({ id: band.id }, { unknown: { $concat: "Great!" } }, function (err) {
            (0, _assert2.default)(err === undefined);
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo([band].concat(_collection.BANDS.slice(1)));
              done();});});});




        (0, _justo.test)("{field: {$concat: value}} - with field being null", function (done) {
          var band = Object.assign({}, _collection.BANDS[1], { tags: "Great!" });

          coll.update({ id: band.id }, { tags: { $concat: "Great!" } }, function (err) {
            (0, _assert2.default)(err === undefined);
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo([_collection.BANDS[0], band].concat(_collection.BANDS.slice(2)));
              done();});});});




        (0, _justo.test)("{field: {$concat: value}} - with empty string", function (done) {
          var band = Object.assign({}, _collection.BANDS[3], { origin: "New York, United States" });

          coll.update({ id: band.id }, { origin: { $concat: "New York, United States" } }, function (err) {
            (0, _assert2.default)(err === undefined);
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo(_collection.BANDS.slice(0, 3).concat(band).concat(_collection.BANDS.slice(4)));
              done();});});});




        (0, _justo.test)("{field: {$concat: value}} - with non-empty string", function (done) {
          var band = Object.assign({}, _collection.BANDS[0], { origin: _collection.BANDS[0].origin + "Great!" });

          coll.update({ id: band.id }, { origin: { $concat: "Great!" } }, function (err) {
            (0, _assert2.default)(err === undefined);
            coll.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo([band].concat(_collection.BANDS.slice(1)));
              done();});});});});});});







  (0, _justo.suite)("#save()", function () {
    (0, _justo.suite)("Error handler", function () {
      (0, _justo.test)("save(doc) - without id", function () {
        coll.save.bind(coll).must.raise(Error, [{ x: 1, y: 2 }]);});


      (0, _justo.test)("save(doc, opts) - without id", function () {
        coll.save.bind(coll).must.raise(Error, [{ x: 1, y: 2 }, {}]);});


      (0, _justo.test)("save(doc, opts, callback) - without id", function () {
        coll.save.bind(coll).must.raise(Error, [{ x: 1, y: 2 }, {}, function () {}]);});});



    (0, _justo.suite)("Insert", function () {
      (0, _justo.test)("save(doc)", function (done) {
        coll.save(_collection.ECHO);
        setTimeout(function () {
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.BANDS.concat(_collection.ECHO));
            done();});}, 

        500);});


      (0, _justo.test)("save(doc, opts)", function (done) {
        coll.save(_collection.ECHO, {});
        setTimeout(function () {
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.BANDS.concat(_collection.ECHO));
            done();});}, 

        500);});


      (0, _justo.test)("save(doc, callback)", function (done) {
        coll.save(_collection.ECHO, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.BANDS.concat(_collection.ECHO));
            done();});});});




      (0, _justo.test)("save(doc, opts, callback)", function (done) {
        coll.save(_collection.ECHO, {}, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo(_collection.BANDS.concat(_collection.ECHO));
            done();});});});});





    (0, _justo.suite)("Update", function () {
      (0, _justo.test)("save(doc)", function (done) {
        var band = Object.assign({}, _collection.BANDS[0], { origin: "Jamaica" });

        coll.save(band);

        setTimeout(function () {
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo([band].concat(_collection.BANDS.slice(1)));
            done();});}, 

        500);});


      (0, _justo.test)("save(doc, opts)", function (done) {
        var band = Object.assign({}, _collection.BANDS[0], { origin: "Jamaica" });

        coll.save(band, {});

        setTimeout(function () {
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo([band].concat(_collection.BANDS.slice(1)));
            done();});}, 

        500);});


      (0, _justo.test)("save(doc, callback)", function (done) {
        var band = Object.assign({}, _collection.BANDS[0], { origin: "Jamaica" });

        coll.save(band, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo([band].concat(_collection.BANDS.slice(1)));
            done();});});});




      (0, _justo.test)("save(doc, opts, callback)", function (done) {
        var band = Object.assign({}, _collection.BANDS[0], { origin: "Jamaica" });

        coll.save(band, {}, function (err) {
          (0, _assert2.default)(err === undefined);
          coll.findAll(function (err, res) {
            (0, _assert2.default)(err === undefined);
            res.docs.must.be.similarTo([band].concat(_collection.BANDS.slice(1)));
            done();});});});});});






  (0, _justo.suite)("Injection", function () {
    (0, _justo.test)("insert(doc, callback)", function (done) {
      var ic = db.getCollection(bandsColl, { inject: { author: "elisa" } });
      ic.insert(_collection.ECHO, function (err) {
        (0, _assert2.default)(err === undefined);
        coll.findAll(function (err, res) {
          (0, _assert2.default)(err === undefined);
          res.docs.must.be.similarTo(_collection.BANDS.concat([Object.assign({}, _collection.ECHO, { author: "elisa" })]));
          done();});});});




    (0, _justo.test)("save(doc, callback)", function (done) {
      var ids = db.getCollection(bandsColl, { inject: { author: "elisa" } });
      ids.save(_collection.ECHO, function (err) {
        (0, _assert2.default)(err === undefined);
        coll.findAll(function (err, res) {
          (0, _assert2.default)(err === undefined);
          res.docs.must.be.similarTo(_collection.BANDS.concat([Object.assign({}, _collection.ECHO, { author: "elisa" })]));
          done();});});});




    (0, _justo.test)("update(query, update, callback)", function (done) {
      var doc = Object.assign({}, _collection.BANDS[0], { origin: "GIRO" });
      var ic = db.getCollection(bandsColl, { inject: { id: doc.id } });
      ic.update({}, { origin: "GIRO" }, function (err) {
        (0, _assert2.default)(err === undefined);
        coll.findAll(function (err, res) {
          (0, _assert2.default)(err === undefined);
          res.docs.must.be.similarTo([doc].concat(_collection.BANDS.slice(1)));
          done();});});});




    (0, _justo.test)("remove(query, callback)", function (done) {
      var ic = db.getCollection(bandsColl, { inject: { id: _collection.BANDS[0].id } });
      ic.remove({}, function (err) {
        (0, _assert2.default)(err === undefined);
        coll.findAll(function (err, res) {
          (0, _assert2.default)(err === undefined);
          res.docs.must.be.similarTo(_collection.BANDS.slice(1));
          done();});});});




    (0, _justo.test)("truncate(callback)", function (done) {
      var ic = db.getCollection(bandsColl, { inject: { id: _collection.BANDS[0].id } });
      ic.truncate(function (err) {
        (0, _assert2.default)(err === undefined);
        coll.findAll(function (err, res) {
          (0, _assert2.default)(err === undefined);
          res.docs.must.be.similarTo(_collection.BANDS.slice(1));
          done();});});});




    (0, _justo.test)("find(query, callback)", function (done) {
      var ic = db.getCollection(bandsColl, { inject: { id: _collection.BANDS[2].id } });
      ic.find({}, function (err, res) {
        (0, _assert2.default)(err === undefined);
        res.docs.must.be.eq(_collection.BANDS.slice(2, 3));
        done();});});



    (0, _justo.test)("findAll(callback)", function (done) {
      var ic = db.getCollection(bandsColl, { inject: { id: _collection.BANDS[2].id } });
      ic.findAll(function (err, res) {
        (0, _assert2.default)(err === undefined);
        res.docs.must.be.eq(_collection.BANDS.slice(2, 3));
        done();});});



    (0, _justo.test)("findOne(query, callback)", function (done) {
      var ic = db.getCollection(bandsColl, { inject: { id: _collection.BANDS[2].id } });
      ic.findOne({}, function (err, doc) {
        (0, _assert2.default)(err === undefined);
        doc.must.be.eq(_collection.BANDS[2]);
        done();});});});});