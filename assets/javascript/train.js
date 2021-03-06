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

function signOut() {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
        $("#login-container").show();
        $("#main-container").hide();
    }).catch(function (error) {
        // An error happened.
    });
}

function authenticate() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the GitHub API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log(user);
        $("#login-container").hide();
        $("#main-container").show();
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
        $("#login-container").show();
        $("#main-container").hide();
    });
}

function nextArrival(tFrequency, firstTime) {

    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
    // Current Time
    var currentTime = moment();
    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    // Next Train
    var nextTrain = moment(moment().add(tMinutesTillTrain, "minutes")).format("HH:mm");
    return {
        'minutesTillTrain': tMinutesTillTrain,
        'nextTrain': nextTrain
    };
}

function populateTable() {
    // Create Firebase event for adding train to the database and a row in the html when a user adds an entry
    $("#table-body").empty();
    database.ref().on("child_added", function (childSnapShot, prevChildKey) {
        // Store everything in a variable
        var trainName = childSnapShot.val().name;
        var destination = childSnapShot.val().destination;
        var trainTime = childSnapShot.val().time;
        var trainFrequency = childSnapShot.val().frequency;
        var arrival = nextArrival(trainFrequency, trainTime);
        // Add each train's data into the table
        $("#train-table").append('<tr class="train-id"><td>' + trainName + "</td><td>" + destination + "</td><td>" +
            trainFrequency + "</td><td>" + arrival.nextTrain + "</td><td>" + arrival.minutesTillTrain + "</td></tr>");
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

    // clear all of the text-boxes in the form   
    $("#add-train-input").val("");
    $("#add-destination-input").val("");
    $("#add-train-time-input").val("");
    $("#add-frequency-input").val("");

});

$(document).ready(function () {
    $("#login-container").show();
    $("#main-container").hide();
    initialize();
    // authenticate();
    populateTable();
    setInterval(populateTable, 60000);
});