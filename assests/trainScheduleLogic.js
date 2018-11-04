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

var currentTime = moment();
var trainName = " ";
var trainDestination = " ";
var trainStart = " ";
var trainFrequency = " ";
var nxtTrain = " ";
var mAway = " ";

// 2. Button for adding trains
$("#add-train-btn").on("click", addTrain); 
 
function updateTrainTime(){
  database.ref().orderByChild(dateAdded).on("child_added", function(childSnapshot) {
    // childSnapshot.val()
    // var dateAdd = "";
    console.log("inUpdate function");
    // database.ref().on("child_changed", function(childSnapshot) {
    childSnapshot.forEach(function (snapshot){
      console.log("snapshot:" +snapshot.val());
      trainFrequency = snapshot.val().frequency;
      // nxtTrain = snapshot.val().nextTrain;
      // mAway = snapshot.val().minAway;
      var updateTime = timeCalc(trainFrequency);
      database.ref().update({minAway: updateTime[0],nextTrain: updateTime[1]})
      console.log("firebase update: " + snapshot.val());
    });
  });
};
function addTrain(){
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var trainDestination = $("#destination-input").val().trim();
  var trainStart = moment($("#start-input").val().trim(), "HH:mm").format("X");
  var trainFrequency = $("#frequency-input").val().trim();
  var calc = timeCalc(trainFrequency,trainStart);
  var mAway = calc[0];
  var nTrain = calc[1];
  console.log ("mAway: " + mAway);
  console.log("nTrain: " + nTrain);
  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: trainDestination,
    start: trainStart,
    frequency: trainFrequency,
    minAway: mAway,
    nextTrain: nTrain,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  };
  // Uploads train data to the database
  database.ref().push(newTrain);
  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.start);
  console.log(newTrain.frequency);
  console.log("minAway: " + newTrain.minAway);
  console.log("next Train: " + newTrain.nextTrain);

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
   nxtTrain = childSnapshot.val().nextTrain;
   mAway = childSnapshot.val().minAway;


  // train Info
  console.log(trainName);
  console.log(trainDestination);
  console.log(trainStart);
  console.log(trainFrequency);
  // Prettify the train start
  var trainStartPretty = moment.unix(trainStart).format("HH:mm");

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

function timeCalc(trainFrequency){
  var tFrequency = trainFrequency;

    // Time is 3:30 AM
    var firstTime = "3:30";

    // First Time (pushed back 1 year to make sure it comes before current time)
    // var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    var firstTimeConverted = moment(firstTime, "HH:mm");
    console.log(firstTimeConverted);
    // Current Time
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log("tRemainder:" + tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    tMinutesTillTrain = tMinutesTillTrain.toString();

    // Next Train
    var ntTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(ntTrain).format("hh:mm"));
        ntTrain = (moment(ntTrain).format("hh:mm")).toString();

    return [tMinutesTillTrain,ntTrain];
    //   minAway : tMinutesTillTrain,
    //   nxtArrival: ntTrain
    // }

    // database.ref().push({
    //   minAway: tMinutesTillTrain,
    //   nxtArrival: nextTrain,
    //   dateAdded: firebase.database.ServerValue.TIMESTAMP
    // });
}
// will add later .
// setInterval(updateTrainTime,30*1000);
// Example Time Math
// -----------------------------------------------------------------------------
// Assume train start date of January 1, 2015
// Assume current date is March 1, 2016

// We know that this is 15 months.
// Now we will create code in moment.js to confirm that any attempt we use meets this test case
