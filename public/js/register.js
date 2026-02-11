// /LAMPAPI/Register.php
import { urlBase, extension, setStatus } from "./util.js";

const url = `${urlBase}/Register.${extension}`;

// Cache DOM elements
const firstEl = document.getElementById("firstName");
const lastEl = document.getElementById("lastName");
const userEl = document.getElementById("username");
const passEl = document.getElementById("password");
const resultEl = document.getElementById("registerResult");
const eyeBtn = document.querySelector(".eye-button");
const form = document.querySelector(".login-form");

firstEl.value = "john"
lastEl.value = "smith"
userEl.value = "user"
passEl.value = "pass"

// Event listeners
if (eyeBtn) eyeBtn.addEventListener("click", togglePasswordVisibility);

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // prevent page reload
    await doRegister();
  });
}

// Toggle password visibility
function togglePasswordVisibility() {
  if (!passEl || !eyeBtn) return;

  const isHidden = passEl.type === "password";
  passEl.type = isHidden ? "text" : "password";
  eyeBtn.setAttribute("aria-pressed", isHidden ? "true" : "false");
  eyeBtn.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
}

// Register function
async function doRegister() {
  if (!firstEl || !lastEl || !userEl || !passEl || !resultEl) return;

  const f = (firstEl.value || "").trim();
  const l = (lastEl.value || "").trim();
  const login = (userEl.value || "").trim();
  const password = (passEl.value || "").trim();

  setStatus(resultEl, "", false, false, 0);

  if (!f || !l || !login || !password) {
    setStatus(resultEl, "Please fill out all fields", true, true, 0);
    if (!f) firstEl.focus();
    else if (!l) lastEl.focus();
    else if (!login) userEl.focus();
    else passEl.focus();
    return;
  }

  const payload = { firstName: f, lastName: l, username: login, password: password };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setStatus(resultEl, "Server error. Try again.", true, true, 0);
      return;
    }

    const data = await response.json();

    if (data.error) {
      setStatus(resultEl, data.error, true, true, 0);
      return;
    }

    setStatus(resultEl, "Registration successful! You can now log in.", false, true, 5000);

  } catch (err) {
    console.error("Registration error:", err);
    setStatus(resultEl, "Failed to register. Try again later.", true, true, 0);
  }
}
