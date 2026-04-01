# NASA Mission Explorer 🚀

A web app that shows NASA's Astronomy Picture of the Day (APOD). You can pick any date and see what photo NASA posted that day. I thought it was really cool that you can check what the universe looked like on your birthday so that's kind of the main idea behind this.

---

## What does it do

- You pick a date and it fetches the NASA photo for that day
- The date can go all the way back to June 16 1995 (that's when NASA started posting these)
- There's a fullscreen button to view the image bigger
- There's also an HD button to load the higher quality version
- Sometimes NASA posts a video instead of a photo, the app handles that too
- If something goes wrong (like bad internet or the API fails) it shows an error message instead of just breaking

---

## Why I built this

This was a project idea I got where you use a real public API to build something. I picked NASA because the API is free and you get an actual key in like 2 minutes. Also space photos are genuinely cool so it didn't feel boring to work on.

---

## Files in this project
```
nasa-mission-explorer/
│
├── index.html    ← the structure, all the divs and buttons
├── style.css     ← all the styling, dark space theme
├── app.js        ← where all the logic is, API calls etc.
└── README.md     ← this file
```

---

## How to run it

There's no install or anything. Just:

1. Download or clone the project
2. Open `index.html` in your browser

Or if you're using VS Code, just use the **Live Server** extension (right click index.html → Open with Live Server). That's what I used while building it.

---

## The API

This project uses NASA's free APOD API. You need a key to use it but it's completely free, you just sign up at [https://api.nasa.gov/](https://api.nasa.gov/) and they email you one.

The URL looks like this:
```
https://api.nasa.gov/planetary/apod?api_key=YOUR_KEY&date=2003-08-15
```

You just change the date at the end and it returns a JSON object with the image, title, explanation etc. Pretty straightforward once I figured out how fetch() works.

If you want to run this yourself, open `app.js` and replace my key at the top:
```javascript
const API_KEY = "YOUR_NASA_API_KEY_HERE";
```

---

## Stuff I learned while making this

- How to use `fetch()` and `async/await` to call an API
- That APIs can return different types of media (image vs video) so you have to check before just slapping an `<img>` tag in
- The NASA API sometimes returns a 404 for today's date because they haven't posted yet — I fixed this by defaulting to yesterday instead of today
- How `try/catch/finally` works — the `finally` block runs no matter what which is useful for hiding the loading spinner
- Setting `min` and `max` on a date input in HTML so users can't pick invalid dates

---

## Known issues / things I haven't figured out yet

- The HD button doesn't work on days where NASA posted a video (HD url only exists for images)
- No way to save or favourite photos yet, maybe I'll add that later
- Haven't made it fully responsive for very small screens

---

## Cool dates to try

- Your own birthday — genuinely try this it's fun
- `1995-06-16` — the very first APOD ever posted
- `2004-01-04` — Mars rover Spirit landing

---

## Credits

- NASA for making their API free and open — [https://api.nasa.gov/](https://api.nasa.gov/)
- My teacher for the project idea
