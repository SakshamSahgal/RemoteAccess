
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

        streamCanvas.addEventListener("wheel", simulateScroll);          // Add a scroll event listener to the canvas
        streamCanvas.addEventListener("mousemove", simulateMouseMove);   // Add a mousemove event listener to the canvas
        streamCanvas.addEventListener("click", simulateMouseClick);      // Add a click event listener to the canvas
        window.addEventListener("keydown", simulateKeyDown);             // Add a keydown event listener to the window
        StreamControlButton.innerHTML = "Stop Streaming";                // Change the button text to "Stop Streaming"
        StreamControlButton.disabled = false;                            // Enable the button
    }, 2000);                                                            //this is done to prevent the user from spamming the start/stop button because the server takes some time to start/stop the stream
    
}

function StopStream() {
    
    StreamControlButton.disabled = true;

    let stopJSON = {
        msgType : "stop"
    }
    socket.send(JSON.stringify(stopJSON));
    //wait for 2 seconds
    setTimeout(function(){
        static.src = "/static.png";
        static.onload = function() {
            streamCtx.drawImage(static, 0, 0);
        };
        
        streamCanvas.removeEventListener("wheel", simulateScroll);
        streamCanvas.removeEventListener("mousemove", simulateMouseMove); // Remove the mousemove event listener from the canvas
        streamCanvas.removeEventListener("click", simulateMouseClick);    // Remove the click event listener from the canvas
        window.removeEventListener("keydown", simulateKeyDown);           // Remove the keydown event listener from the window
        StreamControlButton.disabled = false;
        StreamControlButton.innerHTML = "Start Streaming";                // Change the button text to "Start Streaming"
        document.getElementById("fps").disabled = false;                  // re-Enable the FPS input field
    }, 2000);                                                             //this is done to prevent the user from spamming the start/stop button because the server takes some time to start/stop the stream
}

// Function to simulate key down
function simulateKeyDown(event) {
    // console.log(event.key);
    let keyDownJSON = {
        msgType: "keyDown",
        key: event.key,
    };
    socket.send(JSON.stringify(keyDownJSON));
}