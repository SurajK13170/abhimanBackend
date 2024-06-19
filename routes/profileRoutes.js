const { authenticateToken } = require('../Middleware/auth');
const express = require('express')
const {getprofile, getprofiles, postRequest, getAllRequests} = require("../controllers/profileController")
const router = express.Router();

router.get('/:userId',authenticateToken, getprofile);
router.get('/all',authenticateToken, getprofiles);
router.get('/sendRequest/:userId',authenticateToken, postRequest);
router.get('/requests',authenticateToken, getAllRequests);




module.exports = router;