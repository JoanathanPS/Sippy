/**
 * Sippy - Notifications Component
 */

const SippyNotifications = {
    /**
     * Show notification
     */
    show(message, type = 'info') {
        SippyUtils.showToast(message);
    }
};

window.SippyNotifications = SippyNotifications;

