//imports
import assert from "assert";
import {Driver, Result, CollectionQuery} from "elisa";
import {suite, test, init, fin} from "justo";
import {
  ECHO, JESUS, DAWES, BANDS, DISBANDED, NON_DISBANDED,
  YEAR_GE_2000, YEAR_GT_2000, YEAR_LE_2000, YEAR_LT_2000,
  YEAR_NOT_BETWEEN_1990_AND_1999, YEAR_BETWEEN_1990_AND_1999,
  ID_LIKE_A, ID_NOT_LIKE_A, ORIGIN_LIKE_L, ORIGIN_NOT_LIKE_L,
  ID_GE_M, ID_GT_M, ID_LE_M, ID_LT_M,
  ID_BETWEEN_L_AND_O, ID_NOT_BETWEEN_L_AND_O,
  ID_NOT_CONTAIN_W, ID_CONTAIN_W,
  ORIGIN_CONTAIN_LONDON, ORIGIN_NOT_CONTAIN_LONDON,
  TAGS_CONTAIN_FOLK, TAGS_NOT_CONTAIN_FOLK
} from "../data/collection";

//suite
export default suite("Synchronous Connection", function() {
  var drv, drvName, db, cx, cxOpts, coll, bandsColl, emptyColl, createCollections, dropCollections;

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

  init({name: "*", title: "Open connection and get collection"}, function() {
    cx = drv.openConnection({type: "sync"}, cxOpts);
    db = cx.db;
    coll = db.getCollection(bandsColl);
  });

  init({name: "*", title: "Create collections and data"}, function(done) {
    createCollections(
      cxOpts,
      [
        {name: bandsColl, docs: BANDS},
        {name: emptyColl, docs: []}
      ],
      done
    );
  });

  fin({name: "*", title: "Drop collections"}, function(done) {
    dropCollections(cxOpts, [bandsColl, emptyColl], done);
  });

  fin({name: "*", title: "Close connection"}, function(params) {
    cx.close();
  });

  test("Attributes", function() {
    coll.qn.must.be.eq(bandsColl);
    coll.fqn.must.be.eq("elisa." + bandsColl);
    coll.must.have({inject: undefined});
  });

  test("#q()", function() {
    var q = coll.q();
    q.must.be.instanceOf(CollectionQuery);
    q.source.must.be.same(coll);
  });

  suite("#hasId()", function() {
    test("hasId(id) : true", function() {
      coll.hasId(BANDS[0].id).must.be.eq(true);
    });

    test("hasId(id) : false", function() {
      coll.hasId("unknown").must.be.eq(false);
    });
  });

  suite("#findAll()", function() {
    test("findAll() : Result with data", function() {
      const res = coll.findAll();

      res.must.be.instanceOf(Result);
      res.length.must.be.eq(BANDS.length);
      res.docs.must.be.similarTo(BANDS);
    });

    test("findAll() : Result without data", function() {
      const res = db.getCollection(emptyColl).findAll();

      res.must.be.instanceOf(Result);
      res.length.must.be.eq(0);
      res.docs.must.be.eq([]);
    });
  });

  suite("#count()", function() {
    suite("Without documents", function() {
      test("count() : number", function() {
        db.getCollection(emptyColl).count().must.be.eq(0);
      });

      test("count(opts) : number", function() {
        db.getCollection(emptyColl).count({}).must.be.eq(0);
      });
    });

    suite("With documents", function() {
      test("count() : number", function() {
        coll.count().must.be.eq(BANDS.length);
      });

      test("count(opts) : number", function() {
        coll.count({}).must.be.eq(BANDS.length);
      });
    });
  });

  suite("#insert()", function() {
    suite("One document", function() {
      suite("Id doesn't exist", function() {
        test("insert(doc)", function() {
          coll.insert(ECHO);
          coll.findAll().docs.must.be.similarTo(BANDS.concat([ECHO]));
        });

        test("insert(doc, opts)", function() {
          coll.insert(ECHO, {});
          coll.findAll().docs.must.be.similarTo(BANDS.concat([ECHO]));
        });
      });

      suite("Id exists", function() {
        test("insert(doc) => error", function() {
          coll.insert.bind(coll).must.raise(Error, [{id: BANDS[0].id, x: 1, y: 2, z: 3}]);
          coll.findAll().docs.must.be.similarTo(BANDS);
        });

        test("insert(doc, opts) => error", function() {
          coll.insert.bind(coll).must.raise(Error, [{id: BANDS[0].id, x: 1, y: 2, z: 3}, {}]);
          coll.findAll().docs.must.be.similarTo(BANDS);
        });
      });
    });

    suite("Several documents", function() {
      suite("No document exists", function() {
        test("insert(docs)", function() {
          const DOCS = [{id: "one", x: 1}, {id: "two", x: 2}];

          coll.insert(DOCS);
          coll.findAll().docs.must.be.similarTo(BANDS.concat(DOCS));
        });

        test("insert(docs, opts)", function() {
          const DOCS = [{id: "one", x: 1}, {id: "two", x: 2}];

          coll.insert(DOCS, {});
          coll.findAll().docs.must.be.similarTo(BANDS.concat(DOCS));
        });
      });

      suite("Some document exists", function() {
        test("insert(docs)", function() {
          const DOCS = [{id: "one", x: 1}, {id: "two", x: 2}, BANDS[0]];

          coll.insert.bind(coll).must.raise(Error, [DOCS]);
          coll.count().must.be.eq(BANDS.length + 2);
        });

        test("insert(docs, opts)", function() {
          const DOCS = [{id: "one", x: 1}, {id: "two", x: 2}, BANDS[0]];

          coll.insert.bind(coll).must.raise(Error, [DOCS, {}]);
          coll.count().must.be.eq(BANDS.length + 2);
        });
      });
    });

    test("Inserting fields with values of different types", function() {
      const doc = {id: "123", a: ["one", 2, "three"], b: true, n: 1234321, o: {x: 111, y: 222, z: 333}, s: "string"};
      coll.insert(doc);
      coll.findAll().docs.must.be.similarTo(BANDS.concat(doc));
    });
  });

  suite("#remove()", function() {
    test("remove({}) - nop", function() {
      coll.remove({});
      coll.findAll().docs.must.be.similarTo(BANDS);
    });

    suite("remove({id})", function() {
      test("remove({id}) - id not existing", function() {
        coll.remove({id: "unknown"});
        coll.findAll().docs.must.be.similarTo(BANDS);
      });

      test("remove({id}) - id existing", function() {
        coll.remove({id: BANDS[0].id});
        coll.count().must.be.eq(BANDS.length - 1);
        coll.findAll().docs.must.be.similarTo(BANDS.slice(1));
      });
    });

    suite("remove(query)", function() {
      test("remove(simple) - removing", function() {
        coll.remove({disbanded: true});
        coll.findAll().docs.must.be.similarTo(NON_DISBANDED);
      });

      test("remove(simple) - not removing", function() {
        coll.remove({active: false});
        coll.findAll().docs.must.be.similarTo(BANDS);
      });

      test("remove(compound) - removing", function() {
        coll.remove({active: true, disbanded: false});
        coll.findAll().docs.must.be.similarTo(DISBANDED);
      });

      test("remove(compound) - not removing", function() {
        coll.remove({active: false, disbanded: true});
        coll.findAll().docs.must.be.similarTo(BANDS);
      });
    });

    suite("WHERE operators", function() {
      test("remove({id: value})", function() {
        coll.remove({id: BANDS[0].id});
        coll.findAll().docs.must.be.similarTo(BANDS.slice(1));
      });

      test("remove({field: value})", function() {
        coll.remove({disbanded: true});
        coll.findAll().docs.must.be.similarTo(NON_DISBANDED);
      });

      test("remove({id: {$eq: value}})", function() {
        coll.remove({id: {$eq: BANDS[0].id}});
        coll.findAll().docs.must.be.similarTo(BANDS.slice(1));
      });

      test("remove({field: {$eq: value}})", function() {
        coll.remove({disbanded: {$eq: true}});
        coll.findAll().docs.must.be.similarTo(NON_DISBANDED);
      });

      test("remove({id: {$ne: value}})", function(params) {
        coll.remove({id: {[params[0]]: BANDS[0].id}});
        coll.findAll().docs.must.be.similarTo([BANDS[0]]);
      }).params("$ne", "$neq");

      test("remove({field: {$ne: value}})", function(params) {
        coll.remove({disbanded: {[params[0]]: true}});
        coll.findAll().docs.must.be.similarTo(DISBANDED);
      }).params("$ne", "$neq");

      test("remove({id: {$lt: value}})", function() {
        coll.remove({id: {$lt: "M"}});
        coll.findAll().docs.must.be.similarTo(ID_GE_M);
      });

      test("remove({field: {$lt: value}})", function() {
        coll.remove({year: {$lt: 2000}});
        coll.findAll().docs.must.be.similarTo(YEAR_GE_2000);
      });

      test("remove({id: {$le: value}})", function(params) {
        coll.remove({id: {[params[0]]: "M"}});
        coll.findAll().docs.must.be.similarTo(ID_GT_M);
      }).params("$le", "$lte");

      test("remove({field: {$le: value}})", function(params) {
        coll.remove({year: {[params[0]]: 1999}});
        coll.findAll().docs.must.be.similarTo(YEAR_GT_2000);
      }).params("$le", "$lte");

      test("remove({id: {$gt: value}})", function() {
        coll.remove({id: {$gt: "M"}});
        coll.findAll().docs.must.be.similarTo(ID_LE_M);
      });

      test("remove({field: {$gt: value}})", function() {
        coll.remove({year: {$gt: 2000}});
        coll.findAll().docs.must.be.similarTo(YEAR_LE_2000);
      });

      test("remove({id: {$ge: value}})", function(params) {
        coll.remove({id: {[params[0]]: "M"}});
        coll.findAll().docs.must.be.similarTo(ID_LT_M);
      }).params("$ge", "$gte");

      test("remove({field: {$ge: value}})", function(params) {
        coll.remove({year: {[params[0]]: 2000}});
        coll.findAll().docs.must.be.similarTo(YEAR_LT_2000);
      }).params("$ge", "$gte");

      test("remove({id: {$between: [one, two]}})", function() {
        coll.remove({id: {$between: ["L", "O"]}});
        coll.findAll().docs.must.be.similarTo(ID_NOT_BETWEEN_L_AND_O);
      });

      test("remove({field: {$between: [one, two]}})", function() {
        coll.remove({year: {$between: [1990, 1999]}});
        coll.findAll().docs.must.be.similarTo(YEAR_NOT_BETWEEN_1990_AND_1999);
      });

      test("remove({id: {$nbetween: [one, two]}})", function(params) {
        coll.remove({id: {[params[0]]: ["L", "O"]}});
        coll.findAll().docs.must.be.similarTo(ID_BETWEEN_L_AND_O);
      }).params("$nbetween", "$notBetween");

      test("remove({field: {$nbetween: [one, two]}})", function(params) {
        coll.remove({year: {[params[0]]: [1990, 1999]}});
        coll.findAll().docs.must.be.similarTo(YEAR_BETWEEN_1990_AND_1999);
      }).params("$nbetween", "$notBetween");

      test("remove({id: {$like: value}})", function() {
        coll.remove({id: {$like: "%a%"}});
        coll.findAll().docs.must.be.similarTo(ID_NOT_LIKE_A);
      });

      test("remove({field: {$like: value}})", function() {
        coll.remove({origin: {$like: "%L%"}});
        coll.findAll().docs.must.be.similarTo(ORIGIN_NOT_LIKE_L);
      });

      test("remove({id: {$nlike: value}})", function(params) {
        coll.remove({id: {[params[0]]: "%a%"}});
        coll.findAll().docs.must.be.similarTo(ID_LIKE_A);
      }).params("$nlike", "$notLike");

      test("remove({field: {$nlike: value}})", function(params) {
        coll.remove({origin: {[params[0]]: "%L%"}});
        coll.findAll().docs.must.be.similarTo(ORIGIN_LIKE_L);
      }).params("$nlike", "$notLike");

      test("remove({id: {$in: array}})", function() {
        coll.remove({id: {$in: [BANDS[0].id, BANDS[1].id]}});
        coll.findAll().docs.must.be.similarTo(BANDS.slice(2));
      });

      test("remove({id: {$in: []}})", function() {
        coll.remove({id: {$in: []}});
        coll.findAll().docs.must.be.similarTo(BANDS);
      });

      test("remove({field: {$nin: array}})", function(params) {
        coll.remove({origin: {[params[0]]: [BANDS[0].origin, BANDS[1].origin]}});
        coll.findAll().docs.must.be.similarTo(BANDS.slice(0, 2));
      }).params("$nin", "$notIn");

      test("remove({field: {$nin: []}})", function(params) {
        coll.remove({origin: {[params[0]]: []}});
        coll.findAll().docs.must.be.similarTo([]);
      }).params("$nin", "$notIn");

      test("remove({id: {$contains: value}})", function(params) {
        coll.remove({id: {[params[0]]: "w"}});
        coll.findAll().docs.must.be.similarTo(ID_NOT_CONTAIN_W);
      }).params("$contain", "$contains");

      test("remove({field: {$contains: value}}) - field as string", function(params) {
        coll.remove({origin: {[params[0]]: "London"}});
        coll.findAll().docs.must.be.similarTo(ORIGIN_NOT_CONTAIN_LONDON);
      }).params("$contain", "$contains");

      test("remove({field: {$contains: value}}) - field as array", function(params) {
        coll.remove({tags: {[params[0]]: "folk"}});
        coll.findAll().docs.must.be.similarTo(TAGS_NOT_CONTAIN_FOLK);
      }).params("$contain", "$contains");

      test("remove({id: {$ncontains: value}})", function(params) {
        coll.remove({id: {[params[0]]: "w"}});
        coll.findAll().docs.must.be.similarTo(ID_CONTAIN_W);
      }).params("$ncontains", "$notContains", "$ncontain", "$notContain");

      test("remove({field: {$ncontains: value}}) - field as string", function(params) {
        coll.remove({origin: {[params[0]]: "London"}});
        coll.findAll().docs.must.be.similarTo(ORIGIN_CONTAIN_LONDON);
      }).params("$ncontains", "$notContains", "$ncontain", "$notContain");

      test("remove({field: {$ncontains: value}}) - field as array", function(params) {
        coll.remove({tags: {[params[0]]: "folk"}});
        coll.findAll().docs.must.be.similarTo(TAGS_CONTAIN_FOLK);
      }).params("$ncontains", "$notContains", "$ncontain", "$notContain");
    });
  });

  suite("#truncate()", function() {
    test("truncate()", function() {
      coll.truncate();
      coll.count().must.be.eq(0);
    });

    test("truncate(opts)", function() {
      coll.truncate({});
      coll.count().must.be.eq(0);
    });
  });

  suite("#update()", function() {
    suite("update({id})", function() {
      test("update({id}, fields) - id not existing", function() {
        coll.update({id: "unknown"}, {x: 123});
        coll.findAll().docs.must.be.similarTo(BANDS);
      });

      test("update({id}, fields) - id existing", function() {
        coll.update({id: BANDS[0].id}, {x: 123, year: {$inc: 1}});
        coll.findAll().docs.must.be.similarTo([Object.assign({}, BANDS[0], {x: 123, year: BANDS[0].year + 1})].concat(BANDS.slice(1)));
      });
    });

    suite("Update operators", function() {
      suite("{field: value}", function() {
        test("{field: value}", function() {
          const band = Object.assign({}, BANDS[0], {year: 1234});
          coll.update({id: band.id}, {year: {$set: 1234}});
          coll.findAll().docs.must.be.similarTo([band].concat(BANDS.slice(1)));
        });

        test("{field: value} - string", function() {
          const band = Object.assign({}, BANDS[0], {x: "an string"});
          coll.update({id: band.id}, {x: "an string"});
          coll.findAll().docs.must.be.similarTo([band].concat(BANDS.slice(1)));
        });

        test("{field: value} - number", function() {
          const band = Object.assign({}, BANDS[0], {x: 123});
          coll.update({id: band.id}, {x: 123});
          coll.findAll().docs.must.be.similarTo([band].concat(BANDS.slice(1)));
        });

        test("{field: value} - boolean", function() {
          const band = Object.assign({}, BANDS[0], {x: true});
          coll.update({id: band.id}, {x: true});
          coll.findAll().docs.must.be.similarTo([band].concat(BANDS.slice(1)));
        });

        test("{field: value} - array", function() {
          const band = Object.assign({}, BANDS[0], {x: ["one", 2, "three"]});
          coll.update({id: band.id}, {x: ["one", 2, "three"]});
          coll.findAll().docs.must.be.similarTo([band].concat(BANDS.slice(1)));
        });

        test("{field: value} - object", function() {
          const band = Object.assign({}, BANDS[0], {x: {x: "one", y: [0, 1, 2], z: {a: "one", b: "two"}}});
          coll.update({id: band.id}, {x: {x: "one", y: [0, 1, 2], z: {a: "one", b: "two"}}});
          coll.findAll().docs.must.be.similarTo([band].concat(BANDS.slice(1)));
        });
      });

      test("{field: {$set: value}}", function() {
        const band = Object.assign({}, BANDS[0], {year: 1234});
        coll.update({id: band.id}, {year: {$set: 1234}});
        coll.findAll().docs.must.be.similarTo([band].concat(BANDS.slice(1)));
      });

      test("{field: {$inc: value}}", function() {
        const band = Object.assign({}, BANDS[0], {year: BANDS[0].year + 1234});
        coll.update({id: band.id}, {year: {$inc: 1234}});
        coll.findAll().docs.must.be.similarTo([band].concat(BANDS.slice(1)));
      });

      test("{field: {$dec: value}}", function() {
        const band = Object.assign({}, BANDS[0], {year: BANDS[0].year - 1234});
        coll.update({id: band.id}, {year: {$dec: 1234}});
        coll.findAll().docs.must.be.similarTo([band].concat(BANDS.slice(1)));
      });

      test("{field: {$mul: value}}", function() {
        const band = Object.assign({}, BANDS[0], {year: BANDS[0].year * 2});
        coll.update({id: band.id}, {year: {$mul: 2}});
        coll.findAll().docs.must.be.similarTo([band].concat(BANDS.slice(1)));
      });

      test("{field: {$div: value}}", function() {
        const band = Object.assign({}, BANDS[0], {year: BANDS[0].year / 2});
        coll.update({id: band.id}, {year: {$div: 2}});
        coll.findAll().docs.must.be.similarTo([band].concat(BANDS.slice(1)));
      });

      suite("{field: {$add: value}}", function() {
        test("{field: {$add: value}} - with field not existing", function() {
          const band = Object.assign({}, BANDS[0], {labels: ["Creation"]});
          coll.update({id: band.id}, {labels: {$add: "Creation"}});
          coll.findAll().docs.must.be.similarTo([band].concat(BANDS.slice(1)));
        });

        test("{field: {$add: value}} - with field being null", function() {
          const band = Object.assign({}, BANDS[1], {tags: ["alternative"]});
          coll.update({id: band.id}, {tags: {$add: "alternative"}});
          coll.findAll().docs.must.be.similarTo([BANDS[0], band].concat(BANDS.slice(2)));
        });

        test("{field: {$add: value}} - with empty array", function() {
          const band = Object.assign({}, BANDS[0], {tags: ["alternative"]});
          coll.update({id: band.id}, {tags: {$add: "alternative"}});
          coll.findAll().docs.must.be.similarTo([band].concat(BANDS.slice(1)));
        });

        test("{field: {$add: value}} - with non-empty array", function() {
          const band = Object.assign({}, BANDS[2], {tags: BANDS[2].tags.concat("indie")});
          coll.update({id: band.id}, {tags: {$add: "indie"}});
          coll.findAll().docs.must.be.similarTo(BANDS.slice(0, 2).concat([band]).concat(BANDS.slice(3)));
        });

        test("{field: {$add: value}} - item existing", function() {
          const band = BANDS[2];
          coll.update({id: band.id}, {tags: {$add: band.tags[0]}});
          coll.findAll().docs.must.be.similarTo(BANDS);
        });
      });

      suite("{field: {$remove: value}}", function() {
        test("{field: {$remove: value}} - with field not existing", function() {
          coll.update({id: BANDS[0].id}, {unknown: {$remove: "value"}});
          coll.findAll().docs.must.be.similarTo(BANDS);
        });

        test("{field: {$remove: value}} - with field being null", function() {
          coll.update({id: BANDS[1].id}, {tags: {$remove: "value"}});
          coll.findAll().docs.must.be.similarTo(BANDS);
        });

        test("{field: {$remove: value}} - with empty array", function() {
          coll.update({id: BANDS[0].id}, {tags: {$remove: "value"}});
          coll.findAll().docs.must.be.similarTo(BANDS);
        });

        test("{field: {$remove: value}} - item in the start", function() {
          const band = Object.assign({}, BANDS[2], {tags: ["folk rock", "folk"]});
          coll.update({id: band.id}, {tags: {$remove: "alternative"}});
          coll.findAll().docs.must.be.similarTo([band].concat(BANDS.slice(0, 2)).concat(BANDS.slice(3)));
        });

        test("{field: {$remove: value}} - item in the end", function() {
          const band = Object.assign({}, BANDS[2], {tags: ["alternative", "folk rock"]});
          coll.update({id: band.id}, {tags: {$remove: "folk"}});
          coll.findAll().docs.must.be.similarTo([band].concat(BANDS.slice(0, 2)).concat(BANDS.slice(3)));
        });

        test("{field: {$remove: value}} - item in the middle", function() {
          const band = Object.assign({}, BANDS[2], {tags: ["alternative", "folk"]});
          coll.update({id: band.id}, {tags: {$remove: "folk rock"}});
          coll.findAll().docs.must.be.similarTo([band].concat(BANDS.slice(0, 2)).concat(BANDS.slice(3)));
        });

        test("{field: {$remove: value}} - the only item", function() {
          const band = Object.assign({}, BANDS[3], {tags: []});
          coll.update({id: band.id}, {tags: {$remove: "alternative"}});
          coll.findAll().docs.must.be.similarTo([band].concat(BANDS.slice(0, 3).concat(BANDS.slice(4))));
        });
      });

      suite("{field: {$push: value}}", function() {
        test("{field: {$push: value}} - with field not existing", function() {
          const band = Object.assign({}, BANDS[0], {labels: ["Creation"]});
          coll.update({id: band.id}, {labels: {$push: "Creation"}});
          coll.findAll().docs.must.be.similarTo([band].concat(BANDS.slice(1)));
        });

        test("{field: {$push: value}} - with field being null", function() {
          const band = Object.assign({}, BANDS[1], {tags: ["alternative"]});
          coll.update({id: band.id}, {tags: {$push: "alternative"}});
          coll.findAll().docs.must.be.similarTo([BANDS[0], band].concat(BANDS.slice(2)));
        });

        test("{field: {$push: value}} - with empty array", function() {
          const band = Object.assign({}, BANDS[0], {tags: ["alternative"]});
          coll.update({id: band.id}, {tags: {$push: "alternative"}});
          coll.findAll().docs.must.be.similarTo([band].concat(BANDS.slice(1)));
        });

        test("{field: {$push: value}} - with non-empty array", function() {
          const band = Object.assign({}, BANDS[2], {tags: BANDS[2].tags.concat("indie")});
          coll.update({id: band.id}, {tags: {$push: "indie"}});
          coll.findAll().docs.must.be.similarTo(BANDS.slice(0, 2).concat([band]).concat(BANDS.slice(3)));
        });
      });

      suite("{field: {$pop: value}} - with field not existing", function() {
        test("{field: {$pop: value}} - with field not existing", function() {
          coll.update({id: BANDS[0].id}, {labels: {$pop: 1}});
          coll.findAll().docs.must.be.similarTo(BANDS);
        });

        test("{field: {$pop: value}} - with field is null", function() {
          coll.update({id: BANDS[1].id}, {tags: {$pop: 1}});
          coll.findAll().docs.must.be.similarTo(BANDS);
        });

        test("{field: {$pop: value}} - array.length == 0", function() {
          coll.update({id: BANDS[0].id}, {tags: {$pop: 1}});
          coll.findAll().docs.must.be.similarTo(BANDS);
        });

        test("{field: {$pop: value}} - array.length == 1", function() {
          const band = Object.assign({}, BANDS[3], {tags: []});
          coll.update({id: band.id}, {tags: {$pop: 1}});
          coll.findAll().docs.must.be.similarTo(BANDS.slice(0, 3).concat(band).concat(BANDS.slice(4)));
        });

        test("{field: {$pop: value}} - array.length == 2", function() {
          const band = Object.assign({}, BANDS[4], {tags: [BANDS[4].tags[0]]});
          coll.update({id: band.id}, {tags: {$pop: 1}});
          coll.findAll().docs.must.be.similarTo(BANDS.slice(0, 4).concat(band));
        });

        test("{field: {$pop: value}} - array.length > 2", function() {
          const band = Object.assign({}, BANDS[2], {tags: BANDS[2].tags.slice(0, 2)});
          coll.update({id: band.id}, {tags: {$pop: 1}});
          coll.findAll().docs.must.be.similarTo(BANDS.slice(0, 2).concat(band).concat(BANDS.slice(3)));
        });
      });

      suite("{field: {$concat: value}}", function() {
        test("{field: {$concat: value}} - with field not existing", function() {
          const band = Object.assign({}, BANDS[0], {unknown: "Great!"});
          coll.update({id: band.id}, {unknown: {$concat: "Great!"}});
          coll.findAll().docs.must.be.similarTo([band].concat(BANDS.slice(1)));
        });

        test("{field: {$concat: value}} - with field being null", function() {
          const band = Object.assign({}, BANDS[1], {tags: "Great!"});
          coll.update({id: band.id}, {tags: {$concat: "Great!"}});
          coll.findAll().docs.must.be.similarTo([BANDS[0], band].concat(BANDS.slice(2)));
        });

        test("{field: {$concat: value}} - with empty string", function() {
          const band = Object.assign({}, BANDS[3], {origin: "New York, United States"});
          coll.update({id: band.id}, {origin: {$concat: "New York, United States"}});
          coll.findAll().docs.must.be.similarTo(BANDS.slice(0, 3).concat(band).concat(BANDS.slice(4)));
        });

        test("{field: {$concat: value}} - with non-empty string", function() {
          const band = Object.assign({}, BANDS[0], {origin: BANDS[0].origin + "Great!"});
          coll.update({id: band.id}, {origin: {$concat: "Great!"}});
          coll.findAll().docs.must.be.similarTo([band].concat(BANDS.slice(1)));
        });
      });
    });
  });

  suite("#save()", function() {
    suite("Error handler", function() {
      test("save(doc) - without id", function() {
        coll.save.bind(coll).must.raise(Error, [{x: 1, y: 2}]);
      });

      test("save(doc, opts) - without id", function() {
        coll.save.bind(coll).must.raise(Error, [{x: 1, y: 2}, {}]);
      });
    });

    suite("Insert", function() {
      test("save(doc)", function() {
        coll.save(ECHO);
        coll.findAll().docs.must.be.similarTo(BANDS.concat(ECHO));
      });

      test("save(doc, opts)", function() {
        coll.save(ECHO, {});
        coll.findAll().docs.must.be.similarTo(BANDS.concat(ECHO));
      });
    });

    suite("Update", function() {
      test("save(doc)", function() {
        const band = Object.assign({}, BANDS[0], {origin: "Jamaica"});
        coll.save(band);
        coll.findAll().docs.must.be.similarTo([band].concat(BANDS.slice(1)));
      });

      test("save(doc, opts)", function() {
        const band = Object.assign({}, BANDS[0], {origin: "Jamaica"});
        coll.save(band, {});
        coll.findAll().docs.must.be.similarTo([band].concat(BANDS.slice(1)));
      });
    });
  });

  suite("Injection", function() {
    test("insert(doc)", function() {
      var ic = db.getCollection(bandsColl, {inject: {author: "elisa"}});
      ic.insert(ECHO);
      coll.findAll().docs.must.be.similarTo(BANDS.concat([Object.assign({}, ECHO, {author: "elisa"})]));
    });

    test("save(doc)", function() {
      var ids = db.getCollection(bandsColl, {inject: {author: "elisa"}});
      ids.save(ECHO);
      coll.findAll().docs.must.be.similarTo(BANDS.concat([Object.assign({}, ECHO, {author: "elisa"})]));
    });

    test("update(query, update)", function() {
      const doc = Object.assign({}, BANDS[0], {origin: "GIRO"});
      var ic = db.getCollection(bandsColl, {inject: {id: doc.id}});
      ic.update({}, {origin: "GIRO"});
      coll.findAll().docs.must.be.similarTo([doc].concat(BANDS.slice(1)));
    });

    test("remove(query)", function() {
      var ic = db.getCollection(bandsColl, {inject: {id: BANDS[0].id}});
      ic.remove({});
      coll.findAll().docs.must.be.similarTo(BANDS.slice(1));
    });

    test("truncate()", function() {
      var ic = db.getCollection(bandsColl, {inject: {id: BANDS[0].id}});
      ic.truncate();
      coll.findAll().docs.must.be.similarTo(BANDS.slice(1));
    });

    test("find(query)", function() {
      var ic = db.getCollection(bandsColl, {inject: {id: BANDS[2].id}});
      ic.find({}).docs.must.be.eq(BANDS.slice(2, 3));
    });

    test("findAll()", function() {
      var ic = db.getCollection(bandsColl, {inject: {id: BANDS[2].id}});
      ic.findAll().docs.must.be.eq(BANDS.slice(2, 3));
    });

    test("findOne(query)", function() {
      var ic = db.getCollection(bandsColl, {inject: {id: BANDS[2].id}});
      ic.findOne({}).must.be.eq(BANDS[2]);
    });
  });
});
