document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.getElementById('submit-button');
    const inputData = document.getElementById('input-data');
    const resultsContainer = document.getElementById('results');

    submitButton.addEventListener('click', async () => {
        const inputValue = inputData.value.trim();
        const selectedOption = document.querySelector('input[name="data"]:checked');

        // Input validation
        if (!inputValue) {
            displayError('Please enter a value to verify.');
            return; 
        }

        if (!selectedOption) {
            displayError('Please select the type of data (email, address, or phone) to verify.');
            return;
        }

        // Clear previous results
        resultsContainer.innerHTML = `<p>Loading...</p>`;

        const dataType = selectedOption.value;

        try {
            let apiResponse;
            if (dataType === 'phone') {
                apiResponse = await fetchPhoneVerification(inputValue);
            } else if (dataType === 'email') {
                apiResponse = await fetchEmailVerification(inputValue);
            } else if (dataType === 'address') {
                apiResponse = await fetchAddressVerification(inputValue);
            }

            displayResults(apiResponse, dataType);
        } catch (error) {
            displayError('An error occurred while verifying. Please try again.');
            console.error('API request failed:', error);
        }
    });

    // Display the API response in the #results div
    function displayResults(data, dataType) {
        resultsContainer.innerHTML = `<h3>Verification Results for ${dataType.toUpperCase()}</h3>`;
        resultsContainer.innerHTML += `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    }

    // Display an error message
    function displayError(message) {
        resultsContainer.innerHTML = `<p style="color:red;">${message}</p>`;
    }

    // Call to Numverify for phone verification
    async function fetchPhoneVerification(phoneNumber) {
        const apiKey = 'YOUR_NUMVERIFY_API_KEY';
        const url = `http://apilayer.net/api/validate?access_key=${apiKey}&number=${phoneNumber}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch phone verification.');
        const data = await response.json();
        return data;
    }

    // Call to EmailRep for email verification
    async function fetchEmailVerification(email) {
        const url = `https://emailrep.io/${email}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch email verification.');
        const data = await response.json();
        return data;
    }

    // Call to Smarty API for address verification
    async function fetchAddressVerification(address) {
        const apiKey = 'YOUR_SMARTY_API_KEY';
        const url = `https://us-street.api.smartystreets.com/street-address?key=${apiKey}&address=${encodeURIComponent(address)}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch address verification.');
        const data = await response.json();
        return data;
    }
});
