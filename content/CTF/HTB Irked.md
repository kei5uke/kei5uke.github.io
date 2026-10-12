---
title: HTB Irked
date: 2026-04-14
author: kei5uke
draft: true
description: Writeup for HTB Irked
tags:
  - linux
  - writeup
---

10.129.28.11

```
PORT      STATE SERVICE VERSION
22/tcp    open  ssh     OpenSSH 6.7p1 Debian 5+deb8u4 (protocol 2.0)
| ssh-hostkey: 
|   1024 6a:5d:f5:bd:cf:83:78:b6:75:31:9b:dc:79:c5:fd:ad (DSA)
|   2048 75:2e:66:bf:b9:3c:cc:f7:7e:84:8a:8b:f0:81:02:33 (RSA)
|   256 c8:a3:a2:5e:34:9a:c4:9b:90:53:f7:50:bf:ea:25:3b (ECDSA)
|_  256 8d:1b:43:c7:d0:1a:4c:05:cf:82:ed:c1:01:63:a2:0c (ED25519)
80/tcp    open  http    Apache httpd 2.4.10 ((Debian))
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-server-header: Apache/2.4.10 (Debian)
|_http-title: Site doesn't have a title (text/html).
111/tcp   open  rpcbind 2-4 (RPC #100000)
| rpcinfo: 
|   program version    port/proto  service
|   100000  2,3,4        111/tcp   rpcbind
|   100000  2,3,4        111/udp   rpcbind
|   100000  3,4          111/tcp6  rpcbind
|   100000  3,4          111/udp6  rpcbind
|   100024  1          42110/tcp   status
|   100024  1          43420/udp6  status
|   100024  1          45559/tcp6  status
|_  100024  1          50496/udp   status
6697/tcp  open  irc     UnrealIRCd
8067/tcp  open  irc     UnrealIRCd
42110/tcp open  status  1 (RPC #100024)
65534/tcp open  irc     UnrealIRCd

```

# HTTP 80

![[HTB Irked - Screenshot_2026-04-14_at_15.35.47.png]]

/manual: apache 2.4 documentation

# rpcinfo 111

```
# rpcinfo irked.htb

   program version netid     address                service    owner
    100000    4    tcp6      ::.0.111               portmapper superuser
    100000    3    tcp6      ::.0.111               portmapper superuser
    100000    4    udp6      ::.0.111               portmapper superuser
    100000    3    udp6      ::.0.111               portmapper superuser
    100000    4    tcp       0.0.0.0.0.111          portmapper superuser
    100000    3    tcp       0.0.0.0.0.111          portmapper superuser
    100000    2    tcp       0.0.0.0.0.111          portmapper superuser
    100000    4    udp       0.0.0.0.0.111          portmapper superuser
    100000    3    udp       0.0.0.0.0.111          portmapper superuser
    100000    2    udp       0.0.0.0.0.111          portmapper superuser
    100000    4    local     /run/rpcbind.sock      portmapper superuser
    100000    3    local     /run/rpcbind.sock      portmapper superuser
    100024    1    udp       0.0.0.0.197.64         status     107
    100024    1    tcp       0.0.0.0.164.126        status     107
    100024    1    udp6      ::.169.156             status     107
    100024    1    tcp6      ::.177.247             status     107
```

![[HTB Irked - Screenshot_2026-04-14_at_16.26.14.png]]

login           `stskeeps`;
password        `moocowsrulemyworld`;

```
cat /home/djmardov/Documents/.backup
Super elite steg backup pw
UPupDOWNdownLRlrBAbaSSss
```

`Kab6h+m+bbp2J:HG`

# Shell as Djmardov

Interesting group: video

pkexec with SUID

cron

/dev/sr0        /media/cdrom0   udf,iso9660 user,noauto     0       0
