const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const POSTS_IMG_PATH = path.join('/uploads/posts/images');

const postSchema = new mongoose.Schema({
    imgpath:{
        type: String,
        required: true,
    },
    caption:{
        type: String
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    //include ID of all arrays
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ]
},{
    timestamps:true
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..',POSTS_IMG_PATH))
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })

//static methods
postSchema.statics.uploadedImg = multer({storage:storage}).single('post'); //upload single picture for post
postSchema.statics.imgPath = POSTS_IMG_PATH;

const Post = mongoose.model('Post', postSchema);
module.exports=Post;


