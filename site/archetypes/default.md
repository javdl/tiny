---
title:          "{{ replace .TranslationBaseName "-" " " | title }}"
date:           {{ dateFormat "2006-01-02" .Date }}
draft:          true
tags:           ["go", "cpp"]
image:          "{{ dateFormat "20060102" .Date }}_{{ replace .TranslationBaseName "-" " " | title }}_cover.jpg"
---
