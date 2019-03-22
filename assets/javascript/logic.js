// Initialize Firebase
var config = {
  apiKey: "AIzaSyD35PMKSq3euLQ_Aad98HsZvAJlput5zGQ",
  authDomain: "jasmeet-bootcampweek8.firebaseapp.com",
  databaseURL: "https://jasmeet-bootcampweek8.firebaseio.com",
  storageBucket: "jasmeet-bootcampweek8.appspot.com"
};

firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

//Run Time
setInterval(function (startTime) {
  $("#timer").html(moment().format("hh:mm a"));
}, 1000);

// Capture Button Click
$("#add-train").on("click", function () {
  // Don't refresh the page!
  event.preventDefault();

  // Code in the logic for storing and retrieving the most recent train information
  var train = $("#trainname-input")
    .val()
    .trim();
  var destination = $("#destination-input")
    .val()
    .trim();
  var frequency = $("#frequency-input")
    .val()
    .trim();
  var firstTime = $("#firsttime-input")
    .val()
    .trim();

  //database.ref().set({
  var trainInfo = {
    formtrain: train,
    formdestination: destination,
    formfrequency: frequency,
    formfirsttime: firstTime,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  };

  database.ref().push(trainInfo);

  console.log(trainInfo.formtrain);
  console.log(trainInfo.formdestination);
  console.log(trainInfo.formfrequency);
  console.log(trainInfo.formfirsttime);
  console.log(trainInfo.dateAdded);

  // Alert
  // alert("Train was successfully added");

  // Clears all of the text-boxes
  $("#trainname-input").val("");
  $("#destination-input").val("");
  $("#frequency-input").val("");
  $("#firsttime-input").val("");
});

// Firebase watcher + initial loader
database.ref().on(
  "child_added",
  function (childSnapshot, prevChildKey) {
    var train = childSnapshot.val().formtrain;
    var destination = childSnapshot.val().formdestination;
    var frequency = childSnapshot.val().formfrequency;
    var firstTime = childSnapshot.val().formfirsttime;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    //determine Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm a"));

    //get timer functioning
    $("#timer").text(currentTime.format("hh:mm a"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log("Remainder: " + tRemainder);

    //determine Minutes Away
    var minutesAway = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + minutesAway);

    //determine Next Train Arrival
    var nextArrival = moment()
      .add(minutesAway, "minutes")
      .format("hh:mm a");
    console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm a"));

    $("#train-table > tbody").append(
      "<tr><td>" +
      '<i class="fa fa-trash" id="trashcan" aria-hidden="true"></i>' +
      "</td><td>" +
      train +
      "</td><td>" +
      destination +
      "</td><td>" +
      frequency +
      "</td><td>" +
      nextArrival +
      "</td><td>" +
      minutesAway +
      "</td></tr>"
    );

    // var t = setTimeout(startTime, 500);

    // If any errors are experienced, log them to console.
  },
  function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  }
);


$("body").on("click", ".fa-trash", function () {
  $(this)
    .closest("tr")
    .remove();
  alert("delete button clicked");
});

function timeUpdater() {
  //empty tbody before appending new information
  $("#train-table > tbody").empty();

  database.ref().on("child_added", function (childSnapshot, prevChildKey) {
    var train = childSnapshot.val().formtrain;
    var destination = childSnapshot.val().formdestination;
    var frequency = childSnapshot.val().formfrequency;
    var firstTime = childSnapshot.val().formfirsttime;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm a"));
    // $("#timer").html(h + ":" + m);
    $("#timer").text(currentTime.format("hh:mm a"));
    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log("Remainder: " + tRemainder);

    //determine Minutes Away
    var minutesAway = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + minutesAway);

    //determine Next Train Arrival
    var nextArrival = moment()
      .add(minutesAway, "minutes")
      .format("hh:mm a");
    console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm a"));

