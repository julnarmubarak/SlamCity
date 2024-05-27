const express = require('express');
const router = express.Router();
const Controller = require('../controllers/UserController');
const {authenticateToken} = require("../middleware/authmiddleware")

router.post('/login', Controller.login);
router.post('/createCustomer', Controller.createCustomer);
router.post('/createAdmin', authenticateToken, Controller.createAdmin);
router.post('/createEmployee', authenticateToken,Controller.createEmployee);
router.get('/getCustomers', authenticateToken,Controller.getCustomers);
router.get('/getCustomersHaveWallet', authenticateToken,Controller.getCustomersHaveWallet);


// router.post('/', Controller.create);
// router.get('/:id', Controller.getOne);
// router.put('/:id', Controller.update);
// router.delete('/:id', Controller.delete);

module.exports = router;
