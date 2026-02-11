// contacts.js
import {
  urlBase,
  extension,
  userState,
  readCookie,
  setStatus,
  formatPhone,
  doLogout
} from "./util.js";

export function initContactsPage() {
  readCookie();
  wirePhoneAutoFormat();

  const listEl = document.getElementById("contactList");
  if (listEl) listEl.innerHTML = "";

  setStatus(document.getElementById("contactAddResult"), "", false, false, 0);
  setStatus(document.getElementById("contactSearchResult"), "", false, false, 0);
}

function wirePhoneAutoFormat() {
  const phoneEl = document.getElementById("contactPhone");
  if (!phoneEl) return;

  phoneEl.addEventListener("input", () => {
    phoneEl.value = formatPhone(phoneEl.value);
  });
}

function postJSON(endpoint, data) {
  return fetch(`${urlBase}/${endpoint}.${extension}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(r => r.json());
}

export function addContact() {
  const firstEl = document.getElementById("contactFirstName");
  const lastEl = document.getElementById("contactLastName");
  const phoneEl = document.getElementById("contactPhone");
  const emailEl = document.getElementById("contactEmail");
  const resultEl = document.getElementById("contactAddResult");

  if (!firstEl || !lastEl || !phoneEl || !emailEl || !resultEl) return;

  const f = firstEl.value.trim();
  const l = lastEl.value.trim();
  phoneEl.value = formatPhone(phoneEl.value);
  const phone = phoneEl.value.trim();
  const email = emailEl.value.trim();

  if (!f || !l) return;

  postJSON("AddContact", {
    userId: userState.id,
    firstName: f,
    lastName: l,
    phone,
    email
  })
    .then(json => {
      if (json.error) {
        setStatus(resultEl, json.error, true, true, 0);
        return;
      }

      setStatus(resultEl, "Contact added", false, false, 2000);
      firstEl.value = lastEl.value = phoneEl.value = emailEl.value = "";
      listAllContacts();
    })
    .catch(() => setStatus(resultEl, "Server error", true, true, 0));
}

export function searchContacts() {
  const inputEl = document.getElementById("searchText");
  const resultEl = document.getElementById("contactSearchResult");
  const listEl = document.getElementById("contactList");
  if (!inputEl || !resultEl || !listEl) return;

  const srch = inputEl.value.trim();
  if (!srch) {
    setStatus(resultEl, "Enter search text", true, true, 0);
    return;
  }

  listEl.innerHTML = "";

  postJSON("SearchContact", {
    userId: userState.id,
    search: srch
  })
    .then(json => {
      if (json.error) {
        setStatus(resultEl, json.error, true, true, 0);
        return;
      }

      const results = json.results || [];
      if (results.length === 0) {
        setStatus(resultEl, "No contacts found", false, false, 2000);
        return;
      }

      renderContacts(results);
      setStatus(resultEl, "Contacts retrieved", false, false, 2000);
    })
    .catch(() => setStatus(resultEl, "Server error", true, true, 0));
}

export function listAllContacts() {
  const resultEl = document.getElementById("contactSearchResult");
  const listEl = document.getElementById("contactList");
  if (!resultEl || !listEl) return;

  listEl.innerHTML = "";

  postJSON("GetAllContact", { userId: userState.id })
    .then(json => {
      if (json.error) {
        setStatus(resultEl, json.error, true, true, 0);
        return;
      }

      const results = json.results || [];
      if (results.length === 0) {
        setStatus(resultEl, "No contacts yet", false, false, 2000);
        return;
      }

      renderContacts(results);
      setStatus(resultEl, "All contacts loaded", false, false, 2000);
    })
    .catch(() => setStatus(resultEl, "Server error", true, true, 0));
}

export function deleteContact(id) {
  if (!confirm("Delete contact?")) return;

  postJSON("DeleteContact", {
    userId: userState.id,
    contactId: id
  })
    .then(json => {
      if (json.error) {
        alert(json.error);
        return;
      }
      listAllContacts();
    });
}

export function renderContacts(results) {
  const listEl = document.getElementById("contactList");
  if (!listEl) return;

  listEl.innerHTML = results.map(c => `
        <div class="result-item">
            <strong>${c.FirstName} ${c.LastName}</strong><br>
            ${c.Phone}<br>
            ${c.Email}<br>
            <button class="btn-delete" data-id="${c.ID}">Delete</button>
        </div>
    `).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  readCookie();

  document.querySelector("#search")?.addEventListener("click", searchContacts);
  document.querySelector("#listAll")?.addEventListener("click", listAllContacts);
  document.querySelector(".btnPrimary")?.addEventListener("click", addContact);
  document.querySelector(".topBar .btnSecondary")?.addEventListener("click", doLogout);

  const listEl = document.getElementById("contactList");

  listEl?.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-delete");
    if (!btn) return;

    const id = btn.dataset.id;
    deleteContact(id);
  });

  listAllContacts();
});

