/**
 * Sippy - Chat Interface
 */

const SippyChat = {
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
    }
};

window.SippyChat = SippyChat;

