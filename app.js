// // Your NASA API key
// const API_KEY = "5XvXgOn64P1ISLQ3yrgagauYRNKB323aOkijF9pk"; // replace with your actual key
// const BASE_URL = "https://api.nasa.gov/planetary/apod";

// // This function fetches APOD data for a given date
// async function fetchAPOD(date) {

//   // Build the full URL with date and API key
//   const url = `${BASE_URL}?api_key=${API_KEY}&date=${date}`;

//   try {
//     // Send the request
//     const response = await fetch(url);

//     // Check if NASA responded with an error
//     if (!response.ok) {
//       throw new Error(`API error: ${response.status}`);
//     }

//     // Convert the response to a JS object
//     const data = await response.json();

//     // Just print it for now — we'll display it on the page next
//     console.log(data);

//   } catch (error) {
//     console.log("Something went wrong:", error);
//   }
// }
// // Get today's date as "YYYY-MM-DD" automatically
// const today = new Date().toISOString().split("T")[0];
// fetchAPOD(today); // ✅ always fetches today

// // // Call the function with today's date
// // fetchAPOD("2025-04-01");
// // ```

// // ---

// // ## How to test this

// // 1. Save `app.js`
// // 2. Open `index.html` in Chrome
// // 3. Press **F12** → go to the **Console** tab
// // 4. You should see an object printed like this:
// // ```
// // {
// //   date: "2025-04-01",
// //   title: "Some cool space thing",
// //   explanation: "A long description...",
// //   url: "https://...",
// //   hdurl: "https://...",
// //   media_type: "image"
// // }


const API_KEY = "5XvXgOn64P1ISLQ3yrgagauYRNKB323aOkijF9pk";
const BASE_URL = "https://api.nasa.gov/planetary/apod";

function displayAPOD(data) {

  document.getElementById("errorBox").style.display = "none";


  document.getElementById("apodTitle").textContent = data.title;


  document.getElementById("apodDate").textContent = data.date;


  document.getElementById("apodExplanation").textContent = data.explanation;


  const copyright = document.getElementById("apodCopyright");
  if (data.copyright) {
    copyright.textContent = "© " + data.copyright;
  } else {
    copyright.textContent = "Public Domain";
  }


  const mediaWrapper = document.getElementById("mediaWrapper");
  mediaWrapper.innerHTML = "";

  if (data.media_type === "image") {
    const img = document.createElement("img");
    img.src = data.url;
    img.alt = data.title;
    img.style.width = "100%";
    mediaWrapper.appendChild(img);

  } else if (data.media_type === "video") {
    const iframe = document.createElement("iframe");
    iframe.src = data.url;
    iframe.width = "100%";
    iframe.height = "500";
    iframe.setAttribute("allowfullscreen", true);
    mediaWrapper.appendChild(iframe);
  }
}

async function fetchAPOD(date) {
  document.getElementById("loadingOverlay").style.display = "flex";

  const url = `${BASE_URL}?api_key=${API_KEY}&date=${date}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    displayAPOD(data);

  } catch (error) {
    console.log("Something went wrong:", error);
    document.getElementById("errorBox").style.display = "block";

  } finally {
    document.getElementById("loadingOverlay").style.display = "none";
  }
}

const today = new Date().toISOString().split("T")[0];
fetchAPOD(today);


document.getElementById("fetchBtn").addEventListener("click", function() {
  

  const selectedDate = document.getElementById("datePicker").value;


  if (!selectedDate) {
    alert("Please select a date first!");
    return;
  }


  fetchAPOD(selectedDate);
});



const datePicker = document.getElementById("datePicker");
datePicker.min = "1995-06-16";  
datePicker.max = today;          
datePicker.value = today;