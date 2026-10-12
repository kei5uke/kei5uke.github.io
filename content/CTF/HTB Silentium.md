---
title: HTB Silentium
author: kei5uke
draft: true
description: Writeup for HTB Silentium
tags:
  - linux
  - writeup
---

# NMAP

```
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 9.6p1 Ubuntu 3ubuntu13.15 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 0c:4b:d2:76:ab:10:06:92:05:dc:f7:55:94:7f:18:df (ECDSA)
|_  256 2d:6d:4a:4c:ee:2e:11:b6:c8:90:e6:83:e9:df:38:b0 (ED25519)
80/tcp open  http    nginx 1.24.0 (Ubuntu)
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-title: Did not follow redirect to http://silentium.htb/
|_http-server-header: nginx/1.24.0 (Ubuntu)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

```

NO UDP

# HTTP80

![[HTB Silentium - image.png]]

FeroxBuster

![[HTB Silentium - image 1.png]]

FFUF with different domains

![[HTB Silentium - image 2.png]]

# HTTP80 staging.silentium.htb

![[HTB Silentium - image 3.png]]

Found api: `/api/v1`

![[HTB Silentium - image 4.png]]

![[HTB Silentium - image 5.png]]

![[HTB Silentium - image 6.png]]

Based on the found api pages, this is `flowiseai:3.0.5`

This version has 2 major CVEs: **CVE-2025-58434, CVE-2025-59528**

https://github.com/AzureADTrent/CVE-2025-58434-59528#cve-2025-58434--cve-2025-59528

This exploit with `ben@silentium.htb` gives you a shell

# Shell in Docker container

![[HTB Silentium - image 7.png]]

env variables show SMTP_PASSWORD. This can be used for ssh connection.

# Shell as Ben

`sshpass -p 'r04D!!_R4ge' ssh ben@silentium.htb`

# ROOT shell

grog is running on 3001

[https://github.com/popyue/CVE-2025-8110](https://github.com/popyue/CVE-2025-8110)

![[HTB Silentium - image 8.png]]
