//imports
import {workflow} from "justo";

//api
export default workflow("Collection by Validator", function(params) {
  require("./CollectionQuerySync").default("Synchronous connection", ...params);
  require("./CollectionQueryAsync").default("Asycnhronous connection", ...params);
});
