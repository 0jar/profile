const root = document.documentElement;
const toggle = document.querySelector<HTMLButtonElement>("#theme-toggle");
const copyStatus = document.querySelector<HTMLElement>("#copy-status");

if (toggle) {
  const syncPressed = () => {
    toggle.setAttribute("aria-pressed", String(root.getAttribute("data-theme") === "dark"));
  };
  syncPressed();

  toggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    const apply = () => {
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch { }
      syncPressed();
    };
    const canAnimate =
      "startViewTransition" in document &&
      window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    if (canAnimate) {
      document.startViewTransition(apply);
    } else {
      apply();
    }
  });
}

document.querySelectorAll<HTMLButtonElement>("[data-copy-email]").forEach((button) => {
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copyEmail ?? "");
      if (copyStatus) copyStatus.textContent = button.dataset.copiedLabel ?? "";
    } catch { }
  });
});

const mobileMenu = document.querySelector<HTMLDetailsElement>(".mobile-menu");
if (mobileMenu) {
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.open = false;
    });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu.open) {
      mobileMenu.open = false;
    }
  });
}
