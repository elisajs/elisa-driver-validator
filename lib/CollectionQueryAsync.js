//imports
import assert from "assert";
import {Driver, Result, CollectionQuery} from "elisa";
import {suite, test, init, fin} from "justo";
import {
  BANDS, DISBANDED, NON_DISBANDED,
  SORTED_ASC_BY_ID, SORTED_DESC_BY_ID,
  SORTED_ASC_BY_YEAR, SORTED_DESC_BY_YEAR,
  NON_DISBANDED_SORTED_BY_ID
} from "../data/collection";

//suite
export default suite("Asynchronous Connection", function() {
  var drv, drvName, db, cx, cxOpts, coll, bandsColl, emptyColl, createCollections, dropCollections, q;

  init({title: "Initialize suite from params"}, function(params) {
    params = params[0];

    if (params.type == "collection") {
      bandsColl = "bands";
      emptyColl = "empty";
    } else {
      bandsColl = "test.bands";
      emptyColl = "test.empty";
    }

    drvName = params.name;
    cxOpts = params.cxOpts;
    createCollections = params.createCollections;
    dropCollections = params.dropCollections;
  });

  init({title: "Get driver"}, function() {
    drv = Driver.getDriver(drvName);
  });

  init("*", function(done) {
    drv.openConnection(cxOpts, function(err, con) {
      cx = con;
      db = cx.db;
      coll = db.getCollection(bandsColl);
      done();
    });
  }).title("Open connection and get collection");

  init("*", function(done) {
    createCollections(
      cxOpts,
      [
        {name: bandsColl, docs: BANDS},
        {name: emptyColl, docs: []}
      ],
      done
    );
  }).title("Create collections and data");

  init("*", function() {
    q = coll.q();
  }).title("Get query");

  fin("*", function(done) {
    dropCollections(cxOpts, [bandsColl, emptyColl], done);
  }).title("Drop collections");

  fin("*", function(params) {
    cx.close();
  }).title("Close connection");

  suite("#find()", function() {
    test("find(callback) => Result", function(done) {
      q.find(function(err, res) {
        assert(err === undefined);
        res.must.be.instanceOf(Result);
        res.docs.must.be.similarTo(BANDS);
        done();
      });
    });

    test("find(query, callback)=>: Result", function(done) {
      q.find({disbanded: false}, function(err, res) {
        assert(err === undefined);
        res.must.be.instanceOf(Result);
        res.docs.must.be.similarTo(NON_DISBANDED);
        done();
      });
    });

    test("find(query, opts, callback) => Result", function(done) {
      q.find({disbanded: false}, {}, function(err, res) {
        assert(err === undefined);
        res.must.be.instanceOf(Result);
        res.docs.must.be.similarTo(NON_DISBANDED);
        done();
      });
    });
  });

  suite("#findOne()", function() {
    test("findOne(callback) => object", function(done) {
      q.findOne(function(err, doc) {
        assert(err === undefined);
        doc.must.be.insideOf(BANDS);
        done();
      });
    });

    test("findOne(query, callback) => object", function(done) {
      q.findOne({id: BANDS[0].id}, function(err, doc) {
        assert(err === undefined);
        doc.must.be.eq(BANDS[0]);
        done();
      });
    });

    test("findOne(query, opts, callback) => object", function(done) {
      q.findOne({origin: BANDS[1].origin}, {}, function(err, doc) {
        assert(err === undefined);
        doc.must.be.eq(BANDS[1]);
        done();
      });
    });
  });

  test("#limit(l)", function(params, done) {
    q.limit(params[0]).must.be.same(q);

    q.run(function(err, res) {
      assert(err === undefined);
      res.must.be.instanceOf(Result);
      res.length.must.be.eq(params[0]);
      for (let doc of res.docs) doc.must.be.insideOf(BANDS);
      done();
    });
  }).params(1, 2, 3);

  suite("#offset()", function() {
    test("offset(o) - without limit", function(params, done) {
      q.offset(params[0]).must.be.same(q);

      q.run(function(err, res) {
        assert(err === undefined);
        res.must.be.instanceOf(Result);
        res.length.must.be.eq(BANDS.length-params[0]);
        done();
      });
    }).params(1, 2, 3);

    test("offset(o) - with limit", function(params, done) {
      q.offset(params[0]).limit(2);

      q.run(function(err, res) {
        assert(err === undefined);
        res.must.be.instanceOf(Result);
        res.length.must.be.eq(2);
        done();
      });
    }).params(1, 2, 3);
  });

  suite("#filter()", function() {
    test("filter(query)", function(done) {
      q.filter({disbanded: false}).must.be.same(q);

      q.run(function(err, res) {
        assert(err === undefined);
        res.must.be.instanceOf(Result);
        res.docs.must.be.similarTo(NON_DISBANDED);
        done();
      });
    });
  });

  suite("#sort()", function() {
    suite("By id", function() {
      test("sort(id)", function(params, done) {
        q.sort(params[0]).must.be.same(q);
        q.run(function(err, res) {
          assert(err === undefined);
          res.must.be.instanceOf(Result);
          res.docs.must.be.eq(SORTED_ASC_BY_ID);
          done();
        });
      }).params("id", {id: "ASC"});

      test("sort({id: 'DESC'})", function(done) {
        q.sort({id: "DESC"}).must.be.same(q);
        q.run(function(err, res) {
          assert(err === undefined);
          res.must.be.instanceOf(Result);
          res.docs.must.be.eq(SORTED_DESC_BY_ID);
          done();
        });
      });
    });

    suite("By field", function() {
      test("sort(field)", function(params, done) {
        q.sort(params[0]).must.be.same(q);
        q.run(function(err, res) {
          assert(err === undefined);
          res.must.be.instanceOf(Result);
          res.docs.must.be.eq(SORTED_ASC_BY_YEAR);
          done();
        });
      }).params("year", {year: "ASC"});

      test("sort({field: 'DESC'})", function(done) {
        q.sort({year: "DESC"}).must.be.same(q);
        q.run(function(err, res) {
          assert(err === undefined);
          res.must.be.instanceOf(Result);
          res.docs.must.be.eq(SORTED_DESC_BY_YEAR);
          done();
        });
      });
    });

    suite("Several", function() {
      test("sort(field, field)", function(done) {
        q.sort("id", "year").must.be.same(q);
        q.run(function(err, res) {
          assert(err === undefined);
          res.must.be.instanceOf(Result);
          res.docs.must.be.eq(SORTED_ASC_BY_ID);
          done();
        });
      });

      test("sort({field, field})", function(done) {
        q.sort({id: "ASC", year: "ASC"}).must.be.same(q);
        q.run(function(err, res) {
          assert(err === undefined);
          res.must.be.instanceOf(Result);
          res.docs.must.be.eq(SORTED_ASC_BY_ID);
          done();
        });
      });
    });
  });

  suite("#run()", function() {
    test("run() : Result - find all", function(done) {
      q.run(function(err, res) {
        assert(err === undefined);
        res.must.be.instanceOf(Result);
        res.docs.must.be.similarTo(BANDS);
        done();
      });
    });

    test("run() : Result - filter", function(done) {
      q.filter({disbanded: false}).run(function(err, res) {
        assert(err === undefined);
        res.must.be.instanceOf(Result);
        res.docs.must.be.similarTo(NON_DISBANDED);
        done();
      });
    });

    test("run() : Result - filter|sort", function(done) {
      q.filter({disbanded: false}).sort("id").run(function(err, res) {
        assert(err === undefined);
        res.must.be.instanceOf(Result);
        res.docs.must.be.eq(NON_DISBANDED_SORTED_BY_ID);
        done();
      });
    });

    test("run() : Result - filter|sort|limit", function(done) {
      q.filter({disbanded: false}).sort("id").limit(2).run(function(err, res) {
        assert(err === undefined);
        res.must.be.instanceOf(Result);
        res.docs.must.be.eq(NON_DISBANDED_SORTED_BY_ID.slice(0, 2));
        done();
      });
    });

    test("run() : Result - filter|sort|offset", function(done) {
      q.filter({disbanded: false}).sort("id").offset(2).run(function(err, res) {
        assert(err === undefined);
        res.must.be.instanceOf(Result);
        res.docs.must.be.eq(NON_DISBANDED_SORTED_BY_ID.slice(2));
        done();
      });
    });

    test("run() : Result - filter|sort|offset|limit", function(done) {
      q.filter({disbanded: false}).sort("id").offset(1).limit(2).run(function(err, res) {
        assert(err === undefined);
        res.must.be.instanceOf(Result);
        res.docs.must.be.eq(NON_DISBANDED_SORTED_BY_ID.slice(1, 3));
        done();
      });
    });
  });

  suite("Injection", function() {
    test("filter(query)", function(done) {
      db.getCollection(bandsColl, {inject: {id: BANDS[2].id}}).q().filter({}).run(function(err, res) {
        assert(err === undefined);
        res.docs.must.be.eq(BANDS.slice(2, 3));
        done();
      });
    });

    test("find(query, callback)", function(done) {
      db.getCollection(bandsColl, {inject: {id: BANDS[2].id}}).q().find({}, function(err, res) {
        assert(err === undefined);
        res.docs.must.be.eq(BANDS.slice(2, 3));
        done();
      });
    });

    test("findOne(query, callback)", function(done) {
      db.getCollection(bandsColl, {inject: {id: BANDS[2].id}}).q().findOne({}, function(err, doc) {
        assert(err === undefined);
        doc.must.be.eq(BANDS[2]);
        done();
      });
    });
  });
});
