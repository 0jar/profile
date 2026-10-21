---
start: "2024-09"
end: "present"
lane: "ops"
title: "jarema.me, jar.tf and jar.vn"
role: "Author and maintainer"
org: "Personal project"
location: "Online"
summary: "Three personal domains, one a blog, one a link page with short links, and one this plain summary site."
highlights: []
stack: ["Astro", "Next.js", "Static sites", "Base36 short links"]
repoUrl: "https://codeberg.org/0jar/links"
liveUrl: "https://jar.tf"
showInTimeline: true
onCv: true
order: 2
---

I wanted a place for longer writing, a short address I could hand to anyone, and a page that only says who I am. Putting all three on one site would have made each worse, so I run three domains. [jarema.me](https://jarema.me) is the blog and notes. [jar.tf](https://jar.tf) is a link-in-bio page with a short-link redirector, so any post can be shared with a short address. This site, jar.vn, is the professional profile.

The link-in-bio page and redirector is a small Next.js project, and the source is public on [Codeberg](https://codeberg.org/0jar/links). Short codes map to destinations in a single data file, with no database involved. It also supports timestamped URLs for my blog. The sites themselves are built to be static so they load quickly on a weak connection, which matters to me because some of the time I myself am stuck on 3G connection.

I keep my code on Codeberg, GitHub, GitLab and Disroot Git under the handle 0jar. It's small, boring parts, each with one job each, things are written down so it could be handed to someone else.
