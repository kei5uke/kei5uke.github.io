---
title: HTB UpDown (2026)
author: kei5uke
draft: true
description: Writeup for HTB UpDown (2026)
tags:
  - linux
  - writeup
---

# Nmap

```
PORT   STATE SERVICE VERSION                                                                                                                                                                                                                               
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.5 (Ubuntu Linux; protocol 2.0)                                                                                                                                                                          
| ssh-hostkey:                                                                                                                                                                                                                                             
|   3072 9e:1f:98:d7:c8:ba:61:db:f1:49:66:9d:70:17:02:e7 (RSA)                                                                                                                                                                                             
|   256 c2:1c:fe:11:52:e3:d7:e5:f7:59:18:6b:68:45:3f:62 (ECDSA)                                                                                                                                                                                            
|_  256 5f:6e:12:67:0a:66:e8:e2:b7:61:be:c4:14:3a:d3:8e (ED25519)                                                                                                                                                                                          
80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))                                                                                                                                                                                                        
| http-methods:                                                                                                                                                                                                                                            
|_  Supported Methods: GET HEAD POST OPTIONS                                                                                                                                                                                                               
|_http-server-header: Apache/2.4.41 (Ubuntu)                                                                                                                                                                                                               
|_http-title: Is my Website up ?                                                                                                                                                                                                                           
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

# Domain

`ffuf -w /usr/share/wordlists/seclists/Discovery/DNS/subdomains-top1million-110000.txt -H "Host:FUZZ.siteisup.htb" -u http://siteisup.htb -mc all -fl 40`

`siteisup.htb`

`dev.siteisup.htb`

# Ferox

**siteisup.htb**

- `dev`

**dev.siteisup.htb**

- `.git`
- `cgi-bin`

POST shows the same result

# .Git repository dir

`git-dumper http://siteisup.htb/dev/.git git` 

# dev.siteisup.htb

![[HTB UpDown - image.png]]

![[HTB UpDown - image 1.png]]

Upload zip file named as ksk.lol

`zip -r ksk.lol info.php rev_shell.php`
