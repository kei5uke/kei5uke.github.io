---
title: HTB UpDown (2024)
author: kei5uke
draft: true
description: Writeup for HTB UpDown (2024)
tags:
  - linux
  - writeup
---

# Enumeration

```
┌──(root㉿kali)-[~]
└─# nmap 10.129.227.227 -sC -sV -A -T4 --min-rate 10000 -p- -oN nmap_tcp.txt
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-07-01 14:19 EDT
Nmap scan report for 10.129.227.227
Host is up (0.033s latency).
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.5 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 9e:1f:98:d7:c8:ba:61:db:f1:49:66:9d:70:17:02:e7 (RSA)
|   256 c2:1c:fe:11:52:e3:d7:e5:f7:59:18:6b:68:45:3f:62 (ECDSA)
|_  256 5f:6e:12:67:0a:66:e8:e2:b7:61:be:c4:14:3a:d3:8e (ED25519)
80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))
|_http-title: Is my Website up ?
|_http-server-header: Apache/2.4.41 (Ubuntu)
No exact OS matches for host (If you know what OS is running on it, see https://nmap.org/submit/ ).
TCP/IP fingerprint:
OS:SCAN(V=7.94SVN%E=4%D=7/1%OT=22%CT=1%CU=41667%PV=Y%DS=2%DC=T%G=Y%TM=6682F
OS:332%P=x86_64-pc-linux-gnu)SEQ(SP=106%GCD=1%ISR=10B%TI=Z%CI=Z%II=I%TS=9)S
OS:EQ(SP=106%GCD=1%ISR=10B%TI=Z%CI=Z%II=I%TS=A)OPS(O1=M53CST11NW7%O2=M53CST
OS:11NW7%O3=M53CNNT11NW7%O4=M53CST11NW7%O5=M53CST11NW7%O6=M53CST11)WIN(W1=F
OS:E88%W2=FE88%W3=FE88%W4=FE88%W5=FE88%W6=FE88)ECN(R=Y%DF=Y%T=40%W=FAF0%O=M
OS:53CNNSNW7%CC=Y%Q=)T1(R=Y%DF=Y%T=40%S=O%A=S+%F=AS%RD=0%Q=)T2(R=N)T3(R=N)T
OS:4(R=Y%DF=Y%T=40%W=0%S=A%A=Z%F=R%O=%RD=0%Q=)T5(R=Y%DF=Y%T=40%W=0%S=Z%A=S+
OS:%F=AR%O=%RD=0%Q=)T6(R=Y%DF=Y%T=40%W=0%S=A%A=Z%F=R%O=%RD=0%Q=)T7(R=Y%DF=Y
OS:%T=40%W=0%S=Z%A=S+%F=AR%O=%RD=0%Q=)U1(R=Y%DF=N%T=40%IPL=164%UN=0%RIPL=G%
OS:RID=G%RIPCK=G%RUCK=G%RUD=G)IE(R=Y%DFI=N%T=40%CD=S)

Network Distance: 2 hops
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

TRACEROUTE (using port 80/tcp)
HOP RTT      ADDRESS
1   31.67 ms 10.10.14.1
2   31.86 ms 10.129.227.227
```

```
┌──(root㉿kali)-[~]
└─# nmap -sU -T4 --top-port=100 10.129.227.227
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-07-01 14:21 EDT
Warning: 10.129.227.227 giving up on port because retransmission cap hit (6).
Nmap scan report for 10.129.227.227
Host is up (0.037s latency).
Not shown: 87 closed udp ports (port-unreach)
PORT      STATE         SERVICE
19/udp    open|filtered chargen
67/udp    open|filtered dhcps
68/udp    open|filtered dhcpc
69/udp    open|filtered tftp
162/udp   open|filtered snmptrap
1025/udp  open|filtered blackjack
1433/udp  open|filtered ms-sql-s
1719/udp  open|filtered h323gatestat
2049/udp  open|filtered nfs
49153/udp open|filtered unknown
49156/udp open|filtered unknown
49185/udp open|filtered unknown
49188/udp open|filtered unknown
```

# HTTP 80

Website that loads other web page

No PHP reverse shell

No Responder output

```
    GET        9l       31w      274c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter
403     POST        9l       28w      277c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter
404     POST        9l       31w      274c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter
301      GET        9l       28w      310c http://siteisup.htb/dev => http://siteisup.htb/dev/
200      GET      320l      675w     5531c http://siteisup.htb/stylesheet.css
200      GET       40l       93w     1131c http://siteisup.htb/
200     POST       40l       93w     1131c http://siteisup.htb/
301     POST        9l       28w      310c http://siteisup.htb/dev => http://siteisup.htb/dev/
[####################] - 2m    249138/249138  0s      found:5       errors:0      
[####################] - 2m    124564/124564  1096/s  http://siteisup.htb/ 
[####################] - 2m    124564/124564  1088/s  http://siteisup.htb/dev/     
```

Found different sub domain

`ffuf -w /usr/share/dnsrecon/namelist.txt -H "Host:FUZZ.siteisup.htb" -u [http://siteisup.htb](http://siteisup.htb/) -fs 1131`

dev

```
htaccess            
SetEnvIfNoCase Special-Dev "only4dev" Required-Header
Order Deny,Allow
Deny from All
Allow from env=Required-Header
```

`Special-Dev: only4dev`
