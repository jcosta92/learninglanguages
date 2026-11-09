# Obrigado · Danke

A trilingual course for two people learning each other's language: **English** in the middle, **European Portuguese** and **German (Germany)** side by side, from A1 to C2.

- 43 units: A1 (10), A2 (10), B1 (8) at full depth; B2, C1, C2 (5 each) as scaffolds with readings
- 1,276 words, 374 phrases, 114 grammar points with 551 trilingual examples, 14 parallel reading texts
- 7 exercise types: flashcards, pick the word, recognise it, type it, match pairs, fill the gap, build the sentence
- A **DE / PT** switch decides which language the exercises ask for; progress is kept separately for each
- Every item can be flagged (⚑) as wrong; Menu → Copy flags exports the list for correction

## Run it

The course is one self-contained file, `index.html`. Any of these work:

| Option | How |
| --- | --- |
| Streamlit Community Cloud | New app → this repo → branch `main` → main file `streamlit_app.py` |
| GitHub Pages | Settings → Pages → Deploy from branch → `main` / root |
| Locally | Open `index.html` in a browser, or `streamlit run streamlit_app.py` |

Progress is saved in each browser's localStorage. To move it between phones: Menu → Copy progress, then Menu → Paste progress on the other device.

## Edit the content

Content lives in `src/data/a1.js` … `c2.js`; the page template and engine in `src/app.html`.

```bash
npm install        # once, for the test only
npm test           # validates every unit, rebuilds index.html, runs every exercise in both languages
```

`node build.js` alone validates the data and regenerates `index.html`. Commit the regenerated `index.html` together with the source change.

### Data format

```js
{id:'a1-01', title:'Greetings', icon:'👋', intro:'…',
 vocab:[{en:'thank you', pt:'obrigado / obrigada', de:'danke', icon:'💐', note:'…', pos:'noun'}],
 phrases:[{en:'…', pt:'…', de:'…'}],
 grammar:[{title:'…', en:'…', pt:'…', de:'…',
           table:{head:[…], rows:[[…]]},
           examples:[{en:'I am tired.', pt:'[Estou] cansado.', de:'Ich [bin] müde.'}]}],
 reading:{title:'…', en:'…', pt:'…', de:'…', questions:['…']}}
```

Square brackets in grammar examples mark the word blanked out in the fill-the-gap exercise; use one pair per sentence.

## Sources and caveats

Level structure follows the CEFR can-do descriptors. Unit topics follow the A1–C2 syllabus of the Goethe-Institut exams and the CAPLE/Camões exams for European Portuguese (CIPLE to DUPLE). The vocabulary and texts were written for this course and have not yet been reviewed by a native speaker of either language; flagged items are the review queue.
