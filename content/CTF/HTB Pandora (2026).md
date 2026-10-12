---
title: HTB Pandora (2026)
author: kei5uke
draft: true
description: Writeup for HTB Pandora (2026)
tags:
  - linux
  - writeup
---

# Nmap

```bash
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 24:c2:95:a5:c3:0b:3f:f3:17:3c:68:d7:af:2b:53:38 (RSA)
|   256 b1:41:77:99:46:9a:6c:5d:d2:98:2f:c0:32:9a:ce:03 (ECDSA)
|_  256 e7:36:43:3b:a9:47:8a:19:01:58:b2:bc:89:f6:51:08 (ED25519)
80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))
| http-methods: 
|_  Supported Methods: GET POST OPTIONS HEAD
|_http-title: Play | Landing
|_http-favicon: Unknown favicon MD5: 115E49F9A03BB97DEB840A3FE185434C
|_http-server-header: Apache/2.4.41 (Ubuntu)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

```bash
161/udp open  snmp
```

# p80

![[HTB Pandora - image.png]]

# SNMP UDP

```bash
HOST-RESOURCES-MIB::hrSWRunParameters.896 = STRING: "-c sleep 30; /bin/bash -c '/usr/bin/host_check -u daniel -p HotelBabylon23'"                                                                                                                          
HOST-RESOURCES-MIB::hrSWRunParameters.910 = ""                                                                                                                                                                                                             
HOST-RESOURCES-MIB::hrSWRunParameters.1004 = ""                                                                                                                                                                                                            
HOST-RESOURCES-MIB::hrSWRunParameters.1033 = STRING: "-k start"                                                                                                                                                                                            
HOST-RESOURCES-MIB::hrSWRunParameters.1192 = STRING: "-u daniel -p HotelBabylon23"

```
