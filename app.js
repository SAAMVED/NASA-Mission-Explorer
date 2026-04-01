// My NASA API key - got this by signing up on NASA's website (api.nasa.gov)
const API_KEY = "5XvXgOn64P1ISLQ3yrgagauYRNKB323aOkijF9pk";
const BASE_URL = "https://api.nasa.gov/planetary/apod"; // this is the main link we send requests to

function displayAPOD(data) {
  // data came back fine so we don't need to show the red error box anymore
  document.getElementById("errorBox").style.display = "none";

  // putting the title of today's space photo into the h1 or wherever #apodTitle is
  document.getElementById("apodTitle").textContent = data.title;

  // showing the date so i know which day this photo is from
  document.getElementById("apodDate").textContent = data.date;

  // this is the long paragraph NASA writes explaining what's in the photo
  document.getElementById("apodExplanation").textContent = data.explanation;

  // some photos are owned by photographers, some are free (public domain)
  // if NASA gives us a copyright name we show it, otherwise just say Public Domain
  const copyright = document.getElementById("apodCopyright");
  if (data.copyright) {
    copyright.textContent = "© " + data.copyright;
  } else {
    copyright.textContent = "Public Domain";
  }

  // clear whatever was showing before so old image doesn't stick around
  const mediaWrapper = document.getElementById("mediaWrapper");
  mediaWrapper.innerHTML = "";

  // NASA sometimes gives a video instead of a photo (usually a YouTube embed)
  // so i have to check what type of media it is before displaying it
  if (data.media_type === "image") {
    // normal image - just create an img tag and drop it in
    const img = document.createElement("img");
    img.src = data.url;
    img.alt = data.title;
    img.style.width = "100%"; // make it fill the whole container
    mediaWrapper.appendChild(img);

  } else if (data.media_type === "video") {
    // for videos NASA gives an iframe (like embedding YouTube)
    // allowfullscreen lets the user go fullscreen
    const iframe = document.createElement("iframe");
    iframe.src = data.url;
    iframe.width = "100%";
    iframe.height = "500";
    iframe.setAttribute("allowfullscreen", true);
    mediaWrapper.appendChild(iframe);
  }
}

async function fetchAPOD(date) {
  // show the loading spinner while we wait for NASA to respond
  document.getElementById("loadingOverlay").style.display = "flex";

  // building the full URL - we pass the api key and the date as parameters
  // example: https://api.nasa.gov/planetary/apod?api_key=XXX&date=2024-01-01
  const url = `${BASE_URL}?api_key=${API_KEY}&date=${date}`;

  try {
    const response = await fetch(url); // actually sending the request to NASA
    if (!response.ok) {
      // if status code is something like 404 or 500, we throw our own error
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json(); // converting the response into a JS object
    displayAPOD(data); // now pass that data to our display function above

  } catch (error) {
    // something broke - could be bad internet, wrong date, API limit hit, etc.
    console.log("Something went wrong:", error);
    document.getElementById("errorBox").style.display = "block"; // show the error message on screen

  } finally {
    // finally block always runs whether it worked or not - so we always hide the loader
    document.getElementById("loadingOverlay").style.display = "none";
  }
}

// when the page first loads, automatically show today's APOD
// toISOString() gives "2024-01-01T00:00:00.000Z" and split("T")[0] just grabs the date part
// get yesterday's date instead of today
// because NASA sometimes hasn't uploaded today's photo yet
const today = new Date();
today.setDate(today.getDate() - 1); // go back 1 day
const todayStr = today.toISOString().split("T")[0];

fetchAPOD(todayStr);

// this runs when the user clicks the "Explore" button to look up a specific date
document.getElementById("fetchBtn").addEventListener("click", function() {
  
  // grab whatever date the user picked from the calendar input
  const selectedDate = document.getElementById("datePicker").value;

  // if they clicked Explore without picking a date, remind them
  if (!selectedDate) {
    alert("Please select a date first!");
    return; // stop here, don't go further
  }

  // all good - fetch the APOD for whatever date they chose
  fetchAPOD(selectedDate);
});


// setting rules on the date picker so user can't pick invalid dates
const datePicker = document.getElementById("datePicker");
datePicker.min = "1995-06-16";  // APOD didn't exist before this date so no point going earlier
datePicker.max = today;          // future dates don't have photos yet obviously
datePicker.value = today;        // start with today's date already filled in
