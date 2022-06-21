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
const godname = "*sniplash*";

const db = getDatabase();

// helper function for random room code generation
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
function randomFrom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// store username input element
const usernameslot = document.getElementById("username");

// create room function
function createRoom() {
    // generates random room id
    let roomID =
        randomFrom(alphabet) +
        randomFrom(alphabet) +
        randomFrom(alphabet) +
        randomFrom(alphabet);

    // makes room creator the room host
    let roomhost = usernameslot.value;
    console.log("host: " + usernameslot.value, "room ID: " + roomID);

    // creates empty room in Firebase Realtime Database
    set(ref(db, "rooms/" + roomID), {
        host: roomhost,
        players: { p0: roomhost },
        playercount: 1,
        msgs: null,
        answers: {},
        currentPrompt: null,
    })
        .then(() => {
            // Post active room notif
            postMsg(roomID, godname, "Room " + roomID + " now active!");
            // go to room URL
            location.href = `/room.html?username=${usernameslot.value}&roomid=${roomID}`;
        })
        .catch((error) => {
            console.log(error);
        });
}

function joinRoom() {
    // get room code from input field
    const roomID = document.getElementById("roomcode").value.toUpperCase();
    console.log(usernameslot.value, roomID);
    // go to room URL with inputted username
    onValue(ref(db, `rooms/${roomID}/playercount`), (snapshot) => {
        let numberOfPlayers = snapshot.val();
        if (numberOfPlayers > 0) {
            set(
                ref(db, `rooms/${roomID}/players/p${numberOfPlayers}`),
                usernameslot.value
            )
                .then(() => {
                    location.href = `/room.html?username=${usernameslot.value}&roomid=${roomID}`;
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    });
}

// listen for create room event
document
    .getElementById("createroombutton")
    .addEventListener("click", createRoom);

// listen for join room event
document.getElementById("joinroombutton").addEventListener("click", joinRoom);

// post message function (used above)
function postMsg(roomID, username, msg) {
    const date = new Date();
    set(ref(db, "rooms/" + roomID + "/msgs" + "/m" + date.getTime()), {
        username: username,
        msg: msg,
    });
}
