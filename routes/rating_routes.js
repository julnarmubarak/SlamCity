const express = require('express');
const router = express.Router();
const Controller = require('../controllers/ratingController');
const {authenticateToken} = require("../middleware/authmiddleware")

router.get('/', authenticateToken, Controller.getAll);
router.post('/',  authenticateToken,  Controller.create);
router.get('/:id', Controller.getOne);
router.put('/:id', Controller.update);
router.delete('/:id', Controller.delete);

module.exports = router;
