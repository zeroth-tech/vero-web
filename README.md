# Vero Blink Sequence Website

A simple web application that converts hexadecimal session keys into visual blink sequences.

## Features

- Converts 5-character hexadecimal codes into binary sequences
- Displays blink patterns using background colors
- Supports both URL parameter and manual input
- Mobile-friendly interface
- Stop/start functionality

## Usage

### Via URL
Access the website with a session key parameter:
```
https://vero.zeroth.technology?key=a7c91
```

### Manual Input
1. Visit https://vero.zeroth.technology
2. Enter a 5-character hexadecimal code
3. Click "Start Blinking"
4. Click "Stop Blinking" to end the sequence

## Technical Details

- Each session key is a 5-character hexadecimal string
- Converts to 20-bit binary sequence
- Blink sequence uses:
  - Green (G) for 1
  - Blue (B) for 0
  - Red (R) for terminator
  - Black (_) for delimiter
- Each blink lasts 200 milliseconds

## Setup

1. Clone the repository
2. Deploy the files to your web server
3. Ensure all files are in the same directory:
   - index.html
   - styles.css
   - script.js
