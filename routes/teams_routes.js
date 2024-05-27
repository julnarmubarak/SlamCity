const express = require("express");
const router = express.Router();
const Controller = require("../controllers/teamsController");
const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/authmiddleware");

router.get("/", Controller.getAll);
router.post("/GetMatchesOfTeam", Controller.GetMatchesOfTeam);

router.post("/", Controller.create);
router.get("/:id", Controller.getOne);
router.put("/:id", Controller.update);
router.delete("/:id", Controller.delete);

module.exports = router;
