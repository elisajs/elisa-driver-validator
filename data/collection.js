//internal data
export const ECHO = {
  id: "Echo & the Bunnymen",
  year: 1978,
  origin: "Liverpool, England",
  disbanded: true,
  active: true,
  tags: ["alternative"]
};

export const JESUS = {
  id: "The Jesus and Mary Chain",
  year: 1983,
  origin: "East Kilbride, Scotland",
  disbanded: true,
  active: true,
  tags: []
};

export const NATIONAL = {
  id: "The National",
  year: 1999,
  origin: "Cincinnati, Ohio",
  disbanded: false,
  active: true,
  tags: null
};

export const MUMFORD = {
  id: "Mumford & Sons",
  year: 2007,
  origin: "London, England",
  disbanded: false,
  active: true,
  tags: ["alternative", "folk rock", "folk"]
};

export const NADA = {
  id: "Nada Surf",
  year: 1992,
  origin: "",
  disbanded: false,
  active: true,
  tags:  ["alternative"]
};

export const DAWES = {
  id: "Dawes",
  year: 2009,
  origin: "Los Angeles, CA",
  disbanded: false,
  active: true,
  tags: ["rock", "folk"]
};

export const BANDS = [JESUS, NATIONAL, MUMFORD, NADA, DAWES];
export const SORTED_ASC_BY_ID = [DAWES, MUMFORD, NADA, JESUS, NATIONAL];
export const SORTED_DESC_BY_ID = [NATIONAL, JESUS, NADA, MUMFORD, DAWES];
export const SORTED_ASC_BY_YEAR = [JESUS, NADA, NATIONAL, MUMFORD, DAWES];
export const SORTED_DESC_BY_YEAR = [DAWES, MUMFORD, NATIONAL, NADA, JESUS];
export const DISBANDED = [JESUS];
export const NON_DISBANDED = [NATIONAL, MUMFORD, NADA, DAWES];
export const NON_DISBANDED_SORTED_BY_ID = [DAWES, MUMFORD, NADA, NATIONAL];
export const YEAR_GE_2000 = [MUMFORD, DAWES];
export const YEAR_GT_2000 = [MUMFORD, DAWES];
export const YEAR_LE_2000 = [JESUS, NATIONAL, NADA];
export const YEAR_LT_2000 = [JESUS, NATIONAL, NADA];
export const YEAR_NOT_BETWEEN_1990_AND_1999 = [JESUS, MUMFORD, DAWES];
export const YEAR_BETWEEN_1990_AND_1999 = [NATIONAL, NADA];
export const ID_BETWEEN_L_AND_O = [MUMFORD, NADA];
export const ID_NOT_BETWEEN_L_AND_O = [JESUS, NATIONAL, DAWES];
export const ID_LIKE_A = [JESUS, NATIONAL, NADA, DAWES];
export const ID_NOT_LIKE_A = [MUMFORD];
export const ORIGIN_LIKE_L = [JESUS, MUMFORD, DAWES];
export const ORIGIN_NOT_LIKE_L = [NATIONAL, NADA];
export const ID_GE_M = [JESUS, NATIONAL, MUMFORD, NADA];
export const ID_GT_M = [JESUS, NATIONAL, MUMFORD, NADA];
export const ID_LE_M = [DAWES];
export const ID_LT_M = [DAWES];
export const ID_NOT_CONTAIN_W = [JESUS, NATIONAL, MUMFORD, NADA];
export const ID_CONTAIN_W = [DAWES];
export const ORIGIN_NOT_CONTAIN_LONDON = [JESUS, NATIONAL, NADA, DAWES];
export const ORIGIN_CONTAIN_LONDON = [MUMFORD];
export const TAGS_NOT_CONTAIN_FOLK = [JESUS, NATIONAL, NADA];
export const TAGS_CONTAIN_FOLK = [MUMFORD, DAWES];
