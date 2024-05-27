const express = require('express');
const router = express.Router();
const Controller = require('../controllers/e_walletController');
const {authenticateToken} = require("../middleware/authmiddleware")

router.get('/', authenticateToken,Controller.getAll);
router.post('/', authenticateToken,Controller.create);
router.get('/:id', Controller.getOne);
router.delete('/:id', Controller.delete);

router.post('/updateAmount', Controller.updateAmount);
module.exports = router;
