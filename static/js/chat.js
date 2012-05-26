$(function() {
    var $login = $("#login"),
        $chat = $("#chat"),
        $messages = $("#messages");

    var socket = io.connect('/');

    socket.on('connect', function() {
        init();
    });

    var init = function() {
        $("#btn-enterroom").click(function(e) {
            if ( $.trim( $('#nickname').val() ) == '' ) {
                alert('Please enter your nickname.');
            } else {
                setNickname( $.trim($("#nickname").val()) );
            }
            e.preventDefault();
        });  
    };

    var setNickname = function(nickname) {
        socket.emit('set_nickname', nickname, function(is_available) {
            if (is_available) {
                console.log('Nickname' + nickname + " is available.");
                setUpChat(nickname)
            } else {
                console.log('Nickname' + nickname + " is not available.");
            }
        });
    };

    var setUpChat = function(nickname) {
        $login.hide();
        $chat.show();

        $("#btn-submitmessage").click(function(e) {
            sendMessage($("#message").val());
            $("#message").val('');
            e.preventDefault();
        });

        socket.on('user_new', function() {
            $("#clients-box ul").text("");
        });

        socket.on('user_connected', function(userid, data) {
            $("#clients-box ul").append("<li class=\"" + userid + "\">" + data + "</li>");
        });

        socket.on('user_disconnected', function(userid) {
            $("#clients-box ul li." + userid).remove();
        });

        socket.on('message', function(nickname, message) {
            addMessage(nickname, message);
        });

    };

    var sendMessage = function(msg) {
        socket.emit('message', msg);
    };

    var addMessage = function(nickname, message) {
        $messages.append($("<p><b>" + nickname + "</b>: " + message + "</p>"))
        $("#messages").scrollTop($("#messages")[0].scrollHeight);
    };

});