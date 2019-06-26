/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-undef */

// import and export of variables
export var curMap = [];
export var curDay, curMoney, curLevel, school, loggedIn;
import firebaseconfig from "/config/firebase-config.js";
import { defaultMap } from "./assets/maps/default-map.js";

// syncs the local map data variable with the one from the firebase database so Phaser can use the data to convert it to tilemap. also retrieves the day and money and school from the database
export function updateMap() {
  curMap = [];
  let row = 0;
  let rowNumber = 0;
  let dbRef = firebase
    .database()
    .ref("users/" + firebase.auth().currentUser.uid);

  dbRef
    .child("/day/")
    .once("value")
    .then(function(snapshot) {
      curDay = snapshot.val();
    });

  dbRef
    .child("/money/")
    .once("value")
    .then(function(snapshot) {
      curMoney = snapshot.val();
    });

  dbRef
    .child("/school/")
    .once("value")
    .then(function(snapshot) {
      school = snapshot.val();
    });

  dbRef.child("/map/").once("value", function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var childData = childSnapshot.val();
      if (row % 32 === 0 && rowNumber <= 32) {
        curMap += childData + "|";
        rowNumber++;
        row = 0;
      } else {
        curMap += childData;
        row++;
      }
    });
    console.log(curMap);
    // console.log(curDay);
    // console.log(curMoney);
    // console.log(school);
    curLevel = curMap.split("|").map(el => el.split(","));
    console.log(curLevel);
  });
}

// function that sync the database with the global money variable
export function updateMoney() {
  let dbRef = firebase
    .database()
    .ref("users/" + firebase.auth().currentUser.uid + "/money/");

  dbRef.on("value", function(snapshot) {
    curMoney = snapshot.val();
  });
}

// function that gets called when the player goes to bed and it updates the growth or death of plants during night as well as increases the day counter
export function sleepMapUpdate() {
  let dbRef = firebase
    .database()
    .ref("users/" + firebase.auth().currentUser.uid);

  let dbScoreboard = firebase
      .database()
      .ref("leaderboard/" + firebase.auth().currentUser.uid + "/money");

  dbRef.child("/map/").once("value", function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      let childKey = childSnapshot.key;
      let childData = childSnapshot.val();
      let tileIndex = 0;
      console.log(childKey, childData);
      let curidk = childData.map(function(tile) {
        tileIndex++;
        if (tile == 34) {
          dbRef
            .child("/map/")
            .child(childKey)
            .child(tileIndex - 1)
            .set(38);
        }

        if (tile == 40) {
          dbRef
            .child("/map/")
            .child(childKey)
            .child(tileIndex - 1)
            .set(37);
        }
      });
    });
    dbRef.child("/day").set(curDay + 1);
    curMoney += 20;
    dbRef.child("/money").set(curMoney);
    console.log(curMoney);

    dbRef
      .child("/day/")
      .once("value")
      .then(function(snapshot) {
        curDay = snapshot.val();
      });

      dbScoreboard.set(curMoney);
    
  });
}

// Initialize Firebase
firebase.initializeApp(firebaseconfig);

// Adds eventlisteners to our buttons
document.getElementById("registerbtn").addEventListener("click", register);
document.getElementById("loginbtn").addEventListener("click", login);
document.getElementById("signoutbtn").addEventListener("click", signOut);


// function that retrieves the scoreboard data from firebase and updates it in the html
function updateScoreboard() {
  $("#scoreboardOl").empty();
  var ol = document.getElementById("scoreboardOl");
  var query = firebase
    .database()
    .ref("leaderboard")
    .orderByChild("money")
    .limitToLast(10);

  query.once("value").then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var childData = childSnapshot.val();
      var li = document.createElement("li");
      li.innerHTML = childData.nickname + " | " + childData.money;
      ol.appendChild(li);
    });
  });
}

// function that calls the update scoreboard function every 5s
setInterval(function(){ updateScoreboard() }, 5000);


// function that uses firebase authentication to register the user and adds the default data to the corresponding database node
function register() {
  let email = document.getElementById("email").value;
  let pass = document.getElementById("password").value;
  let nickname = document.getElementById("nickname").value;
  let school = document.getElementById("school").value;

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, pass)
    .then(function() {
      firebase
        .database()
        .ref("users/" + firebase.auth().currentUser.uid)
        .set({
          email: email,
          day: 0,
          money: 100,
          school: school,
          map: defaultMap
        })
        .then(function() {
          firebase
            .database()
            .ref("leaderboard/" + firebase.auth().currentUser.uid)
            .set({
              nickname: nickname,
              money: 100
            });
        });
      document.getElementById("rgrText").innerHTML = "You are registered!";
    })
    .catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      document.getElementById("rgrText").innerHTML = error.message;
    });
    document.getElementById("rgrText").innerHTML = "You are registered!";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  document.getElementById("nickname").value = "";
}

// function that logs in the user
function login() {
  let emaillgn = document.getElementById("emaillgn").value;
  let passlgn = document.getElementById("passwordlgn").value;

  firebase
    .auth()
    //Sign in session will remain even if the browser is closed up until signOut is called
    .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(function() {
      document.getElementById("lgnTxt").innerHTML = "User logged in!";
      return firebase.auth().signInWithEmailAndPassword(emaillgn, passlgn);
    })
    .catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      document.getElementById("lgnTxt").innerHTML = error.message;
    });

}

// function that logs out the user and clears the local map variable in order to prevent stacking
function signOut() {
  firebase
    .auth()
    .signOut()
    .then(function() {
      // Sign-out successful.
      curMap = [];
      //console.log(curMap);
    })
    .catch(function(error) {
      // An error happened.
    });
}

// function that checks whether the user is logged in or not and stores it in a local variable that is accessed by the scenes
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log("User " + user.email + " is logged in!");
    loggedIn = true;
    updateMap();
  } else {
    console.log("No user is logged in!");
    loggedIn = false;
  }
});
