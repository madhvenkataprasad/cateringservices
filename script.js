// Prevent multiple navigation clicks
let isNavigating = false;

function goBack() {
    if (isNavigating) {
        console.log('Navigation in progress, ignoring back click');
        return;
    }
    isNavigating = true;
    console.log('Navigating back to:', document.referrer || 'index.html');
    const previousPage = document.referrer.includes(window.location.hostname) ?
        new URL(document.referrer).pathname :
        '/index.html';
    window.location.href = previousPage;
}

// Handle popstate for back/forward navigation
window.addEventListener('popstate', function(event) {
    const url = event.state ? .page || 'index.html';
    console.log('Popstate triggered, navigating to:', url);
    window.location.href = url;
});

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded:', window.location.pathname);
    history.replaceState({ page: window.location.pathname }, '', window.location.pathname);
    isNavigating = false;
});