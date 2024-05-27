const pool = require("../db/dbconfig");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const tableName = "user";
const columns = [
  "u_id",
  "r_id",
  "F_name",
  "L_name",
  "password",
  "email",
  "gender",
  "age",
  "created_at",
  "updated_at",
  "is_deleted",
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

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const qry = `SELECT 
              u_id, r_id, email, F_name, L_name, password 
              FROM ${tableName} where email='${email}' `;
  pool.query(qry, async (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!results || results.length == 0) {
      return res.status(400).json({ error: "User or password are wrong" });
    }
    const user = results[0];
    if (await bcrypt.compare(password, user.password)) {
      const accessToken = jwt.sign(
        { u_id: user.u_id, email: user.email, r_id: user.r_id },
        process.env.ACCESS_TOKEN_SECRET
      );
      res.json({
        accessToken: accessToken,
        full_name: user.F_name + " " + user.L_name,
        r_id: user.r_id
      });
    } else {
      return res.status(400).json({ error: "User or password are wrong" });
    }
  });
};

const createUser = async (req, res, r_id) =>
  new Promise(async (resolve, reject) => {
    const values = [];
    let questionMarks = "";
    const notEnteredFields = [];

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body["password"], salt);

    req.body["password"] = hashedPassword;
    req.body["r_id"] = r_id;

    columnsWithoutId.forEach((col) => {
      values.push(req.body[col]);
      questionMarks += "?, ";
    });
    questionMarks = questionMarks.slice(0, -2);

    pool.query(
      `INSERT INTO  ${tableName} (${columnsWithoutId
        .filter((ele) => !notEnteredFields.includes(ele))
        .join(", ")}) VALUES (${questionMarks})`,
      values,
      (err, results) => {
        if (err) {
          resolve(res.status(500).json({ error: err.message }));
        }
        const accessToken = jwt.sign(
          { u_id: results.insertId, email: req.body.email, r_id: r_id },
          process.env.ACCESS_TOKEN_SECRET
        );
        resolve(res.json({ accessToken }));
      }
    );
  });

exports.createAdmin = async (req, res) => {
  const tt = await createUser(req, res, 1);
  return tt;
};
exports.createCustomer = async (req, res) => {
  return await createUser(req, res, 2);
};
exports.createEmployee = async (req, res) => {
  return await createUser(req, res, 3);
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


exports.getCustomersHaveWallet = (req,res) =>{
  const qry = `
    select ew.ew_id, ew.amount , CONCAT(F_name, ' ', L_name) AS full_name
    from user u    
    inner join e_wallet ew on ew.u_id = u.u_id   
    where r_id = 2
  `;

  pool.query(qry, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
}
exports.getCustomers = (req,res) =>{
  const qry = `
    select u_id , CONCAT(F_name, ' ', L_name) AS full_name
    from user   where r_id = 2
  `;

  pool.query(qry, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
}