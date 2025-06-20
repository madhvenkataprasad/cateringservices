function goBack() {
    window.history.back();
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded:', window.location.pathname);

    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }

    // Loader animation when clicking any <a>
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            if (loadingOverlay) {
                loadingOverlay.style.display = 'flex';
            }
        });
    });
});