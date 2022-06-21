import * as User from "./models/User.js";

function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            setInnerHTML(elmnt, this.responseText);
            //elmnt.innerHTML = this.responseText;
          }
          if (this.status == 404) {
            elmnt.innerHTML = "Page not found.";
          }
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      return;
    }
  }
}

includeHTML();

var setInnerHTML = function (elm, html) {
  elm.innerHTML = html;
  Array.from(elm.querySelectorAll("script")).forEach(oldScript => {
    const newScript = document.createElement("script");
    Array.from(oldScript.attributes)
      .forEach(attr => newScript.setAttribute(attr.name, attr.value));
    newScript.appendChild(document.createTextNode(oldScript.innerHTML));
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });
}

function delegate(el, evt, sel, handler) {
  el.addEventListener(evt, function (event) {
    var t = event.target;
    while (t && t !== this) {
      if (t.matches(sel)) {
        handler.call(t, event);
      }
      t = t.parentNode;
    }
  });
}

function showToast(message, type) {
  const color = type || 'primary';
  const content = `
  <div
    class="toast align-items-center text-white bg-${color} border-0 position-fixed p-3 bottom-0 end-0"
    style="z-index: 9999;"
    role="alert"
    aria-live="assertive"
    aria-atomic="true">
    <div class="d-flex">
      <div class="toast-body">
        ${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  </div>`;

  document.querySelector('.toast-placeholder').innerHTML += content;

  var toastElList = [].slice.call(document.querySelectorAll('.toast:not(.hide)'))
  toastElList.map(function (toastEl) {
    return new bootstrap.Toast(toastEl, { autohide: true }).show();
  });
}

function ensureAdmin() {
  const user = User.getUserByEmail(User.getUserLogged()?.email);
  if (!user || !user.isAdmin()) {
    window.location = '/';
  }
}

function ensureUser() {
  const user = User.getUserByEmail(User.getUserLogged()?.email);
  if (!user) {
    window.location = '/';
  }
}

const uid = () => (performance.now().toString(36) + Math.random().toString(36)).replace(/\./g, "");

export {
  ensureAdmin,
  showToast,
  delegate,
  uid,
  ensureUser,
}
