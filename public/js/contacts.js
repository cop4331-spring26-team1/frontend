// contacts.js — handles contacts page only
import {
    urlBase,
    extension,
    userState,
    readCookie,
    setStatus,
    formatPhone,
    doLogout
} from "./util.js";

/**
 * Initialize contacts page
 */
export function initContactsPage() {
    readCookie();
    wirePhoneAutoFormat();

    const listEl = document.getElementById("contactList");
    if (listEl) listEl.innerHTML = "";

    const addResultEl = document.getElementById("contactAddResult");
    const searchResultEl = document.getElementById("contactSearchResult");
    setStatus(addResultEl, "", false, false, 0);
    setStatus(searchResultEl, "", false, false, 0);
}

/**
 * Auto-format phone input for add/edit forms
 */
function wirePhoneAutoFormat() {
    const phoneEl = document.getElementById("contactPhone");
    if (!phoneEl) return;

    phoneEl.addEventListener("input", () => {
        const before = phoneEl.value;
        const formatted = formatPhone(before);
        if (before !== formatted) phoneEl.value = formatted;
    });
}

/**
 * Add new contact
 */
export function addContact() {
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

    if (!f) { firstEl.reportValidity(); firstEl.focus(); return; }
    if (!l) { lastEl.reportValidity(); lastEl.focus(); return; }
    if (!phoneEl.checkValidity()) { phoneEl.reportValidity(); return; }
    if (!emailEl.checkValidity()) { emailEl.reportValidity(); return; }

    console.log(userState.id)

    const tmp = { firstName: f, lastName: l, phone, email, userId: userState.id };
    const jsonPayload = JSON.stringify(tmp);

    const url = `${urlBase}/AddContact.${extension}`;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;

        if (xhr.status !== 200) {
            setStatus(resultEl, "Server error. Try again.", true, true, 0);
            return;
        }

        let jsonObject = {};
        try { jsonObject = JSON.parse(xhr.responseText); }
        catch { setStatus(resultEl, "Invalid server response", true, true, 0); return; }

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
}

/**
 * Search contacts
 */
export function searchContacts() {
    const inputEl = document.getElementById("searchText");
    const resultEl = document.getElementById("contactSearchResult");
    const listEl = document.getElementById("contactList");

    if (!inputEl || !resultEl || !listEl) return;

    const srch = (inputEl.value || "").trim();

    setStatus(resultEl, "", false, false, 0);
    listEl.innerHTML = "";

    if (!srch) {
        setStatus(resultEl, "Enter search text first", true, true, 0);
        inputEl.focus();
        return;
    }

    const tmp = { search: srch, userId: userState.id };
    const jsonPayload = JSON.stringify(tmp);
    const url = `${urlBase}/SearchContacts.${extension}`;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;

        if (xhr.status !== 200) { setStatus(resultEl, "Server error. Try again.", true, true, 0); return; }

        let jsonObject = {};
        try { jsonObject = JSON.parse(xhr.responseText); }
        catch { setStatus(resultEl, "Invalid server response", true, true, 0); return; }

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
}

/**
 * List all contacts
 */
export function listAllContacts() {
    const resultEl = document.getElementById("contactSearchResult");
    const listEl = document.getElementById("contactList");
    if (!resultEl || !listEl) return;

    setStatus(resultEl, "", false, false, 0);
    listEl.innerHTML = "";

    const tmp = { userId: userState.id };
    const jsonPayload = JSON.stringify(tmp);
    const url = `${urlBase}/GetAllContacts.${extension}`;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;

        if (xhr.status !== 200) { setStatus(resultEl, "Server error. Try again.", true, true, 0); return; }

        let jsonObject = {};
        try { jsonObject = JSON.parse(xhr.responseText); }
        catch { setStatus(resultEl, "Invalid server response", true, true, 0); return; }

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
}

/**
 * Render contacts in DOM
 */
export function renderContacts(results) {
    const listEl = document.getElementById("contactList");
    if (!listEl) return;

    const html = results.map(c => {
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
          <button class="small-button btn-edit" type="button" aria-label="Edit ${escapeAttr(labelName)}" onclick="beginEditContact(${id});">Edit</button>
          <button class="small-button btn-delete" type="button" aria-label="Delete ${escapeAttr(labelName)}" onclick="deleteContact(${id});">Delete</button>
        </div>
      </div>
    `;
    }).join("");

    listEl.innerHTML = html;
}

// Helper functions
function safeText(v) { return String(v ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;"); }
function escapeAttr(v) { return String(v ?? "").replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("'", "&#39;").replaceAll("<", "&lt;").replaceAll(">", "&gt;"); }
function fullNameFromContact(c) { return ((c.firstName ?? "").trim() + " " + (c.lastName ?? "").trim()).trim(); }

// ----------------- EVENT LISTENERS -----------------

// Attach listeners to static buttons
document.addEventListener("DOMContentLoaded", () => {

    readCookie();

    const addBtn = document.querySelector(".btnPrimary.btnWide"); // the "Add Contact" button
    if (addBtn) addBtn.addEventListener("click", addContact);

    const searchBtn = document.querySelector("button.btnPrimary.btnWide:nth-of-type(2)"); // Search button
    if (searchBtn) searchBtn.addEventListener("click", searchContacts);

    const listAllBtn = document.querySelector("button.btnPrimary.btnWide:nth-of-type(3)"); // List All button
    if (listAllBtn) listAllBtn.addEventListener("click", listAllContacts);

    const logoutBtn = document.querySelector(".topBar .btnSecondary"); // Log Out button
    if (logoutBtn) logoutBtn.addEventListener("click", () => {
        doLogout();
    });

    // Event delegation for edit/delete buttons inside contact list
    const listEl = document.getElementById("contactList");
    if (listEl) {
        listEl.addEventListener("click", (e) => {
            const btn = e.target.closest("button");
            if (!btn) return;

            const idMatch = btn.getAttribute("data-id") || btn.id?.split("_")[1];
            if (!idMatch) return;
            const id = parseInt(idMatch);

            if (btn.classList.contains("btn-edit")) beginEditContact(id);
            if (btn.classList.contains("btn-delete")) deleteContact(id);
        });
    }
});
