// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new trains - then update the html + update the database
// 3. Create a way to retrieve trains from the train database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed
// var fireApiKey = config.fireKey;
// 1. Initialize Firebase
var dataKey = config.fireKey;
var config = {
  apiKey: dataKey,
  authDomain: "trainschedule-78063.firebaseapp.com",
  databaseURL: "https://trainschedule-78063.firebaseio.com",
  projectId: "trainschedule-78063",
  storageBucket: "trainschedule-78063.appspot.com",
  messagingSenderId: "474043826565"
};
firebase.initializeApp(config);

var database = firebase.database();
// var trainName = $("#train-name-input").val().trim();
// var trainDestination = $("#destination-input").val().trim();
// var trainStart = moment($("#start-input").val().trim(), "HH:mm").format("X");
// var trainFrequency = $("#frequency-input").val().trim();
var nxtTrain = "";
var mAway = "";

// 2. Button for adding trains
// $("#add-train-btn").on("click", function(event){
//   console.log("this" +this);
//   // if (trainName.val().length === 0 || trainDestination.val().length === 0 || trainStart.val().length === 0 || timeFrequency.val() === 0) {
//    if(!$.trim(this.value).length){
//     alert("Please Fill All Required Fields");
// } else {
//     // if form is filled out, run function
//     addTrain(event);
// }
// });
$("#add-train-btn").on("click", addTrain);
// updateInfo();

function addTrain(event){
  event.preventDefault();
  var trainName = $("#train-name-input").val().trim();
  var trainDestination = $("#destination-input").val().trim();
  var trainStart = moment($("#start-input").val().trim(), "HH:mm").format("X");
  var trainFrequency = $("#frequency-input").val().trim();
  var newTrain = {
    name: trainName,
    destination: trainDestination,
    start: trainStart,
    frequency: trainFrequency,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  };
  // Uploads train data to the database
  database.ref().push(newTrain);
  alert("train successfully added");
  // updateInfo();
  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#start-input").val("");
  $("#frequency-input").val("");
  
};

// function updateInfo(){
// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
   var cTrainName = childSnapshot.val().name;
   var cTrainDestination = childSnapshot.val().destination;
   var cTrainStart = childSnapshot.val().start;
   var cTrainFrequency = childSnapshot.val().frequency;
  //  nxtTrain = childSnapshot.val().nextTrain;
  //  mAway = childSnapshot.val().minAway;
  var calc = timeCalc(cTrainFrequency,cTrainStart);
   mAway = calc[0];
   nxtTrain = calc[1];

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(cTrainName),
    $("<td>").text(cTrainDestination),
    $("<td>").text(cTrainFrequency),
    $("<td>").text(nxtTrain),
    $("<td>").text(mAway)
  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
},function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});
// }
function timeCalc(cTrainFrequency,cTrainStart){
  var tFrequency = cTrainFrequency;

    // Time is 3:30 AM
    var firstTime = cTrainStart;
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
