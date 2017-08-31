// Initialize Firebase
var config = {
    apiKey: "AIzaSyB_aFlRXrsRM08uxHp0-dYkVLKbePTXUiM",
    authDomain: "train-timings-4ff15.firebaseapp.com",
    databaseURL: "https://train-timings-4ff15.firebaseio.com",
    projectId: "train-timings-4ff15",
    storageBucket: "",
    messagingSenderId: "920169152971"
};
var database;

function initialize() {
    firebase.initializeApp(config);
    database = firebase.database();
}

function authenticate() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log(user);
        // ...
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        console.log(errorCode, errorMessage, email, credential);
        // ...
    });
}

function nextArrival(tFrequency, firstTime) {
    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;  
    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    // Next Train
    var nextTrain = moment(moment().add(tMinutesTillTrain, "minutes"));
    
    return tMinutesTillTrain;
}

function populateTable() {
    // Create Firebase event for adding train to the database and a row in the html when a user adds an entry
    database.ref().on("child_added", function (childSnapShot, prevChildKey) {
        console.log(childSnapShot.val());
        // Store everything in a variable
        var trainName = childSnapShot.val().name;
        var destination = childSnapShot.val().destination;
        var trainTime = childSnapShot.val().time;
        var trainFrequency = childSnapShot.val().frequency;
        // Add each train's data into the table
        $("#train-table").append('<tr class="train-id"><td>' + trainName + "</td><td>" + destination + "</td><td>" +
            trainFrequency + "</td><td>" + trainTime + "</td><td>" + nextArrival(trainFrequency, trainTime) + "</td></tr>");
    });
}

//  Button for adding trains
$("#add-train-button").on("click", function () {
    event.preventDefault();

    //   grab the user input
    var trainName = $("#add-train-input").val().trim();
    var trainDestination = $("#add-destination-input").val().trim();
    var trainTime = $("#add-train-time-input").val().trim();
    var trainFrequency = $("#add-frequency-input").val().trim();

    // Create local "temporary" object for holding train data
    var newTrain = {
        name: trainName,
        destination: trainDestination,
        time: trainTime,
        frequency: trainFrequency
    }
    // Upload train data to the database
    database.ref().push(newTrain);
    alert("Train successfully added");

    // clear all of the text-boxes
    $("#add-train-input").val("");
    $("#add-destination-input").val("");
    $("#add-train-time-input").val("");
    $("add-frequency-input").val("");
});


$(document).ready(function () {
    $("#login-container").hide();
    $("#main-container").show();
    // authenticate();
    initialize();
    populateTable();
});