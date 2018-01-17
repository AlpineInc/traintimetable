$(function() {
    var config = {
        apiKey: "AIzaSyDmtmIyyDM4iIhrEcVOkzLpHLI70-YfLVU",
        authDomain: "helloworld-2f9ac.firebaseapp.com",
        databaseURL: "https://helloworld-2f9ac.firebaseio.com",
        projectId: "helloworld-2f9ac",
        storageBucket: "helloworld-2f9ac.appspot.com",
        messagingSenderId: "260127417867"
    };
    firebase.initializeApp(config);
    var database = firebase.database();


    function getNextTrainTime(trainStartTime, trainFrequency) {
        var diffTime = moment().diff(moment(trainStartTime), "minutes");
        var diffTimeModulus = diffTime % parseInt(trainFrequency);
        var minutesTillTrain = parseInt(trainFrequency) - diffTimeModulus;
        var nextTrainTime = moment().add(minutesTillTrain, "minutes").format("hh:mm");
        return {
            "nextTrainTime": nextTrainTime,
            "minutesTillTrain": minutesTillTrain
        };
    };



    function refreshTimeTable() {
        var table = $("#table-trainTable");

        $("#table-trainTable > tbody > tr").each(function() {
            var trainStartTime = moment($("#td-trainStartTime", this).text(),"hh:mm");
            var trainFrequency = $("#td-trainFrequency", this).text();
            var nextTrain = getNextTrainTime(trainStartTime, trainFrequency);
            $("#td-nextTrainTime", this).text(nextTrain.nextTrainTime);
            $("#td-minsUntil", this).text(nextTrain.minutesTillTrain);

        });
    };



    database.ref("/trainRecord").on("child_added", function(childSapshot) {
        var trainStartTime = moment(childSapshot.val().trainStartTime, "hh:mm");
        var trainFrequency = childSapshot.val().trainFrequency;

        var nextTrain = getNextTrainTime(trainStartTime, trainFrequency);

        $("#table-trainTable > tbody").append("<tr><td style='display:none' id='td-trainStartTime'>" + childSapshot.val().trainStartTime + "</td><td>" + childSapshot.val().trainName + "</td><td>" + childSapshot.val().trainDestination + "</td><td id='td-trainFrequency'>" + childSapshot.val().trainFrequency + "</td><td id='td-nextTrainTime'>" + nextTrain.nextTrainTime + "</td><td id='td-minsUntil'>" + nextTrain.minutesTillTrain + "</td></tr>");

    }, function(errorObject) {
        console.log("Database read failed: " + errorObject.code);
    });



    $(document).on("click", "#btn-addNewTrain", function(event) {
        event.preventDefault();

        var trainRecord = {
            "trainName": $("#input-trainName").val(),
            "trainDestination": $("#input-trainDestination").val(),
            "trainStartTime": $("#input-trainStartTime").val(),
            "trainFrequency": $("#input-trainFrequency").val()
        };

        database.ref("/trainRecord").push(trainRecord);

        $("#input-trainName").val("");
        $("#input-trainDestination").val("");
        $("#input-trainStartTime").val("");
        $("#input-trainFrequency").val("");
    });


    setInterval(refreshTimeTable, 60000);

});