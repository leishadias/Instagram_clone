const express=require('express');
const router = express.Router();

const chatsController = require('../controllers/chats_controller');

router.get('/inbox', chatsController.inbox);

module.exports=router;