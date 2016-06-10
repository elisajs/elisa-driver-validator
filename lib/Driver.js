//imports
import {Driver, Connection} from "elisa";
import assert from "assert";
import {suite, test, init, fin} from "justo";

//suite
export default suite("Validator: Driver", function() {
  var drv, cxOpts;

  init({title: "Get options from params.opts"}, function(params) {
    cxOpts = params[0].cxOpts;
  });

  init({title: "Get driver using params.name"}, function(params) {
    drv = Driver.getDriver(params[0].name);
  });

  test("Check whether the driver is registered", function() {
    drv.must.be.instanceOf(Driver);
  });

  suite("#createConnection()", function() {
    test("#createConnection(opts)", function() {
      var cx = drv.createConnection(cxOpts);

      cx.must.be.instanceOf(Connection);
      cx.driver.must.be.same(drv);
      cx.opened.must.be.eq(false);
      cx.closed.must.be.eq(true);
    });
  });

  suite("#openConnection()", function() {
    suite("Asynchronous connection", function() {
      test("openConnection(opts, callback)", function(done) {
        drv.openConnection(cxOpts, function(err, cx) {
          assert(err === undefined);
          cx.must.be.instanceOf(Connection);
          cx.driver.must.be.same(drv);
          cx.type.must.be.eq("async");
          cx.opened.must.be.eq(true);
          cx.closed.must.be.eq(false);
          done();
        });
      });

      test("openConnection({type: 'async'}, opts, callback)", function(done) {
        drv.openConnection({type: "async"}, cxOpts, function(err, cx) {
          assert(err === undefined);
          cx.must.be.instanceOf(Connection);
          cx.driver.must.be.same(drv);
          cx.type.must.be.eq("async");
          cx.opened.must.be.eq(true);
          cx.closed.must.be.eq(false);
          done();
        });
      });
    });

    suite("Synchronous connection", function() {
      test("openConnection({type: 'sync', opts) : Connection", function() {
        var cx = drv.openConnection({type: "sync"}, cxOpts);
        cx.must.be.instanceOf(Connection);
        cx.driver.must.be.same(drv);
        cx.type.must.be.eq("sync");
        cx.opened.must.be.eq(true);
        cx.closed.must.be.eq(false);
      });
    });
  });
});
