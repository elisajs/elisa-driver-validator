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
export default suite("Synchronous Connection", function() {
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

  init("*", function() {
    cx = drv.openConnection({type: "sync"}, cxOpts);
    db = cx.db;
    coll = db.getCollection(bandsColl);
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
    test("find() : Result", function() {
      const res = q.find();
      res.must.be.instanceOf(Result);
      res.docs.must.be.similarTo(BANDS);
    });

    test("find(query) : Result", function() {
      const res = q.find({disbanded: false});
      res.must.be.instanceOf(Result);
      res.docs.must.be.similarTo(NON_DISBANDED);
    });

    test("find(query, opts) : Result", function() {
      const res = q.find({disbanded: false}, {});
      res.must.be.instanceOf(Result);
      res.docs.must.be.similarTo(NON_DISBANDED);
    });
  });

  suite("#findOne()", function() {
    test("findOne() : object", function() {
      q.findOne().must.be.insideOf(BANDS);
    });

    test("findOne(query) : object", function() {
      q.findOne({id: BANDS[0].id}).must.be.eq(BANDS[0]);
    });

    test("findOne(query, opts) : object", function() {
      q.findOne({origin: BANDS[1].origin}, {}).must.be.eq(BANDS[1]);
    });
  });

  test("#limit(l)", function(params) {
    var res;

    q.limit(params[0]).must.be.same(q);

    res = q.run();
    res.must.be.instanceOf(Result);
    res.length.must.be.eq(params[0]);
    for (let doc of res.docs) doc.must.be.insideOf(BANDS);
  }).params(1, 2, 3);

  suite("#offset()", function() {
    test("offset(o) - without limit", function(params) {
      var res;

      q.offset(params[0]).must.be.same(q);

      res = q.run();
      res.must.be.instanceOf(Result);
      res.length.must.be.eq(BANDS.length-params[0]);
    }).params(1, 2, 3);

    test("offset(o) - with limit", function(params) {
      var res;

      q.offset(params[0]).limit(2);

      res = q.run();
      res.must.be.instanceOf(Result);
      res.length.must.be.eq(2);
    }).params(1, 2, 3);
  });

  suite("#filter()", function() {
    test("filter(query)", function() {
      var res;

      q.filter({disbanded: false}).must.be.same(q);

      res = q.run();
      res.must.be.instanceOf(Result);
      res.docs.must.be.similarTo(NON_DISBANDED);
    });
  });

  suite("#sort()", function() {
    suite("By id", function() {
      test("sort(id)", function(params) {
        var res;

        q.sort(params[0]).must.be.same(q);
        res = q.run();
        res.must.be.instanceOf(Result);
        res.docs.must.be.eq(SORTED_ASC_BY_ID);
      }).params("id", {id: "ASC"});

      test("sort({id: 'DESC'})", function() {
        var res;

        q.sort({id: "DESC"}).must.be.same(q);
        res = q.run();
        res.must.be.instanceOf(Result);
        res.docs.must.be.eq(SORTED_DESC_BY_ID);
      });
    });

    suite("By field", function() {
      test("sort(field)", function(params) {
        var res;

        q.sort(params[0]).must.be.same(q);
        res = q.run();
        res.must.be.instanceOf(Result);
        res.docs.must.be.eq(SORTED_ASC_BY_YEAR);
      }).params("year", {year: "ASC"});

      test("sort({field: 'DESC'})", function() {
        var res;

        q.sort({year: "DESC"}).must.be.same(q);
        res = q.run();
        res.must.be.instanceOf(Result);
        res.docs.must.be.eq(SORTED_DESC_BY_YEAR);
      });
    });

    suite("Several", function() {
      test("sort(field, field)", function() {
        var res;

        q.sort("id", "year").must.be.same(q);
        res = q.run();
        res.must.be.instanceOf(Result);
        res.docs.must.be.eq(SORTED_ASC_BY_ID);
      });

      test("sort({field, field})", function() {
        var res;

        q.sort({id: "ASC", year: "ASC"}).must.be.same(q);
        res = q.run();
        res.must.be.instanceOf(Result);
        res.docs.must.be.eq(SORTED_ASC_BY_ID);
      });
    });
  });

  suite("#run()", function() {
    test("run() : Result - find all", function() {
      var res = q.run();
      res.must.be.instanceOf(Result);
      res.docs.must.be.similarTo(BANDS);
    });

    test("run() : Result - filter", function() {
      var res = q.filter({disbanded: false}).run();
      res.must.be.instanceOf(Result);
      res.docs.must.be.similarTo(NON_DISBANDED);
    });

    test("run() : Result - filter|sort", function() {
      var res = q.filter({disbanded: false}).sort("id").run();
      res.must.be.instanceOf(Result);
      res.docs.must.be.eq(NON_DISBANDED_SORTED_BY_ID);
    });

    test("run() : Result - filter|sort|limit", function() {
      var res = q.filter({disbanded: false}).sort("id").limit(2).run();
      res.must.be.instanceOf(Result);
      res.docs.must.be.eq(NON_DISBANDED_SORTED_BY_ID.slice(0, 2));
    });

    test("run() : Result - filter|sort|offset", function() {
      var res = q.filter({disbanded: false}).sort("id").offset(2).run();
      res.must.be.instanceOf(Result);
      res.docs.must.be.eq(NON_DISBANDED_SORTED_BY_ID.slice(2));
    });

    test("run() : Result - filter|sort|offset|limit", function() {
      var res = q.filter({disbanded: false}).sort("id").offset(1).limit(2).run();
      res.must.be.instanceOf(Result);
      res.docs.must.be.eq(NON_DISBANDED_SORTED_BY_ID.slice(1, 3));
    });
  });

  suite("Injection", function() {
    test("filter(query)", function() {
      db.getCollection(bandsColl, {inject: {id: BANDS[2].id}}).q().filter({}).run().docs.must.be.eq(BANDS.slice(2, 3));
    });

    test("find(query)", function() {
      db.getCollection(bandsColl, {inject: {id: BANDS[2].id}}).q().find({}).docs.must.be.eq(BANDS.slice(2, 3));
    });

    test("findOne(query)", function() {
      db.getCollection(bandsColl, {inject: {id: BANDS[2].id}}).q().findOne({}).must.be.eq(BANDS[2]);
    });
  });
});
