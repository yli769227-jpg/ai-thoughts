# ai-thoughts

Personal blog about AI — built with [Astro](https://astro.build).

## Stack
- Astro 6 · Content Collections
- Instrument Serif (display) · Outfit (body) · JetBrains Mono (mono)
- Custom geeky theme: flowing blue blob background, cursor halo, scroll progress bar, click-to-burst particle effects, word-by-word hero reveal, line-by-line prose reveal

## Structure
```
src/
  components/
    BackgroundFX.astro    # flowing bg + halo + burst + reveal scripts
    Header.astro          # sticky nav w/ pulsing dot + caret
    Footer.astro
    PostList.astro        # post cards w/ data-burst hook
  layouts/
    BaseLayout.astro
  pages/
    index.astro           # home
    about.astro
    blog/index.astro      # full post list
    blog/[...slug].astro  # article page
    rss.xml.js
  content/blog/*.md       # your posts (untouched)
  styles/global.css       # design tokens + shared fx styles
```

## Develop
```
npm install
npm run dev
```

## Build
```
npm run build
```
Output goes to `dist/`. The site is configured for GitHub Pages at
`https://yli769227-jpg.github.io/ai-thoughts`.
