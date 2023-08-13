const express=require('express');
const router = express.Router();
const postController = require('../controllers/posts_controller');
const passport = require('passport');

router.post('/create', passport.checkAuthentication, postController.create);
router.get('/destroy/:id', passport.checkAuthentication, postController.destroy);
router.get('/create-new-post', postController.createPost);


module.exports=router;