const express=require('express');
const router = express.Router();

const followerController = require('../controllers/followers_controller');

router.get('/create', followerController.create);
router.get('/destroy', followerController.destroy);

module.exports=router;
