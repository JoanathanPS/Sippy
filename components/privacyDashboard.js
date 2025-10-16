/**
 * Sippy - Privacy Dashboard
 */

const SippyPrivacy = {
    /**
     * Show privacy info
     */
    showInfo() {
        const size = SippyData.getStorageSize();
        SippyUtils.showToast(`Storage used: ${size} KB. All data is stored locally on your device.`, 5000);
    }
};

window.SippyPrivacy = SippyPrivacy;

