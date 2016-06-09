
// Connect client to port 8000, that's where openshift has websockets enabled
var socket = io.connect(':8000/');

if ("vibrate" in navigator) { // Vibration API supported
    // Enable vibrate support
    navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
}

// Socket event emitting

function setHost() {
    socket.emit('set host', {username: localStorage.getItem("username")});
}

function changeColor(bandNum, color) {
    socket.emit('color', {'color': color, 'band': bandNum});
}

function pulse(bandNum, numPulses) {
    socket.emit("pulse", {'numPulses': numPulses, 'band': bandNum});
}

function pulse_vibrate(duration) {
    socket.emit("pulse_vibrate", {'duration':duration});
}

// Listeners

$(document).ready(function() {
    // Pressing p shows admin panel
    $("body").keydown(function(e) {
        if (e.keyCode === 80) { // P
            $("#admin").toggle();
        }
    })
})


// Socket responses (all)

socket.on('change color', function(data) {
    switch(data["band"]) {
        case "1":
            $("#band1").css("background-color", data["color"]);
            break;
        case "2":
            $("#band2").css("background-color", data["color"]);
            break;
        case "3":
            $("#band3").css("background-color", data["color"]);
            break;
    }
})

socket.on('change pulse', function(data) {
    var classToAdd = "";
    if (data["numPulses"] === "1") {
        classToAdd = "pulse_once";
    } else {
        classToAdd = "pulse_forever";
    }
    switch(data["band"]) {
        case "1":
            $("#band1").removeClass("pulse_once");
            $("#band1").removeClass("pulse_forever");

            // To replay animations that only loop once you have to trigger a reflow lmao
            $('#band1').hide().show(0);
            $("#band1").addClass(classToAdd);
            break;
        case "2":
            $("#band2").removeClass("pulse_once");
            $("#band2").removeClass("pulse_forever");

            $('#band2').hide().show(0);
            $("#band2").addClass(classToAdd);
            break;
        case "3":
            $("#band3").removeClass("pulse_once");
            $("#band3").removeClass("pulse_forever");

            $('#band3').hide().show(0);
            $("#band3").addClass(classToAdd);
            break;
    }
})

socket.on('pulse_vibrate', function(data) {
    switch(data["duration"]) {
        case "0.25":
            navigator.vibrate(250);
            break;
        case "0.5":
            navigator.vibrate(500);
            break;
        case "1":
            navigator.vibrate(1000);
            break;
    }
})

