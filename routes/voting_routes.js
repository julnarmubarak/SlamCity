const express = require('express');
const router = express.Router();
const Controller = require('../controllers/votingController');
const {authenticateToken} = require("../middleware/authmiddleware")
router.get('/', Controller.getAll);
router.post('/', authenticateToken,Controller.create);
router.get('/:id', Controller.getOne);
router.put('/:id', Controller.update);
router.delete('/:id', Controller.delete);

module.exports = router;
