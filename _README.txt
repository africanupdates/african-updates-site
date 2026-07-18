AFRICAN UPDATES — TEMPLATES MASTER (safe version)
=================================================

WHAT THIS IS
------------
Every template and stylesheet I built, in its current correct version.
Unzip at the root of your repo and let it overwrite.

WHAT IS DELIBERATELY *NOT* IN HERE
----------------------------------
These are yours — you edited them, so they are excluded and will NOT be
touched by this zip:

  i18n/en.toml, i18n/fr.toml, i18n/rw.toml
  hugo.toml
  content/   (all your posts and pages)

That means this zip is NOT a full site backup. It is insurance for the
template layer only. Your translations, settings and content stay exactly
as they are in your repo.

CONTENTS
--------
layouts/
  index.html                       homepage (category sections match slug or name)
  404.html                         search form points to the working search page
  robots.txt                       crawling rules + sitemap links
  posts/single.html                THE article template (thumbnails, hero,
                                   small-image safeguard, translated categories,
                                   NewsArticle schema)
  _default/single.html             clean copy of the article template
  _default/page.html               static pages (about, contact, policies)
  _default/list.html               archive listing (translated headings)
  _default/term.html               fallback term template
  _default/taxonomy.html           "all categories" overview (guarded against
                                   the empty-terms build crash)
  _default/baseof.html             base shell + organization schema
  _default/home.newssitemap.xml    Google News sitemap
  _default/_markup/render-image.html   body images -> WebP, guarded so a bad
                                       file cannot crash the build
  _default/_markup/render-table.html   tables scroll on mobile
  categories/term.html             category pages (fixes the blank-page bug)
  tags/term.html                   tag pages (same fix)
  authors/term.html                author profile pages
  search/search.html               Pagefind search UI
  partials/                        nav, footer, sidebar, topbar, hero-slider,
                                   breaking-ticker, breadcrumb, post-card,
                                   responsive-image, organization-schema,
                                   pagination, share, header, analytics,
                                   cookie-consent

static/
  css/au-theme.css                 all styling, incl. badge colours for all
                                   21 categories
  admin/config.yml                 Decap CMS — English labels throughout,
                                   21 categories in all three collections
  admin/index.html                 Decap preview (hardened)
  _redirects                       /  ->  /rw/

VERIFIED
--------
Full Hugo build with this exact set: 0 errors. Homepages in all three
languages, category pages, search pages, robots.txt and the news sitemap
all generated.

DEPENDS ON YOUR FILES
---------------------
These templates read translation keys from your i18n files. If a label ever
shows in English where it should be translated, the cause is a missing key,
not the template. The naming rules are:

  categories   cat_<slug with - as _>    e.g. cat_african_union
  menu items   menu_<name as slug>       e.g. menu_east_africa
  languages    lang_<code>               e.g. lang_fr

Add the missing key to i18n/en.toml, fr.toml and rw.toml and it will render.

REMINDERS
---------
- Cloudflare build command must stay:
    hugo --gc --minify && npx -y pagefind --site public
- Update base_url in static/admin/config.yml when africanupdates.com goes
  live, or CMS login will break.
- Upload post thumbnails at 1200px wide or larger. Anything under 600px is
  shown contained rather than stretched, but it still cannot look sharp.
- If a build ever fails with "getResourcesForPage ... has no resource",
  find the post folder named in the error and fix or delete its broken image.
