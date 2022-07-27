const socket = io();

const chatForm = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages');
const usersList = document.getElementById('users');
const roomName = document.getElementById('room-name');

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

socket.emit('joinRoom', { username, room });

socket.on('message', (message) => {
    outputMessage(message);
    //scroll down
    chatMessage.scrollTop = chatMessage.scrollHeight;
});

socket.on('usersRoom', ({ room, users }) => {
    outputUsers(users);
    outputRoomName(room);
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    socket.emit('chatMessage', msg);
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

function outputMessage(message) {
    /*const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);*/
    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;
    p.innerHTML += `<span>${message.time}</span>`;
    div.appendChild(p);
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.text;
    div.appendChild(para);
    document.querySelector('.chat-messages').appendChild(div);
}

function outputUsers(users) {
    usersList.innerHTML = '';
    users.map((user) => {
        const li = document.createElement('li');
        li.innerText = user.username;
        usersList.appendChild(li);
    });
}

function outputRoomName(room) {
    roomName.innerText = room;
}
