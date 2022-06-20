import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js";
import {
    getDatabase,
    ref,
    set,
    onValue,
    child,
    push,
    update,
} from "https://www.gstatic.com/firebasejs/9.8.3/firebase-database.js";

const db = getDatabase();

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
function randomFrom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

const usernameslot = document.getElementById("username");

function createRoom() {
    let roomID =
        randomFrom(alphabet) +
        randomFrom(alphabet) +
        randomFrom(alphabet) +
        randomFrom(alphabet);
    let roomhost = usernameslot.value;
    console.log("host: " + usernameslot.value, "room ID: " + roomID);
    set(ref(db, "rooms/" + roomID), {
        host: roomhost,
        msgs: null,
        players: 1,
    });
    postMsg(roomID, "SNIPLASH", "Room " + roomID + " now active!");
    location.href = `/room.html?username=${usernameslot.value}&roomid=${roomID}`;
}

function joinRoom() {
    const roomID = document.getElementById("roomcode").value.toUpperCase();
    console.log(usernameslot.value, roomID);
    location.href = `/room.html?username=${usernameslot.value}&roomid=${roomID}`;
}

document
    .getElementById("createroombutton")
    .addEventListener("click", createRoom);

document.getElementById("joinroombutton").addEventListener("click", joinRoom);

function postMsg(roomID, username, msg) {
    const date = new Date();
    set(ref(db, "rooms/" + roomID + "/msgs" + "/m" + date.getTime()), {
        username: username,
        msg: msg,
    });
}
