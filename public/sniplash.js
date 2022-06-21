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

const PROMPTS = `A brand of cereal for serial killers
A bumper sticker a nudist would have
A new, exciting rule for Monopoly: pass Go and collect __
A rejected name for a Crayola color
A rejected title in the Magic School Bus series: The Magic School Bus Goes To _
A time you should absolutely not wear white
A weird surgery that starts with "Laser"
A weird thing for a baseball umpire to lean down and say to a catcher
Something a friendly heckler would yell at a comedy show
The Eiffel Tower would be a lot cooler if it had __
The most embarrassing thing that could happen at prom
The name of a bar with no bathrooms
The nickname Hitler gave to his moustache, probably
The only thing you can remember from inside the womb
The dumbest use of science would be to clone a __
The greatest part about having lots and lots of back hair
The worst thing to hear from your spouse: "I'm leaving you for __"
The worst vehicle to drag race in
What are mannequins always thinking?
What keeps Adam Sandler making movies?
What word should never be followed by an exclamation mark?
What's that blue liquid in Magic 8 balls?
What Victoria's Secret models probably do right after a fashion show`.split(
    "\n"
);
function randomFrom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

let currentPrompt, Players, numberOfPlayers, currentScores;

console.log(roomID);

onValue(ref(db, `rooms/${roomID}/players`), (snapshot) => {
    Players = snapshot.val();
    numberOfPlayers = Object.keys(Players).length;
    console.log("Number of players: " + numberOfPlayers);
    set(ref(db, `rooms/${roomID}/playercount`), numberOfPlayers);
});

function changePrompt() {
    onValue(ref(db, `rooms/${roomID}/host`), (snapshot) => {
        let hostname = snapshot.val();
        console.log("host is user: " + (hostname === username));
        if (hostname === username) {
            currentPrompt = randomFrom(PROMPTS);
            set(ref(db, `rooms/${roomID}/currentPrompt`), currentPrompt)
                .then(() => {
                    postMsg(roomID, godname, "Current prompt:" + currentPrompt);
                    document.querySelector("#prompt").innerHTML = currentPrompt;
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            onValue(ref(db, `rooms/${roomID}/currentPrompt`), (snapshot) => {
                currentPrompt = snapshot.val();
                document.querySelector("#prompt").innerHTML = currentPrompt;
            });
        }
    });
}
changePrompt();

document.querySelector("#playeranswer").addEventListener("submit", () => {
    console.log("Submitted answer");
    postMsg(roomID, godname, `${username} has submitted`);
    set(
        ref(db, `rooms/${roomID}/answers/${username}`),
        document.querySelector("#playeranswerfield").value
    );
});

onValue(ref(db, `rooms/${roomID}/answers`), (snapshot) => {
    let answers = snapshot.val();
    console.log(numberOfPlayers);
    if ((Object.keys(answers).length = numberOfPlayers)) {
        postMsg(roomID, godname, "Everyone has answered!");
    }
});
