const pool = require("../db/dbconfig");

const tableName = "match_details";

const columns = [
  "match_id",
  "league_id",
  "match_location_id",
  "time",
  "team_league_id_1",
  "team_league_id_2",
  "team1_score",
  "team2_score",
  "date",
  "finished",

  "link",
  "result",

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

exports.getPlayedMatchesOfTeam = (req, res) => {
  const team_league_id = req.body.team_league_id;
  const qry = `select 
  md.match_id,
  ci.name city_name, ml.name as stadium_name,  
  md.date, md.time,
   t1.name as team_1_name, t2.name as team_2_name 
  from match_details md 
  join leagues l on md.league_id = l.league_id
  join match_location ml on md.match_location_id = ml.match_location_id
  join city ci on ci.city_id = ml.city_id
  join teams_leagues tl1 on tl1.team_league_id = md.team_league_id_1
  join teams t1 on tl1.team_id = t1.team_id
  join teams_leagues tl2 on tl2.team_league_id = md.team_league_id_2
  join teams t2 on tl2.team_id = t2.team_id
  where (tl1.team_league_id = ${team_league_id} or tl2.team_league_id = ${team_league_id} ) 
  and md.finished = True
  `;
  pool.query(qry, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};
exports.getPlayedMatchesOfLeague = (req, res) => {
  const league_id = req.body.league_id;
  const qry = `
  select finished, team2_score, team1_score, match_id,team_league_id_1 as team_1, team_league_id_2 as team_2, result
  from match_details md
  where md.finished = 1 and md.league_id = ${league_id}
  `;
  pool.query(qry, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

exports.getMatchesOfLeague = (req, res) => {
  const league_id = req.body.league_id;
  const qry = `select 
  md.match_id,
  ci.name city_name, ml.name as stadium_name,  
  md.date, md.time,
   t1.name as team_1_name, t2.name as team_2_name 
  from match_details md 
  join leagues l on md.league_id = l.league_id
  join match_location ml on md.match_location_id = ml.match_location_id
  join city ci on ci.city_id = ml.city_id
  join teams_leagues tl1 on tl1.team_league_id = md.team_league_id_1
  join teams t1 on tl1.team_id = t1.team_id
  join teams_leagues tl2 on tl2.team_league_id = md.team_league_id_2
  join teams t2 on tl2.team_id = t2.team_id
  where l.league_id = ${league_id}
  `;
  pool.query(qry, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

exports.getUnplayedMatches = (req, res) => {
  const qry = `select ci.name, ml.name,  md.date, md.time, t1.name, t2.name 
  from match_details md 
  join leagues l on md.league_id = l.league_id
  join match_location ml on md.match_location_id = ml.match_location_id
  join city ci on ci.city_id = ml.city_id
  join teams_leagues tl1 on tl1.team_league_id = md.team_league_id_1
  join teams t1 on tl1.team_id = t1.team_id
  join teams_leagues tl2 on tl2.team_league_id = md.team_league_id_2
  join teams t2 on tl2.team_id = t2.team_id
  where md.finished = 0
  `;
  pool.query(qry, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

exports.getPlayedMatches = (req, res) => {
  const qry = `
  select ci.name, ml.name,  md.date, md.time, t1.name, t2.name 
  from match_details md 
  join leagues l on md.league_id = l.league_id
  join match_location ml on md.match_location_id = ml.match_location_id
  join city ci on ci.city_id = ml.city_id
  join teams_leagues tl1 on tl1.team_league_id = md.team_league_id_1
  join teams t1 on tl1.team_id = t1.team_id
  join teams_leagues tl2 on tl2.team_league_id = md.team_league_id_2
  join teams t2 on tl2.team_id = t2.team_id
    where md.finished = 1
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
  //req.body.team2_score
  //eq.body.team1_score
  console.log("hello: ")

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

  let str2 = "";

  columnsWithoutId.forEach((col) => {
    if (req.body[col] || col == "result") {
      str2 += ` ${col} = '${req.body[col]}' , `;
    }
  });

  str = str2.slice(0, -2);
  console.log("id: ", id);

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
