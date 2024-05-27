const express = require('express');
const router = express.Router();
const Controller = require('../controllers/match_detailsController');

router.get('/', Controller.getAll);
router.get('/getUnplayedMatches', Controller.getUnplayedMatches);
router.get('/getPlayedMatches', Controller.getPlayedMatches);

router.post('/getMatchesOfLeague', Controller.getMatchesOfLeague);
router.post('/getPlayedMatchesOfLeague', Controller.getPlayedMatchesOfLeague);

router.post('/getPlayedMatchesOfTeam', Controller.getPlayedMatchesOfTeam);

router.post('/', Controller.create);
router.get('/:id', Controller.getOne);
router.put('/:id', Controller.update);
router.delete('/:id', Controller.delete);

module.exports = router;
