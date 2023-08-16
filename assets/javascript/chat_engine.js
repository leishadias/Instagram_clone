let chatArea = $(".chat-room-display");
let selfUser;
let userMail;
let otherUser;
let currentChatRoom;
let roomList = [];

var socket = io.connect("http://localhost:5000");
socket.on("connect", function () {
  console.log("connection established using sockets...!");
});



function joinRoom() {
  socket.emit("join_room", {
    user_email: userMail,
    chatroom: currentChatRoom,
  });

  socket.on("user_joined", function (data) {
    console.log("New User Joined", data);
  });
}

var sendMessage = () => {
  function activateMessageSending() {
    let inputBox = $(".chat-message-input");
    let msg = inputBox.val();

    if (msg != "") {
      socket.emit("send_message", {
        message: msg,
        user_id: selfUser._id,
        user_email: userMail,
        chatroom: currentChatRoom,
      });

      inputBox.val("");
    }
  }

  $("#send-message").click(activateMessageSending); // click action

  $("input").keydown(function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      activateMessageSending();
    }
  });
};

function connectRoom() {
  
  if (!roomList.includes(currentChatRoom)) {
    joinRoom();
    roomList.push(currentChatRoom);
  }

  sendMessage();
}

socket.on("receive_message", function (data) {
  let messageList = $(`#chat-messages-list-${currentChatRoom}`);
  let messageType = "other";

  if (data.user_email === userMail) {
    messageType = "self";
  }

  if (messageType === "self") {
    messageList.append(
      ` <div class="self-message">
          <div class="self-user">
            <div class="message-content-self">${data.message}</div>
          </div>
        </div>
      `
    );
  } else {
    messageList.append(`
     <div class="other-message">
          <div class="other-user">
            <div class="other-user-image">
              ${
                otherUser.avatar
                  ? `<img
            src="${otherUser.avatar}"
            alt="image"
          />`
                  : `<img
            src="/images/codeial-default-avatar2.png"
            alt="image"
          />`
              }
            </div>
            <div class="message-content-other">${data.message}</div>
          </div>
        </div>
    `);
  }
  scrollBottom();
});

function createArea(chatRoom, follower, user) {
  return `
  <div class="user-chat-box">
      <div class="chat-header">
        <div class="header-avatar">
        ${
          follower.avatar
            ? `<img
            src="${follower.avatar}"
            alt="image"
          />`
            : `<img
            src="/images/codeial-default-avatar2.png"
            alt="image"
          />`
        }
        </div>
        <div class="header-name">${follower.name}</div>
      </div>
      <div class="chat-messages-list-style" id="chat-messages-list-${
        chatRoom._id
      }">

      ${chatRoom.messages
        .map((chat) => {
          return `${
            chat.user === user._id
              ? `<div class="self-message">
          <div class="self-user">
            <div class="message-content-self">${chat.message}</div>
          </div>
        </div>`
              : `<div class="other-message">
          <div class="other-user">
            <div class="other-user-image">
              ${
                follower.avatar
                  ? `<img
            src="${follower.avatar}"
            alt="image"
          />`
                  : `<img
            src="/images/codeial-default-avatar2.png"
            alt="image"
          />`
              }
            </div>
            <div class="message-content-other">${chat.message}</div>
          </div>
        </div>`
          }`;
        })
        .join("")}
      </div>
      <div class="chat-message-input-container">
        <input class="chat-message-input" placeholder="Type message here" required/>
        <button id="send-message">Send
        </button>
      </div>
    </div>`;
}

$(".chat-list").each(function () {
  $(this).click(function () {
    const followerId = $(this).attr("data-followerId");
    console.log("followerId",followerId);
    $.ajax({
      type: "GET",
      url: `/messages/chatroom/?follower=${followerId}`,

      success: function (data) {
        let { chatRoom, follower, user } = data.data;
        let room = createArea(chatRoom, follower, user);
        chatArea.empty();
        chatArea.append(room);
        scrollBottom();

        selfUser = user;
        otherUser = follower;
        currentChatRoom = chatRoom._id;
        userMail = user.email;

        connectRoom();
        changeScreen();
        // arrow();
        tempClass(followerId);
      },
      error: function (error) {
        console.log(error.responseText);
      },
    });
  });
});

// function arrow() {
//   $(".back-button").click(() => {
//     $(".chat-room-display").css("display", "none");
//     $("#chat-user-list").css({ display: "block", width: "100%" });
//   });
// }

function changeScreen() {
  if (window.innerWidth <= 430) {
    $(".chat-room-display").css({ display: "block", width: "100%" });
    $("#chat-user-list").css("display", "none");
  }
}

function scrollBottom() {
  let list = document.getElementsByClassName("chat-messages-list-style")[0];
  list.scrollTop = list.scrollHeight;
}

function tempClass(followerId) {
  $("#roomlist > div").removeClass("temporary-highlight");
  $(`#follower-${followerId}`).addClass("temporary-highlight");
}

// class ChatEngine{
//     constructor(chatBoxId, userEmail){
//         this.chatBox = $(`#${chatBoxId}`);
//         this.userEmail = userEmail;

//         this.socket = io.connect('http://localhost:5000');

//         if (this.userEmail){
//             this.connectionHandler();
//         }

//     }

//     connectionHandler(){
//         let self = this;

//         this.socket.on('connect', function(){
//             console.log('connection established using sockets...!');


//             self.socket.emit('join_room', {
//                 user_email: self.userEmail,
//                 chatroom: 'codeial'
//             });

//             self.socket.on('user_joined', function(data){
//                 console.log('a user joined!', data);
//             })


//         });

//         $('#send-message').click(function(){
//             let msg = $('#chat-message-input').val();

//             if (msg != ''){
//                 self.socket.emit('send_message', {
//                     message: msg,
//                     user_email: self.userEmail,
//                     chatroom: 'codeial'
//                 });
//             }
//         });

//         this.socket.on('receive_message', function(data){
//             console.log('message received!');
//             let newMessage = $('<li>');

//             let messageType = 'other-message';

//             if (data.user_email == self.userEmail){
//                 messageType = 'self-message';
//             }

//             newMessage.append($('<span>', {
//                 'html': data.message
//             }));

//             newMessage.append($('<sub>', {
//                 'html': data.user_email
//             }));

//             newMessage.addClass(messageType);

//             $('#chat-messages-list').append(newMessage);
//         });
//     }

    
// }