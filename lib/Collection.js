//imports
import {workflow} from "justo";

//api
export default workflow("Collection by Validator", function(params) {
  require("./CollectionSync").default("Synchronous connection", ...params);
  require("./CollectionAsync").default("Asycnhronous connection", ...params);
});
