# Adding a project

1. Put Chad's photos in `src/assets/photos/raw/` (HEIC from an iPhone is fine). This folder is
   never committed.
2. Run `npm run photos`. It strips all EXIF (GPS included), fixes rotation, and writes JPEGs to
   `src/assets/photos/projects/`. It lists any photo under 1600px wide: don't use those as a hero.
3. Run `npm run test:exif` to confirm no processed photo has GPS data.
4. Add `src/content/projects/<short-name>.md`:

```md
---
title: Kitchen remodel on Elm
town: Tea                 # must be one of location.serviceTowns in site.config.json
service: remodeling       # remodeling | additions | decks | siding | new-construction
date: 2026-09-15
cover: ../../assets/photos/projects/elm-kitchen-after.jpg
photos:
  - { src: ../../assets/photos/projects/elm-kitchen-before.jpg, alt: "Kitchen before, dark oak cabinets and a soffit over the sink", kind: before }
  - { src: ../../assets/photos/projects/elm-kitchen-after.jpg, alt: "Same kitchen after, white shaker cabinets to the ceiling", kind: after }
caption: Took out the soffit and ran the uppers to the ceiling.
featured: true
---
```

The build fails if a town or service is misspelled, any `alt` is empty, or `caption` is empty or
longer than one sentence. The first project with both a `before` and an `after` photo (featured
first, then newest) fills the before/after slider on the home page.
