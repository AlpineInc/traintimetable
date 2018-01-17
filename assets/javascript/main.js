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
        // Difference between current time and train start times
        var diffTime = moment().diff(moment(trainStartTime), "minutes");

        // Time modulus 
        var diffTimeModulus = diffTime % trainFrequency;

        // Time for the next train
        var minutesTillTrain = trainFrequency - diffTimeModulus;

        // Next Train
        var nextTrainTime = moment().add(minutesTillTrain, "minutes").format("hh:mm");
        return {
            "nextTrainTime": nextTrainTime,
            "minutesTillTrain": minutesTillTrain
        };
    };

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

    database.ref("/trainRecord").on("child_added", function(childSapshot) {
        var trainStartTime = moment(childSapshot.val().trainStartTime, "hh:mm");
        var trainFrequency = childSapshot.val().trainFrequency;

        var nextTrain = getNextTrainTime(trainStartTime, trainFrequency);

        $("#table-trainTable > tbody").append("<tr><td>" + childSapshot.val().trainName + "</td><td>" + childSapshot.val().trainDestination + "</td><td>" + childSapshot.val().trainFrequency + "</td><td>" + nextTrain.nextTrainTime + "</td><td>" + nextTrain.minutesTillTrain + "</td></tr>");

    }, function(errorObject) {
        console.log("Database read failed: " + errorObject.code);
    });

    //setTimeout(refreshTimeTable, 1000);

    function refreshTimeTable() {

        var table = $("#table-trainTable");
        console.log("hello1");

        $("#table-trainTable > tbody > tr").each(function() {
            console.log("hello2");
            console.log(this);
            $(this > td).each(function() {
                console.log(this.html());
            })
        });
        //var nextTrain = getNextTrainTime(trainStartTime, trainFrequency);

        //$("#table-trainTable > tbody").append("<tr><td>" + childSapshot.val().trainName + "</td><td>" + childSapshot.val().trainDestination + "</td><td>" + childSapshot.val().trainFrequency + "</td><td>" + nextTrain.nextTrainTime + "</td><td>" + nextTrain.minutesTillTrain + "</td></tr>");

    };
    refreshTimeTable();

});