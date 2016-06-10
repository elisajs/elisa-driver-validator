//imports
import {workflow} from "justo";

//api
export default workflow("Store by Validator", function(params) {
  require("./StoreSync").default("Synchronous connection", ...params);
  require("./StoreAsync").default("Asycnhronous connection", ...params);
});
