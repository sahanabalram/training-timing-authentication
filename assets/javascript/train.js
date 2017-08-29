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

  // 2. Button for adding Employees

  $("#add-train-button").on("click",function(){
      event.preventDefault();
  })