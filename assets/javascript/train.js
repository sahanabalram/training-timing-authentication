// Initialize Firebase
  var config = {
    apiKey: "AIzaSyB_aFlRXrsRM08uxHp0-dYkVLKbePTXUiM",
    authDomain: "train-timings-4ff15.firebaseapp.com",
    databaseURL: "https://train-timings-4ff15.firebaseio.com",
    projectId: "train-timings-4ff15",
    storageBucket: "",
    messagingSenderId: "920169152971"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  //  Button for adding trains
  $("#add-train-button").on("click",function(){
      event.preventDefault();

    //   grab the user input
    var trainName = $("#add-train-input").val().trim();
    var destinationName = $("#add-destination-input").val().trim();
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
  
  });