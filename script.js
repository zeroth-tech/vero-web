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
const blinkRateSelect = document.getElementById('blink-rate'); // New element
const smsNumberInput = document.getElementById('sms-number');   // New element
const smsLink = document.getElementById('sms-link');         // New element
const emailForm = document.getElementById('email-form');       // New element
const emailAddressInput = document.getElementById('email-address'); // New element
const emailSessionKeyInput = document.getElementById('email-session-key'); // New element
const emailBlinkRateInput = document.getElementById('email-blink-rate'); // New element

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

// Add listeners only if the elements exist on the page
if (sessionKeyInput) {
    sessionKeyInput.addEventListener('input', updateSmsLink);
}
if (blinkRateSelect) {
    blinkRateSelect.addEventListener('change', updateSmsLink); // Use 'change' for select elements
}
if (smsNumberInput) {
    smsNumberInput.addEventListener('input', updateSmsLink);
}
if (emailForm) {
    emailForm.addEventListener('submit', handleEmailFormSubmit);
} else {
    console.warn("Email form not found. Submission handling disabled.");
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

    // Set the initial SMS link based on default values when the page loads
    updateSmsLink();
});

// --- Configuration ---
// IMPORTANT: Replace this with the actual URL of your Vero Blink page
const VERO_BLINK_BASE_URL = 'https://your-domain.com/verify-blink'; // MODIFY THIS
// --- End Configuration ---

// --- Functions ---

/**
 * Generates the full Vero Blink verification URL.
 * @param {string} baseUrl - The base URL of the verification page.
 * @param {string} sessionKey - The session key.
 * @param {string} blinkRate - The blink rate.
 * @returns {string} The complete verification URL.
 */
function generateVerificationLink(baseUrl, sessionKey, blinkRate) {
    // Basic validation
    if (!sessionKey || !blinkRate) {
        console.warn("Session key or blink rate is missing for link generation.");
        return ''; // Return empty if essential parts are missing
    }
    try {
        const url = new URL(baseUrl);
        url.searchParams.set('sessionKey', sessionKey);
        url.searchParams.set('blinkRate', blinkRate);
        return url.toString();
    } catch (error) {
        console.error("Error creating verification URL:", error);
        return ''; // Return empty on error (e.g., invalid base URL)
    }
}

/**
 * Updates the href attribute of the SMS link based on current input values.
 */
function updateSmsLink() {
    // Ensure all required elements exist before proceeding
    if (!sessionKeyInput || !blinkRateSelect || !smsNumberInput || !smsLink) {
        console.error("One or more elements required for SMS link are missing.");
        return;
    }

    try {
        const sessionKey = sessionKeyInput.value.trim();
        const blinkRate = blinkRateSelect.value; // Get value from select
        const phoneNumber = smsNumberInput.value.trim();
        const verificationLink = generateVerificationLink(VERO_BLINK_BASE_URL, sessionKey, blinkRate);

        // Disable link if essential info is missing or invalid
        let isValid = true;
        if (!verificationLink) {
            isValid = false;
        }

        // Basic validation for phone number format (optional, adjust as needed)
        if (!phoneNumber || !/^\+?[0-9\s\-()]+$/.test(phoneNumber)) {
             // Optionally provide user feedback about invalid number
             isValid = false;
        }

        if (isValid) {
             smsLink.style.opacity = '1';
             smsLink.style.cursor = 'pointer';
             smsLink.classList.remove('disabled'); // Use a class for disabling style

             const smsBody = `Click this link to verify liveness with Vero: ${verificationLink}`;
             // Encode the body text for the SMS URL
             smsLink.href = `sms:${phoneNumber.replace(/[\s\-()]/g, '')}?body=${encodeURIComponent(smsBody)}`; // Remove formatting chars for href
        } else {
             smsLink.removeAttribute('href'); // Disable link
             smsLink.style.opacity = '0.6';
             smsLink.style.cursor = 'not-allowed';
             smsLink.classList.add('disabled'); // Add disabled class
        }

     } catch (error) {
        console.error("Error updating SMS link:", error);
        // Handle errors, e.g., disable the link or show a message
        if (smsLink) {
            smsLink.removeAttribute('href');
            smsLink.style.opacity = '0.6';
            smsLink.style.cursor = 'not-allowed';
            smsLink.classList.add('disabled');
        }
    }
}

/**
 * Updates hidden form fields before email form submission.
 */
function handleEmailFormSubmit(event) {
    // Ensure all required elements exist
     if (!sessionKeyInput || !blinkRateSelect || !emailSessionKeyInput || !emailBlinkRateInput || !emailAddressInput) {
        console.error("One or more elements required for email submission are missing.");
        event.preventDefault(); // Prevent submission if elements are missing
        alert("Error: Cannot prepare email. Please check console.");
        return;
    }

    // Update hidden fields with the current values from the visible inputs/select
    const currentSessionKey = sessionKeyInput.value.trim();
    const currentBlinkRate = blinkRateSelect.value;
    const currentEmail = emailAddressInput.value.trim();

    // Basic validation before setting hidden fields
    if (!currentSessionKey || !currentBlinkRate || !currentEmail) {
        event.preventDefault(); // Stop the form submission
        alert("Please ensure Session Key, Blink Rate, and Email Address are provided.");
        return;
    }

    emailSessionKeyInput.value = currentSessionKey;
    emailBlinkRateInput.value = currentBlinkRate;

    console.log(`Preparing to submit email form to ${event.target.action}`);
    console.log(`Email: ${currentEmail}`);
    console.log(`Session Key: ${emailSessionKeyInput.value}`);
    console.log(`Blink Rate: ${emailBlinkRateInput.value}`);

    // The form will now submit via standard HTML form submission.
    // Actual email sending MUST be handled by your backend endpoint at '/send-email'.
    // Consider adding a visual indicator that the form is submitting.
}

// Optional: Add a CSS class for disabled state if needed in style.css
// .btn.disabled, .btn-secondary.disabled {
//   opacity: 0.6;
//   cursor: not-allowed;
// } 

document.addEventListener('DOMContentLoaded', () => {
    const sessionKeyInput = document.getElementById('session-key');
    const blinkRateSelect = document.getElementById('blink-rate');
    const sendButton = document.getElementById('send-session-button');

    if (sendButton && sessionKeyInput && blinkRateSelect) {
        sendButton.addEventListener('click', () => {
            const sessionKey = sessionKeyInput.value.trim();
            const blinkRate = blinkRateSelect.value;

            // Basic validation
            if (!sessionKey) {
                alert('Please enter a session key.');
                sessionKeyInput.focus();
                return;
            }
             if (sessionKey.length !== 5) { // Optional: Enforce length if needed
                alert('Session key should be 5 characters.');
                 sessionKeyInput.focus();
                 return;
             }
            if (!blinkRate) {
                alert('Please select a blink rate.');
                blinkRateSelect.focus();
                return;
            }

            // Construct the URL for the send page with query parameters
            const sendUrl = `send.html?sessionKey=${encodeURIComponent(sessionKey)}&blinkRate=${encodeURIComponent(blinkRate)}`;

            // Redirect the user
            window.location.href = sendUrl;
        });
    } else {
        console.error("Required elements (button, session key input, or blink rate select) not found on index.html");
    }
}); 