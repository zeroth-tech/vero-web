// DOM Elements
const sessionKeyInput = document.getElementById('session-key');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const inputSection = document.getElementById('input-section');

// Blink sequence state
let isBlinking = false;
let blinkInterval = null;

// Convert hex to binary
function hexToBinary(hex) {
    return parseInt(hex, 16).toString(2).padStart(20, '0');
}

// Convert binary to blink sequence
function binaryToBlinkSequence(binary) {
    let sequence = '';
    for (let bit of binary) {
        sequence += bit === '1' ? 'G_' : 'B_';
    }
    sequence += 'R'; // Add terminator
    return sequence;
}

// Execute blink sequence
function executeBlinkSequence(sequence) {
    let currentIndex = 0;
    const colors = {
        'G': '#00ff00', // Green for 1
        'B': '#0000ff', // Blue for 0
        'R': '#ff0000', // Red for terminator
        '_': '#000000'  // Black for delimiter
    };

    blinkInterval = setInterval(() => {
        if (currentIndex >= sequence.length) {
            currentIndex = 0; // Loop the sequence
        }

        const currentChar = sequence[currentIndex];
        document.body.style.backgroundColor = colors[currentChar];
        currentIndex++;
    }, 200);
}

// Start blinking
function startBlinking(sessionKey) {
    if (!sessionKey || sessionKey.length !== 5) {
        alert('Please enter a valid 5-character hex code');
        return;
    }

    const binary = hexToBinary(sessionKey);
    const sequence = binaryToBlinkSequence(binary);
    
    isBlinking = true;
    inputSection.style.display = 'none';
    stopBtn.style.display = 'block';
    executeBlinkSequence(sequence);
}

// Stop blinking
function stopBlinking() {
    if (blinkInterval) {
        clearInterval(blinkInterval);
        blinkInterval = null;
    }
    isBlinking = false;
    document.body.style.backgroundColor = '#000000';
    inputSection.style.display = 'block';
    stopBtn.style.display = 'none';
}

// Event Listeners
startBtn.addEventListener('click', () => {
    const sessionKey = sessionKeyInput.value.toLowerCase();
    startBlinking(sessionKey);
});

stopBtn.addEventListener('click', stopBlinking);

// Check URL for session key
window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionKey = urlParams.get('key');
    
    if (sessionKey) {
        startBlinking(sessionKey);
    }
}); 