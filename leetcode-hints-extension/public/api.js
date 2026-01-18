const API_CONFIG = {
    BASE_URL: 'https://3f5iehmu7c.execute-api.us-east-1.amazonaws.com/prod',
    ENDPOINTS: {
        SAVE_HINT: '/hints',
        GET_HINTS: '/hints',
        DELETE_HINT: '/hints',
        GENERATE: '/generate'
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

/**
 * MAIN FUNCTION: Called when user clicks "Get Hint"
 * 1. Fetches top community solution (if possible)
 * 2. Calls Lambda (which handles Cache check + AI Generation)
 */
async function generateAIHints(problemText) {
    console.log("Starting Hint Process...");

    const problemSlug = getProblemIdFromUrl();

    let topSolution = null;
    try {
        topSolution = await fetchTopCommunitySolution(problemSlug);
    } catch (e) {
        console.warn("Could not fetch community solution, using fallback.", e);
    }

    //Lambda Call
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GENERATE}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                problemSlug: problemSlug,
                problemText: problemText,
                topSolution: topSolution
            })
        });

        if (!response.ok) throw new Error('Lambda call failed');

        const data = await response.json();

        console.log(`✅ Success! Source: ${data.source}`);
        return data.hints; // Returns ["Hint 1", "Hint 2", "Hint 3"]

    } catch (error) {
        console.error('Error getting hints:', error);
        return null;
    }
}


async function fetchTopCommunitySolution(problemSlug) {
    console.log(`🕵️ Hunting for 'Most Voted' solution for: ${problemSlug}...`);

    const csrfToken = document.cookie.split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];

    if (!csrfToken) {
        console.error("❌ No CSRF token. Are you logged in?");
        return null;
    }

    const query = `
    query communitySolutions($questionSlug: String!, $skip: Int!, $first: Int!, $query: String, $orderBy: TopicSortingOption, $languageTags: [String!], $topicTags: [String!]) {
      questionSolutions(
        filters: {questionSlug: $questionSlug, skip: $skip, first: $first, query: $query, orderBy: $orderBy, languageTags: $languageTags, topicTags: $topicTags}
      ) {
        solutions {
          id
          title
          post {
            content
          }
        }
      }
    }
    `;

    const response = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-csrftoken': csrfToken
        },
        body: JSON.stringify({
            query: query,
            variables: {
                query: "",
                languageTags: [],
                topicTags: [],
                questionSlug: problemSlug,
                skip: 0,
                first: 1,
                orderBy: "most_votes" // Sorting by Most Votes
            }
        })
    });

    if (!response.ok) return null;

    const data = await response.json();
    const solution = data.data?.questionSolutions?.solutions?.[0];

    if (solution) {
        console.log("Found Solution:", solution.title);
        return solution.post.content;
    }
    return null;
}
