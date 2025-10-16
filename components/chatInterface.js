/**
 * Sippy - Chat Interface
 */

const SippyChat = {
    loopTimer: null,
    /**
     * Show chat message
     */
    showMessage(message, actions = []) {
        // Use bubble message for now
        if (window.SippyBubble) {
            SippyBubble.showMessage(message, 5000);
        }
    },
    
    /**
     * Get contextual message
     */
    getContextualMessage() {
        if (window.SippyHydration) {
            return SippyHydration.getMotivationalMessage();
        }
        return 'Stay hydrated! 💧';
    },

    /**
     * Start proactive motivation loop
     */
    startLoop() {
        if (this.loopTimer) clearInterval(this.loopTimer);
        this.loopTimer = setInterval(() => {
            const msg = this.getContextualMessage();
            this.showMessage(msg);
        }, 15 * 60 * 1000); // every 15 minutes
    }
};

window.SippyChat = SippyChat;

