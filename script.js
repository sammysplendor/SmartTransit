const loginButton = document.querySelector('.login_button');
const emailInput = document.querySelector('input[name="email"]');
const passwordInput = document.querySelector('input[name="password"]');

loginButton.addEventListener('click', (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  if (email === '') {
    alert('Please enter an email address');
  } else if (email.indexOf('@gmail.com') === -1) {
    alert('Invalid email: Email address must be a Gmail address');
  } else if (password.length < 8) {
    alert('Password must be at least 8 characters long');
  } else {
    alert('Login successful!');
  }
});