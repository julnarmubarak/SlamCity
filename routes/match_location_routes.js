const express = require('express');
const router = express.Router();
const Controller = require('../controllers/match_locationController');

router.get('/', Controller.getAll);
router.post('/', Controller.create);
router.post('/getMatchStadium', Controller.getMatchStadium);
router.get('/:id', Controller.getOne);
router.put('/:id', Controller.update);
router.delete('/:id', Controller.delete);

module.exports = router;
