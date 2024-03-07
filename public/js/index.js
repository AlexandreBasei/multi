const player = {
    host: false,
    roomId: null,
    username: "",
    socketId: "",
    turn: false,
    win: false
}

const socket = io();

const form = document.getElementById("form");
const usernameInput = document.getElementById("username");

const userCard = document.getElementById("user-card");
const gameCard = document.getElementById("game-card");

const waitingArea = document.getElementById("waiting-area");
const restartArea = document.getElementById('restart-area');

const roomsCard = document.getElementById('rooms-card');
const roomsList = document.getElementById('rooms-list');

const turnMessage = document.getElementById('turn-message');

let ennemyUsername = "";

socket.emit('get rooms');
socket.on('list rooms', (rooms) => {
    let html = "";

    if (rooms.length > 0) {
        rooms.forEach(room => {
            if (room.players.length !== 2) {
                html += `<li class="list-group-item d-flex justify-content-between">
                    <p class="p-0 m-0 flex-grow-1 fw-bold">${room.players[0].username}'s Room - ${room.id}</p>
                    <button class="btn btn-sm btn-success join-room" data-room="${room.id}">Join</button>
                </li>`;
            }
        });
    }

    if (html !== "") {
        roomsCard.classList.remove('d-none');
        roomsList.innerHTML = html;

        for (const element of document.getElementsByClassName('join-room')) {
            element.addEventListener('click', joinRoom, false)
        }
    }
})

form.addEventListener('submit', (e) => {
    e.preventDefault();

    player.username = usernameInput.value;
    player.host = true;
    player.turn = true;
    player.socketId = socket.id;

    userCard.hidden = true;
    waitingArea.classList.remove("d-none");
    roomsCard.classList.add('d-none');

    socket.emit('playerData', player);
});

socket.on('start game', (players) => {
    startGame(players);
})


//Adapté que pour 2 joueurs pour l'instant
socket.on('play', (ennemyPlayer) => {
    if (ennemyPlayer.socketId !== player.socketId && !ennemyPlayer.turn) {
        //Ici gestion du jeu
    }
})

const startGame = () => {
    restartArea.classList.add('d-none');
    waitingArea.classList.add('d-none');
    gameCard.classList.remove('d-none');
    turnMessage.classList.remove('d-none');

    const ennemyPlayer = players.find(p => p.socketId != player.socketId);
    ennemyUsername = ennemyPlayer.username;

    if (player.host && player.turn) {
        setTurnMessage('alert-info','alert-success',"It's your turn !");
    }
    else {
        setTurnMessage('alert-success','alert-info', `It's <b>${ennemyPlayer.username}</b>'s turn !`);
    }
}

const setTurnMessage = (classToRemove, classToAdd, html) => {
    turnMessage.classList.remove(classToRemove);
    turnMessage.classList.add(classToAdd);
    turnMessage.innerHTML = html;
}

const joinRoom = () => {
    if (usernameInput.value !== "") {
        player.username = usernameInput.value;
        player.socketId = socket.id;
        player.roomId = this.dataset.room;

        socket.emit('playerData', player);
        userCard.hidden = true;
        waitingArea.classList.remove('d-none');
        roomsCard.classList.add('d-none');
    }
}