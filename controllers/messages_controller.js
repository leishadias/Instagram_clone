const User = require("../models/user");
const Chatroom = require("../models/chatroom");

module.exports.userChats = async function (req, res) {
  try {
    let follower;
    if (req.user) {
      follower = await User.findById(req.user._id)
      .populate(
        "following",
        "name email avatar"
      );
    }
    return res.render("chats", {
      title: "chats",
      followers: follower
    });
  } catch (err) {
    console.log("ERROR", err);
    return;
  }
};

module.exports.chatRoom = async function (req, res) {
  try {
    if (req.xhr) {
      let user = await User.findById(req.user._id).select("name email avatar");

      let follower = await User.findById(req.query.follower).select(
        "name email avatar"
      );
        console.log("follower",follower);
      let chatRoom;

      chatRoom = await Chatroom.findOne({
        user1: user._id,
        user2: follower._id,
      }).populate("messages");
      if (chatRoom == undefined) {
        chatRoom = await Chatroom.findOne({
          user1: follower._id,
          user2: user._id,
        }).populate("messages");
      }

      if (chatRoom == undefined) {
        chatRoom = await Chatroom.create({
          user1: user._id,
          user2: follower._id,
        });
      }

      return res.status(200).json({
        data: {
          chatRoom,
          follower,
          user,
        },
        message: "SUCCESS",
      });
    } else {
      return res.redirect("back");
    }
  } catch (err) {
    console.log("ERROR", err);
    return;
  }
};
