# Dengue, in context

An educational dashboard about reported dengue cases and deaths in Bangladesh.
It explores annual historical counts, then evaluates a simple monthly Poisson
model against a locked 2025 test set.

The model has one parameter, λ (lambda), for each calendar month. Each λ is the
average reported case count for that month from 2021–2024. The project excludes
2020 from model fitting because the student chose to treat that unusually low
year as unrepresentative. The 2025 case counts are held out until the final
evaluation. Deaths are shown as historical counts only and are not modeled.

This is a classroom model, not an official public-health forecast or medical
advice. It does not estimate an individual's chance of infection and is not
updated with live data. It does not account for population changes, weather,
interventions, or reporting changes. Patients should contact qualified health
professionals for personal guidance; health teams should use current official
surveillance and local protocols.

The app contains 72 monthly records from January 2020 through December 2025.
Source details and the data license are in [SOURCES.md](./SOURCES.md); AI use
and student decisions are recorded in [AI-NOTES.md](./AI-NOTES.md).

## Run and check the website

From this folder, install dependencies and start the local preview:

```sh
npm install
npm run dev
```

Run the course website rules checker with:

```sh
node tools/check.mjs
```

Only the `app/` folder is uploaded for the website submission. Dataset source
and license details are in [SOURCES.md](./SOURCES.md); AI use is recorded in
[AI-NOTES.md](./AI-NOTES.md).

## Deploy with Vercel

The project is a static Vite site. Import
[pai-final-project](https://github.com/Samin-yasar/pai-final-project) into
Vercel. Use `npm run build` as the build command and `dist` as the output
directory. Vercel can install the dependencies from `package-lock.json`.

To use `pai1.samin-yasar.dev`, add that exact domain in the Vercel project’s
**Settings → Domains**. Follow the DNS record Vercel displays at the provider
that manages `samin-yasar.dev`; the required CNAME target can depend on the
domain configuration. Wait for Vercel to verify DNS and issue HTTPS before
sharing the address. Deployments from the connected GitHub repository will
update the site automatically.

## Project files

- Website source: `app/`.
- GitHub: [pai-final-project](https://github.com/Samin-yasar/pai-final-project).
- The repository uses an MIT License for project code. Dataset terms remain
  CC BY 4.0 as listed in [SOURCES.md](./SOURCES.md).
- Thumbnail: `thumbnail/dengue-in-context.png` (1280 × 720); editable source:
  `thumbnail/dengue-in-context.svg`.
- Video: omitted from this project. The course says students under 18 should
  not make a video.
