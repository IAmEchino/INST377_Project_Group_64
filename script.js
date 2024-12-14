const submitButton = document.getElementById("submit-button");
const resultsContainer = document.getElementById("results");
const inputData = document.getElementById("input-data");

// Function to generate a new flexbox item
function generateResultBox(content) {
  // Create a new div for the result
  const resultBox = document.createElement("div");
  resultBox.className = "result-box";
  resultBox.textContent = content;

  // Append the new result box to the results container
  resultsContainer.appendChild(resultBox);
}

// Add an event listener to the Submit button
submitButton.addEventListener("click", () => {
  const inputValue = inputData.value.trim();
  if (inputValue) {
    // Generate a new result with user input
    generateResultBox(`Result: ${inputValue}`);
    // Clear the input field
    inputData.value = "";
  } else {
    alert("Please enter some data to verify!");
  }
});
