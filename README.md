# Minha The Little Fairy ✨

A static romantic microsite. No backend, no Node.js. Works on GitHub Pages, Netlify and Vercel.

## Files
- `index.html` – content (names, favorites, songs, texts)
- `style.css` – design (colors at the top)
- `script.js` – behavior + `SITE_CONFIG` at the top (names, music path, secret message, optional date)
- `images/` – `minha1.webp` … `minha5.webp`
- `audio/` – put your own legal file here as `favorite-song.mp3`

## Photos
Overwrite a file in `images/` keeping its name, or change the `src` in `index.html`.
If you use .jpg, update the `src` paths (search `images/minha`).
Placement: minha4 hero · minha1 about + polaroid · minha2 dream + polaroid · minha5 parallax band + final · minha3 favorites.
Optional Kashmir photo: add `images/kashmir.jpg`, then uncomment `--kashmir` in `style.css`.

## Music
Not autoplayed. Add `audio/favorite-song.mp3`; the floating button (bottom-right) plays/pauses it.
YouTube songs only open links in a new tab.

## Deploy on GitHub Pages
Upload everything (keep the folder structure; `index.html` at the repo root) → Settings → Pages → Deploy from branch → main / root.
