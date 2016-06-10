//imports
import {workflow} from "justo";

//api
export default workflow("Namespace by Validator", function(params) {
  require("./NamespaceSync").default("Synchronous connection", ...params);
  require("./NamespaceAsync").default("Asycnhronous connection", ...params);
});
