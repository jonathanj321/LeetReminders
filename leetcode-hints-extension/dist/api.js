const API_CONFIG = {
    BASE_URL: 'https://3f5iehmu7c.execute-api.us-east-1.amazonaws.com/prod', 
    ENDPOINTS: {
        SAVE_HINT: '/hints',
        GET_HINTS: '/hints',
        DELETE_HINT: '/hints'
    }
};

async function saveHint(text, hintNumber, statusElement) {
    const userId = getUserId();
    const problemId = getProblemIdFromUrl();
    
    statusElement.textContent = '💾 Saving...';
    statusElement.style.color = '#text-label-3 dark:text-dark-label-3';
    
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SAVE_HINT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                problemId: problemId,
                hintNumber: hintNumber,
                hintText: text
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        statusElement.textContent = '✅ Saved!';
        statusElement.style.color = '#28a745';
        
        setTimeout(() => {
            statusElement.textContent = '';
        }, 2000);
        
        return true;
    } catch (error) {
        console.error('Error saving hint:', error);
        statusElement.textContent = '❌ Save failed';
        statusElement.style.color = '#dc3545';
        
        try {
            const hintKey = `hint_${hintNumber}_${btoa(window.location.href).slice(0, 50)}`;
            localStorage.setItem(hintKey, text);
            setTimeout(() => {
                statusElement.textContent = '💾 Saved locally';
                statusElement.style.color = '#ffc107';
            }, 1000);
            return true;
        } catch (localError) {
            console.error('Local storage also failed:', localError);
            return false;
        }
    }
}

async function deleteHint(hintNumber) {
    const userId = getUserId();
    const problemId = getProblemIdFromUrl();
    
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DELETE_HINT}?userId=${encodeURIComponent(userId)}&problemId=${encodeURIComponent(problemId)}&hintNumber=${hintNumber}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return true;
    } catch (error) {
        console.error('Error deleting hint:', error);
        
        try {
            const hintKey = `hint_${hintNumber}_${btoa(window.location.href).slice(0, 50)}`;
            localStorage.removeItem(hintKey);
            return true;
        } catch (localError) {
            console.error('Local storage delete also failed:', localError);
            return false;
        }
    }
}

async function loadHint(hintNumber) {
    const userId = getUserId();
    const problemId = getProblemIdFromUrl();
    
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_HINTS}?userId=${encodeURIComponent(userId)}&problemId=${encodeURIComponent(problemId)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const hint = result.hints[hintNumber];
        return hint ? hint.text : null;
    } catch (error) {
        console.error('Error loading hint:', error);
        
        try {
            const hintKey = `hint_${hintNumber}_${btoa(window.location.href).slice(0, 50)}`;
            return localStorage.getItem(hintKey);
        } catch (localError) {
            console.error('Local storage load also failed:', localError);
            return null;
        }
    }
}

