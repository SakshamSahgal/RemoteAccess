#!/bin/bash

# Capture a screenshot using gnome-screenshot
gnome-screenshot --file="Screenshots/screenshot.png"

# Check if the screenshot was successfully saved
if [ $? -eq 0 ]; then
    echo "Screenshot saved as screenshot.png"
else
    echo "Failed to capture the screenshot"
fi

