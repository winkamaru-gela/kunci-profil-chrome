// --- 1. LOGIKA UTAMA MEMBUKA KUNCI ---
document.getElementById('unlock-btn').addEventListener('click', () => {
    const input = document.getElementById('password-input').value;
    
    chrome.storage.local.get(['password'], function(result) {
        if (input === result.password) {
            // Jika sandi benar, ubah status terkunci menjadi false
            chrome.storage.local.set({ isLocked: false }, () => {
                // Buka Tab Baru agar browser tidak tertutup
                chrome.tabs.create({ url: "chrome://newtab/" }, () => {
                    // Tutup layar kunci
                    window.close();
                });
            });
        } else {
            // Jika sandi salah
            document.getElementById('error-msg').style.display = 'block';
            document.getElementById('guest-instruction').style.display = 'none';
        }
    });
});

// Fitur menekan tombol "Enter" di keyboard
document.getElementById('password-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        document.getElementById('unlock-btn').click();
    }
});

// --- 2. LOGIKA TOMBOL INSTRUKSI USER TAMU ---
document.getElementById('guest-btn').addEventListener('click', () => {
    const instruksi = document.getElementById('guest-instruction');
    const errorMsg = document.getElementById('error-msg');
    
    // Sembunyikan pesan error jika sedang muncul
    errorMsg.style.display = 'none';
    
    // Munculkan atau sembunyikan instruksi tamu
    if (instruksi.style.display === 'block') {
        instruksi.style.display = 'none';
    } else {
        instruksi.style.display = 'block';
    }
});


// --- 3. FITUR KEAMANAN: BLOKIR INSPECT ELEMENT & KLIK KANAN ---

// Mencegah menu Klik Kanan muncul
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Mencegah kombinasi tombol keyboard untuk Developer Tools
document.addEventListener('keydown', function(e) {
    // Blokir tombol F12
    if (e.key === 'F12') {
        e.preventDefault();
    }
    
    // Blokir kombinasi Ctrl + Shift + I (Inspect Element)
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
    }

    // Blokir kombinasi Ctrl + Shift + J (Console)
    if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
    }

    // Blokir kombinasi Ctrl + Shift + C (Inspect Element Selection)
    if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
    }

    // Blokir kombinasi Ctrl + U (View Page Source)
    if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
    }
});