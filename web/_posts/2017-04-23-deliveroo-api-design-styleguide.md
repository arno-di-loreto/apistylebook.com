---
layout: post
title: Deliveroo API Design Styleguide added on the API Stylebook
date: 2017-04-23
categories: Update
permalink: /blog/deliveroo-api-design-styleguide-added-on-the-api-stylebook
author: Arnaud Lauret
---

The [Deliveroo API Design guide](/design/guidelines/deliveroo-api-design-guidelines) has been added the API Stylebook! This is a MUST read for any API designer.

> Deliveroo is a British online food delivery company. Orders are placed through its website and then either employed or self-employed bicycle, motorcycle or car couriers transport orders from restaurants to customers.
> Source [wikipedia]https://en.wikipedia.org/wiki/Deliveroo

These guidelines can be sum up with this quote:

> We choose to adopt three general principles. Here’s a shortcut to remember:  
> RESTful, Hypermedia, Fine-grained

They are *internal apis* oriented but contains some interesting considerations and precisions for [external APIs](http://deliveroo.engineering/guidelines/api-design/#external-facing) and the duality of internal/external design.

[API Documentation](http://deliveroo.engineering/guidelines/api-design/#documenting-apis) is briefly explained with 3 lines but contains 2 powerful quotes that everyone working with API MUST have in mind:

> API users are both developers and machines  
> Discuss APIs before starting any implementation

This document contains a really interesting section about [API and domain modelling](http://deliveroo.engineering/guidelines/api-design/#api-and-domain-modelling) based on Domain Driven Design. This sections helps reader to model resources and their relations.

Deliveroo engineering teams promote wisely the use of [Hypermedia](http://deliveroo.engineering/guidelines/api-design/#hypermedia--hateoas) (but please, just stop using this ugly HATEOAS acronym!).

> More importantly, consumers should not need to construct URLs, instead using only URLs dynamically discovered in responses.

This is the first analyzed document to deal with [internationalization](http://deliveroo.engineering/guidelines/api-design/#internationalisation-i18n).

Two approaches of versioning are described, one for [internal facing APIs](http://deliveroo.engineering/guidelines/api-design/#versioning) and another for [external facing APIs](http://deliveroo.engineering/guidelines/api-design/#public-friendly-apis). 

How deliveroo engineering team [handles errors beyond HTTP status](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors) is simple and brilliant.

> The results are not just intended to be acted on by machines, but rather presented to users.

[Caching](http://deliveroo.engineering/guidelines/api-design/#caching) is explained in depth.

> Caching efficiency is a critical aim of well-designed APIs, as it is influential on service performance; cache consistency is as important.

These guidelines are definitely a MUST read for any API designer. If you want to see all topics covered by this document go to the [Deliveroo API Design guide](/design/guidelines/deliveroo-api-design-guidelines) on the API Stylebook.

*Note: there's a minor contradiction concerning HTTP status code return by PATCH (both MUST and MUST NOT return 200), an [issue](https://github.com/deliveroo/deliveroo.engineering/issues/135) has been declared.*
