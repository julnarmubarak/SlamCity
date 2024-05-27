const pool = require("../db/dbconfig");

const tableName = "ticket";

const columns = ["t_id", "u_id", "m_id", "seat_number", "created_at"];
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
exports.getBookedSeatsOfMatch = (req, res) => {
  const match_id = req.body.match_id;

  const qry = `
  SELECT
  ml.seat_columns,
  ml.seat_rows,
  ml.seat_price,
  GROUP_CONCAT(t.seat_number) AS booked_seats
  FROM match_details md 
  join match_location ml on ml.match_location_id = md.match_location_id
  left JOIN
  ticket t ON t.m_id = md.match_id
  where md.match_id = ${match_id}
  GROUP BY
  md.match_id;
  `;
  pool.query(qry, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};
exports.getBookedSeatsOfUser = (req, res) => {
  const u_id = req.user.u_id;

  const qry = `
      SELECT distinct ci.name as city_name, ml.name as stadium_name, ml.seat_price, 
      ll.name as league_name,  md.date, md.time,  
      t1.name as team_1_name, t2.name as team_2_name, t.seat_number, md.finished, t.t_id
      FROM ticket t
      join match_details md on md.match_id = t.m_id
      join teams_leagues tl1 on tl1.team_league_id = md.team_league_id_1
      join teams_leagues tl2 on tl2.team_league_id = md.team_league_id_2
      join leagues ll on ll.league_id = md.league_id
      join teams t1 on t1.team_id = tl1.team_id
      join teams t2 on t2.team_id = tl2.team_id
      join match_location ml on ml.match_location_id = md.match_location_id
      join city ci on ci.city_id =  ml.city_id
      
      where t.u_id = ${u_id}
  `;
  pool.query(qry, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

const executeQuery = (qry) =>
  new Promise((resolve, reject) => {
    pool.query(qry, (err, results) => {
      if (err) {
        reject(err.message);
      }
      resolve(results);
    });
  });

const getuserMoney = (user_id) =>
  new Promise((resolve, reject) => {
    const qry = `SELECT amount FROM e_wallet where u_id='${user_id}' `;
    pool.query(qry, (err, results) => {
      if (err) {
        return reject({ error: err.message });
      }
      if (!results || results.length == 0 || !results[0].amount) {
        return reject({ message: "You don't have a wallet" });
      }
      resolve(results);
    });
  });
exports.create = async (req, res) => {
  let qry = "";
  const u_id = req.user.u_id;
  const total_price = req.body.total_price;
  const ussss = await getuserMoney(u_id);
  const user_money = ussss[0].amount;

  if (user_money < total_price) {
    return res.status(500).json({ error: "You don't have enough money" });
  }
  const seat_numbers = JSON.parse(req.body.seat_numbers);
  const m_id = req.body.m_id;
  try {
    for (let i = 0; i < seat_numbers.length; i++) {
      qry = `insert into ticket (u_id, m_id,seat_number) values (${u_id}, ${m_id}, ${seat_numbers[i]});`;
      const results = await executeQuery(qry);
    }

    qry = `update e_wallet set amount= ${
      parseFloat(user_money) - parseFloat(total_price)
    } where u_id = ${u_id}`;
    const resultssss = await executeQuery(qry);
    res.status(201).json({ success: true });
  } catch (ex) {
    return res.status(500).json({ error: ex.message });
  }
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
  const t_id  = req.body.t_id;
  pool.query(
    `Delete  FROM ${tableName} WHERE t_id = ${t_id}`,
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Ticket deleted successfully", success: true });
    }
  );
};
