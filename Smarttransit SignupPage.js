// Sign Up function

function getAuthToken() {
  return localStorage.getItem("token");
}

document
  .getElementById("signupForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Form validation
    if (!name || !email || !phone || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (!email.endsWith("@gmail.com")) {
      alert("Email must be a Gmail address.");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(
        "https://smarttransit-api.onrender.com/v1/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            phone,
            password,
            confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userEmail", email);
        alert(`Welcome, ${name}! Your account has been created.`);
        window.location.href = "loginpage.html"; // redirect
      } else {
        alert(data.message || data.error || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Unable to connect to server. Please try again later.");
    }

    alert(`Welcome, ${name}! Your SmartTransit account has been created.`);
  });
