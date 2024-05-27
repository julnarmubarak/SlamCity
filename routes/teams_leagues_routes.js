const express = require('express');
const router = express.Router();
const Controller = require('../controllers/teams_leaguesController');

router.get('/', Controller.getAll);
router.post('/getTeamsOfLeague', Controller.getTeamsOfLeague);
router.post('/', Controller.create);
router.get('/:id', Controller.getOne);
router.put('/:id', Controller.update);
router.delete('/:id', Controller.delete);

module.exports = router;
