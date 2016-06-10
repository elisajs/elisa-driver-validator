//imports
const justo = require("justo");
const suite = justo.suite;
const test = justo.test;
const init = justo.init;
const fin = justo.fin;
const pkg = require("../../dist/es5/nodejs/elisa-driver-validator");

//suite
suite("API", function() {
  test("validateConnection", function() {
    pkg.validateConnection.must.be.instanceOf(Function);
  });

  test("validateDatabase", function() {
    pkg.validateDatabase.must.be.instanceOf(Function);
  });

  test("validateDriver", function() {
    pkg.validateDriver.must.be.instanceOf(Function);
  });

  test("validateNamespace", function() {
    pkg.validateNamespace.must.be.instanceOf(Function);
  });

  test("validateServer", function() {
    pkg.validateServer.must.be.instanceOf(Function);
  });

  test("validateStore", function() {
    pkg.validateStore.must.be.instanceOf(Function);
  });
})();
