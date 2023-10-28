var offsetslider = document.getElementById("offsetslider");

offsetslider.addEventListener('input',() =>  {
    document.getElementById("offset").innerHTML = offsetslider.value;
    });

 // Function to simulate mouse movement
 function simulateMouseMove(event) {
    // Get the mouse coordinates relative to the canvas
    const rect = streamCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    //translating canvas coordinates to webpage coordinates
    let moveJSON = {
        msgType: "mousemove",
        x: parseInt(x) + parseInt(document.getElementById("offsetslider").value),
        y: y-87,
    };

    
    // Draw a small circle at the current mouse position on the canvas
    streamCtx.beginPath();
    streamCtx.arc(x, y, 5, 0, 2 * Math.PI);
    streamCtx.fillStyle = "blue";
    streamCtx.fill();
    
    //sending the mouse coordinates to the server
    socket.send(JSON.stringify(moveJSON));
  }

// Function to simulate mouse click
function simulateMouseClick(event) {
    const x = event.clientX;
    const y = event.clientY;
    console.log(x, y);
    let clickJSON = {
        msgType: "click",
        x: parseInt(x) + parseInt(document.getElementById("offsetslider").value),
        y: y-87,
    };
    socket.send(JSON.stringify(clickJSON));
}

// Function to simulate mouse scroll
function simulateScroll(event) {
    console.log(event.deltaY);
    let scrollJSON = {
        msgType: "scroll",
        deltaY: event.deltaY,
    };
    socket.send(JSON.stringify(scrollJSON));
}

