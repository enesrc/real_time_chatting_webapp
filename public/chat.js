const socket = io.connect('http://localhost:3000');

const message = document.getElementById('message');
const sender = document.getElementById('sender');
const submitBtn = document.getElementById('submitBtn');
const joinBtn = document.getElementById('joinBtn');
const output = document.getElementById('output');
const feedback = document.getElementById('feedback');
const room = document.getElementById('room');

let roomCode = "general";

joinBtn.addEventListener('click', () => {
    if(room.value.length > 0){
        roomCode = room.value;
        socket.emit('join_room', {
            room: roomCode,
            sender: sender.value
        });

        // html-css
        joinBtn.style.display = 'none';
        leaveBtn.style.display = 'block';
        room.disabled = true;
        revertRoomInputToStandard();
    }
    else{
        room.classList.add('error');
        room.placeholder = "Oda adı girin...";
    }
});

leaveBtn.addEventListener('click', () => {
    socket.emit('leave_room', {
        room: roomCode,
        sender: sender.value
    });
    roomCode = "general";

    // html-css
    leaveBtn.style.display = 'none';
    joinBtn.style.display = 'block';
    room.value = '';
    room.disabled = false;
});

message.addEventListener('input', () => { 
    if(message.value.length < 1){
        socket.emit('cancel_typing', roomCode);
    }
    else if(sender.value.length > 0){
        socket.emit('typing', {
            room: roomCode,
            sender: sender.value
        });
    }
});

submitBtn.addEventListener('click', () => {
    if(sender.value.length < 1){
        sender.classList.add('error');
        sender.placeholder = "Adınızı girin...";
    }
    else if(message.value.length < 1) {
        message.classList.add('error');
        message.placeholder = "Mesajınızı girin...";
    }
    else{
        socket.emit('chat', {
            room: roomCode,
            message: message.value,
            sender: sender.value
        });
        revertMessageInputsToStandard();
    }
});

message.addEventListener('keypress', (event) => {
    if(event.key === "Enter"){
        if(sender.value.length < 1){
            sender.classList.add('error');
            sender.placeholder = "Adınızı girin...";
        }
        else if(message.value.length < 1) {
            message.classList.add('error');
            message.placeholder = "Mesajınızı girin...";
        }
        else{
            socket.emit('chat', {
                room: roomCode,
                message: message.value,
                sender: sender.value
            });
            revertMessageInputsToStandard();
        }
    }
});

socket.on('chat', data => {
    feedback.innerHTML = '';
    output.innerHTML += '<p><strong>' + data.sender + ': </strong>' + data.message + '</p>';
});

socket.on('typing', sender => {
    feedback.innerHTML = '<p><em>' + sender + ' yazı yazıyor...</em></p>';
});

socket.on('cancel_typing', () => {
    feedback.innerHTML = '';
});

socket.on('join_room', data => {
    output.innerHTML += '<p><em>' + data.sender + ', odaya katıldı.</em></p>';
});

socket.on('leave_room', data => {
    output.innerHTML += '<p><em>' + data.sender + ', odadan ayrıldı.</em></p>';
});

function revertMessageInputsToStandard() {
    message.value = '';
    message.placeholder = "Mesaj";
    message.classList.remove('error');
    sender.placeholder = "Adınız";
    sender.classList.remove('error');
}

function revertRoomInputToStandard() {
    room.placeholder = "Oda adı";
    room.classList.remove('error');
}