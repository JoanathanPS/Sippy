/**
 * Sippy - Animated Mascot "Sippy"
 */

const SippyMascot = {
    emotions: {
        happy: '😊',
        excited: '🤩',
        worried: '😟',
        tired: '😴',
        celebrating: '🎉',
        sleeping: '😴',
        thinking: '🤔',
        urgent: '😰'
    },
    
    currentEmotion: 'happy',
    
    /**
     * Set mascot emotion
     */
    setEmotion(emotion) {
        this.currentEmotion = emotion;
        const emoji = this.emotions[emotion] || this.emotions.happy;
        
        // Update all mascot elements
        document.querySelectorAll('[id*="mascot"], [id*="Mascot"]').forEach(el => {
            if (el.classList.contains('mascot-container')) {
                el.className = `mascot-container emotion-${emotion}`;
            }
            el.textContent = emoji;
        });
    },
    
    /**
     * Show mascot with message
     */
    showWithMessage(emotion, message, duration = 3000) {
        this.setEmotion(emotion);
        if (window.SippyBubble) {
            SippyBubble.showMessage(message, duration);
        }
    }
};

window.SippyMascot = SippyMascot;

