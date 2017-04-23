---
layout: post
title: Google API Design Guide added on the API Stylebook
date: 2017-03-05
categories: Update
permalink: /blog/google-api-design-guide-added-on-the-api-stylebook
author: Arnaud Lauret
---

Google shared its API Design Guide with the community and it has been added to the [API Stylebook](/design/guidelines/google-api-design-guide).

[![alt text](/media/screenshots/google-api-design-guide.png)](/design/guidelines/google-api-design-guide)

> This is a general design guide for networked APIs. It has been used inside Google since 2014 and is the guide we follow when designing Cloud APIs and other Google APIs. It is shared here to inform outside developers and to make it easier for us all to work together.  

This guide is slightly different from the [other ones](/design/guidelines/) because it deals with REST **and RPC** API design focusing on [gRPC APIs](http://www.grpc.io/) using [Protocol Buffers v3](https://cloud.google.com/apis/design/proto3).  

> This guide applies to both REST APIs and RPC APIs, with specific focus on gRPC APIs. gRPC APIs use Protocol Buffers to define their API surface and API Service Configuration to configure their API services, including HTTP mapping, logging, and monitoring.  

People who are not familiar with [gRPC](http://www.grpc.io/) and [proto3](https://cloud.google.com/apis/design/proto3) may be taken aback by this guide, but it's really worth reading for any API designers or anyone wishing to use [Google Cloud Endpoints](https://cloud.google.com/endpoints/docs/grpc).  

The [documentation section](/design/guidelines/google-api-design-guide#documentation) is really interesting giving guidelines on how to write your API (technical) documentation. If you remember only one thing concerning documentation, let it be this quote:

> In most cases, there's more to say than just restating the obvious

Versioning and how to determine if a change is a breaking one or not are very well explained (see [Versionning](/design/guidelines/google-api-design-guide#versioning)).

To have a quick look at all the topics covered by the [Google API Design Guide, click here.](/design/guidelines/google-api-design-guide).