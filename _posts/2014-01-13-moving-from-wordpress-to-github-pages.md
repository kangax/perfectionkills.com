---
layout: post
title: Moving from Wordpress to Github Pages
tags:
  - other
---

# Moving from Wordpress to Github Pages

Moving from Wordpress to [Github Pages](http://pages.github.com) (and [Jekyll](http://jekyllrb.com/)) is the best thing that ever happened to this blog. I've been meaning to do it for a while and finally found some time over these holidays.

Jekyll is a static site generator, and Github Pages allow for seamless hosting of its content. I've been using it on [fabricjs.com](http://fabricjs.com) for [couple years now](https://github.com/kangax/fabricjs.com); once you get familiar with the worklow, it's simple and straightforward.

If you mainly care about content and enjoy minimalism, Jekyll/gh-pages is just a *perfect combo* that doesn't get in a way and lets you **focus on writing**.

## Pros (vs. Wordpress)

- Simple and **familiar workflow** via [Git](http://git-scm.com/) & [Github](http://github.com)
- Quick and **easy updates** (takes few seconds to change, commit, push)
- Can add/update content **while offline** (thanks to Git, of course)
- **Simple formatting** via Markdown or HTML (know exactly how text will be formatted and displayed)
- All content is in clear text form, **easily accessible** (not hidden somewhere deep in the database)
- All **assets** — images, JS, CSS, etc. — are easily added/accessible (no need to upload to wordpress or FTP to server or keep in Dropbox, etc.)
- No need for **constant wordpress updates** & blog **backups** (in case something goes wrong)
- **Better security** (simpler system means less attack vectors; wordpress was often hacked with viagra ads)
- **Higher stability** (unrelated to Wordpress but rather my hosting provider; blog was down 72 mins (!) in the past month; github is much more stable, [constantly improving uptime](https://status.github.com/), [adding CDN](https://github.com/blog/1715-faster-more-awesome-github-pages), etc.)
- **Easy contributions** to site/content via Github's Pull Requests and/or issues (although this one might be a bit of a stretch)

## Cons (sort of)

- Comments no longer work **without Javascript** (when using Disqus; the biggest downside)
- You no longer **"own" comments** (when using Disqus; they're stored in a "cloud")
- Github **doesn't run plugins** (if you ever need to customize something; can be easily mitigated by pushing locally generated content)
- Jekyll **runs on Ruby**, instead of Javascript — my preferred language (if you ever need to customize something; but Ruby is not PHP so it's not all that bad)

## Other improvements during move

- Normalized presentation: code blocks, blockquotes, headers, font sizes, styles
- Fixed broken images, links, demos
- Collected all asset images in once place, smooshed them (saving ~500KB overall)
- Made site responsive
- Removed all the unnecessary crap (why was there twitter stream in footer again?)

## Fun stats

Since starting [perfectionkills.com](http://perfectionkills.com) in Aug 2007 — mostly wanting to share Prototype.js tutorials, tips, and scripts — I wrote **55 posts** (worth **70,000 words**). There's been **914,000 visits** and **1,160,000 pageviews**. People left **1744 comments** (most popular posts being [Understanding delete](http://perfectionkills.com/understanding-delete), [Javascript quiz](http://perfectionkills.com/javascript-quiz), and [Profiling CSS for fun and profit](http://perfectionkills.com/profiling-css-for-fun-and-profit-optimization-notes)).

Here's to the next 50 posts and a milion visits! :)
