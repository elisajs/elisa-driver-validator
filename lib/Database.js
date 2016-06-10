//imports
import {workflow} from "justo";

//api
export default workflow("Database by Validator", function(params) {
  require("./DatabaseSync").default("Synchronous connection", ...params);
  require("./DatabaseAsync").default("Asycnhronous connection", ...params);
});
