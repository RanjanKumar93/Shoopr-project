const navbarOpenMobile = document.querySelector(".nav-bar-open");
const mobileNavBar = document.querySelector(".mobile-nav-section");
const mobileNavBackdrop = document.querySelector(".nav-backdrop");

navbarOpenMobile.addEventListener("click", function () {
  mobileNavBar.classList.remove("hidden");
  mobileNavBackdrop.classList.remove("hidden");
});

mobileNavBackdrop.addEventListener("click", function () {
  mobileNavBar.classList.add("hidden");
  mobileNavBackdrop.classList.add("hidden");
});
