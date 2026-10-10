BIRTHDAY HEART LOCKET WEBSITE — V6
=================================

START HERE
1. Extract the ZIP into a normal folder.
2. Keep the files and folders together.
3. Open index.html in Chrome or Edge.
4. Add your photos, videos and chosen song below, then refresh.

PERSONALIZE THE NAMES
Open app.js in Notepad or VS Code and edit the values near the top:
  const HER_NAME = 'Her Name';
  const YOUR_NAME = 'Your Name';
The birthday is 11 October 2009. You can edit BIRTHDAY_MONTH, BIRTHDAY_DAY and BIRTH_YEAR in app.js.

BACKGROUND MUSIC (NO SONG PAGE)
There is no dedicated Song page. A small floating music button appears on every page.
Put your chosen MP3 at exactly:
  assets/music/birthday-song.mp3
Then refresh. Clicking “Start the birthday journey” now directly calls play() from that click, and the Countdown page retries playback when the MP3 is ready. The small floating music button can pause/resume it on any page.
For file:// previews, the site also carries the music preference between pages with a window-name fallback. Browser policies can still block playback in some setups; if so, click the floating “Play Music” button once. If the button says “Add Song”, check the filename and path.

LOCKET FIX + NEXT PAGE
The locket photo is now a separate layer above the moving wings when the locket is open, so the wings cannot cover it. The photo fades/scales in after the opening motion and is hidden while closed. Opening triggers confetti. The button shown after opening now goes to the birthday letter (letter.html), not the heart album.
Add the photo at:
  assets/locket/inside-photo.jpg

HEART-SHAPED ALBUM
The dedicated heart album remains a separate section. It contains 5 photos + 2 videos, 2 clickable secret envelopes, a central hero photo, decorative Polaroids and the pink ribbon.
Photos:
  assets/heart/photo-1.jpg
  assets/heart/photo-2.jpg
  assets/heart/photo-3.jpg
  assets/heart/photo-4.jpg
  assets/heart/hero-photo.jpg
Videos:
  assets/heart/video-1.mp4
  assets/heart/video-2.mp4
Captions can be edited in the heartItems array in app.js.

PAGES
  index.html       Birthday home
  countdown.html   Live birthday countdown
  gift.html        Animated present + confetti
  locket.html      3D pendant with one photo inside + confetti
  letter.html      Birthday letter
  album.html       Heart-shaped Polaroid album + secret envelopes
  game.html        Catch-the-hearts mini game

NOTES
- Placeholders show if a media file has not been added yet.
- Browser autoplay may be blocked until the music toggle is clicked.
- If you publish the site online, upload the entire folder structure.
