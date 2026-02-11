import { urlBase, extension, setStatus, saveCookie, userState } from "./util.js";

const form = document.querySelector(".login-form");
const loginEl = document.getElementById("username");
const passEl = document.getElementById("password");
const resultEl = document.getElementById("loginResult");

loginEl.value = "user"
passEl.value = "pass"

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // prevent page reload
    await doLogin();
  });
}

async function doLogin() {


  if (!loginEl || !passEl || !resultEl) return;

  const login = (loginEl.value || "").trim();
  const password = (passEl.value || "").trim();

  setStatus(resultEl, "", false, false, 0);

  if (!login || !password) {
    setStatus(resultEl, "Please enter username and password", true, true, 0);
    if (!login) loginEl.focus();
    else passEl.focus();
    return;
  }

  const payload = { login, password };
  const url = `${urlBase}/Login.${extension}`;

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

    if (!data.success) {
      setStatus(resultEl, data.error, true, true, 0);
      passEl.focus();
      return; 
    }

    // Save user info in a single state object

    userState.id = data.id;
    userState.firstName = data.firstName || "";
    userState.lastName = data.lastName || "";

    saveCookie();

    window.location.href = "./contacts.html";
  } catch (err) {
    console.error("Login error:", err);
    setStatus(resultEl, "Failed to login. Try again later.", true, true, 0);
  }
}
