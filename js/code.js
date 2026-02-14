const urlBase = "http://smallproject.liamab.com/LAMPAPI";
const extension = "php";

let userId = 0;
let firstName = "";
let lastName = "";

let statusTimers = {
  add: null,
  search: null,
  admin: null,
  adminSearch: null,
  login: null,
  register: null,
};

function clearTimer(key) {
  if (statusTimers[key]) {
    clearTimeout(statusTimers[key]);
    statusTimers[key] = null;
  }
}

function setStatus(el, message, isError, shouldFocus, ttlMs) {
  if (!el) return;

  el.textContent = message || "";

  if (isError) {
    el.setAttribute("role", "alert");
    el.setAttribute("aria-live", "assertive");
  } else {
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
  }
  el.setAttribute("aria-atomic", "true");

  if (shouldFocus) {
    el.tabIndex = -1;
    el.focus();
  }

  if (ttlMs && ttlMs > 0) {
    const key =
      el.id === "contactAddResult"
        ? "add"
        : el.id === "contactSearchResult"
        ? "search"
        : el.id === "adminResult"
        ? "admin"
        : el.id === "adminSearchResult"
        ? "adminSearch"
        : el.id === "loginResult"
        ? "login"
        : el.id === "registerResult"
        ? "register"
        : null;

    if (key) {
      clearTimer(key);
      statusTimers[key] = setTimeout(() => {
        el.textContent = "";
      }, ttlMs);
    }
  }
}

function digitsOnly(s) {
  return String(s ?? "").replace(/\D/g, "");
}

function formatPhone(digits) {
  const d = digitsOnly(digits).slice(0, 10);
  const a = d.slice(0, 3);
  const b = d.slice(3, 6);
  const c = d.slice(6, 10);

  if (d.length <= 3) return a;
  if (d.length <= 6) return `${a}-${b}`;
  return `${a}-${b}-${c}`;
}

function wirePhoneAutoFormat() {
  const phoneEl = document.getElementById("contactPhone");
  if (!phoneEl) return;

  phoneEl.addEventListener("input", () => {
    const before = phoneEl.value;
    const formatted = formatPhone(before);
    if (before !== formatted) phoneEl.value = formatted;
  });
}

function initContactsPage() {
  readCookie();
  wirePhoneAutoFormat();

  const listEl = document.getElementById("contactList");
  if (listEl) listEl.innerHTML = "";

  const addResultEl = document.getElementById("contactAddResult");
  const searchResultEl = document.getElementById("contactSearchResult");
  setStatus(addResultEl, "", false, false, 0);
  setStatus(searchResultEl, "", false, false, 0);
}

function togglePasswordVisibility() {
  const input = document.getElementById("password");
  const btn = document.querySelector(".eye-button");
  if (!input || !btn) return;

  const isHidden = input.type === "password";
  input.type = isHidden ? "text" : "password";
  btn.setAttribute("aria-pressed", isHidden ? "true" : "false");
  btn.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
}

function doLogin() {
  userId = 0;
  firstName = "";
  lastName = "";

  const loginEl = document.getElementById("username");
  const passEl = document.getElementById("password");
  const resultEl = document.getElementById("loginResult");

  if (!loginEl || !passEl || !resultEl) return;

  const login = (loginEl.value || "").trim();
  const password = (passEl.value || "").trim();

  setStatus(resultEl, "", false, false, 0);

  if (login.length === 0 || password.length === 0) {
    setStatus(resultEl, "Please enter username and password", true, true, 0);
    if (login.length === 0) loginEl.focus();
    else passEl.focus();
    return;
  }

  const tmp = { login: login, password: password };
  const jsonPayload = JSON.stringify(tmp);

  const url = urlBase + "/Login." + extension;

  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function () {
      if (this.readyState !== 4) return;

      if (this.status !== 200) {
        setStatus(resultEl, "Server error. Try again.", true, true, 0);
        return;
      }

      let jsonObject = {};
      try {
        jsonObject = JSON.parse(xhr.responseText);
      } catch {
        setStatus(resultEl, "Invalid server response", true, true, 0);
        return;
      }

      userId = jsonObject.id;

      if (userId < 1) {
        setStatus(resultEl, "Username or password incorrect", true, true, 0);
        passEl.focus();
        return;
      }

      firstName = jsonObject.firstName || "";
      lastName = jsonObject.lastName || "";

      saveCookie();
      // if (userId === 1) window.location.href = "admin/admin.html";
      if (userId === 1) window.location.href = "contacts.html";
      else window.location.href = "contacts.html";
    };

    xhr.send(jsonPayload);
  } catch (err) {
    setStatus(resultEl, err.message, true, true, 0);
  }
}

function doRegister() {
  const firstEl = document.getElementById("firstName");
  const lastEl = document.getElementById("lastName");
  const userEl = document.getElementById("username");
  const passEl = document.getElementById("password");
  const resultEl = document.getElementById("registerResult");

  if (!firstEl || !lastEl || !userEl || !passEl || !resultEl) return;

  const f = (firstEl.value || "").trim();
  const l = (lastEl.value || "").trim();
  const login = (userEl.value || "").trim();
  const password = (passEl.value || "").trim();

  setStatus(resultEl, "", false, false, 0);

  if (
    f.length === 0 ||
    l.length === 0 ||
    login.length === 0 ||
    password.length === 0
  ) {
    setStatus(resultEl, "Please fill out all fields", true, true, 0);
    if (f.length === 0) firstEl.focus();
    else if (l.length === 0) lastEl.focus();
    else if (login.length === 0) userEl.focus();
    else passEl.focus();
    return;
  }

  const tmp = { firstName: f, lastName: l, login: login, password: password };
  const jsonPayload = JSON.stringify(tmp);

  const url = urlBase + "/Register." + extension;

  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function () {
      if (this.readyState !== 4) return;

      if (this.status !== 200) {
        setStatus(resultEl, "Server error. Try again.", true, true, 0);
        return;
      }

      let jsonObject = {};
      try {
        jsonObject = JSON.parse(xhr.responseText);
      } catch {
        setStatus(resultEl, "Invalid server response", true, true, 0);
        return;
      }

      if (jsonObject.error && jsonObject.error.length > 0) {
        setStatus(resultEl, jsonObject.error, true, true, 0);
        return;
      }

      window.location.href = "login.html";
    };

    xhr.send(jsonPayload);
  } catch (err) {
    setStatus(resultEl, err.message, true, true, 0);
  }
}

function saveCookie() {
  let date = new Date();
  date.setTime(date.getTime() + 20 * 60 * 1000);

  document.cookie =
    "firstName=" +
    firstName +
    ",lastName=" +
    lastName +
    ",userId=" +
    userId +
    ";expires=" +
    date.toGMTString() +
    ";path=/";
}

function readCookie() {
  userId = -1;
  firstName = "";
  lastName = "";

  const data = document.cookie || "";
  const splits = data.split(",");

  for (let i = 0; i < splits.length; i++) {
    const thisOne = splits[i].trim();
    const tokens = thisOne.split("=");

    if (tokens[0] === "firstName") firstName = tokens[1] || "";
    else if (tokens[0] === "lastName") lastName = tokens[1] || "";
    else if (tokens[0] === "userId")
      userId = parseInt((tokens[1] || "").trim());
  }

  if (!Number.isFinite(userId) || userId < 0) {
    window.location.href = "index.html";
    return;
  }

  const userNameEl = document.getElementById("userName");
  if (userNameEl) {
    const safeFirst = firstName || "User";
    const safeLast = lastName || "";
    userNameEl.textContent = "Logged in as " + safeFirst + " " + safeLast;
  }
}

function doLogout() {
  userId = 0;
  firstName = "";
  lastName = "";
  document.cookie = "firstName=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  window.location.href = "/index.html";
}

function addContact() {
  const firstEl = document.getElementById("contactFirstName");
  const lastEl = document.getElementById("contactLastName");
  const phoneEl = document.getElementById("contactPhone");
  const emailEl = document.getElementById("contactEmail");
  const resultEl = document.getElementById("contactAddResult");

  if (!firstEl || !lastEl || !phoneEl || !emailEl || !resultEl) return;

  setStatus(resultEl, "", false, false, 0);

  const f = (firstEl.value || "").trim();
  const l = (lastEl.value || "").trim();

  phoneEl.value = formatPhone(phoneEl.value || "");
  const phone = (phoneEl.value || "").trim();
  const email = (emailEl.value || "").trim();

  if (f.length === 0) {
    firstEl.reportValidity();
    firstEl.focus();
    return;
  }
  if (l.length === 0) {
    lastEl.reportValidity();
    lastEl.focus();
    return;
  }
  if (!phoneEl.checkValidity()) {
    phoneEl.reportValidity();
    return;
  }
  if (!emailEl.checkValidity()) {
    emailEl.reportValidity();
    return;
  }

  const tmp = {
    firstName: f,
    lastName: l,
    phone: phone,
    email: email,
    userId: userId,
  };
  const jsonPayload = JSON.stringify(tmp);

  const url = urlBase + "/AddContact." + extension;

  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function () {
      if (this.readyState !== 4) return;

      if (this.status !== 200) {
        setStatus(resultEl, "Server error. Try again.", true, true, 0);
        return;
      }

      let jsonObject = {};
      try {
        jsonObject = JSON.parse(xhr.responseText);
      } catch {
        setStatus(resultEl, "Invalid server response", true, true, 0);
        return;
      }

      if (jsonObject.error && jsonObject.error.length > 0) {
        setStatus(resultEl, jsonObject.error, true, true, 0);
        return;
      }

      setStatus(resultEl, "Contact added", false, false, 2500);

      firstEl.value = "";
      lastEl.value = "";
      phoneEl.value = "";
      emailEl.value = "";
      firstEl.focus();

      const listEl = document.getElementById("contactList");
      if (listEl) listEl.innerHTML = "";
    };

    xhr.send(jsonPayload);
  } catch (err) {
    setStatus(resultEl, err.message, true, true, 0);
  }
}

function searchContacts() {
  const inputEl = document.getElementById("searchText");
  const resultEl = document.getElementById("contactSearchResult");
  const listEl = document.getElementById("contactList");

  if (!inputEl || !resultEl || !listEl) return;

  const srch = (inputEl.value || "").trim();

  setStatus(resultEl, "", false, false, 0);
  listEl.innerHTML = "";

  if (srch.length === 0) {
    setStatus(resultEl, "Enter search text first", true, true, 0);
    inputEl.focus();
    return;
  }

  const tmp = { search: srch, userId: userId };
  const jsonPayload = JSON.stringify(tmp);

  const url = urlBase + "/SearchContacts." + extension;

  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function () {
      if (this.readyState !== 4) return;

      if (this.status !== 200) {
        setStatus(resultEl, "Server error. Try again.", true, true, 0);
        return;
      }

      let jsonObject = {};
      try {
        jsonObject = JSON.parse(xhr.responseText);
      } catch {
        setStatus(resultEl, "Invalid server response", true, true, 0);
        return;
      }

      if (jsonObject.error && jsonObject.error.length > 0) {
        setStatus(resultEl, jsonObject.error, true, true, 0);
        return;
      }

      const results = jsonObject.results || [];

      if (!Array.isArray(results) || results.length === 0) {
        setStatus(resultEl, "No contacts found", false, false, 2500);
        inputEl.value = "";
        inputEl.focus();
        return;
      }

      setStatus(resultEl, "Contacts retrieved", false, false, 2000);
      renderContacts(results);

      inputEl.value = "";
      inputEl.focus();
    };

    xhr.send(jsonPayload);
  } catch (err) {
    setStatus(resultEl, err.message, true, true, 0);
  }
}

function listAllContacts() {
  const resultEl = document.getElementById("contactSearchResult");
  const listEl = document.getElementById("contactList");
  if (!resultEl || !listEl) return;

  setStatus(resultEl, "", false, false, 0);
  listEl.innerHTML = "";

  const tmp = { userId: userId };
  const jsonPayload = JSON.stringify(tmp);

  const url = urlBase + "/GetAllContacts." + extension;

  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function () {
      if (this.readyState !== 4) return;

      if (this.status !== 200) {
        setStatus(resultEl, "Server error. Try again.", true, true, 0);
        return;
      }

      let jsonObject = {};
      try {
        jsonObject = JSON.parse(xhr.responseText);
      } catch {
        setStatus(resultEl, "Invalid server response", true, true, 0);
        return;
      }

      if (jsonObject.error && jsonObject.error.length > 0) {
        setStatus(resultEl, jsonObject.error, true, true, 0);
        return;
      }

      const results = jsonObject.results || [];

      if (!Array.isArray(results) || results.length === 0) {
        setStatus(resultEl, "No contacts yet", false, false, 2500);
        return;
      }

      setStatus(resultEl, "All contacts loaded", false, false, 2000);
      renderContacts(results);
    };

    xhr.send(jsonPayload);
  } catch (err) {
    setStatus(resultEl, err.message, true, true, 0);
  }
}

function safeText(v) {
  return String(v ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeAttr(v) {
  return String(v ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function fullNameFromContact(c) {
  const f = String(c.firstName ?? "").trim();
  const l = String(c.lastName ?? "").trim();
  return (f + " " + l).trim();
}

function renderContacts(results) {
  const listEl = document.getElementById("contactList");
  if (!listEl) return;

  const html = results
    .map((c) => {
      const id = c.id;
      const fullName = safeText(fullNameFromContact(c));
      const phone = safeText(c.phone);
      const email = safeText(c.email);

      const labelName = fullNameFromContact(c) || "contact";

      return `
        <div class="result-item" id="contact_${id}" role="listitem">
          <div><strong>${fullName}</strong></div>
          <div>${phone}</div>
          <div>${email}</div>

          <div class="contact-actions">
            <button class="small-button btn-edit" type="button" aria-label="Edit ${escapeAttr(
              labelName
            )}" onclick="beginEditContact(${id});">Edit</button>
            <button class="small-button btn-delete" type="button" aria-label="Delete ${escapeAttr(
              labelName
            )}" onclick="deleteContact(${id});">Delete</button>
          </div>
        </div>
      `;
    })
    .join("");

  listEl.innerHTML = html;
}

function beginEditContact(contactId) {
  const container = document.getElementById("contact_" + contactId);
  if (!container) return;

  const currentText = container.querySelectorAll("div");
  if (currentText.length < 4) return;

  const existingName = currentText[0].innerText.trim();
  const phone = currentText[1].innerText.trim();
  const email = currentText[2].innerText.trim();

  const parts = existingName.split(/\s+/).filter(Boolean);
  const f = parts.length > 0 ? parts[0] : "";
  const l = parts.length > 1 ? parts.slice(1).join(" ") : "";

  container.innerHTML = `
    <div><strong>Editing</strong></div>

    <div class="inline-edit">
      <div class="two-col">
        <div class="formGroup">
          <label class="sronly" for="editFirst_${contactId}">First name</label>
          <input class="input" type="text" id="editFirst_${contactId}"
            value="${escapeAttr(f)}" placeholder="First name" required />
        </div>

        <div class="formGroup">
          <label class="sronly" for="editLast_${contactId}">Last name</label>
          <input class="input" type="text" id="editLast_${contactId}"
            value="${escapeAttr(l)}" placeholder="Last name" required />
        </div>
      </div>

      <div class="formGroup">
        <label class="sronly" for="editPhone_${contactId}">Phone</label>
        <input class="input" type="tel" id="editPhone_${contactId}"
          value="${escapeAttr(
            phone
          )}" inputmode="numeric" placeholder="407-222-4567"
          required pattern="^\\d{3}-\\d{3}-\\d{4}$"
          title="Phone must be 10 digits and will format as 407-222-4567" />
      </div>

      <div class="formGroup">
        <label class="sronly" for="editEmail_${contactId}">Email</label>
        <input class="input" type="email" id="editEmail_${contactId}"
          value="${escapeAttr(email)}" placeholder="name@example.com" required
          title="Email format example name@example.com" />
      </div>
    </div>

    <div class="contact-actions">
      <button class="small-button btn-edit" type="button" onclick="saveEditContact(${contactId});">Save</button>
      <button class="small-button btn-delete" type="button" onclick="listAllContacts();">Cancel</button>
    </div>
  `;

  const phoneEl = document.getElementById("editPhone_" + contactId);
  if (phoneEl) {
    phoneEl.addEventListener("input", () => {
      const before = phoneEl.value;
      const formatted = formatPhone(before);
      if (before !== formatted) phoneEl.value = formatted;
    });
  }

  const firstEl = document.getElementById("editFirst_" + contactId);
  if (firstEl) firstEl.focus();
}

function saveEditContact(contactId) {
  const firstEl = document.getElementById("editFirst_" + contactId);
  const lastEl = document.getElementById("editLast_" + contactId);
  const phoneEl = document.getElementById("editPhone_" + contactId);
  const emailEl = document.getElementById("editEmail_" + contactId);

  if (!firstEl || !lastEl || !phoneEl || !emailEl) return;

  const f = (firstEl.value || "").trim();
  const l = (lastEl.value || "").trim();
  phoneEl.value = formatPhone(phoneEl.value || "");
  const phone = (phoneEl.value || "").trim();
  const email = (emailEl.value || "").trim();

  if (f.length === 0) {
    firstEl.reportValidity();
    return;
  }
  if (l.length === 0) {
    lastEl.reportValidity();
    return;
  }
  if (!phoneEl.checkValidity()) {
    phoneEl.reportValidity();
    return;
  }
  if (!emailEl.checkValidity()) {
    emailEl.reportValidity();
    return;
  }

  const tmp = {
    id: contactId,
    firstName: f,
    lastName: l,
    phone: phone,
    email: email,
    userId: userId,
  };
  const jsonPayload = JSON.stringify(tmp);

  const url = urlBase + "/UpdateContact." + extension;

  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function () {
      if (this.readyState !== 4) return;

      if (this.status !== 200) {
        alert("Server error. Try again.");
        return;
      }

      let jsonObject = {};
      try {
        jsonObject = JSON.parse(xhr.responseText);
      } catch {
        alert("Invalid server response");
        return;
      }

      if (jsonObject.error && jsonObject.error.length > 0) {
        alert(jsonObject.error);
        return;
      }

      listAllContacts();
    };

    xhr.send(jsonPayload);
  } catch (err) {
    alert(err.message);
  }
}

function deleteContact(contactId) {
  const ok = confirm("Delete this contact?");
  if (!ok) return;

  const tmp = { id: contactId, userId: userId };
  const jsonPayload = JSON.stringify(tmp);

  const url = urlBase + "/DeleteContact." + extension;

  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function () {
      if (this.readyState !== 4) return;

      if (this.status !== 200) {
        alert("Server error. Try again.");
        return;
      }

      let jsonObject = {};
      try {
        jsonObject = JSON.parse(xhr.responseText);
      } catch {
        alert("Invalid server response");
        return;
      }

      if (jsonObject.error && jsonObject.error.length > 0) {
        alert(jsonObject.error);
        return;
      }

      listAllContacts();
    };

    xhr.send(jsonPayload);
  } catch (err) {
    alert(err.message);
  }
}
