
 // Function to simulate mouse movement
 function simulateMouseMove(event) {
    // Get the mouse coordinates relative to the canvas
    const rect = streamCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Clear the canvas
    // ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw a small circle at the current mouse position
    streamCtx.beginPath();
    streamCtx.arc(x, y, 5, 0, 2 * Math.PI);
    streamCtx.fillStyle = "blue";
    streamCtx.fill();
  }

  var offsetslider = document.getElementById("offsetslider");

  offsetslider.onchange = function() {
    document.getElementById("offset").innerHTML = offsetslider.value;
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