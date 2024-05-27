const express = require('express');
const router = express.Router();
const Controller = require('../controllers/playersController');

router.get('/', Controller.getAll);
router.post('/getPlayersOfTeam', Controller.getPlayersOfTeam);

router.post('/', Controller.create);
router.get('/:id', Controller.getOne);
router.put('/:id', Controller.update);
router.delete('/:id', Controller.delete);

module.exports = router;
