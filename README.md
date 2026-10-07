# Vitals
Vitals — Preliminary Symptom Insight
Ever had a weird symptom at 11 p.m. and wondered, "Is this something I should worry about, or am I overthinking it?" That's the feeling this project is built around.
Vitals is a small, friendly web app that gives you a first, plain-language read on symptoms related to your heart, lungs, and brain. It doesn't diagnose anything (and it says so, loudly). It just helps you figure out whether it's worth talking to a real doctor, and helps you find one nearby.
I built it as a student project to explore how a symptom checker could feel less cold and clinical, and a bit more human.
> ⚠️ \*\*Please read:\*\* Vitals is an educational demo. It is not a medical device, not a diagnosis, and not a replacement for a licensed healthcare professional. If you think something is an emergency, call your local emergency number right away.
---
What it can do
Symptom checks for three systems. Pick heart, lungs, or brain, tick the symptoms you're noticing, answer a couple of quick follow-ups (age, how long, how severe), and get a short summary of patterns that might match, with a friendly recommendation for each.
Urgent warnings. If your symptoms line up with something serious (like a possible heart attack or stroke pattern), the app shows a clear warning to seek emergency care instead of burying it.
Lab report reader. Upload a photo of a blood test and the app reads the values it recognizes (using OCR), compares them with typical adult ranges, and explains in simple words what each marker relates to. It never names a condition or suggests a treatment.
Find care near you. Share your location and see nearby pharmacies, hospitals, or clinics on a map, closest first, with a "Get directions" link.
Chat assistant. A small chatbot that helps you navigate the site and answers everyday health questions with likely causes, self-care tips, and when to see a doctor.
A break from the worry. A guided 4-4-4-4 breathing exercise and a memory-match card game, because waiting on answers is stressful.
Light and dark mode, plus a simple sign-in screen.
---
Built with
HTML, CSS, and vanilla JavaScript — no frameworks, no build step
Tesseract.js for reading lab report images right in the browser
Geoapify Places API for the nearby care finder and map
Google Gemini API for the chatbot's open-ended answers
Google Fonts (Fraunces, IBM Plex Sans, IBM Plex Mono)
---
Project structure
```
├── index.html   # Page structure: login, symptom checker, lab reader, find care, chatbot
├── style.css    # All styling, including the dark theme
└── script.js    # Symptom scoring logic, OCR, chatbot, games, and the care finder
```
---
Running it locally
There's nothing to install.
Download or clone this repo:
```bash
   git clone https://github.com/<your-username>/<your-repo-name>.git
   ```
Open `index.html` in your browser. That's it.
For the chatbot and the "Find care" feature to work, you'll need your own API keys (see below). The symptom checkers, games, and lab reader work without them, as long as you're online (the lab reader loads its OCR library from a CDN).
Setting up your API keys
Open `script.js` and look for these two lines:
```js
const GEMINI\_API\_KEY = 'your-gemini-key-here';
const GEOAPIFY\_API\_KEY = 'your-geoapify-key-here';
```
Get a Gemini key from Google AI Studio.
Get a free Geoapify key from myprojects.geoapify.com.
Important: because this is a front-end-only project, any key you put in `script.js` is visible to anyone who opens the page. Don't commit real keys to a public repo. Restrict your keys to your own domain in their dashboards, set usage limits, and if you ever deploy this seriously, move the calls to a small backend.
---
How the symptom scoring works
There's no black-box AI deciding your results. Each condition has a small set of related symptoms with weights, and your score is how much of that total you matched, nudged slightly by how severe you said it feels. You can read and tweak all of it in the `ORGANS` object at the top of `script.js`. It's deliberately simple and transparent, which is also why it should only ever be treated as a rough, educational estimate.
---
A note on privacy
Symptom checks, the games, and the lab report reader all run in your browser. Your lab image isn't uploaded anywhere.
The chat assistant sends what you type to Google's Gemini API.
The Find care feature sends your approximate coordinates to Geoapify to look up nearby places (and only when you click the button).
The sign-in screen is a front-end demo only. It doesn't create real accounts or store passwords.
---
Limitations (being honest)
Results are rule-based and simplified. Real medicine is far more nuanced.
The lab reader only knows a handful of common markers and typical adult ranges. It doesn't know your age, sex, or history, and OCR can misread blurry photos.
Place listings come from OpenStreetMap data and may be incomplete or out of date. Call ahead.
It only covers the heart, lungs, and brain.
---
Ideas for what's next
Add more body systems (digestive, skin, and so on)
Support for more lab markers and unit conversions
Real authentication and a small backend to keep API keys safe
Multi-language support
Saving past check history
---
Contributing
Suggestions and fixes are very welcome. Open an issue or send a pull request. If you work in healthcare and spot something misleading, please tell me; that kind of feedback matters most.
License
Released under the MIT License. Feel free to learn from it and build on it. Just keep the disclaimers intact.
---
Made with care , a student at VIT Bhopal University. Take care of yourself. 💚
