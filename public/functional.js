const host = window.location.origin;

document.addEventListener('DOMContentLoaded', () => {
  // Generate ASCII title using Figlet.js

  const submitButton = document.getElementById('submit-button');
  const inputData = document.getElementById('input-data');
  const resultsContainer = document.getElementById('results');

  submitButton.addEventListener('click', async () => {
      const inputValue = inputData.value.trim();
      const selectedOption = document.querySelector('input[name="data"]:checked');

      console.log(selectedOption.value);


      // Input validation
      if (!inputValue) {
          displayError('Please enter a value to verify.');
          return;
      }

      if (selectedOption.value == "phone" && inputValue.length < 11) {
          displayError('Please input a complete phone number with country code included.');
          return;
      }
      if (selectedOption.value == "address" && !inputValue.match(/\b\d{5}(?:-\d{4})?\b/)) {
        displayError('Valid 5 or 9-digit ZIP code required.');
        return;
      } 

      if (!selectedOption.value) {
        displayError('Please select the type of data (email, address, or phone) to verify.');
        return;
    }

      const dataType = selectedOption.value;

      try {
                    // First, check if data exists in database
        let cachedData = await checkDatabaseCache(inputValue, dataType);

        if (cachedData) {
            generateResultBox(inputValue, cachedData, dataType);
            return;
        }
          let apiResponse;
          if (dataType === 'phone') {
              apiResponse = await fetchPhoneVerification(inputValue);
              console.log(apiResponse)
              await saveToDatabase('phone_number', {
                  'phone_number': inputValue,
                  'valid': apiResponse.valid,
                  'location': apiResponse.location
              });
          } else if (dataType === 'email') {
              apiResponse = await fetchEmailVerification(inputValue);
              console.log("Input Value: ", inputValue)
              await saveToDatabase('email_address', {
                  'email_address': inputValue,
                  'format': apiResponse.format,
                  'domain': apiResponse.domain,
                  'disposable': apiResponse.disposable,
                  'dns': apiResponse.dns
              });
          } else if (dataType === 'address') {
              apiResponse = await fetchAddressVerification(inputValue);
              await saveToDatabase('physical_address', {
                  'address': inputValue,
                  'dpv_match_code': apiResponse.dpv_match_code,
                  'dpv_vacant': apiResponse.dpv_vacant
              });
          }

          generateResultBox(inputValue, apiResponse, dataType);
      } catch (error) {
          displayError('An error occurred while verifying. Please try again.');
          console.error('Verification failed:', error);
      }

    // Check database cache for existing entry
    async function checkDatabaseCache(value, type) {
        let endpoint;
        switch(type) {
            case 'phone':
                endpoint = `/phone_numbers/${encodeURIComponent(value)}`;
                break;
            case 'email':
                endpoint = `/email_addresses/${encodeURIComponent(value)}`;
                break;
            case 'address':
                endpoint = `/physical_addresses/${encodeURIComponent(value)}`;
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
            return await response.json();
        } catch (error) {
            console.error('Database cache check failed:', error);
            return null;
        }
    }

  // Save verification result to database
  async function saveToDatabase(table, payload) {
      try {
          console.log(payload);
          const response = await fetch(`${host}/${table}`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(payload)
          });

          return await response.json();
      } catch (error) {
            console.print("Weird phone error: ", error)
          console.error('Database save failed:', error);
      }
  }

  // Fetch APIs for verification (same as existing)
  async function fetchPhoneVerification(phoneNumber) {
      const phoneApiKey = '441310475c38d772a9b0b636e3e872ac';
      const phoneUrl = `http://apilayer.net/api/validate?access_key=${phoneApiKey}&number=${phoneNumber}`;
      const phoneResponse = await fetch(phoneUrl);
      if (!phoneResponse.ok) throw new Error('Failed to fetch phone verification.');
      return await phoneResponse.json();
  }

  async function fetchEmailVerification(email) {
      const emailUrl = `https://www.disify.com/api/email/${email}`;
      const emailResponse = await fetch(emailUrl);
      if (!emailResponse.ok) throw new Error('Failed to fetch email verification.');
      return await emailResponse.json();
  }

// This would work if not for an incredibly stupid limitation put in place
// by the API provider, which completely breaks functionality except through
// Google Chrome. Professor Dash said that he will accept this code as-is with 
// no penalty as it is otherwise valid.
  async function fetchAddressVerification(address) {
      const zipCode = address.match(/\b\d{5}(?:-\d{4})?\b/)[0];
      const physicalAuthToken = 'U9SFctsGZ7dQSZCmCh7g';
      const physicalAuthID = '19f2610e-aa6b-2f90-3a18-eb7bb7230e73'
      const physicalApiKey = '218455856825865685'
      const physicalUrl = `https://us-street.api.smarty.com/street-address?street=${encodeURIComponent(address)}&zipcode=${encodeURIComponent(zipCode)}&auth-id=${encodeURIComponent(physicalAuthID)}&auth-token=${encodeURIComponent(physicalAuthToken)}`.toString();
      console.log(physicalUrl)
      const physicalResponse = await fetch(physicalUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Host': 'us-street.api.smarty.com'
        }
    });
      if (!physicalResponse.ok) throw new Error('Failed to fetch address verification.');
      return await physicalResponse.json();
  }

  // Error and Result Display Functions
  function displayError(message) {
      const errorBox = document.createElement('div');
      errorBox.className = 'result-box-error';
      errorBox.style.color = 'red';
      errorBox.textContent = message;
      const closeButton = document.createElement('button');
      closeButton.textContent = 'Close';
      closeButton.className = 'close-result';
      closeButton.addEventListener('click', () => {
          resultsContainer.removeChild(errorBox);
      });
      errorBox.appendChild(closeButton);

      resultsContainer.appendChild(errorBox);
  }

    function generateResultBox(inputValue, data, dataType) {
        const resultBox = document.createElement('div');
        resultBox.className = 'result-box';
        
        // Create a title for the result box
        const titleElement = document.createElement('h4');
        titleElement.textContent = `${dataType.toUpperCase()} Verification`;
        resultBox.appendChild(titleElement);

        switch(dataType) {
            case 'phone':
                if (data.valid == true) {
                    var validity = "✅"
                } else {
                    var validity = "❌"
                }
                const phoneText = `Phone Number: ${inputValue}\n Location: ${data.location}\n Valid? ${validity}`
                const phoneDetails = document.createElement('pre');
                phoneDetails.textContent = phoneText
                resultBox.appendChild(phoneDetails);
                break;
            case 'email':
                if (data.format == true && data.disposable == false && data.dns == true) {
                    var validity = "✅"
                } else {
                    var validity = "❌"
                }
                const emailText = `Email Address: ${inputValue}\n Valid? ${validity}`
                const emailDetails = document.createElement('pre');
                emailDetails.textContent = emailText
                resultBox.appendChild(emailDetails);
                break;
            case 'address':
                if (data.dpv_vacant == false) {
                    var vacancy = "❎"
                } else {
                    var vacancy = "✔️"
                }

                if (data.dpv_match_code == "Y" || 
                    data.dpv_match_code == "S" || 
                    data.dpv_match_code == "D") {
                    var validity = "✅"
                } else {
                    var validity = "❌"
                }
                const physicalText = `Physical Address: ${inputValue}\n Valid? ${validity}\n Vacant? ${vacancy}`
                const physicalDetails = document.createElement('pre');
                physicalDetails.textContent = physicalText
                resultBox.appendChild(physicalDetails);
                break;
            default:
                throw new Error('Invalid data type');
        }
        // Add a close button to remove the result box
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.className = 'close-result';
        closeButton.addEventListener('click', () => {
            resultsContainer.removeChild(resultBox);
        });
        resultBox.appendChild(closeButton);

        // Append the result box to the results container
        resultsContainer.appendChild(resultBox);

        // Clear the input field
        inputData.value = '';
    }
  });
});