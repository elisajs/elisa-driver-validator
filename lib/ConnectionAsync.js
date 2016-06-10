//imports
import assert from "assert";
import {Driver, Database} from "elisa";
import {suite, test, init, fin} from "justo";

//suite
export default suite("Connection (Asynchronous Connection)", function() {
  var drv, cxOpts;

  init({title: "Get driver"}, function(params) {
    drv = Driver.getDriver(params[0].name);
  });

  init({title: "Get connection options from params"}, function(params) {
    cxOpts = params[0].cxOpts;
  });

  suite("#db", function() {
    var cx;

    init({name: "*", title: "Open connection"}, function(done) {
      drv.openConnection(cxOpts, function(err, con) {
        cx = con;
        done();
      });
    });

    test("db", function() {
      cx.db.must.be.instanceOf(Database);
      cx.db.name.must.be.instanceOf(String);
      cx.db.connection.must.be.same(cx);
      cx.db.driver.must.be.same(drv);
    });
  });

  suite("#open()", function() {
    var cx;

    init({name: "*", title: "Create connection"}, function() {
      cx = drv.createConnection(cxOpts);
    });

    test("open()", function(done) {
      cx.open();

      setTimeout(function() {
        cx.opened.must.be.eq(true);
        cx.closed.must.be.eq(false);
        done();
      }, 1500);
    });

    test("open(callback)", function(done) {
      cx.open(function(err) {
        assert(err === undefined);
        cx.opened.must.be.eq(true);
        cx.closed.must.be.eq(false);
        done();
      });
    });
  });

  suite("#close()", function() {
    var cx;

    init({name: "*", title: "Open connection"}, function(done) {
      drv.openConnection(cxOpts, function(err, con) {
        cx = con;
        done();
      });
    });

    test("close()", function(done) {
      cx.close();

      setTimeout(function() {
        cx.closed.must.be.eq(true);
        cx.opened.must.be.eq(false);
        done();
      }, 1000);
    });

    test("close(callback)", function(done) {
      cx.close(function(err) {
        assert(err === undefined);
        cx.closed.must.be.eq(true);
        cx.opened.must.be.eq(false);
        done();
      });
    });
  });

  suite("#connected()", function() {
    var cx;

    init({name: "*", title: "Open connection"}, function(done) {
      drv.openConnection(cxOpts, function(err, con) {
        cx = con;
        done();
      });
    });

    test("connected(callback) - with opened connection", function(done) {
      cx.connected(function(error, con) {
        assert(error === undefined);
        con.must.be.eq(true);
        done();
      });
    });

    test("connected(callback) - with closed connection", function(done) {
      cx.close();

      setTimeout(function() {
        cx.connected(function(error, con) {
          assert(error === undefined);
          con.must.be.eq(false);
          done();
        });
      }, 500);
    });
  });

  suite("#ping()", function() {
    test("ping() - opened connection", function(done) {
      drv.openConnection(cxOpts, function(err, cx) {
        cx.ping(function(err) {
          assert(err === undefined);
          done();
        });
      });
    });

    test("ping() - closed connection", function(done) {
      var cx = drv.createConnection({});

      cx.ping(function(err) {
        err.must.be.instanceOf(Error);
        err.message.must.be.eq("Connection closed.");
        done();
      });
    });
  });
});
