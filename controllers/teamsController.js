const pool = require("../db/dbconfig");

const tableName = "teams";
const columns = ["team_id", "name", "photo_path", "created_at", "updated_at"];

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
exports.GetMatchesOfTeam = (req, res) => {
  const team_league_id = req.body.team_league_id;
  const qry = `
    SELECT me.match_id ,me.date, me.time, me.link, me.result, 
    me.team1_score, me.team2_score, 
    t1.team_id t1_id, t2.team_id t2_id , 
    t1.name as t1_name, t1.photo_path as t1_photo, 
    t2.name as t2_name, t2.photo_path as t2_photo,
    me.finished
    FROM match_details me 
    join teams_leagues tl1 on tl1.team_league_id = me.team_league_id_1
    join teams t1 on t1.team_id =  tl1.team_id 
    join teams_leagues tl2 on tl2.team_league_id = me.team_league_id_2 
    join teams t2 on t2.team_id = tl2.team_id 
    WHERE tl1.team_league_id = ${team_league_id} or 
    tl2.team_league_id = ${team_league_id}
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
