const submitButton = document.getElementById("submit-button");
const inputData = document.getElementById("input-data");
const resultsContainer = document.getElementById("results");

function generateResultBox(content) {
  const resultBox = document.createElement("div");
  resultBox.className = "result-box"; 
  resultBox.textContent = content; 
  resultsContainer.appendChild(resultBox); 
}

submitButton.addEventListener("click", () => {
  const inputValue = inputData.value.trim();
  if (inputValue) {
    generateResultBox(`Result: ${inputValue}`);
    inputData.value = ""; 
  } else {
    alert("Please enter some data to verify!");
  }
});
