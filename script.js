$(function () {
  const grid = $("#productGrid");
  const priceTable = $("#priceTable");

  // Count visits in this browser (demo only; LocalStorage).
  let visits = Number(localStorage.getItem("albertoVisits") || 0) + 1;
  localStorage.setItem("albertoVisits", visits);
  $("#visitorCount").text(visits.toLocaleString());
  $("#visitLabel").text(visits === 1 ? "visit" : "visits");

  function renderProducts(filter = "all") {
    const filtered = watchProducts.filter(p => filter === "all" || p.category === filter);
    grid.empty();
    filtered.forEach((p, index) => {
      grid.append(`
        <div class="col-sm-6 col-lg-4">
          <article class="product-card" role="button" tabindex="0" data-id="${p.id}" style="animation:fade .3s ease both">
            <div class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy"><span class="product-tag">${p.tag}</span></div>
            <div class="product-info"><small class="ref">${p.ref}</small><h3>${p.name}</h3>
              <div class="product-bottom"><span class="product-price">${p.priceLabel}</span><span class="view-details">View details</span></div>
            </div>
          </article>
        </div>`);
    });
  }

  function renderPriceList() {
    watchProducts.forEach(p => priceTable.append(`<tr><td>${p.name}</td><td>${p.tag}</td><td class="ref">${p.ref}</td><td class="text-end">${p.priceLabel}</td></tr>`));
  }

  renderProducts();
  renderPriceList();

  $(".filter-btn").on("click", function () {
    $(".filter-btn").removeClass("active");
    $(this).addClass("active");
    renderProducts($(this).data("filter"));
  });

  function showProduct(id) {
    const p = watchProducts.find(item => item.id === Number(id));
    if (!p) return;
    $("#productModalBody").html(`
      <div class="modal-product-grid">
        <img src="${p.image}" alt="${p.name}">
        <div><span class="modal-meta">${p.tag} collection · <span class="ref">${p.ref}</span></span><h2 class="mt-3">${p.name}</h2>
          <p>${p.description}</p><p class="modal-price">${p.priceLabel}</p>
          <dl class="modal-specs"><dt>Movement</dt><dd>${p.movement}</dd><dt>Case</dt><dd>${p.case}</dd><dt>Water resistance</dt><dd>${p.water}</dd></dl>
          <a class="btn btn-gold" href="#contact" data-bs-dismiss="modal">Enquire now</a>
        </div>
      </div>`);
    bootstrap.Modal.getOrCreateInstance(document.getElementById("productModal")).show();
  }

  grid.on("click", ".product-card", function () { showProduct($(this).data("id")); });
  grid.on("keydown", ".product-card", function (e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); showProduct($(this).data("id")); }
  });

  $(".gallery-tile").on("click", function () {
    $("#galleryModalImage").attr("src", $(this).data("image"));
    bootstrap.Modal.getOrCreateInstance(document.getElementById("galleryModal")).show();
  });

  // Live date and time for the continuous footer ticker.
  function updateClock() {
    const now = new Date();
    $("#liveDate").text(now.toLocaleDateString(undefined, {weekday:"short", year:"numeric", month:"short", day:"numeric"}));
    $("#liveTime").text(now.toLocaleTimeString());
    $("#year").text(now.getFullYear());
  }
  updateClock();
  setInterval(updateClock, 1000);

  // Ask permission only after the visitor clicks the location label.
  $("#locationText").css("cursor", "pointer").attr("title", "Click to share your location");
  $("#locationText").on("click", function () {
    if (!navigator.geolocation) { $(this).text("Location is not supported by this browser"); return; }
    $(this).text("Requesting location");
    navigator.geolocation.getCurrentPosition(
      pos => $(this).text(`${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}`),
      () => $(this).text("Location unavailable"),
      {timeout:8000}
    );
  });

  // Front-end demo form: no message is sent to a server.
  $("#contactForm").on("submit", function (e) {
    e.preventDefault();
    $("#formMessage").text("Thank you. This demo form is not connected to a server yet");
    this.reset();
  });

  // Smooth close of mobile navigation after selecting a section.
  $(".navbar-nav .nav-link").on("click", function () {
    const menu = document.getElementById("mainMenu");
    if (menu.classList.contains("show")) bootstrap.Collapse.getOrCreateInstance(menu).hide();
    $(".navbar-nav .nav-link").removeClass("active");
    $(this).addClass("active");
  });

  // Highlight the section currently in view.
  const sections = $("main section[id]");
  $(window).on("scroll", function () {
    let current = "home";
    sections.each(function () { if ($(window).scrollTop() >= $(this).offset().top - 150) current = this.id; });
    $(".navbar-nav .nav-link").removeClass("active");
    $(`.navbar-nav .nav-link[href="#${current}"]`).addClass("active");
  });
});