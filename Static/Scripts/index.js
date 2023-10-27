
var socket = new WebSocket(`ws://localhost:3000/websocket`);
streamCanvas = document.getElementById("stream");
streamCtx = streamCanvas.getContext("2d");
var static = new Image();

socket.onopen = () => {
    console.log('WebSocket connection established.');
    
    static.src = "/static.png";
    static.onload = function() {
        streamCtx.drawImage(static, 0, 0);
    };
  };

socket.onclose = () => {
    console.log('WebSocket connection closed.');
  };

socket.onmessage = (event) => {

    console.log("Received frame")

    static.src = 'data:image/png;base64,' + event.data;
    static.onload = function() {
        streamCtx.drawImage(static, 0, 0);
    };
};
  


StreamControlButton = document.getElementById("StreamControl");

StreamControlButton.onclick = function() {
    if (StreamControlButton.innerHTML == "Start Streaming") {
        StartStream();
    } else {
        StreamControlButton.innerHTML = "Start Streaming";
        StopStream();
    }
};




function StartStream() {

    StreamControlButton.disabled = true;
    document.getElementById("fps").disabled = true;         // Disable the FPS input field

    let startJSON = {
       msgType : "start",
         fps : document.getElementById("fps").value 
    }
    socket.send(JSON.stringify(startJSON));
    
    //wait for 2 seconds 
    setTimeout(function(){
        StreamControlButton.innerHTML = "Stop Streaming";       // Change the button text to "Stop Streaming"
        StreamControlButton.disabled = false;                   // Enable the button
    }, 2000);                                                    //this is done to prevent the user from spamming the start/stop button because the server takes some time to start/stop the stream
    
}

function StopStream() {
    
    StreamControlButton.disabled = true;

    let stopJSON = {
        msgType : "stop"
    }
    socket.send(JSON.stringify(stopJSON));
    //wait for 5 seconds 
    setTimeout(function(){
        static.src = "/static.png";
        static.onload = function() {
            streamCtx.drawImage(static, 0, 0);
        };
        StreamControlButton.disabled = false;
        StreamControlButton.innerHTML = "Start Streaming";      // Change the button text to "Start Streaming"
        document.getElementById("fps").disabled = false;        // re-Enable the FPS input field
    }, 5000);                                                   //this is done to prevent the user from spamming the start/stop button because the server takes some time to start/stop the stream
}