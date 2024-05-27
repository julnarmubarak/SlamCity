const express = require('express');
const router = express.Router();
const Controller = require('../controllers/ticketController');
const { authenticateToken } = require('../middleware/authmiddleware');

router.get('/', Controller.getAll);
router.post('/', authenticateToken, Controller.create);
router.post('/getBookedSeatsOfMatch'  , Controller.getBookedSeatsOfMatch);
router.post('/getBookedSeatsOfUser' ,authenticateToken , Controller.getBookedSeatsOfUser);
router.get('/:id', Controller.getOne);
router.put('/:id', Controller.update);
router.post('/delete', authenticateToken,Controller.delete);

module.exports = router;
