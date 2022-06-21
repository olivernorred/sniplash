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

// use godname variable when sending status messages like "Graham has joined!"
export const godname = "*sniplash*";

// firebase getDatabase
export const db = getDatabase();

// get room ID and username from URL
export const roomID = location.href.split("roomid=")[1].toUpperCase();
export const username = location.href.split("name=")[1].split("&")[0];

// post msg function
export function postMsg(roomID, username, msg) {
    const date = new Date();
    set(ref(db, "rooms/" + roomID + "/msgs" + "/m" + date.getTime()), {
        username: username,
        msg: msg,
    });
}
