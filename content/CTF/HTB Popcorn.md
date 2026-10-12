---
title: HTB Popcorn
date: 2026-04-24
author: kei5uke
draft: true
description: Writeup for HTB Popcorn
tags:
  - linux
  - writeup
---

# Nmap

```
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 5.1p1 Debian 6ubuntu2 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   1024 3e:c8:1b:15:21:15:50:ec:6e:63:bc:c5:6b:80:7b:38 (DSA)
|_  2048 aa:1f:79:21:b8:42:f4:8a:38:bd:b8:05:ef:1a:07:4d (RSA)
80/tcp open  http    Apache httpd 2.2.12
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-server-header: Apache/2.2.12 (Ubuntu)
|_http-title: Did not follow redirect to http://popcorn.htb/
Service Info: Host: 127.0.0.1; OS: Linux; CPE: cpe:/o:linux:linux_kernel

```

# HTTP80

![[HTB Popcorn - image.png]]

- Bunch of webpages

1. Uploading kali.torrent 
2. Change thumbnail to backdoor.php with Burpsuit on
3. Change the content-type to image.png

![[HTB Popcorn - Screenshot_2026-04-24_at_10.20.20.png]]

![[HTB Popcorn - Screenshot_2026-04-24_at_10.21.35.png]]

# Shell as www-data

config.php

![[HTB Popcorn - Screenshot_2026-04-24_at_11.22.59.png]]

`torrenthoster:torrent:SuperSecret!!`

mysql

`Admin:d5bfedcee289e5e05b86daad8ee3e2e2`

registration.php shows that this is md5 hash

full-nelson vulnerability

`5b09cb8e272cfea937fabdc750e03381`
