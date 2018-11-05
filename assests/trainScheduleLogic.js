// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new trains - then update the html + update the database
// 3. Create a way to retrieve trains from the train database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed
// var fireApiKey = config.fireKey;
// 1. Initialize Firebase
 var config = {
    apiKey: "AIzaSyA_fZV21m_j87r6DzLykGgJO2yo2Mj0GEM",
    authDomain: "trainschedule-78063.firebaseapp.com",
    databaseURL: "https://trainschedule-78063.firebaseio.com",
    projectId: "trainschedule-78063",
    storageBucket: "trainschedule-78063.appspot.com",
    messagingSenderId: "474043826565"
  };
  firebase.initializeApp(config);

var database = firebase.database();
var trainName = $("#train-name-input").val().trim();
var trainDestination = $("#destination-input").val().trim();
var trainStart = moment($("#start-input").val().trim(), "HH:mm").format("X");
var trainFrequency = $("#frequency-input").val().trim();
var nxtTrain = "";
var mAway = "";

// 2. Button for adding trains
$("#add-train-btn").on("click", function(event){
  if (trainName.length === 0 || trainDestination.length === 0 || trainStart.length === 0 || timeFrequency === 0) {
    alert("Please Fill All Required Fields");
} else {
    // if form is filled out, run function
    addTrain(event);
}
});

function addTrain(event){
  event.preventDefault();
  var newTrain = {
    name: trainName,
    destination: trainDestination,
    start: trainStart,
    frequency: trainFrequency,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  };
  // Uploads train data to the database
  database.ref().push(newTrain);
  // Logs everything to console
  // console.log(newTrain.name);
  // console.log(newTrain.destination);
  // console.log(newTrain.start);
  // console.log(newTrain.frequency);
  // console.log("minAway: " + newTrain.minAway);
  // console.log("next Train: " + newTrain.nextTrain);

  alert("train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#start-input").val("");
  $("#frequency-input").val("");
  
};

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
   trainName = childSnapshot.val().name;
   trainDestination = childSnapshot.val().destination;
   trainStart = childSnapshot.val().start;
   trainFrequency = childSnapshot.val().frequency;
  //  nxtTrain = childSnapshot.val().nextTrain;
  //  mAway = childSnapshot.val().minAway;
  var calc = timeCalc(trainFrequency,trainStart);
   mAway = calc[0];
   nxtTrain = calc[1];

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDestination),
    $("<td>").text(trainFrequency),
    $("<td>").text(nxtTrain),
    $("<td>").text(mAway)
  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
});

function timeCalc(trainFrequency,trainStart){
  var tFrequency = trainFrequency;

    // Time is 3:30 AM
    var firstTime = trainStart;
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    // console.log("DIFFERENCE IN TIME: " + diffTime);
    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    // console.log("tRemainder:" + tRemainder);
    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    tMinutesTillTrain = tMinutesTillTrain.toString();
    // Next Train
    var ntTrain = (moment().add(tMinutesTillTrain, "minutes").format("hh:mm A")).toString();

    // console.log("ARRIVAL TIME: " + ntTrain);
        // ntTrain = (moment(ntTrain).format("hh:mm A")).toString();

    return [tMinutesTillTrain,ntTrain];
}
