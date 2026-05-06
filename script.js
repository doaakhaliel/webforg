function startLoading() {

  let p = 0;

  const bar = document.getElementById("progress");
  const percent = document.getElementById("percent");
  const status = document.getElementById("status");

  const text = [
    "Starting system...",
    "Loading resources...",
    "Preparing WebForge...",
    "Done..."
  ];

  let i = 0;

  let interval = setInterval(() => {

    p++;

    bar.style.width = p + "%";
    percent.innerText = p + "%";

    if (p % 25 === 0) {
      status.innerText = text[i];
      i++;
    }

    if (p >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        window.location.href = "home.html";
      }, 500);
    }

  }, 20);
}