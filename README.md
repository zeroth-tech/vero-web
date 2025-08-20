# Vero Blink Sequence Website at VERO.ZEROTH.TECHNOLOGY. 
STILL ACTIVE
A simple demo web application that converts hexadecimal session keys into visual blink sequences. 

## Features

- Converts 5-character hexadecimal codes into binary sequences
- Displays blink patterns using background colors
- Supports both URL parameter and manual input
- intended to be used on a mobile device
    - if desktop detected displays a QR code that will open the browser on your mobile
    - give the use the option to blink on desktop by clicking the QR
- Mobile-friendly interface
- Stop/start functionality
- Configurable blink rate

## Usage

### Via URL
Access the website with session key and optional rate parameter:
```
https://vero.zeroth.technology?key=a7c91 # Uses default 200ms rate
https://vero.zeroth.technology?key=a7c91&rate=300 # Slower blink (300ms)
https://vero.zeroth.technology?key=a7c91&rate=100 # Faster blink (100ms)
```

### Manual Input
1. Visit https://vero.zeroth.technology
2. Enter a 5-character hexadecimal code
3. Click "Start Blinking"
4. Click "Stop Blinking" to end the sequence

### Desktop Access
When accessing from a desktop browser:
1. A QR code will be displayed automatically
2. Scan the QR code with your mobile device to continue
3. Alternatively, click the QR code to proceed on desktop anyway

## Technical Details

- Each session key is a 5-character hexadecimal string
- Converts to 20-bit binary sequence
- Blink sequence uses:
  - Green (G) for 1
  - Blue (B) for 0
  - Red (R) for terminator
  - Black (_) for delimiter
- Configurable blink rate:
  - Default: 200 milliseconds
  - Can be adjusted via URL parameter
  - Faster rates (<200ms) for quicker authentication
  - Slower rates (>200ms) for easier visual tracking

## Directory Structure

```
/
├── index.html          # Landing page with session key input
├── style.css          # Shared styles
├── script.js          # Shared JavaScript functionality
├── assets/
│   └── vero-logo.svg  # Logo file
└── blink/
    └── index.html     # Blink sequence page
```

## Setup

1. Clone the repository
2. Deploy the files to your web server
3. Ensure all files maintain the directory structure shown above

## Browser Compatibility

- Works on modern mobile browsers (Chrome, Safari, Firefox)
- Desktop browsers supported with QR code redirect option
- Requires JavaScript enabled
- Requires support for:
  - CSS Background Color transitions
  - URL Parameters
  - QR Code scanning (on mobile)

## Dependencies

- QRCode.js (CDN loaded) for QR code generation
