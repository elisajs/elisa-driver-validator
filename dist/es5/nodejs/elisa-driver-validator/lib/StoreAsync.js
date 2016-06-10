"use strict";Object.defineProperty(exports, "__esModule", { value: true });
var _assert = require("assert");var _assert2 = _interopRequireDefault(_assert);
var _elisa = require("elisa");
var _justo = require("justo");
var _store = require("../data/store");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}exports.default = 


(0, _justo.suite)("Asynchronous Connection", function () {
  var drv, drvName, db, cx, cxOpts, store, bandsStore, emptyStore, createStores, dropStores;

  (0, _justo.init)({ title: "Initialize suite from params" }, function (params) {
    params = params[0];

    if (params.type == "store") {
      bandsStore = "bands";
      emptyStore = "empty";} else 
    {
      bandsStore = "test.bands";
      emptyStore = "test.empty";}


    drvName = params.name;
    cxOpts = params.cxOpts;
    createStores = params.createStores;
    dropStores = params.dropStores;});


  (0, _justo.init)({ title: "Get driver" }, function () {
    drv = _elisa.Driver.getDriver(drvName);});


  (0, _justo.init)({ name: "*", title: "Open connection and get store" }, function (done) {
    drv.openConnection(cxOpts, function (err, con) {
      cx = con;
      db = cx.db;
      store = db.getStore(bandsStore);

      done();});});



  (0, _justo.init)({ name: "*", title: "Create stores and data" }, function (done) {
    createStores(
    cxOpts, 
    [
    { name: bandsStore, docs: _store.BANDS }, 
    { name: emptyStore, docs: [] }], 

    done);});



  (0, _justo.fin)({ name: "*", title: "Drop stores" }, function (done) {
    dropStores(cxOpts, [bandsStore, emptyStore], done);});


  (0, _justo.fin)({ name: "*", title: "Close connection" }, function (done) {
    cx.close(done);});


  (0, _justo.test)("#qn", function () {
    store.qn.must.be.eq(bandsStore);});


  (0, _justo.test)("#fqn", function () {
    store.fqn.must.be.eq("elisa." + bandsStore);});


  (0, _justo.suite)("#hasId()", function () {
    (0, _justo.test)("hasId(id, callback) - existing", function (done) {
      store.hasId(_store.BANDS[0].id, function (err, exist) {
        (0, _assert2.default)(err === undefined);
        exist.must.be.eq(true);
        done();});});



    (0, _justo.test)("hasId(id, callback) - not existing", function (done) {
      store.hasId("unknown", function (err, exist) {
        (0, _assert2.default)(err === undefined);
        exist.must.be.eq(false);
        done();});});});




  (0, _justo.suite)("#find()", function () {
    (0, _justo.test)("find({id}, callback) => undefined", function (done) {
      store.find({ id: "unknown" }, function (err, doc) {
        (0, _assert2.default)(err === undefined);
        (0, _assert2.default)(doc === undefined);
        done();});});



    (0, _justo.test)("find({id}, callback) => object", function (done) {
      store.find({ id: _store.BANDS[0].id }, function (err, doc) {
        (0, _assert2.default)(err === undefined);
        doc.must.have(_store.BANDS[0]);
        done();});});});




  (0, _justo.suite)("#findAll()", function () {
    (0, _justo.test)("findAll(callback) => Result - with data", function (done) {
      store.findAll(function (err, res) {
        (0, _assert2.default)(err === undefined);
        res.must.be.instanceOf(_elisa.Result);
        res.length.must.be.eq(_store.BANDS.length);
        res.docs.must.be.similarTo(_store.BANDS);
        done();});});



    (0, _justo.test)("findAll(callback) => Result - without data", function (done) {
      db.getStore(emptyStore).findAll(function (err, res) {
        (0, _assert2.default)(err === undefined);
        res.must.be.instanceOf(_elisa.Result);
        res.length.must.be.eq(0);
        res.docs.must.be.eq([]);
        done();});});});




  (0, _justo.suite)("#count()", function () {
    (0, _justo.suite)("Without documents", function () {
      (0, _justo.test)("count(callback) => 0", function (done) {
        db.getStore(emptyStore).count(function (err, cnt) {
          (0, _assert2.default)(err === undefined);
          cnt.must.be.eq(0);
          done();});});



      (0, _justo.test)("count(opts, callback) => 0", function (done) {
        db.getStore(emptyStore).count({}, function (err, cnt) {
          (0, _assert2.default)(err === undefined);
          cnt.must.be.eq(0);
          done();});});});




    (0, _justo.suite)("With documents", function () {
      (0, _justo.test)("count(callback) => number", function (done) {
        store.count(function (err, cnt) {
          (0, _assert2.default)(err === undefined);
          cnt.must.be.eq(_store.BANDS.length);
          done();});});



      (0, _justo.test)("count(opts, callback) => number", function (done) {
        store.count({}, function (err, cnt) {
          (0, _assert2.default)(err === undefined);
          cnt.must.be.eq(_store.BANDS.length);
          done();});});});});





  (0, _justo.suite)("#insert()", function () {
    (0, _justo.suite)("One document", function () {
      (0, _justo.suite)("Id doesn't exist", function () {
        (0, _justo.test)("insert(doc) - key doesn't exist", function (done) {
          store.insert(_store.ECHO);

          setTimeout(function () {
            store.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo(_store.BANDS.concat([_store.ECHO]));
              done();});}, 

          500);});


        (0, _justo.test)("insert(doc, callback) - key doesn't exist", function (done) {
          store.insert(_store.ECHO, function (err) {
            (0, _assert2.default)(err === undefined);

            store.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo(_store.BANDS.concat([_store.ECHO]));
              done();});});});});





      (0, _justo.suite)("Id exists", function () {
        (0, _justo.test)("insert(doc) - key exists", function (done) {
          var id = _store.BANDS[0].id;

          store.insert({ id: id, x: 1, y: 2, z: 3 });

          setTimeout(function () {
            store.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo(_store.BANDS.slice(1).concat([{ id: id, x: 1, y: 2, z: 3 }]));
              done();});}, 

          500);});


        (0, _justo.test)("insert(doc, callback) - key exists", function (done) {
          var id = _store.BANDS[0].id;

          store.insert({ id: id, x: 1, y: 2, z: 3 }, function (err) {
            (0, _assert2.default)(err === undefined);

            store.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo(_store.BANDS.slice(1).concat([{ id: id, x: 1, y: 2, z: 3 }]));
              done();});});});});});






    (0, _justo.suite)("Several documents", function () {
      (0, _justo.suite)("No document exists", function () {
        (0, _justo.test)("insert(docs)", function (done) {
          var DOCS = [{ id: "one", x: 1 }, { id: "two", x: 2 }];
          var store = db.getStore(emptyStore);

          store.insert(DOCS);

          setTimeout(function () {
            store.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo(DOCS);
              done();});}, 

          500);});


        (0, _justo.test)("insert(docs, callback)", function (done) {
          var DOCS = [{ id: "one", x: 1 }, { id: "two", x: 2 }];
          var store = db.getStore(emptyStore);

          store.insert(DOCS, function (err) {
            (0, _assert2.default)(err === undefined);

            store.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo(DOCS);
              done();});});});});





      (0, _justo.suite)("Some document exists", function () {
        (0, _justo.test)("insert(docs)", function (done) {
          var DOCS = [_store.BANDS[0], { id: "one", x: 1 }, { id: "two", x: 2 }];

          store.insert(DOCS);

          setTimeout(function () {
            store.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo(_store.BANDS.slice(1).concat(DOCS));
              done();});}, 

          500);});


        (0, _justo.test)("insert(docs, callback)", function (done) {
          var DOCS = [_store.BANDS[0], { id: "one", x: 1 }, { id: "two", x: 2 }];

          store.insert(DOCS, function (err) {
            (0, _assert2.default)(err === undefined);

            store.findAll(function (err, res) {
              (0, _assert2.default)(err === undefined);
              res.docs.must.be.similarTo(_store.BANDS.slice(1).concat(DOCS));
              done();});});});});});});







  (0, _justo.suite)("#remove()", function () {
    (0, _justo.test)("remove({id}) - id not existing", function (done) {
      store.remove({ id: "unknown" });

      setTimeout(function () {
        store.findAll(function (err, res) {
          (0, _assert2.default)(err === undefined);
          res.docs.must.be.similarTo(_store.BANDS);
          done();});}, 

      500);});


    (0, _justo.test)("remove({id}, callback) - id not existing", function (done) {
      store.remove({ id: "unknown" }, function (err) {
        (0, _assert2.default)(err === undefined);

        store.findAll(function (err, res) {
          (0, _assert2.default)(err === undefined);
          res.docs.must.be.similarTo(_store.BANDS);
          done();});});});




    (0, _justo.test)("remove({id}) - id existing", function (done) {
      store.remove({ id: _store.BANDS[0].id });

      setTimeout(function () {
        store.findAll(function (err, res) {
          (0, _assert2.default)(err === undefined);
          res.docs.must.be.similarTo(_store.BANDS.slice(1));
          done();});}, 

      500);});


    (0, _justo.test)("remove({id}, callback) - id existing", function (done) {
      store.remove({ id: _store.BANDS[0].id }, function (err) {
        (0, _assert2.default)(err === undefined);

        store.findAll(function (err, res) {
          (0, _assert2.default)(err === undefined);
          res.docs.must.be.similarTo(_store.BANDS.slice(1));
          done();});});});});





  (0, _justo.suite)("#truncate()", function () {
    (0, _justo.test)("truncate()", function (done) {
      store.truncate();

      setTimeout(function () {
        store.count(function (err, cnt) {
          (0, _assert2.default)(err === undefined);
          cnt.must.be.eq(0);
          done();});}, 

      500);});


    (0, _justo.test)("truncate(callback)", function (done) {
      store.truncate(function (err) {
        (0, _assert2.default)(err === undefined);

        store.count(function (err, cnt) {
          (0, _assert2.default)(err === undefined);
          cnt.must.be.eq(0);
          done();});});});});





  (0, _justo.suite)("#update()", function () {
    (0, _justo.test)("update({id}, fields) - id not existing", function (done) {
      store.update({ id: "unknown" }, { x: 123 });

      setTimeout(function () {
        store.findAll(function (err, res) {
          (0, _assert2.default)(err === undefined);
          res.docs.must.be.similarTo(_store.BANDS);
          done();});}, 

      500);});


    (0, _justo.test)("update({id}, fields) - id existing", function (done) {
      store.update({ id: _store.BANDS[0].id }, { x: 123, year: { $inc: 1 } }, function (err) {
        (0, _assert2.default)(err === undefined);

        store.findAll(function (err, res) {
          (0, _assert2.default)(err === undefined);
          res.docs.must.be.similarTo([Object.assign({}, _store.BANDS[0], { x: 123, year: _store.BANDS[0].year + 1 })].concat(_store.BANDS.slice(1)));
          done();});});});});});