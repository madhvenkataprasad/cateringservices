function showLoading(url) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
        console.log('Showing loading overlay for', url);
    }

    setTimeout(() => {
        window.location.href = url;
    }, 500);
}

function goBack() {
    window.history.back();
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded:', window.location.pathname);
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
});