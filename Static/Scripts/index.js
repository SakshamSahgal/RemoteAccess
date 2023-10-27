
var socket = new WebSocket(`ws://localhost:3000/websocket`);



socket.onopen = () => {
    console.log('WebSocket connection established.');
    var static = new Image();
    streamCanvas = document.getElementById("stream");
    streamCtx = streamCanvas.getContext("2d");
    static.src = "/static.png";

    static.onload = function() {
        streamCtx.drawImage(static, 0, 0);
    };
  };

socket.onclose = () => {
    console.log('WebSocket connection closed.');
  };

socket.onmessage = (event) => {
    
    console.log(event.data);
    streamCanvas = document.getElementById("stream");
    streamCtx = streamCanvas.getContext("2d");
    var static = new Image();

    static.src = 'data:image/png;base64,' + event.data;

    static.onload = function() {
        streamCtx.drawImage(static, 0, 0);
    };
};
  


StreamControlButton = document.getElementById("StreamControl");

StreamControlButton.onclick = function() {
    if (StreamControlButton.innerHTML == "Start Streaming") {
        StreamControlButton.innerHTML = "Stop Streaming";
        StartStream();
    } else {
        StreamControlButton.innerHTML = "Start Streaming";
        // StopStream();
    }
};




function StartStream() {
    let startJSON = {
       msgType : "start",
         fps : document.getElementById("fps").value 
    }
    socket.send(JSON.stringify(startJSON));
}