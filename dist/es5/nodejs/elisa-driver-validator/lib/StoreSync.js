"use strict";Object.defineProperty(exports, "__esModule", { value: true });
var _assert = require("assert");var _assert2 = _interopRequireDefault(_assert);
var _elisa = require("elisa");
var _justo = require("justo");
var _store = require("../data/store");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}exports.default = 


(0, _justo.suite)("Synchronous Connection", function () {
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


  (0, _justo.init)({ name: "*", title: "Open connection and get store" }, function () {
    cx = drv.openConnection({ type: "sync" }, cxOpts);
    db = cx.db;
    store = db.getStore(bandsStore);});


  (0, _justo.init)({ name: "*", title: "Create stores and data" }, function (done) {
    createStores(
    cxOpts, 
    [
    { name: bandsStore, docs: _store.BANDS }, 
    { name: emptyStore, docs: [] }], 

    done);});



  (0, _justo.fin)({ name: "*", title: "Drop stores" }, function (done) {
    dropStores(cxOpts, [bandsStore, emptyStore], done);});


  (0, _justo.fin)({ name: "*", title: "Close connection" }, function (params) {
    cx.close();});


  (0, _justo.test)("Attributes", function () {
    store.qn.must.be.eq(bandsStore);
    store.fqn.must.be.eq("elisa." + bandsStore);
    store.must.have({ inject: undefined });});


  (0, _justo.suite)("#hasId()", function () {
    (0, _justo.test)("hasId(id) : true", function () {
      store.hasId(_store.BANDS[0].id).must.be.eq(true);});


    (0, _justo.test)("hasId(id) : false", function () {
      store.hasId("unknown").must.be.eq(false);});});



  (0, _justo.suite)("#find()", function () {
    (0, _justo.test)("find({id}) : undefined", function () {
      (0, _assert2.default)(store.find({ id: "unknown" }) === undefined);});


    (0, _justo.test)("find({id}) : object", function () {
      store.find({ id: _store.BANDS[0].id }).must.have(_store.BANDS[0]);});});



  (0, _justo.suite)("#findAll()", function () {
    (0, _justo.test)("findAll() : Result with data", function () {
      var res = store.findAll();

      res.must.be.instanceOf(_elisa.Result);
      res.length.must.be.eq(_store.BANDS.length);
      res.docs.must.be.similarTo(_store.BANDS);});


    (0, _justo.test)("findAll() : Result without data", function () {
      var res = db.getStore(emptyStore).findAll();

      res.must.be.instanceOf(_elisa.Result);
      res.length.must.be.eq(0);
      res.docs.must.be.eq([]);});});



  (0, _justo.suite)("#count()", function () {
    (0, _justo.suite)("Without documents", function () {
      (0, _justo.test)("count() : number", function () {
        db.getStore(emptyStore).count().must.be.eq(0);});


      (0, _justo.test)("count(opts) : number", function () {
        db.getStore(emptyStore).count({}).must.be.eq(0);});});



    (0, _justo.suite)("With documents", function () {
      (0, _justo.test)("count() : number", function () {
        store.count().must.be.eq(_store.BANDS.length);});


      (0, _justo.test)("count(opts) : number", function () {
        store.count({}).must.be.eq(_store.BANDS.length);});});});




  (0, _justo.suite)("#insert()", function () {
    (0, _justo.suite)("One document", function () {
      (0, _justo.suite)("Id doesn't exist", function () {
        (0, _justo.test)("insert(doc) - key doesn't exist", function () {
          store.insert(_store.ECHO);
          store.count().must.be.eq(_store.BANDS.length + 1);
          store.findAll().docs.must.be.similarTo(_store.BANDS.concat([_store.ECHO]));});});



      (0, _justo.suite)("Id exists", function (console) {
        (0, _justo.test)("insert(doc) - key exists", function () {
          var id = _store.BANDS[0].id;

          store.insert({ id: id, x: 1, y: 2, z: 3 });
          store.count().must.be.eq(_store.BANDS.length);
          store.findAll().docs.must.be.similarTo(_store.BANDS.slice(1).concat([{ id: id, x: 1, y: 2, z: 3 }]));});});});




    (0, _justo.suite)("Several documents", function () {
      (0, _justo.suite)("No document exists", function () {
        (0, _justo.test)("insert(docs)", function () {
          var DOCS = [{ id: "one", x: 1 }, { id: "two", x: 2 }];
          var store = db.getStore(emptyStore);

          store.insert(DOCS);
          store.count().must.be.eq(2);
          store.findAll().docs.must.be.similarTo(DOCS);});});



      (0, _justo.suite)("Some document exists", function () {
        (0, _justo.test)("insert(docs)", function () {
          var DOCS = [_store.BANDS[0], { id: "one", x: 1 }, { id: "two", x: 2 }];

          store.insert(DOCS);
          store.count().must.be.eq(_store.BANDS.length + 2);
          store.findAll().docs.must.be.similarTo(_store.BANDS.slice(1).concat(DOCS));});});});});





  (0, _justo.suite)("#remove()", function () {
    (0, _justo.test)("remove({id}) - id not existing", function () {
      store.remove({ id: "unknown" });
      store.findAll().docs.must.be.similarTo(_store.BANDS);});


    (0, _justo.test)("remove({id}) - id existing", function () {
      store.remove({ id: _store.BANDS[0].id });
      store.count().must.be.eq(_store.BANDS.length - 1);
      store.findAll().docs.must.be.similarTo(_store.BANDS.slice(1));});});



  (0, _justo.suite)("#truncate()", function () {
    (0, _justo.test)("truncate()", function () {
      store.truncate();
      store.count().must.be.eq(0);});});



  (0, _justo.suite)("#update()", function () {
    (0, _justo.test)("update({id}, fields) - id not existing", function () {
      store.update({ id: "unknown" }, { x: 123 });
      store.count().must.be.eq(_store.BANDS.length);
      store.findAll().docs.must.be.similarTo(_store.BANDS);});


    (0, _justo.test)("update({id}, fields) - id existing", function () {
      store.update({ id: _store.BANDS[0].id }, { x: 123, year: { $inc: 1 } });
      store.count().must.be.eq(_store.BANDS.length);
      store.findAll().docs.must.be.similarTo([Object.assign({}, _store.BANDS[0], { x: 123, year: _store.BANDS[0].year + 1 })].concat(_store.BANDS.slice(1)));});});



  (0, _justo.suite)("#save()", function () {
    (0, _justo.suite)("Error handler", function () {
      (0, _justo.test)("save(doc) - without id", function () {
        store.save.bind(store).must.raise(Error, [{ x: 1, y: 2 }]);});


      (0, _justo.test)("save(doc, opts) - without id", function () {
        store.save.bind(store).must.raise(Error, [{ x: 1, y: 2 }, {}]);});});



    (0, _justo.suite)("Insert", function () {
      (0, _justo.test)("save(doc)", function () {
        store.save(_store.ECHO);
        store.findAll().docs.must.be.similarTo(_store.BANDS.concat(_store.ECHO));});


      (0, _justo.test)("save(doc, opts)", function () {
        store.save(_store.ECHO, {});
        store.findAll().docs.must.be.similarTo(_store.BANDS.concat(_store.ECHO));});});



    (0, _justo.suite)("Update", function () {
      (0, _justo.test)("save(doc)", function () {
        var band = Object.assign({}, _store.BANDS[0], { origin: "Jamaica" });
        store.save(band);
        store.findAll().docs.must.be.similarTo([band].concat(_store.BANDS.slice(1)));});


      (0, _justo.test)("save(doc, opts)", function () {
        var band = Object.assign({}, _store.BANDS[0], { origin: "Jamaica" });
        store.save(band, {});
        store.findAll().docs.must.be.similarTo([band].concat(_store.BANDS.slice(1)));});});});




  (0, _justo.suite)("Injection", function () {
    (0, _justo.test)("insert(doc)", function () {
      var band = Object.assign({}, _store.ECHO, { author: "elisa" });
      db.getStore(bandsStore, { inject: { author: "elisa" } }).insert(band);
      store.findAll().docs.must.be.similarTo(_store.BANDS.concat([band]));});


    (0, _justo.test)("save(doc)", function () {
      var band = Object.assign({}, _store.ECHO, { author: "elisa" });
      db.getStore(bandsStore, { inject: { author: "elisa" } }).save(band);
      store.findAll().docs.must.be.similarTo(_store.BANDS.concat([band]));});});});