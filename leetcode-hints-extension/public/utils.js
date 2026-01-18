function getUserId() {
    const loginButton = document.querySelector('a[href="/accounts/login/"]');
    const signUpButton = document.querySelector('a[href="/accounts/signup/"]');

    if (loginButton || signUpButton) {
        let anonId = localStorage.getItem('leetcode_hints_anon_id');
        if (!anonId) {
            anonId = 'anon_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
            localStorage.setItem('leetcode_hints_anon_id', anonId);
        }
        return anonId;
    }

    const usernameElement = document.querySelector('[data-cy="user-avatar"]') ||
        document.querySelector('img[alt*="avatar"]') ||
        document.querySelector('.nav-user-pic-container img') ||
        document.querySelector('[data-testid="user-menu"] img');

    if (usernameElement) {
        const altText = usernameElement.alt;
        if (altText && altText.includes('avatar')) {
            const username = altText.replace("'s avatar", "").replace(" avatar", "");
            if (username && username !== "avatar") {
                return username;
            }
        }
    }

    const profileLink = document.querySelector('a[href^="/u/"]');
    if (profileLink) {
        const match = profileLink.href.match(/\/u\/([^\/]+)/);
        if (match) {
            return match[1];
        }
    }
}

function getProblemIdFromUrl() {
    const url = window.location.href;
    const match = url.match(/\/problems\/([^/]+)/);
    return match ? match[1] : 'unknown';
}

// Helper to grab the problem text from LeetCode's DOM
function getProblemDescription() {
    const descriptionEl = document.querySelector('div[data-track-load="description_content"]');
    if (!descriptionEl) return null;
    return descriptionEl.innerText;
}