---
title: HTB Devvortex
date: 2026-04-14
author: kei5uke
draft: true
description: Writeup for HTB Devvortex
tags:
  - linux
  - writeup
---

# Nmap

```
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.9 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 48:ad:d5:b8:3a:9f:bc:be:f7:e8:20:1e:f6:bf:de:ae (RSA)
|   256 b7:89:6c:0b:20:ed:49:b2:c1:86:7c:29:92:74:1c:1f (ECDSA)
|_  256 18:cd:9d:08:a6:21:a8:b8:b6:f7:9f:8d:40:51:54:fb (ED25519)
80/tcp open  http    nginx 1.18.0 (Ubuntu)
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-server-header: nginx/1.18.0 (Ubuntu)
|_http-title: Did not follow redirect to http://devvortex.htb/
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

PORT      STATE         SERVICE
68/udp    open|filtered dhcpc
80/udp    open|filtered http
136/udp   open|filtered profile
137/udp   open|filtered netbios-ns
517/udp   open|filtered talk
520/udp   open|filtered route
593/udp   open|filtered http-rpc-epmap
683/udp   open|filtered corba-iiop
1019/udp  open|filtered unknown
1029/udp  open|filtered solid-mux
1030/udp  open|filtered iad1
1813/udp  open|filtered radacct
4000/udp  open|filtered icq
7938/udp  open|filtered unknown
9876/udp  open|filtered sd
19283/udp open|filtered keysrvr
20031/udp open|filtered bakbonenetvault
27892/udp open|filtered unknown
32768/udp open|filtered omad
32771/udp open|filtered sometimes-rpc6
32772/udp open|filtered sometimes-rpc8
49185/udp open|filtered unknown
```

# HTTP80

![[HTB Devvortex - image.png]]

Summery: web dev page
Note: Mail function does not work

- Feroxbuster: not interesting
- Subdomain with FFUF: found `dev` 
`ffuf -w /usr/share/wordlists/seclists/Discovery/DNS/subdomains-top1million-110000.txt -H "Host:FUZZ.devvortex.htb" -u http://devvortex.htb -mc all -fw 4`
- Robotx.txt

![[HTB Devvortex - image 1.png]]

- http://dev.devvortex.htb/administrator/manifests/files/joomla.xml
Version: `4.2.6`

![[HTB Devvortex - image 2.png]]

- https://github.com/adhikara13/CVE-2023-23752/blob/main/CVE-2023-23752.py
`lewis`:`P4ntherg0t1n5r3c0n##`

![[HTB Devvortex - image 3.png]]

# Shell as www-data

Got shell through admin template edit panel

Found: `logan` in `/home`

joomla config

`public $db = 'joomla';`

`public $secret = 'ZI7zLTbaGKliS9gq';`

mysql `mysql -D joomla -u lewis -p`

`logan@devvortex.htb` : `$2y$10$IT4k5kmSGvHSO9d6M/1w0eYiB5Ne9XzArQRFJTGThNiy/yBtkIj12` —> `tequieromucho` by john

# Shell as logan

![[HTB Devvortex - Screenshot_2026-04-14_at_15.14.10.png]]

https://vk9-sec.com/cve-2023-1326privilege-escalation-apport-cli-2-26-0/

![[HTB Devvortex - Screenshot_2026-04-14_at_15.19.32.png]]
