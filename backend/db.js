const Endee = require("../endee");

const db = new Endee.VectorStore({
  dimension: 384
});

module.exports = db;
