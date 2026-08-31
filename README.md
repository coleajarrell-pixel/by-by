# By & By Productions — Portfolio Website

A static portfolio site for By & By Productions, a Charleston, SC media
company. Plain HTML/CSS/JS — no build step, no framework, so it can be
deployed anywhere that serves static files.

## Structure

```
index.html      Home page
work.html       Full portfolio grid with category filters
about.html      Company story, values, team
contact.html    Contact form + studio info + map
css/style.css   All styling
js/projects.js  Portfolio data (edit this to add/remove projects)
js/main.js      Nav, scroll reveal, portfolio filtering, form validation
assets/         Favicon and any other static assets
```

## Before going live

Everything in the current site is placeholder/template content. Update:

1. **Portfolio projects** — edit `js/projects.js`. Each entry is one card
   on the Work page (and optionally the homepage, if `featured: true`).
   Set `image: "assets/work/your-photo.jpg"` on an entry to use a real
   photo/video poster instead of the gradient placeholder.
2. **Contact info** — replace the placeholder email
   (`hello@byandbyproductions.com`) and phone number in `index.html`,
   `work.html`, `about.html`, `contact.html`, and social links
   (Instagram/Vimeo) with your real ones.
3. **Contact form backend** — the form in `contact.html` has no backend
   wired up yet. Pick one:
   - **Netlify Forms**: if you host on Netlify, the `data-netlify="true"`
     attribute already on the form is enough — no extra setup.
   - **FormSubmit**: change the form's `action` to
     `https://formsubmit.co/your-real-email@domain.com`.
   - Any other form service (Formspree, Getform, etc.) — point `action`
     at the endpoint they give you.
4. **Team section** (`about.html`) — replace the `[Add team member name]`
   placeholders with real names, roles, and photos.
5. **Testimonials** (`index.html`) — replace the placeholder testimonial
   card with a real client quote once you have one.
6. **Address/map** — the map on `contact.html` is centered on Charleston
   generally; narrow the `bbox` in the iframe `src` if you have a specific
   studio address to pin.

## Running locally

No build step required. From this folder:

```
python3 -m http.server 8000
```

Then open http://localhost:8000

## Deploying

Any static host works, for example:
- **GitHub Pages**: push this repo and enable Pages on the branch/root.
- **Netlify**: drag-and-drop the folder, or connect the repo (also gets
  you working contact forms for free — see above).
- **Vercel**: import the repo as a static project.
