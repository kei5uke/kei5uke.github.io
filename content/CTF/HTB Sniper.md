---
title: HTB Sniper
date: 2026-09-10
author: kei5uke
draft: true
description: Writeup for HTB Sniper
tags:
  - windows
  - writeup
---

# Nmap

```
PORT      STATE SERVICE       VERSION
80/tcp    open  http          Microsoft IIS httpd 10.0
|_http-server-header: Microsoft-IIS/10.0
| http-methods:
|   Supported Methods: OPTIONS TRACE GET HEAD POST
|_  Potentially risky methods: TRACE
|_http-title: Sniper Co.
135/tcp   open  msrpc         Microsoft Windows RPC
139/tcp   open  netbios-ssn   Microsoft Windows netbios-ssn
445/tcp   open  microsoft-ds?
49667/tcp open  msrpc         Microsoft Windows RPC
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-time:
|   date: 2026-09-10T20:34:48
|_  start_date: N/A
| smb2-security-mode:
|   3.1.1:
|_    Message signing enabled but not required
|_clock-skew: 7h00m00s

nmap 10.129.229.6 -sU -T4 --top-port=100 -oN nmap.udp.txt -v
Nothing
```

# HTTP 80

![[HTB Sniper - Screenshot_2026-09-10_at_16.05.51.png]]

Login.php
