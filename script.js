// Prevent multiple navigation clicks
let isNavigating = false;

function showLoading(url) {
    if (isNavigating) {
        console.log('Navigation in progress, ignoring click');
        return;
    }
    isNavigating = true;

    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
        console.log('Showing loading overlay for', url);
    } else {
        console.warn('Loading overlay not found');
    }

    // Directly redirect to the new URL
    window.location.href = url; //
    // The isNavigating flag will be reset by the DOMContentLoaded event on the new page.
}

function goBack() {
    if (isNavigating) {
        console.log('Navigation in progress, ignoring back click');
        return;
    }
    console.log('Navigating back');
    history.back(); // Navigate to the previous page in history
}

// Handle popstate for back/forward navigation
window.addEventListener('popstate', function(event) {
    // When the browser's history entry changes (e.g., via back/forward buttons),
    // this event fires. We reload the page corresponding to the new state.
    if (event.state && event.state.page) { //
        console.log('Popstate triggered, navigating to:', event.state.page); //
        window.location.href = event.state.page; //
    } else {
        // Fallback for cases where state might be null (e.g., initial page load, or navigating beyond history)
        console.log('Popstate triggered with no state, defaulting to current path.'); //
        window.location.href = window.location.pathname; //
    }
});

// Initialize the page
document.addEventListener('DOMContentLoaded', function() { //
    console.log('Page loaded:', window.location.pathname); //
    // Replace the current history entry with one that explicitly includes the page URL.
    // This ensures consistent behavior when navigating back/forward.
    history.replaceState({ page: window.location.pathname }, '', window.location.pathname); //
    const loadingOverlay = document.getElementById('loadingOverlay'); //
    if (loadingOverlay) { //
        loadingOverlay.style.display = 'none'; // Ensure overlay is hidden on page load
    }
    // Reset navigation flag when a new page has successfully loaded
    isNavigating = false;
});