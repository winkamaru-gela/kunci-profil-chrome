// Mengatur sandi awal saat diinstal
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(['password'], function(result) {
        if (!result.password) {
            chrome.storage.local.set({ password: "admin", isLocked: true });
        } else {
            chrome.storage.local.set({ isLocked: true });
        }
    });
});

// Mengunci browser saat baru dibuka
chrome.runtime.onStartup.addListener(() => {
    chrome.storage.local.set({ isLocked: true });
});

// Memantau setiap tab
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    const url = changeInfo.url || tab.pendingUrl || tab.url;
    if (url) { 
        periksaDanAlihkan(tabId, url);
    }
});

function periksaDanAlihkan(tabId, url) {
    chrome.storage.local.get(['isLocked'], function(result) {
        
        // --- BLOKIR MENU EKSTENSI (Lihat penjelasan di bawah) ---
        /*
        if (url.startsWith("chrome://extensions")) {
            chrome.tabs.update(tabId, { url: chrome.runtime.getURL("options.html") }).catch(() => {});
            return; 
        }
        */
        // --------------------------------------------------------

        if (result.isLocked) {
            const urlKunci = chrome.runtime.getURL("kunci.html");
            
            // PERBAIKAN: Tambahkan pengecualian untuk 'chrome-extension://'
            // Jika tab yang dibuka BUKAN halaman kunci, BUKAN devtools, dan BUKAN dari ekstensi lain
            if (!url.startsWith(urlKunci) && 
                !url.startsWith("devtools://") && 
                !url.startsWith("chrome-extension://")) {
                
                // Cek apakah tab kunci sudah ada yang terbuka?
                chrome.tabs.query({ url: urlKunci }, function(tabs) {
                    if (tabs.length > 0) {
                        // Jika sudah ada, TUTUP tab yang baru ini agar tidak dobel
                        chrome.tabs.remove(tabId).catch(() => {});
                        // Fokuskan ke tab kunci yang sudah ada
                        chrome.tabs.update(tabs[0].id, { active: true });
                    } else {
                        // Jika belum ada, ubah tab ini menjadi layar kunci
                        chrome.tabs.update(tabId, { url: urlKunci }).catch(() => {});
                    }
                });
            }
        }
    });
}