//imports
import assert from "assert";
import {Driver, Database} from "elisa";
import {suite, test, init, fin} from "justo";

//suite
export default suite("Connection (Synchronous Connection)", function() {
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
      cx = drv.createConnection({type: "sync"}, cxOpts);
    });

    test("open()", function() {
      cx.open();
      cx.opened.must.be.eq(true);
      cx.closed.must.be.eq(false);
    });
  });

  suite("#close()", function() {
    var cx;

    init({name: "*", title: "Open connection"}, function() {
      cx = drv.openConnection({type: "sync"}, cxOpts);
    });

    test("close()", function() {
      cx.close();
      cx.closed.must.be.eq(true);
      cx.opened.must.be.eq(false);
    });
  });

  suite("#connected()", function() {
    var cx;

    init({name: "*", title: "Open connection"}, function() {
      cx = drv.openConnection({type: "sync"}, cxOpts);
    });

    test("connected() - with opened connection", function() {
      cx.connected().must.be.eq(true);
    });

    test("connected() - with closed connection", function() {
      cx.close();
      cx.connected().must.be.eq(false);
    });
  });

  suite("#ping()", function() {
    test("ping() - opened connection", function() {
      drv.openConnection({type: "sync"}, cxOpts).ping();
    });

    test("ping() - closed connection", function() {
      var cx = drv.createConnection({type: "sync"}, cxOpts);
      cx.ping.bind(cx).must.raise(Error);
    });
  });
});
