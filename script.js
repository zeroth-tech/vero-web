// ==============================================
// DOM Element References
// ==============================================
const sessionKeyInput = document.getElementById('session-key');        // Input field for session key
const startBtn = document.getElementById('start-btn');                // Button to start blinking
const stopBtn = document.getElementById('stop-btn');                  // Button to stop blinking
const inputSection = document.getElementById('input-section');        // Container for input elements
const textSection = document.getElementById('text-section');          // Container for text content
const qrSection = document.getElementById('qr-section');             // Container for QR code
const qrCode = document.getElementById('qr-code');                   // QR code element
const confirmSessionBtn = document.getElementById('confirm-session'); // Button to confirm session key

// ==============================================
// Global State Variables
// ==============================================
let isBlinking = false;                    // Tracks if sequence is currently blinking
let blinkInterval = null;                  // Holds the interval ID for the blink sequence
const DEFAULT_BLINK_RATE = 200;            // Default blink rate in milliseconds

// ==============================================
// Utility Functions
// ==============================================

/**
 * Detects if the current device is mobile
 * @returns {boolean} True if device is mobile, false otherwise
 */
function isMobileDevice() {
    // Check user agent string for mobile devices
    const mobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Check if device supports touch
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    
    return mobileUserAgent || isTouchDevice;
}

/**
 * Converts hexadecimal string to 20-bit binary
 * @param {string} hex - 5-character hex string
 * @returns {string} 20-bit binary string
 */
function hexToBinary(hex) {
    return parseInt(hex, 16).toString(2).padStart(20, '0');
}

/**
 * Converts binary string to blink sequence
 * @param {string} binary - Binary string
 * @returns {string} Sequence of G (green/1), B (blue/0), _ (delimiter), R (terminator)
 */
function binaryToBlinkSequence(binary) {
    let sequence = '';
    for (let bit of binary) {
        sequence += bit === '1' ? 'G_' : 'B_';
    }
    sequence += 'R'; // Add terminator
    return sequence;
}

/**
 * Executes the blink sequence with specified timing
 * @param {string} sequence - String of blink instructions (G/B/R/_)
 * @param {number} rate - Milliseconds between each blink (default: DEFAULT_BLINK_RATE)
 */
function executeBlinkSequence(sequence, rate = DEFAULT_BLINK_RATE) {
    let currentIndex = 0;
    // Color mapping for sequence characters
    const colors = {
        'G': '#00ff00', // Green represents binary 1
        'B': '#0000ff', // Blue represents binary 0
        'R': '#ff0000', // Red marks sequence termination
        '_': '#000000'  // Black serves as visual delimiter
    };

    // Set up interval for color changes
    blinkInterval = setInterval(() => {
        if (currentIndex >= sequence.length) {
            currentIndex = 0; // Reset to start of sequence
        }

        const currentChar = sequence[currentIndex];
        document.body.style.backgroundColor = colors[currentChar];
        currentIndex++;
    }, rate);
}

/**
 * Initiates the blinking sequence
 * @param {string} sessionKey - 5-character hex code
 * @param {number} rate - Milliseconds between blinks (default: DEFAULT_BLINK_RATE)
 */
function startBlinking(sessionKey, rate = DEFAULT_BLINK_RATE) {
    // Validate session key
    if (!sessionKey || sessionKey.length !== 5) {
        alert('Please enter a valid 5-character hex code');
        return;
    }

    // Convert hex to binary, then to blink sequence
    const binary = hexToBinary(sessionKey);
    const sequence = binaryToBlinkSequence(binary);
    
    // Update UI and start sequence
    isBlinking = true;
    textSection.style.display = 'none';
    stopBtn.style.display = 'block';
    executeBlinkSequence(sequence, rate);
}

/**
 * Stops the blinking sequence and resets UI
 */
function stopBlinking() {
    // Clear the blink interval if it exists
    if (blinkInterval) {
        clearInterval(blinkInterval);
        blinkInterval = null;
    }
    
    // Reset state and UI
    isBlinking = false;
    document.body.style.backgroundColor = '#000000';
    textSection.style.display = 'block';
    stopBtn.style.display = 'none';
}

// ==============================================
// Event Listeners
// ==============================================

// Start button click handler
if (startBtn) {
    startBtn.addEventListener('click', () => {
        // Check URL parameters first
        const urlParams = new URLSearchParams(window.location.search);
        const urlKey = urlParams.get('key');
        
        // Then check input field if it exists
        const inputKey = sessionKeyInput ? sessionKeyInput.value.toLowerCase() : null;
        
        // Use whichever key is available
        const sessionKey = urlKey || inputKey;
        
        if (sessionKey) {
            startBlinking(sessionKey);
        } else {
            alert('No session key found');
        }
    });
}

// Stop button click handler
if (stopBtn) {
    stopBtn.addEventListener('click', stopBlinking);
}

// Confirm session button handler (on landing page)
if (confirmSessionBtn && sessionKeyInput) {
    confirmSessionBtn.addEventListener('click', () => {
        const sessionKey = sessionKeyInput.value.toLowerCase();
        if (sessionKey && sessionKey.length === 5) {
            // Redirect to blink page with key and rate parameters
            window.location.href = `./blink/index.html?key=${sessionKey}&rate=${DEFAULT_BLINK_RATE}`;
        } else {
            alert('Please enter a valid 5-character hex code');
        }
    });
}

// ==============================================
// Page Load Handler
// ==============================================

window.addEventListener('load', () => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const sessionKey = urlParams.get('key');
    const blinkRate = parseInt(urlParams.get('rate')) || DEFAULT_BLINK_RATE;
    
    // Log device detection for debugging
    console.log('Is mobile device?', isMobileDevice());
    
    if (!isMobileDevice()) {
        // Desktop behavior: Show QR code
        textSection.style.display = 'none';
        qrSection.style.display = 'block';
        
        // Generate QR code with current URL
        const currentUrl = new URL(window.location.href);
        const mobileUrl = currentUrl.toString();
        console.log('Mobile URL:', mobileUrl);
        
        // Configure and create QR code
        new QRCode(document.getElementById("qr-code"), {
            text: mobileUrl,
            width: 256,
            height: 256,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        // Make QR code clickable for desktop override
        qrCode.style.cursor = 'pointer';
        qrCode.addEventListener('click', () => {
            qrSection.style.display = 'none';
            textSection.style.display = 'block';
            if (sessionKey) {
                startBlinking(sessionKey, blinkRate);
            }
        });

        // Add click instruction text
        const bypassText = document.createElement('p');
        //bypassText.textContent = 'Click QR code to proceed anyway';
        //bypassText.style.marginTop = '1rem';
        qrCode.parentNode.insertBefore(bypassText, qrCode.nextSibling);
    } else {
        // Mobile behavior: Show blink interface
        qrSection.style.display = 'none';
        textSection.style.display = 'block';
        if (sessionKey) {
            startBlinking(sessionKey, blinkRate);
        }
    }
}); 