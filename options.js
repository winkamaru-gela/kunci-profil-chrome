document.getElementById('save-btn').addEventListener('click', () => {
    const oldPasswordInput = document.getElementById('old-password').value;
    const newPasswordInput = document.getElementById('new-password').value;
    const statusMsg = document.getElementById('status-msg');

    if (!newPasswordInput) {
        statusMsg.textContent = "Sandi baru tidak boleh kosong!";
        statusMsg.className = "error";
        return;
    }

    // Ambil sandi lama dari database lokal ekstensi
    chrome.storage.local.get(['password'], function(result) {
        if (oldPasswordInput === result.password) {
            // Jika sandi lama cocok, simpan sandi yang baru
            chrome.storage.local.set({ password: newPasswordInput }, () => {
                statusMsg.textContent = "Sandi berhasil diubah!";
                statusMsg.className = "success";
                
                // Kosongkan form input
                document.getElementById('old-password').value = '';
                document.getElementById('new-password').value = '';
            });
        } else {
            // Jika sandi lama salah
            statusMsg.textContent = "Sandi lama salah!";
            statusMsg.className = "error";
        }
    });
});