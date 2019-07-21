---
layout: default
title: Design Guidelines
permalink: /design/guidelines/
date: 2016-08-18 22:31:09 +0200
menu: true
sort: 1
---
<div class="container main-container full-jumbotron">
    <div class="jumbotron">
        <h1>{{ page.title | escape }}</h1>
        <p>Some companies and government agencies share their API Design Guidelines with the community.</p>
        <p>Each document has been analyzed to list covered topics and their references within the document.</p>
    </div>
</div>

<div class="container body-container">
    <div class="row">
        {% assign sorted_pages = (site.pages | where: "layout" , "guideline" | sort: 'sort') %}
        {% for page in sorted_pages %}
        <div class="col-sm-6 col-md-4">
            <div class="thumbnail">
                <img src="{{ page.guideline_screenshotUrl | prepend: site.baseurl | prepend: site.github.url}}" alt="screenshot">
                <div class="caption">
                    <div class="same-height">
                        <h3>{{ page.guideline_title | escape }}</h3>
                        <p>{{ page.guideline_company | escape }}</p>
                    </div>
                    <p><a href="{{ page.url | prepend: site.baseurl | prepend: site.github.url}}" class="btn btn-default" role="button">Explore</a></p>
                </div>
            </div>
        </div>
        {% endfor %}
    </div>
</div>
<script language="javascript">
$(window).ready(function() {
    $(".same-height").height(Math.max.apply(null, $(".same-height").map(function() { return $(this).height(); }))); 
});
$(window).resize(function() {
    $("same-height").height(Math.max.apply(null, $(".same-height").map(function() { return $(this).height(); })));
});
</script>