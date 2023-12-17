import axios from 'axios'

// Constants for localStorage keys and expiry time
const API_KEY_STORAGE_KEY = 'openai_api_key'
const EXPIRY_TIME = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

// Function to save the API key with an expiry timestamp
function saveApiKeyWithExpiry(apiKey: string) {
    const expiryTimestamp = new Date().getTime() + EXPIRY_TIME
    const apiKeyWithExpiry = JSON.stringify({ apiKey, expiryTimestamp })
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKeyWithExpiry)
}

// Function to get the API key if it's not expired
function getApiKey(): string | null {
    const apiKeyWithExpiry = localStorage.getItem(API_KEY_STORAGE_KEY)
    if (apiKeyWithExpiry) {
        const { apiKey, expiryTimestamp } = JSON.parse(apiKeyWithExpiry)
        if (new Date().getTime() < expiryTimestamp) {
            return apiKey
        } else {
            // Clear expired API key
            clearApiKey()
        }
    }
    return null
}

// Function to clear the API key from storage
function clearApiKey() {
    localStorage.removeItem(API_KEY_STORAGE_KEY)
}

// Example usage:
// User enters their API key in a form input and submits
function handleApiKeySubmit(apiKey: string) {
    saveApiKeyWithExpiry(apiKey)
}

// When making an API request
async function makeOpenAiApiRequest(
    endpoint: string,
    body?: any,
    apiKeyForced?: string | undefined,
    kwargs?: any
) {
    const apiKey = apiKeyForced ?? getApiKey()
    if (!apiKey) {
        // Prompt user for their API key as it's either not set or expired
        console.log('API key is required or has expired.')
        return
    }

    const config = {
        ...kwargs,
        headers: {
            Authorization: `Bearer ${apiKey}`,
        },
    }

    const response = await axios.post(endpoint, body, config)
    const data = await response.data

    return data
}

export { clearApiKey, getApiKey, handleApiKeySubmit, makeOpenAiApiRequest }
