// ─── CONFIG ────────────────────────────────────────────
const API_KEY = "5XvXgOn64P1ISLQ3yrgagauYRNKB323aOkijF9pk";
const BASE_URL = "https://api.nasa.gov/planetary/apod";

// ─── STATE ─────────────────────────────────────────────
let allPhotos    = [];   // stores all 30 fetched APOD objects
let favourites   = JSON.parse(localStorage.getItem("nasaFavourites")) || []; // load saved favourites
let currentPhoto = null; // tracks which photo is shown in the cinematic card

// ─── DATE RANGE ────────────────────────────────────────
// We go back 31 days and use yesterday as end to avoid "no data yet" errors
const todayObj  = new Date();
const yesterday = new Date();
yesterday.setDate(todayObj.getDate() - 1);

const endDate   = yesterday.toISOString().split("T")[0];
const pastObj   = new Date();
pastObj.setDate(todayObj.getDate() - 31);
const startDate = pastObj.toISOString().split("T")[0];

// ─── DATE PICKER SETUP ─────────────────────────────────
const datePicker  = document.getElementById("datePicker");
datePicker.min    = "1995-06-16";
datePicker.max    = endDate;
datePicker.value  = endDate;

// =====================================================
// DISPLAY SINGLE APOD (cinematic hero card)
// =====================================================
function displayAPOD(data) {
  currentPhoto = data;

  document.getElementById("errorBox").style.display   = "none";
  document.getElementById("apodTitle").textContent     = data.title;
  document.getElementById("apodDate").textContent      = data.date;
  document.getElementById("apodExplanation").textContent = data.explanation;

  const copyright = document.getElementById("apodCopyright");
  copyright.textContent = data.copyright ? "© " + data.copyright : "Public Domain";

  const mediaWrapper    = document.getElementById("mediaWrapper");
  mediaWrapper.innerHTML = "";

  if (data.media_type === "image") {
    const img = document.createElement("img");
    img.src   = data.url;
    img.alt   = data.title;
    mediaWrapper.appendChild(img);

  } else if (data.media_type === "video") {
    const iframe = document.createElement("iframe");
    iframe.src   = data.url;
    iframe.setAttribute("allowfullscreen", true);
    mediaWrapper.appendChild(iframe);
  }

  // scroll to top so user sees the cinematic card
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// =====================================================
// DISPLAY GALLERY GRID
// Takes an array of APOD objects and renders cards
// =====================================================
function displayGallery(photos) {
  const grid = document.getElementById("galleryGrid");
  grid.innerHTML = ""; // clear previous cards

  // if no results, add empty class so CSS shows "No results" message
  if (photos.length === 0) {
    grid.classList.add("empty");
    return;
  }

  grid.classList.remove("empty");

  // .map() converts each photo object into an HTML card element
  // then we append each one to the grid
  photos.map(function(photo) {
    const card = document.createElement("div");
    card.className = "gallery-card";

    // check if this photo is in favourites
    const isFav     = favourites.includes(photo.date);
    const favClass  = isFav ? "fav-btn active" : "fav-btn";
    const favSymbol = isFav ? "♥" : "♡";

    // build thumbnail — image or video placeholder
    const thumbHTML = photo.media_type === "image"
      ? `<img src="${photo.url}" alt="${photo.title}" loading="lazy" />`
      : `<div class="video-thumb">▶ Video</div>`;

    card.innerHTML = `
      ${thumbHTML}
      <button class="${favClass}" data-date="${photo.date}" title="Add to favourites">
        ${favSymbol}
      </button>
      <div class="card-info">
        <span class="card-date">${photo.date}</span>
        <p class="card-title">${photo.title}</p>
        <span class="card-badge">${photo.media_type}</span>
      </div>
    `;

    // clicking the card loads it in the cinematic hero view
    card.addEventListener("click", function(e) {
      // don't trigger if user clicked the fav button
      if (e.target.classList.contains("fav-btn")) return;
      displayAPOD(photo);
    });

    // favourite button click
    const favBtn = card.querySelector(".fav-btn");
    favBtn.addEventListener("click", function(e) {
      e.stopPropagation(); // prevent card click from firing
      toggleFavourite(photo.date, favBtn);
    });

    grid.appendChild(card);
  });
}

// =====================================================
// APPLY FILTERS — runs every time search/filter/sort changes
// Uses HOFs: .filter() and .sort()
// =====================================================
function applyFilters() {
  const searchTerm  = document.getElementById("searchInput").value.toLowerCase();
  const filterValue = document.getElementById("filterSelect").value;
  const sortValue   = document.getElementById("sortSelect").value;

  // STEP 1: Search — filter by title keyword using .filter()
  let results = allPhotos.filter(function(photo) {
    return photo.title.toLowerCase().includes(searchTerm);
  });

  // STEP 2: Filter by media type using .filter()
  if (filterValue !== "all") {
    results = results.filter(function(photo) {
      return photo.media_type === filterValue;
    });
  }

  // STEP 3: Sort by date using .sort()
  // .sort() compares two items at a time (a and b)
  // returning negative means a comes first, positive means b comes first
  results = results.sort(function(a, b) {
    if (sortValue === "newest") {
      return new Date(b.date) - new Date(a.date); // newest first
    } else {
      return new Date(a.date) - new Date(b.date); // oldest first
    }
  });

  // re-render the gallery with filtered + sorted results
  displayGallery(results);
}

// =====================================================
// FAVOURITES — saves to localStorage so they persist
// Uses .filter() to add/remove from the favourites array
// =====================================================
function toggleFavourite(date, btn) {
  const isAlreadyFav = favourites.includes(date);

  if (isAlreadyFav) {
    // remove from favourites using .filter() — keeps everything EXCEPT this date
    favourites = favourites.filter(function(d) {
      return d !== date;
    });
    btn.classList.remove("active");
    btn.textContent = "♡";
  } else {
    // add to favourites
    favourites.push(date);
    btn.classList.add("active");
    btn.textContent = "♥";
  }

  // save updated favourites array to localStorage
  localStorage.setItem("nasaFavourites", JSON.stringify(favourites));
}

// =====================================================
// DARK / LIGHT MODE TOGGLE
// =====================================================
document.getElementById("darkModeBtn").addEventListener("click", function() {
  document.body.classList.toggle("light-mode");

  // update button label based on current mode
  if (document.body.classList.contains("light-mode")) {
    this.textContent = "Dark Mode";
  } else {
    this.textContent = "Light Mode";
  }
});

// =====================================================
// SEARCH — fires on every keystroke
// =====================================================
document.getElementById("searchInput").addEventListener("input", function() {
  applyFilters();
});

// =====================================================
// FILTER DROPDOWN — fires when user changes selection
// =====================================================
document.getElementById("filterSelect").addEventListener("change", function() {
  applyFilters();
});

// =====================================================
// SORT DROPDOWN — fires when user changes selection
// =====================================================
document.getElementById("sortSelect").addEventListener("change", function() {
  applyFilters();
});

// =====================================================
// FETCH GALLERY — fetches last 30 days from NASA API
// =====================================================
async function fetchGallery() {
  document.getElementById("loadingOverlay").style.display = "flex";

  const url = `${BASE_URL}?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    allPhotos  = data;

    // show the most recent photo in the cinematic card
    displayAPOD(allPhotos[allPhotos.length - 1]);

    // render all 30 photos in the gallery grid (newest first by default)
    displayGallery(
      allPhotos.slice().sort(function(a, b) {
        return new Date(b.date) - new Date(a.date);
      })
    );

  } catch (error) {
    console.log("Something went wrong:", error);
    document.getElementById("errorBox").style.display = "block";

  } finally {
    document.getElementById("loadingOverlay").style.display = "none";
  }
}

// =====================================================
// EXPLORE BUTTON — fetch a specific date
// =====================================================
document.getElementById("fetchBtn").addEventListener("click", function() {
  const selectedDate = document.getElementById("datePicker").value;

  if (!selectedDate) {
    alert("Please select a date first!");
    return;
  }

  document.getElementById("loadingOverlay").style.display = "flex";

  const url = `${BASE_URL}?api_key=${API_KEY}&date=${selectedDate}`;

  fetch(url)
    .then(function(response) {
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      return response.json();
    })
    .then(function(data) {
      displayAPOD(data);
    })
    .catch(function(error) {
      console.log("Something went wrong:", error);
      document.getElementById("errorBox").style.display = "block";
    })
    .finally(function() {
      document.getElementById("loadingOverlay").style.display = "none";
    });
});

// =====================================================
// HD TOGGLE
// =====================================================
document.getElementById("hdToggleBtn").addEventListener("click", function() {
  if (!currentPhoto || currentPhoto.media_type !== "image") return;

  if (!currentPhoto.hdurl) {
    alert("No HD version available for this image.");
    return;
  }

  const img = document.querySelector("#mediaWrapper img");
  if (!img) return;

  if (img.src === currentPhoto.hdurl) {
    img.src          = currentPhoto.url;
    this.textContent = "HD";
  } else {
    img.src          = currentPhoto.hdurl;
    this.textContent = "SD";
  }
});

// =====================================================
// FULLSCREEN
// =====================================================
document.getElementById("fullscreenBtn").addEventListener("click", function() {
  const img = document.querySelector("#mediaWrapper img");
  if (!img) return;
  if (img.requestFullscreen) img.requestFullscreen();
});

// =====================================================
// ON PAGE LOAD
// =====================================================
// ─── Show default image before API loads ───────────────
window.addEventListener("DOMContentLoaded", function() {
  displayAPOD({
    title: "Welcome to NASA Mission Explorer!",
    date: "",
    explanation: "Explore the universe with NASA's Astronomy Picture of the Day. Use the date picker or browse the latest discoveries!",
    copyright: "",
    media_type: "image",
    url: "./default-earth.jpg"
  });
  fetchGallery();
});