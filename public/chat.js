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
const roomID = location.href.split("roomid=")[1].toUpperCase();
console.log(location.href);
const username = location.href.split("name=")[1].split("&")[0];
console.log(`username: ${username}, roomID: ${roomID}`);
let MSGS;
const chatcontainer = document.querySelector("#chatcontainer");

document.querySelector("#roomIDlabel").innerHTML = `Room ID: <b>${roomID}</b>`;

postMsg(roomID, godname, username + " has joined!");

onValue(ref(db, `rooms/${roomID}/msgs`), (snapshot) => {
    const data = snapshot.val();
    MSGS = data;
    console.log(MSGS);
    let chatparcel = document.createElement("div");
    for (const msgID in MSGS) {
        console.log(`${msgID}: ${MSGS[msgID]}`);
        let msgelement = document.createElement("p");
        MSGS[msgID].username != godname
            ? (msgelement.innerHTML = `<b>${MSGS[msgID].username}:</b> ${MSGS[msgID].msg}`)
            : (msgelement.innerHTML = `<span style="color: rgb(0 0 0 / 0.7)">${MSGS[msgID].msg}</span>`);
        chatparcel.appendChild(msgelement);
    }
    chatcontainer.innerHTML = chatparcel.innerHTML;
    chatcontainer.scrollTo(0, chatcontainer.scrollHeight);
});

function postMsg(roomID, username, msg) {
    const date = new Date();
    set(ref(db, "rooms/" + roomID + "/msgs" + "/m" + date.getTime()), {
        username: username,
        msg: msg,
    });
}

const msgfield = document.querySelector("#msgfield");
document.querySelector("#msgform").addEventListener("submit", () => {
    postMsg(roomID, username, document.querySelector("#msgfield").value);
    msgfield.value = "";
});

window.onbeforeunload = () => {
    postMsg(roomID, godname, username + " has left.");
};
