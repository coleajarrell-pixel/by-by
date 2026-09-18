/*
  Portfolio data.
  ------------------------------------------------------------------
  Portfolio entries for live client work only.
  Add new shoots here; do not leave placeholder/sample titles.

  Fields:
  - `image`: a path like "assets/work/project-01.jpg" for a photo
    thumbnail. Prefer this for cards; if `video` is also set, the
    photo shows on the card and the film opens on click.
  - `video`: a path like "assets/work/video/clip.mp4". Used as the
    card thumbnail only when no `image` is set; otherwise opens in
    the film lightbox when the card is clicked.
  - `autoplay`: set true on a video entry to have it play muted and
    looping as soon as the page loads, instead of only on hover.
  - `color`: a CSS gradient placeholder, used only if neither
    `image` nor `video` is set.

  Order: film and brand/hospitality first, nightlife events last.
  ------------------------------------------------------------------
*/

const PROJECTS = [
  {
    id: "biohakd-ad-1",
    title: "BioHAKD Longevity Lounge",
    client: "Brand Ad Film",
    category: "Brand Film",
    tag: "Film",
    year: "2026",
    description: "A brand ad for BioHAKD Longevity Lounge, a Charleston-area wellness and longevity studio.",
    featured: true,
    image: "assets/work/video/biohakd-ad-1-poster.jpg",
    video: "assets/work/video/biohakd-ad-1.mp4",
    poster: "assets/work/video/biohakd-ad-1-poster.jpg"
  },
  {
    id: "palma-1",
    title: "Palma Day Club",
    client: "Hospitality and lifestyle photography",
    category: "Photography",
    tag: "Photo",
    year: "2026",
    description: "Poolside day club coverage for Palma Day Club, Charleston, SC.",
    featured: true,
    image: "assets/work/palma/palma-6.jpg"
  },
  {
    id: "bluedoor-1",
    title: "Blue Door",
    client: "Brand and lifestyle photography",
    category: "Photography",
    tag: "Photo",
    year: "2026",
    description: "Lifestyle photography at Blue Door, a Charleston drink and social bar.",
    featured: true,
    image: "assets/work/bluedoor/bluedoor-1.jpg?v=3"
  },
  {
    id: "groovers-charleston-1",
    title: "Groovers Listening Bar",
    client: "Charleston, SC lifestyle photography",
    category: "Photography",
    tag: "Photo",
    year: "2026",
    description: "Bar and lounge photography at Groovers Listening Bar's Charleston location.",
    featured: true,
    image: "assets/work/groovers/groovers-7.jpg"
  },
  {
    id: "trio-charleston-1",
    title: "Trio Charleston",
    client: "Event photography",
    category: "Events",
    tag: "Photo",
    year: "2026",
    description: "DJ and nightlife event coverage at Trio in Charleston.",
    featured: true,
    image: "assets/work/trio/trio-2.jpg"
  },
  {
    id: "groovers-charlotte-1",
    title: "Groovers Listening Bar (Charlotte)",
    client: "Charlotte, NC nightlife event photography",
    category: "Events",
    tag: "Photo",
    year: "2026",
    description: "Nightlife event coverage at Groovers Listening Bar's Charlotte location.",
    featured: true,
    image: "assets/work/groovers-charlotte/groovers-charlotte-2.jpg"
  },
  {
    id: "trio-charlotte-1",
    title: "Trio Charlotte",
    client: "Event photography",
    category: "Events",
    tag: "Photo",
    year: "2026",
    description: "DJ and nightlife event coverage at Trio in Charlotte.",
    featured: true,
    image: "assets/work/trio-charlotte/trio-charlotte-1.jpg"
  }
];