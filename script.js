const gcashNumberInput = document.getElementById("gcashNumber");
const claimButton = document.getElementById("claimButton");
const warningIcon = document.querySelector(".warning-icon");
const warningMessage = document.querySelector(".warning-message");
const progressBarFill = document.querySelector(".progress-bar-fill");
const loadingIcon = document.querySelector(".loading-icon");

claimButton.addEventListener("click", () => {
  const gcashNumber = gcashNumberInput.value;
  if (validateGcashNumber(gcashNumber)) {
    // Simulated loading and progress
    loadingIcon.style.display = "block";
    progressBarFill.style.width = "0%";
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 10;
      progressBarFill.style.width = progress + "%";
      if (progress >= 100) {
        clearInterval(progressInterval);
        // Display warning after "loading"
        warningIcon.style.display = "block";
        warningMessage.style.display = "block";
        loadingIcon.style.display = "none";
      }
    }, 500);
  } else {
    warningIcon.style.display = "block";
    warningMessage.style.display = "block";
  }
});

function validateGcashNumber(number) {
  // This is a simple validation; you might want to use more robust methods
  return number.startsWith("0") && (number.length === 11 || number.length === 12);
}