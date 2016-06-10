//imports
import {Driver} from "elisa";
import {suite, test, init, fin} from "justo";

//suite
export default suite("Server by Validator", function() {
  var drv, cx, cxOpts, svr;

  init({title: "Get driver"}, function(params) {
    drv = Driver.getDriver(params[0].name);
  });

  init({title: "Open connection and get server"}, function(params, done) {
    cxOpts = params[0].cxOpts;

    drv.openConnection(cxOpts, function(error, con) {
      cx = con;
      svr = cx.server;
      done();
    });
  });

  fin({title: "Close connection"}, function(done) {
    cx.close(done);
  });

  test("#host", function() {
    svr.host.must.be.eq(cxOpts.host);
  });

  test("#port", function() {
    svr.port.must.be.eq(cxOpts.port);
  });

  test("#version", function() {
    svr.version.must.be.instanceOf(String);
  });
});
