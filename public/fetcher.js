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
            // First, check if data exists in database
            let cachedData = await checkDatabaseCache(inputValue, dataType);

            if (cachedData) {
                // Use cached data if found
                console.log("Cached data found!")
                displayResults(cachedData, dataType);
                console.log("Cached data displayed!")
                return;
            }

            // If no cached data, fetch from API
            console.log("No cached data found!")
            let apiResponse;
            if (dataType === 'phone') {
                apiResponse = await fetchPhoneVerification(inputValue);
                await saveToDatabase(apiResponse, 'phone_number', {
                    phone_number: inputValue,
                    valid: apiResponse.valid,
                    location: apiResponse.location_name
                });
            } else if (dataType === 'email') {
                apiResponse = await fetchEmailVerification(inputValue);
                await saveToDatabase(apiResponse, 'email_address', {
                    email_address: inputValue,
                    format: apiResponse.format_valid,
                    domain: apiResponse.domain,
                    disposable: apiResponse.disposable,
                    dns: apiResponse.dns_valid
                });
            } else if (dataType === 'address') {
                apiResponse = await fetchAddressVerification(inputValue);
                await saveToDatabase(apiResponse[0], 'physical_addresses', {
                    address: inputValue,
                    dpv_match_code: apiResponse[0].components.dpv_match_code,
                    dpv_vacant: apiResponse[0].components.dpv_vacant
                });
            }

            displayResults(apiResponse, dataType);
        } catch (error) {
            displayError('An error occurred while verifying. Please try again.');
            console.error('Verification failed:', error);
        }
    });

    // Check database cache for existing entry
    async function checkDatabaseCache(value, type) {
        let endpoint;
        switch(type) {
            case 'phone':
                endpoint = `/phone_numbers/${encodeURIComponent(value)}`;
                console.log(endpoint)
                break;
            case 'email':
                endpoint = `/email_addresses/${encodeURIComponent(value)}`;
                console.log(endpoint)
                break;
            case 'address':
                endpoint = `/physical_addresses/${encodeURIComponent(value)}`;
                console.log(endpoint)
                break;
            default:
                throw new Error('Invalid data type');
        }

        try {
            const response = await fetch(endpoint);
            if (response.status === 404) {
                // No cached data found
                return null;
            }
            // if (!response.ok) throw new Error('Database query returned no results.');
            return await response.json();
        } catch (error) {
            console.error('Database cache check failed:', error);
            return null;
        }
    }
    
    // Save verification result to database
    async function saveToDatabase(data, table, payload) {
        try {
            const response = await fetch(`/${table}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            // if (!response.ok) throw new Error('Failed to save to database');
            return await response.json();
        } catch (error) {
            console.error('Database save failed:', error);
        }
    }

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
        const apiKey = '441310475c38d772a9b0b636e3e872ac';
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
        const apiKey = '215193069828770156';
        const url = `https://us-street.api.smartystreets.com/street-address?key=${apiKey}&address=${encodeURIComponent(address)}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch address verification.');
        const data = await response.json();
        return data;
    }
});