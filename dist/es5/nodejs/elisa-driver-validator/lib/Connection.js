"use strict";Object.defineProperty(exports, "__esModule", { value: true });
var _justo = require("justo");function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}}exports.default = 


(0, _justo.workflow)("Connection by Validator", function (params) {var _require, _require2;
  (_require = require("./ConnectionSync")).default.apply(_require, ["Synchronous connection"].concat(_toConsumableArray(params)));
  (_require2 = require("./ConnectionAsync")).default.apply(_require2, ["Asycnhronous connection"].concat(_toConsumableArray(params)));});