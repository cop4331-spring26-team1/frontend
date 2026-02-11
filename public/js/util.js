// Automatically set the API base URL depending on environment
// export const urlBase = window.location.hostname === "localhost"
//   ? "http://localhost/SmallProject/LAMPAPI"
//   : "http://134.199.207.149/LAMPAPI";

// ** CONFIG ** //
export const urlBase = "http://localhost/SmallProject/LAMPAPI" // API base URL

export const extension = "php"; // endpoint file extensions

// ** GLOBALS ** //
 
// Global user state
export let userState = {
  id: 0,
  firstName: "",
  lastName: "",
};

// Status timers for UI messages
let statusTimers = {
  add: null,
  search: null,
  admin: null,
  adminSearch: null,
  login: null,
  register: null,
};

// ** UTILITY FUNCTIONS ** //

export function clearTimer(key) {
  if (statusTimers[key]) {
    clearTimeout(statusTimers[key]);
    statusTimers[key] = null;
  }
}

export function setStatus(el, message, isError = false, shouldFocus = false, ttlMs = 0) {
  if (!el) return;
  el.textContent = message || "";

  el.setAttribute("role", isError ? "alert" : "status");
  el.setAttribute("aria-live", isError ? "assertive" : "polite");
  el.setAttribute("aria-atomic", "true");

  if (shouldFocus) {
    el.tabIndex = -1;
    el.focus();
  }

  if (ttlMs > 0) {
    const key = el.id
      .replace("Result", "")
      .toLowerCase();
    clearTimer(key);
    statusTimers[key] = setTimeout(() => (el.textContent = ""), ttlMs);
  }
}

export function digitsOnly(s) {
  return String(s ?? "").replace(/\D/g, "");
}

export function formatPhone(digits) {
  const d = digitsOnly(digits).slice(0, 10);
  const a = d.slice(0, 3);
  const b = d.slice(3, 6);
  const c = d.slice(6, 10);
  if (d.length <= 3) return a;
  if (d.length <= 6) return `${a}-${b}`;
  return `${a}-${b}-${c}`;
}

// --- Cookie handling ---
export function saveCookie() {
  const date = new Date();
  date.setTime(date.getTime() + 20 * 60 * 1000); // 20 minutes
  document.cookie =
    `firstName=${userState.firstName},` +
    `lastName=${userState.lastName},` +
    `userId=${userState.id};` +
    `expires=${date.toGMTString()};path=/`;
}

export function readCookie() {
  userState.id = -1;
  userState.firstName = "";
  userState.lastName = "";

  const data = document.cookie || "";
  const splits = data.split(",");

  for (const s of splits) {
    const [key, value] = s.trim().split("=");
    if (key === "firstName") userState.firstName = value || "";
    else if (key === "lastName") userState.lastName = value || "";
    else if (key === "userId") userState.id = parseInt(value || "0");
  }

  if (!Number.isFinite(userState.id) || userState.id < 0) {
    window.location.href = "index.html";
  }

  const userNameEl = document.getElementById("userName");
  if (userNameEl) {
    const safeFirst = userState.firstName || "User";
    const safeLast = userState.lastName || "";
    userNameEl.textContent = `Logged in as ${safeFirst} ${safeLast}`;
  }
}

export function doLogout() {
  userState.id = 0;
  userState.firstName = "";
  userState.lastName = "";
  document.cookie = "firstName=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  window.location.href = "./index.html";
}
