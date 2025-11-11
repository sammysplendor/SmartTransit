// ==================== AUTHENTICATION FUNCTIONS ==================== //

// Login function
async function loginUser(email, password) {
  try {
    const response = await fetch(
      "https://smarttransit-api.onrender.com/api/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await response.json();

    if (data.success) {
      localStorage.setItem("token", data.token); // save token
      localStorage.setItem("userEmail", email); // store email
      alert("Login successful!");
      window.location.href = "profile.html"; // redirect after login
    } else {
      alert(data.error || "Login failed");
    }
  } catch (error) {
    console.error("Error logging in:", error);
  }
}

// Register function
async function registerUser(name, email, phone, password, confirmPassword) {
  try {
    const response = await fetch(
      "https://smarttransit-api.onrender.com/api/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password, confirmPassword }),
      }
    );

    const data = await response.json();

    if (data.success) {
      localStorage.setItem("token", data.token);
      alert("Registration successful!");
      window.location.href = "profile.html";
    } else {
      alert(data.error || "Registration failed");
    }
  } catch (error) {
    console.error("Error registering user:", error);
  }
}

// Function to get the token when needed
function getAuthToken() {
  return localStorage.getItem("token");
}

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

  paymentForm.addEventListener("submit", (event) => {
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
  if (cvv.length !== 3) {
    alert("CVV must be 3 digits");
  }

  //   Expiry Date validation
  const todayDate = new Date();
  const enteredDate = new Date(expiry);

  if (enteredDate < todayDate) {
    alert("Your card has expired");
  }

  // Simulate Payment Processing

  /* 
  paymentButton.disabled = true;
  paymentButton.textContent = "Processing..."; 
  */

  const token = getAuthToken();

  fetch("https://smarttransit-api.onrender.com/api/payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // attach token
    },
    body: JSON.stringify({
      cardName: name,
      cardNumber: number,
      expiryDate: expiry,
      cvv: cvvValue,
      amount: 1000, // example
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Payment response:", data);
      alert(data.success ? "Payment successful" : data.error);
    })
    .catch((err) => console.error(err));
}

// ==================== FOR PROFILE PAGE ==================== //

const profilePageId = document.body.id;

if (profilePageId === "profile-page") {
  // 1. ----- BACK BUTTON FUNCTIONALITY -----
  handleBackButton();

  // 2. ----- GET AND DISPLAY STORED USER INFO -----
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");

  if (userName) document.getElementById("profile-name").textContent = userName;
  if (userEmail)
    document.getElementById("profile-email").textContent = userEmail;

  // 3. ----- PROTECT PROFILE PAGE -----
  document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    console.log("Token found on profile:", token);

    // only redirect if truly missing or dummy value
    if (!token || token === "example_token_value") {
      console.warn("No valid token found. Redirecting to login...");
      window.location.href = "loginpage.html";
    }
  });

  // 4. ----- LOGOUT BUTTON FUNCTIONALITY -----
  const logoutButton = document.querySelector(".logout-btn");

  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      const confirmLogout = confirm("Are you sure you want to logout?");
      if (!confirmLogout) return;

      const token = localStorage.getItem("token");
      if (!token) {
        alert("No active session found.");
        return;
      }

      try {
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
          alert(
            data.message ||
              "Logout failed, but your session will be cleared locally."
          );
        }
      } catch (error) {
        console.error("Logout API error:", error);
        alert("Unable to reach the server. Logging you out locally.");
      }

      // 5. ----- CLEAR STORAGE ONLY ON LOGOUT -----
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("selectedTrip");

      window.location.href = "loginpage.html";
    });
  }
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

const token = getAuthToken();
const userId = localStorage.getItem("userId");

if (token && userId) {
  fetch(`https://smarttransit-api.onrender.com/auth/get-user/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      console.log("Response status:", res.status, res.statusText);
      const text = await res.text();
      console.log("Raw response text:", text);
      if (!res.ok) throw new Error("Fetch failed");
      return JSON.parse(text);
    })
    .then((data) => {
      console.log("User profile:", data);
      document.getElementById("profile-name").textContent = data.name;
    })
    .catch((err) => console.error("Error fetching profile:", err));
} else {
  window.location.href = "loginpage.html";
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

// ==================== AVATAR CLICK FUNCTIONALITY ==================== //
const avatar = document.querySelector("#user-avatar");

if (avatar) {
  avatar.addEventListener("click", (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    // const user = localStorage.getItem("user");

    if (token) {
      // If user is logged in — go directly to profile
      window.location.href = "profile.html";
    } else {
      // If user is not logged in — redirect
      window.location.href = "loginpage.html";
    }
  });
}
