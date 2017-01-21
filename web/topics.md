---
layout: default
title: Design Topics
permalink: /design/topics/
date: 2016-08-18 22:31:09 +0200
menu: true
sort: 2
anchors: true
toc: true
---
<div class="container main-container full-jumbotron">
  <div id="page-title" class="jumbotron">
      <h1>{{ page.title | escape }}</h1>
      <p>All topics covered by analyzed Design Guidelines are listed here.</p>
      <p>Each topic page lists all references to a specific topic throughout all analyzed guidelines.</p>
  </div>
</div>
<div class="container body-container">
  <div class="row">
    <div class="col-sm-3">
      <nav id="toc" data-toggle="toc" class="affix"></nav>
    </div>
    <div class="col-sm-9">
      {% assign sorted_pages = (site.pages | where: "layout" , "topic" | sort: "sort" | group_by: "topic_category") %}
      {% for category in sorted_pages %}
      <div class="panel panel-default">
        <div class="panel-heading">
          <h2 class="panel-title anchored">{{category.name}}</h2>
        </div>
        <table class="table">
        {% for topic in category.items %}
          <tr>
            <td>
              <h3 class="anchored"><a href="{{ topic.url | prepend: site.baseurl | prepend: site.github.url}}">{{ topic.topic_name | escape }}</a></h3>
              <p>{{ topic.topic_description | markdownify }}</p>
            </td>
          </tr>
        {% endfor %}
        </table>
      </div>
      {% endfor %}
    </div>
  </div>
</div>

<script>
$(document).ready(function(){
    var bottom = $("#page-title").offset().top + $("#page-title").outerHeight(true);
    console.log(bottom);
    $('#toc').affix({offset: {top: bottom }});
});
</script>
