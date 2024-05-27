const pool = require("../db/dbconfig");

const tableName = "candidate";

const columns = [
  "candidate_id",
  "player_id",
];
const columnsWithoutId = columns.filter((ele) => ele != columns[0]);
const columnsWithoutIdStr = columnsWithoutId.join(", ");



exports.getAll = (req, res) => {
  const qry = `
    select candidate_id, player_id, pl.name player_name, t.name team_name, pl.number, pl.position 
    from  candidate  ca
    join players pl on ca.player_id = pl.p_id
    join teams_leagues tl on tl.team_league_id = pl.team_league_id
    join teams t on t.team_id  = tl.team_id
  `;
  pool.query(qry, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};


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
