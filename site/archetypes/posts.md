---
title:          "{{ replace .TranslationBaseName "-" " " | title }}"
date:           {{ dateFormat "2006-01-02" .Date }}
draft:          true
tags:           []
description:    ""
image:          "/src/img/{{ .File.Dir }}{{ dateFormat "20060102" .Date }}_{{ .TranslationBaseName }}/cover.jpg"
---
