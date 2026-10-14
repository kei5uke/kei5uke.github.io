# kei5uke.github.io

Personal notes and CTF writeups, written in [Obsidian](https://obsidian.md) and published with [Quartz](https://quartz.jzhao.xyz) to <https://kei5uke.github.io>.

```
.
├── content/   # The Obsidian vault — every note on the site lives here
├── quartz/    # Quartz site generator (config, styles, plugins)
└── .github/   # GitHub Actions workflow that builds and deploys the site
```

## Setup

Requirements: Node.js 22+ and npm 10.9.2+ (see `quartz/.node-version`).

```bash
git clone https://github.com/kei5uke/kei5uke.github.io.git
cd kei5uke.github.io/quartz
npm ci
npm run install-plugins
```

## Run the local server

From `quartz/`:

```bash
npm run serve
```

This builds the site from `../content` and serves it at <http://localhost:8080>, rebuilding when notes change.

## Writing notes with Obsidian

1. In Obsidian, choose **Open folder as vault** and select the `content/` folder. Don't select the repo root.
2. Write notes as usual. Each Markdown file becomes a page, and the URL comes from its path. For example, `Pentest Note/04-web/xss.md` becomes `/pentest-note/04-web/xss`.
3. Start each note with frontmatter:

   ```yaml
   ---
   title: HTB Popcorn
   date: 2026-04-24
   author: kei5uke
   draft: false
   description: Writeup for HTB Popcorn
   tags:
     - linux
     - writeup
   ---
   ```

   - `draft: true` keeps a note off the site.
   - `tags` show up as chips and get their own tag pages.
   - `description` is shown under the title.

4. Use normal Obsidian syntax: `[[wikilinks]]`, `![[image.png]]` embeds, callouts and so on. Quartz renders them.
5. Pasted images go to `content/Attachment/`. The vault is set up to put them there.
6. Folders or files named `private` or `templates`, and the `.obsidian/` folder, are never published.

## Publishing

Push to `main`. When anything under `content/` or `quartz/` changes, the workflow in `.github/workflows/deploy.yml` builds the site and deploys it to GitHub Pages. Images that only draft notes use are removed from the published site.
