---
title: HTB Usage
author: kei5uke
draft: true
description: Writeup for HTB Usage
tags:
  - linux
  - writeup
---

HOST: 10.10.15.252

TARGET: 10.129.14.19

# Nmap

```
PORT   STATE SERVICE VERSION                                                                                                 │
22/tcp open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.6 (Ubuntu Linux; protocol 2.0)                                            │
| ssh-hostkey:                                                                                                               │
|   256 a0:f8:fd:d3:04:b8:07:a0:63:dd:37:df:d7:ee:ca:78 (ECDSA)                                                              │
|_  256 bd:22:f5:28:77:27:fb:65:ba:f6:fd:2f:10:c7:82:8f (ED25519)                                                            │
80/tcp open  http    nginx 1.18.0 (Ubuntu)                                                                                   ├─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
|_http-title: Did not follow redirect to http://usage.htb/                                                                   │╭─ ~ ▓▒░························································································░▒▓ ✔ │ root@kali  08:29:01 
|_http-server-header: nginx/1.18.0 (Ubuntu)                                                                                  │╰─ 
| http-methods:                                                                                                              │
|_  Supported Methods: GET HEAD POST OPTIONS       
```

```
68/udp    open|filtered dhcpc                                                                                                │        inet6 dead:beef:2::11fa  prefixlen 64  scopeid 0x0<global>
120/udp   open|filtered cfdptkt                                                                                              │        inet6 fe80::4299:9fe9:c3aa:114f  prefixlen 64  scopeid 0x20<link>
4500/udp  open|filtered nat-t-ike                                                                                            │        unspec 00-00-00-00-00-00-00-00-00-00-00-00-00-00-00-00  txqueuelen 500  (UNSPEC)
5353/udp  open|filtered zeroconf                                                                                             │        RX packets 147619  bytes 10526025 (10.0 MiB)
17185/udp open|filtered wdbrpc                                                                                               │        RX errors 0  dropped 0  overruns 0  frame 0
20031/udp open|filtered bakbonenetvault                                                                                      │        TX packets 152623  bytes 19109345 (18.2 MiB)
49152/udp open|filtered unknown 
```

# HTTP80

![[HTB Usage - image.png]]

```
200      GET      265l      244w     5141c http://usage.htb/login                                                            │tun0: flags=4305<UP,POINTOPOINT,RUNNING,NOARP,MULTICAST>  mtu 1500
200      GET      264l      247w     5112c http://usage.htb/registration                                                     │        inet 10.10.15.252  netmask 255.255.254.0  destination 10.10.15.252
200      GET      265l      244w     5141c http://usage.htb/                                                                 │        inet6 dead:beef:2::11fa  prefixlen 64  scopeid 0x0<global>
302      GET       12l       22w      334c http://usage.htb/dashboard => http://usage.htb/login                              │        inet6 fe80::4299:9fe9:c3aa:114f  prefixlen 64  scopeid 0x20<link>
200      GET      265l      244w     5181c http://usage.htb/index.php    

403      GET        7l       10w      162c Auto-filtering found 404-like response and created new filter; toggle off with --d│
ont-filter                                                                                                                   │╭─ ~ ▓▒░························································································░▒▓ ✔ │ root@kali  08:50:00 
404      GET       32l      137w     6603c Auto-filtering found 404-like response and created new filter; toggle off with --d│╰─ 
ont-filter                                                                                                                   │
200      GET      254l      232w     4851c http://usage.htb/                                                                 │
404      GET        1l        3w       16c http://usage.htb/infos.php                                                        │
404      GET        1l        3w       16c http://usage.htb/.class.php                                                       │
404      GET        1l        3w       16c http://usage.htb/.settings.php                                                    │
404      GET        1l        3w       16c http://usage.htb/.popup.php                                                       │
404      GET        1l        3w       16c http://usage.htb/.shopping_return_adsense.php                                     │
404      GET        1l        3w       16c http://usage.htb/.act.php                                                         │
404      GET        1l        3w       16c http://usage.htb/.staged.php 
```

- PHP framework laravel

`$2y$10$ohq2kLpBH/ri.P5wR0P3UOmc24Ydvl9DA9H1S6ooOMgH5xVfUPrL2`

`whatever1`

This allows you to get shell: https://raw.githubusercontent.com/ldb33/CVE-2023-24249-PoC/refs/heads/main/CVE-2023-24249.py

# Shell

![[HTB Usage - image 1.png]]

```
APP_NAME=Laravel                                                                                                             │
APP_ENV=local                                                                                                                ├─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
APP_KEY=base64:pP77nTMTmggnX1939G4nPjHgxwidMjhZUGj1AFhARgE=                                                                  │        inet6 fe80::5985:d897:3521:9114  prefixlen 64  scopeid 0x20<link>
APP_DEBUG=false                                                                                                              │        ether 00:0c:29:df:4d:5a  txqueuelen 1000  (Ethernet)
APP_URL=http://localhost                                                                                                     │        RX packets 931488  bytes 648660258 (618.6 MiB)
LOG_CHANNEL=stack                                                                                                            │        RX errors 0  dropped 25  overruns 0  frame 0
LOG_DEPRECATIONS_CHANNEL=null                                                                                                │        TX packets 755826  bytes 281666597 (268.6 MiB)
LOG_LEVEL=debug                                                                                                              │        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
DB_CONNECTION=mysql                                                                                                          │
DB_HOST=127.0.0.1                                                                                                            │lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
DB_PORT=3306                                                                                                                 │        inet 127.0.0.1  netmask 255.0.0.0
DB_DATABASE=usage_blog                                                                                                       │        inet6 ::1  prefixlen 128  scopeid 0x10<host>
DB_USERNAME=staff                                                                                                            │        loop  txqueuelen 1000  (Local Loopback)
DB_PASSWORD=s3cr3t_c0d3d_1uth  
```

usage db user: raj 

`$2y$10$7ALmTTEYfRVd8Rnyep/ck.bSFKfXfsltPLkyQqSp/TT7X1wApJt4.` `xander`

`$2y$10$rbNCGxpWp1HSpO1gQX4uPO.pDg1nszoI/UhwHvfHDdfdfo9VmDJsa` same

`cat .monitrc`

`Xander:3nc0d3d_pa$$w0rd`
