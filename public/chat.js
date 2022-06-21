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
import { godname, db, roomID, username, postMsg } from "./roomsetup.js";

// set up MSGS local object and get chat container element
let MSGS;
const chatcontainer = document.querySelector("#chatcontainer");

// label room in page header
document.querySelector("#roomIDlabel").innerHTML = `Room ID: <b>${roomID}</b>`;

// "Graham has joined!"
postMsg(roomID, godname, username + " has joined!");


// when the messages json tree changes, change MSGS local object to match and display as <p> elements in #chatcontainer element
onValue(ref(db, `rooms/${roomID}/msgs`), (snapshot) => {
    MSGS = snapshot.val();
    // chatparcel is a temporary "element" to hold the accumulated <p> elements
    let chatparcel = document.createElement("div");
    // for property "m1983749208384" in object MSGS
    for (const msgID in MSGS) {
        let msgelement = document.createElement("p");
        // if the username ISN'T godname
        MSGS[msgID].username != godname
            ? // make a normal <p><b>Username:</b>Message message.</p>
              (msgelement.innerHTML = `<b>${MSGS[msgID].username}:</b> ${MSGS[msgID].msg}`)
            : // else (it is godname), make a username-less, gray-color <p><span>Graham has joined!</span></p>
              (msgelement.innerHTML = `<span style="color: rgb(0 0 0 / 0.7)">${MSGS[msgID].msg}</span>`);
        // append <p> elements
        chatparcel.appendChild(msgelement);
    }
    // set the real chat container's HTML to the "fake" chatparcel's innerHTML
    chatcontainer.innerHTML = chatparcel.innerHTML;
    //scroll to bottom
    chatcontainer.scrollTo(0, chatcontainer.scrollHeight);
});

// get input from #msgfield and postMsg using that input
const msgfield = document.querySelector("#msgfield");
document.querySelector("#msgform").addEventListener("submit", () => {
    postMsg(roomID, username, document.querySelector("#msgfield").value);
    msgfield.value = "";
});

// "Graham has left."
window.onbeforeunload = () => {
    postMsg(roomID, godname, username + " has left.");
};
