if (typeof message !== "undefined" && message) {
  Toastify({
    text: "<%= message %>",
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    style: { background: "linear-gradient(to right, #00b09b, #96c93d)" },
  }).showToast();
}

<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/toastify-js"
></script>;
