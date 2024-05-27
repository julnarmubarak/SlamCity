const pool = require("../db/dbconfig");

const tableName = "players";

const columns = [
  "p_id",
  "team_league_id",
  "name",
  "position",
  "number",
  "created_at",
  "updated_at",
];
const columnsWithoutId = columns.filter((ele) => ele != columns[0]);
const columnsWithoutIdStr = columnsWithoutId.join(", ");
exports.getAll = (req, res) => {
  const qry = `SELECT * FROM ${tableName} `;
  pool.query(qry, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};
exports.getPlayersOfTeam = (req, res) => {
  const team_league_id = req.body.team_league_id;
  const qry = `SELECT p_id, name, position, number
              FROM players p
              WHERE p.team_league_id = ${team_league_id}`;
  pool.query(qry, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

// exports.getPlayersStatistics = (req,res) => {
//   const p_id = req.body.p_id;
//   const qry =

// };

exports.create = (req, res) => {
  const values = [];
  let questionMarks = "";

  columnsWithoutId.forEach((col) => {
    values.push(req.body[col]);
    questionMarks += "?, ";
  });
  questionMarks = questionMarks.slice(0, -2);

  pool.query(
    `INSERT INTO  ${tableName} (${columnsWithoutIdStr}) VALUES (${questionMarks})`,
    values,
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: results.insertId });
    }
  );
};

exports.getOne = (req, res) => {
  const { id } = req.params;
  pool.query(
    `SELECT * FROM ${tableName} WHERE ${columns[0]} = ?`,
    [id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results[0]);
    }
  );
};

exports.update = (req, res) => {
  const { id } = req.params;

  let str = "";
  columnsWithoutId.forEach((col) => {
    if (req.body[col]) str += ` ${col} = '${req.body[col]}' , `;
  });
  str = str.slice(0, -2);

  console.log("str: ", str);
  console.log(`UPDATE ${tableName} SET ${str} WHERE ${columns[0]} = ?`);

  pool.query(
    `UPDATE ${tableName} SET ${str} WHERE ${columns[0]} = ?`,
    [id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Employee updated successfully" });
    }
  );
};

exports.delete = (req, res) => {
  const { id } = req.params;
  pool.query(
    `DELETE FROM employees WHERE ${columns[0]} = ?`,
    [id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Employee deleted successfully" });
    }
  );
};
