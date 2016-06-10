//imports
import {workflow} from "justo";

//api
export default workflow("Connection by Validator", function(params) {
  require("./ConnectionSync").default("Synchronous connection", ...params);
  require("./ConnectionAsync").default("Asycnhronous connection", ...params);
});
