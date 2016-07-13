"use strict";Object.defineProperty(exports, "__esModule", { value: true });
var ECHO = exports.ECHO = { 
  id: "Echo & the Bunnymen", 
  year: 1978, 
  origin: "Liverpool, England", 
  disbanded: true, 
  active: true, 
  tags: ["alternative"] };


var JESUS = exports.JESUS = { 
  id: "The Jesus and Mary Chain", 
  year: 1983, 
  origin: "East Kilbride, Scotland", 
  disbanded: true, 
  active: true, 
  tags: [] };


var NATIONAL = exports.NATIONAL = { 
  id: "The National", 
  year: 1999, 
  origin: "Cincinnati, Ohio", 
  disbanded: false, 
  active: true, 
  tags: null };


var MUMFORD = exports.MUMFORD = { 
  id: "Mumford & Sons", 
  year: 2007, 
  origin: "London, England", 
  disbanded: false, 
  active: true, 
  tags: ["alternative", "folk rock", "folk"] };


var NADA = exports.NADA = { 
  id: "Nada Surf", 
  year: 1992, 
  origin: "", 
  disbanded: false, 
  active: true, 
  tags: ["alternative"] };


var DAWES = exports.DAWES = { 
  id: "Dawes", 
  year: 2009, 
  origin: "Los Angeles, CA", 
  disbanded: false, 
  active: true, 
  tags: ["rock", "folk"] };


var BANDS = exports.BANDS = [JESUS, NATIONAL, MUMFORD, NADA, DAWES];
var SORTED_ASC_BY_ID = exports.SORTED_ASC_BY_ID = [DAWES, MUMFORD, NADA, JESUS, NATIONAL];
var SORTED_DESC_BY_ID = exports.SORTED_DESC_BY_ID = [NATIONAL, JESUS, NADA, MUMFORD, DAWES];
var SORTED_ASC_BY_YEAR = exports.SORTED_ASC_BY_YEAR = [JESUS, NADA, NATIONAL, MUMFORD, DAWES];
var SORTED_DESC_BY_YEAR = exports.SORTED_DESC_BY_YEAR = [DAWES, MUMFORD, NATIONAL, NADA, JESUS];
var DISBANDED = exports.DISBANDED = [JESUS];
var NON_DISBANDED = exports.NON_DISBANDED = [NATIONAL, MUMFORD, NADA, DAWES];
var NON_DISBANDED_SORTED_BY_ID = exports.NON_DISBANDED_SORTED_BY_ID = [DAWES, MUMFORD, NADA, NATIONAL];
var YEAR_GE_2000 = exports.YEAR_GE_2000 = [MUMFORD, DAWES];
var YEAR_GT_2000 = exports.YEAR_GT_2000 = [MUMFORD, DAWES];
var YEAR_LE_2000 = exports.YEAR_LE_2000 = [JESUS, NATIONAL, NADA];
var YEAR_LT_2000 = exports.YEAR_LT_2000 = [JESUS, NATIONAL, NADA];
var YEAR_NOT_BETWEEN_1990_AND_1999 = exports.YEAR_NOT_BETWEEN_1990_AND_1999 = [JESUS, MUMFORD, DAWES];
var YEAR_BETWEEN_1990_AND_1999 = exports.YEAR_BETWEEN_1990_AND_1999 = [NATIONAL, NADA];
var ID_BETWEEN_L_AND_O = exports.ID_BETWEEN_L_AND_O = [MUMFORD, NADA];
var ID_NOT_BETWEEN_L_AND_O = exports.ID_NOT_BETWEEN_L_AND_O = [JESUS, NATIONAL, DAWES];
var ID_LIKE_A = exports.ID_LIKE_A = [JESUS, NATIONAL, NADA, DAWES];
var ID_NOT_LIKE_A = exports.ID_NOT_LIKE_A = [MUMFORD];
var ORIGIN_LIKE_L = exports.ORIGIN_LIKE_L = [JESUS, MUMFORD, DAWES];
var ORIGIN_NOT_LIKE_L = exports.ORIGIN_NOT_LIKE_L = [NATIONAL, NADA];
var ID_GE_M = exports.ID_GE_M = [JESUS, NATIONAL, MUMFORD, NADA];
var ID_GT_M = exports.ID_GT_M = [JESUS, NATIONAL, MUMFORD, NADA];
var ID_LE_M = exports.ID_LE_M = [DAWES];
var ID_LT_M = exports.ID_LT_M = [DAWES];
var ID_NOT_CONTAIN_W = exports.ID_NOT_CONTAIN_W = [JESUS, NATIONAL, MUMFORD, NADA];
var ID_CONTAIN_W = exports.ID_CONTAIN_W = [DAWES];
var ORIGIN_NOT_CONTAIN_LONDON = exports.ORIGIN_NOT_CONTAIN_LONDON = [JESUS, NATIONAL, NADA, DAWES];
var ORIGIN_CONTAIN_LONDON = exports.ORIGIN_CONTAIN_LONDON = [MUMFORD];
var TAGS_NOT_CONTAIN_FOLK = exports.TAGS_NOT_CONTAIN_FOLK = [JESUS, NATIONAL, NADA];
var TAGS_CONTAIN_FOLK = exports.TAGS_CONTAIN_FOLK = [MUMFORD, DAWES];