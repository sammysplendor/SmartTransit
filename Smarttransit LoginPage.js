// ==================== AUTHENTICATION FUNCTIONS ==================== //

// Login function
async function loginUser(email, password) {
  try {
    const response = await fetch(
      "https://smarttransit-api.onrender.com/v1/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token || "example_token_value");
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("userEmail", data.user.email);
      localStorage.setItem("userId", data.userId);

      alert("Login successful!");

      window.location.href = "search-result.html";
    } else {
      alert(data.message || "Login failed. Please check your credentials.");
    }
  } catch (error) {
    console.error("Error logging in:", error);
    alert("Unable to connect to server. Please try again later.");
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

// ====================================================================

const loginButton = document.querySelector(".login_button");
const emailInput = document.querySelector('input[name="email"]');
const passwordInput = document.querySelector('input[name="password"]');

loginButton.addEventListener("click", async (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  if (email === "") {
    alert("Please enter an email address");
    return;
  } else if (email.indexOf("@gmail.com") === -1) {
    alert("Invalid email: Email address must be a Gmail address");
    return;
  } else if (password.length < 8) {
    alert("Password must be at least 8 characters long");
    return;
  }

  await loginUser(email, password);
});
