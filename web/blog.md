---
layout: page
title: Blog
longtitle: API Stylebook Blog
subtitle: Collections of Resources for API Designers
permalink: /blog/
menu: true
sort: 3
---

<div class="container blog-container">
  <div class="row">
    {% for post in site.posts %}
      <div class="post-summary">
        <h2>
          <a class="post-link" href="{{ post.url | prepend: site.baseurl | prepend: site.github.url }}">{{ post.title | escape }}</a>
        </h2>
        <p><span class="post-meta">{{ post.date | date: "%b %-d, %Y" }}</span></p>
        {{ post.excerpt }}
        <p><a href="{{ post.url | prepend: site.baseurl | prepend: site.github.url }}">Read more</a></p>
      </div>
    {% endfor %}
  </div>
</div>
  
