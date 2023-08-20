const express=require('express');
const router = express.Router();
const homeController = require('../controllers/home_controller');
const exploreController = require('../controllers/explore_controller');

router.get('/', homeController.home);
router.get('/explore', exploreController.explore);
router.use('/users', require('./users'));
router.use('/posts', require('./posts'));
router.use('/comments', require('./comments'));
router.use('/api', require('./api'));
router.use('/likes', require('./likes'));
router.use('/follower', require('./follower'));
router.use('/messages',require('./messages'));


module.exports=router;
