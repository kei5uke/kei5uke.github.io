---
title: HTB Markup
date: 2026-08-18
author: kei5uke
draft: true
description: Writeup for HTB Markup
tags:
  - windows
  - writeup
---

# Nmap

```bash
22/tcp  open  ssh      OpenSSH for_Windows_8.1 (protocol 2.0)
| ssh-hostkey:
|   3072 9f:a0:f7:8c:c6:e2:a4:bd:71:87:68:82:3e:5d:b7:9f (RSA)
|   256 90:7d:96:a9:6e:9e:4d:40:94:e7:bb:55:eb:b3:0b:97 (ECDSA)
|_  256 f9:10:eb:76:d4:6d:4f:3e:17:f3:93:d6:0b:8c:4b:81 (ED25519)
80/tcp  open  http     Apache httpd 2.4.41 ((Win64) OpenSSL/1.1.1c PHP/7.2.28)
|_http-server-header: Apache/2.4.41 (Win64) OpenSSL/1.1.1c PHP/7.2.28
| http-methods:
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-title: MegaShopping
| http-cookie-flags:
|   /:
|     PHPSESSID:
|_      httponly flag not set
443/tcp open  ssl/http Apache httpd 2.4.41 ((Win64) OpenSSL/1.1.1c PHP/7.2.28)
|_http-title: MegaShopping
|_ssl-date: TLS randomness does not represent time
| http-methods:
|_  Supported Methods: GET HEAD POST OPTIONS
| tls-alpn:
|_  http/1.1
| ssl-cert: Subject: commonName=localhost
| Issuer: commonName=localhost
| Public Key type: rsa
| Public Key bits: 1024
| Signature Algorithm: sha1WithRSAEncryption
| Not valid before: 2009-11-10T23:48:47
| Not valid after:  2019-11-08T23:48:47
| MD5:     a0a4 4cc9 9e84 b26f 9e63 9f9e d229 dee0
| SHA-1:   b023 8c54 7a90 5bfa 119c 4e8b acca eacf 3649 1ff6
|_SHA-256: 0169 7338 0c0f 1df0 0bd9 593e d8d5 efa3 706c d6df 7993 f614 1272 b805 22ac dd23
|_http-server-header: Apache/2.4.41 (Win64) OpenSSL/1.1.1c PHP/7.2.28
| http-cookie-flags:
|   /:
|     PHPSESSID:
|_      httponly flag not set

```

# HTTPS 443

![[HTB Markup - Screenshot_2026-08-18_at_15.15.40.png]]

```bash
200      GET      377l      738w    12100c http://10.129.95.192/
403      GET       45l      113w     1205c http://10.129.95.192/phpmyadmin
503      GET       39l       98w     1060c http://10.129.95.192/examples
403      GET       45l      113w     1205c http://10.129.95.192/licenses
403      GET       45l      113w     1205c http://10.129.95.192/server-status

```
