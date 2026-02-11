// Automatically set the API base URL depending on environment
// export const urlBase = window.location.hostname === "localhost"
//   ? "http://localhost/SmallProject/LAMPAPI"
//   : "http://134.199.207.149/LAMPAPI";

// ** CONFIG **//
export const urlBase = "http://localhost/SmallProject/LAMPAPI"

// File extension for endpoints
export const extension = "php";

// ** UTIL ** //

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

export function setStatus(el, message, isError, shouldFocus, ttlMs) {
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