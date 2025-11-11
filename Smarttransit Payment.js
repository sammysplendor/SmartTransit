// ==================== GLOBAL FUNCTION ==================== //
function handleBackButton() {
  const backButton = document.querySelector("#navbar-btn a");

  if (backButton) {
    backButton.addEventListener("click", (event) => {
      event.preventDefault(); // prevents accidental link reload
      window.history.back(); // takes user to the previous page
    });
  }
}

// ==================== FOR PAYMENT PAGE ==================== //

const paymentPageId = document.body.id;

if (paymentPageId === "payment-page") {
  // 1. ----- BACK BUTTON FUNCTIONALITY -----

  handleBackButton();

  // 2. ----- PAYMENT FORM VALIDATION -----
  const paymentForm = document.querySelector(".payment-form");
  const cardName = document.getElementById("card-name");
  const cardNumber = document.getElementById("card-number");
  const expiryDate = document.getElementById("expiry-date");
  const cvv = document.getElementById("cvv");
  const paymentButton = document.getElementById("payment-button");

  paymentForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // prevents form from submitting
  });

  const name = cardName.value.trim();
  const number = cardNumber.value.trim();
  const expiry = expiryDate.value.trim();
  const cvvValue = cvv.value.trim();

  //   Input checks
  if (!name || !number || !expiry || !cvvValue) {
    alert("Please fill in all fields");
  }

  //   Card number validation
  if (number.length < 16) {
    alert("Card number must be 16 digits");
  }

  //   CVV validation
  if (cvvValue.length !== 3) {
    alert("CVV must be 3 digits");
  }

  //   Expiry Date validation
  const todayDate = new Date();
  const enteredDate = new Date(expiry);

  if (enteredDate < todayDate) {
    alert("Your card has expired");
  }

  // Simulate Payment Processing

  paymentButton.disabled = true;
  paymentButton.textContent = "Processing...";

  const selectedTrip = JSON.parse(localStorage.getItem("selectedTrip"));
  if (!selectedTrip) {
    alert("No trip selected. Please go back and select a trip.");
    paymentButton.disabled = false;
    paymentButton.textContent = "Pay Now";
    return;
  }

  const tripId = selectedTrip.id;
  const amount = selectedTrip.price;

  try {
    const token = localStorage.getItem("token"); // Auth token from login/signup

    const paymentData = {
      amount: amount,
      paymentMethod: "card",
      cardNumber: number,
      expiry: expiry,
      cvv: cvvValue,
    };

    const response = await fetch(
      `https://smarttransit-api.onrender.com/trips/${tripId}/verify-payment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include auth token
        },
        body: JSON.stringify(paymentData),
      }
    );

    const data = await response.json();

    if (response.ok && data.success) {
      alert("Payment successful!");
      // Redirect if necessary
      window.location.href = "profile.html";
    } else {
      alert(data.message || "Payment failed.");
    }
  } catch (error) {
    console.error("Payment API error:", error);
    alert("Unable to process payment. Please try again later.");
  }

  paymentButton.disabled = false;
  paymentButton.textContent = "Pay Now";
}

// ==================== FOR PROFILE PAGE ==================== //

const profilePageId = document.body.id;

if (profilePageId === "profile-page") {
  // 1. ----- BACK BUTTON FUNCTIONALITY -----

  handleBackButton();

  // 2. ----- LOGOUT BUTTON FUNCTIONALITY -----
  const logoutButton = document.querySelector(".logout-btn");

  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      const confirmLogout = confirm("Are you sure you want to logout?");
      if (!confirmLogout) return;

      const token = localStorage.getItem("token");

      try {
        // Call backend API to invalidate session/token
        const response = await fetch(
          "https://smarttransit-api.onrender.com/v1/auth/logout",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          alert("You have been logged out successfully");
        } else {
          console.warn(
            "Logout API returned an issue:",
            data.message || data.error
          );
          alert(
            data.message ||
              "Logout failed, but your session will be cleared locally."
          );
        }
      } catch (error) {
        console.error("Logout API error:", error);
        alert("Unable to reach the server. Logging you out locally.");
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("selectedTrip");

      window.location.href = "loginpage.html";
    });
  }

  // 3. ----- BOOKING STATUS COLORS -----
  const statusBadge = document.querySelectorAll("booking-status");

  statusBadge.forEach((badge) => {
    const statusText = badge.textContent.trim();

    if (statusText === "Completed") {
      badge.style.backgroundColor = "#d8d6d6";
      badge.style.color = "#6b7280";
    } else if (statusText === "Upcoming") {
      badge.style.backgroundColor = "#96e6b3";
      badge.style.color = "#16a34a";
    }
  });
}

// ==================== FOR SEARCH RESULT PAGE ==================== //
const searchResultPage = document.body.id;

if (searchResultPage === "search-result-page") {
  // 1. ----- NIGHT TRAVEL FILTER FUNCTIONALITY -----
  const nightTravelCheckbox = document.getElementById("checkbox");
  const allTripCards = document.querySelectorAll(".trip-card");

  //   When the checkbox is clicked, either only the night trips are shown or all trips are shown
  nightTravelCheckbox.addEventListener("change", () => {
    allTripCards.forEach((card) => {
      const nightTripBadge = card.querySelector(".night-trip-badge");
      const originalDisplay = getComputedStyle(card).display;

      // If user checks the checkbox, only night trips will be shown on the UI
      if (nightTravelCheckbox.checked) {
        if (!nightTripBadge) {
          card.style.display = "none";
        } else {
          card.style.display = "flex";
        }
      } else {
        // If user unchecks the checkbox, all trips display normally
        card.style.display = "flex";
      }
    });
  });

  // 2. ----- CHANGE SEAT COLOR BASED ON AVAILABILITY -----
  const seatTexts = document.querySelectorAll(".top .small-txt");

  seatTexts.forEach((seatText) => {
    if (seatText.textContent.includes("seats available")) {
      const seats = parseInt(seatText.textContent); // gets number of seats

      let seatClass;

      if (seats < 10) {
        seatClass = "red-text";
      } else {
        seatClass = "green-text";
      }

      seatText.classList.add(seatClass);
    }
  });

  // 3. ----- NIGHT TRAVEL FILTER FUNCTIONALITY -----
  const searchButton = document.querySelector(".search-bar button");

  if (searchButton) {
    searchButton.addEventListener("click", () => {
      window.location.href = "search.html"; // or wherever the search form is
    });
    // Backend will then receive the search and handle it with database
  }
}
