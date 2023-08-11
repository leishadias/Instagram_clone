const express=require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/users_controller');

router.get('/profile/:id',passport.checkAuthentication ,userController.profile);
router.post('/update/:id',passport.checkAuthentication ,userController.update);
router.get('/signup', userController.signup);
router.get('/signin', userController.signin);
router.get('/signout', userController.destroySession);
router.post('/create', userController.create);
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/signin'}
    ), userController.createSession);
router.get('/auth/google', passport.authenticate('google',{scope: ['profile','email']}));
router.get('/auth/google/callback', passport.authenticate('google',{failureRedirect: 'users/signin'}), userController.createSession);

module.exports=router;
