const express = require('express');
const router = express.Router();
const Controller = require('../controllers/booking');

router.get('/', Controller.getAll);
router.post('/', Controller.create);
router.get('/:id', Controller.getOne);
router.put('/:id', Controller.update);
router.delete('/:id', Controller.delete);

module.exports = router;
