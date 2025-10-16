/**
 * Sippy - Privacy Dashboard
 */

const SippyPrivacy = {
    /**
     * Show privacy info
     */
    showInfo() {
        const size = SippyData.getStorageSize();
        const message = `All processing is local. No login, no cloud, no telemetry.\nStorage used: ${size} KB.`;
        SippyUtils.showToast(message, 6000);
    }
};

window.SippyPrivacy = SippyPrivacy;

