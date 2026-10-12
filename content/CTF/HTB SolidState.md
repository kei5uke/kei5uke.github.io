---
title: HTB SolidState
author: kei5uke
draft: true
description: Writeup for HTB SolidState
tags:
  - linux
  - writeup
---

# Port

```
┌──(root㉿kali)-[~/solid]
└─# nmap 10.129.98.40 -sC -sV -T4 -oN nmap.txt 
Starting Nmap 7.95 ( https://nmap.org ) at 2026-01-25 09:10 EST
Stats: 0:02:09 elapsed; 0 hosts completed (1 up), 1 undergoing Service Scan
Service scan Timing: About 40.00% done; ETC: 09:15 (0:03:14 remaining)
Stats: 0:04:53 elapsed; 0 hosts completed (1 up), 1 undergoing Script Scan
NSE Timing: About 95.00% done; ETC: 09:15 (0:00:04 remaining)
Stats: 0:05:43 elapsed; 0 hosts completed (1 up), 1 undergoing Script Scan
NSE Timing: About 97.50% done; ETC: 09:16 (0:00:03 remaining)
Nmap scan report for 10.129.98.40
Host is up (0.026s latency).
Not shown: 995 closed tcp ports (reset)
PORT    STATE SERVICE VERSION
22/tcp  open  ssh     OpenSSH 7.4p1 Debian 10+deb9u1 (protocol 2.0)
| ssh-hostkey: 
|   2048 77:00:84:f5:78:b9:c7:d3:54:cf:71:2e:0d:52:6d:8b (RSA)
|   256 78:b8:3a:f6:60:19:06:91:f5:53:92:1d:3f:48:ed:53 (ECDSA)
|_  256 e4:45:e9:ed:07:4d:73:69:43:5a:12:70:9d:c4:af:76 (ED25519)
25/tcp  open  smtp?
|_smtp-commands: Couldn't establish connection on port 25
80/tcp  open  http    Apache httpd 2.4.25 ((Debian))
|_http-server-header: Apache/2.4.25 (Debian)
|_http-title: Home - Solid State Security
110/tcp open  pop3?
119/tcp open  nntp?
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 363.78 seconds
```

`nmap -sU -T4 --top-port=100 10.129.98.40`

NO UDP

# SMTP p25

no connection

# POP3 p110

```
┌──(root㉿kali)-[~]
└─# nc 10.129.98.40 110
+OK solidstate POP3 server (JAMES POP3 Server 2.3.2) ready
```

After resetting passwords

```
┌──(root㉿kali)-[~]
└─# telnet 10.129.99.155 110        
Trying 10.129.99.155...
Connected to 10.129.99.155.
Escape character is '^]'.
USER mindy
+OK solidstate POP3 server (JAMES POP3 Server 2.3.2) ready 
+OK
PASS mindy
+OK Welcome mindy
LIST
+OK 2 1945
1 1109
2 836
.
RETR 1
+OK Message follows
Return-Path: <mailadmin@localhost>
Message-ID: <5420213.0.1503422039826.JavaMail.root@solidstate>
MIME-Version: 1.0
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit
Delivered-To: mindy@localhost
Received: from 192.168.11.142 ([192.168.11.142])
          by solidstate (JAMES SMTP Server 2.3.2) with SMTP ID 798
          for <mindy@localhost>;
          Tue, 22 Aug 2017 13:13:42 -0400 (EDT)
Date: Tue, 22 Aug 2017 13:13:42 -0400 (EDT)
From: mailadmin@localhost
Subject: Welcome

Dear Mindy,
Welcome to Solid State Security Cyber team! We are delighted you are joining us as a junior defense analyst. Your role is critical in fulfilling the mission of our orginzation. The enclosed information is designed to serve as an introduction to Cyber Security and provide resources that will help you make a smooth transition into your new role. The Cyber team is here to support your transition so, please know that you can call on any of us to assist you.

We are looking forward to you joining our team and your success at Solid State Security. 

Respectfully,
James
.
RETR 2
+OK Message follows
Return-Path: <mailadmin@localhost>
Message-ID: <16744123.2.1503422270399.JavaMail.root@solidstate>
MIME-Version: 1.0
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit
Delivered-To: mindy@localhost
Received: from 192.168.11.142 ([192.168.11.142])
          by solidstate (JAMES SMTP Server 2.3.2) with SMTP ID 581
          for <mindy@localhost>;
          Tue, 22 Aug 2017 13:17:28 -0400 (EDT)
Date: Tue, 22 Aug 2017 13:17:28 -0400 (EDT)
From: mailadmin@localhost
Subject: Your Access

Dear Mindy,

Here are your ssh credentials to access the system. Remember to reset your password after your first login. 
Your access is restricted at the moment, feel free to ask your supervisor to add any commands you need to your path. 

username: mindy
pass: P@55W0rd1!2@

Respectfully,
James

.
```

# NNTP p119

```
┌──(root㉿kali)-[~]
└─# nc -nvC 10.129.98.40 119 HELP LIST
(UNKNOWN) [10.129.98.40] 119 (nntp) open
```

# HTTP p80

Webpage

# RSIP 4555

```
listusers
Existing accounts 6
user: james
user: ../../../../../../../../etc/bash_completion.d
user: thomas
user: john
user: mindy
user: mailadmin
```

# Shell as Mindy

Get out of rbash

`ssh [mindy@10.129.99.155](mailto:mindy@10.129.99.155) -t "bash --noprofile"`

pass: `P@55W0rd1!2@`

 /opt/tmp.py

```
#!/usr/bin/env python
import os
import sys
try:
     os.system('rm -r /tmp/* ')
except:
     sys.exit()
```

```
══╣ Active Ports (netstat)                                                                                                  
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      -                                           
tcp        0      0 127.0.0.1:631           0.0.0.0:*               LISTEN      -                   
tcp        0      0 0.0.0.0:5355            0.0.0.0:*               LISTEN      -                   
tcp6       0      0 :::22                   :::*                    LISTEN      -                   
tcp6       0      0 ::1:631                 :::*                    LISTEN      -                   
tcp6       0      0 :::119                  :::*                    LISTEN      -                   
tcp6       0      0 :::25                   :::*                    LISTEN      -                   
tcp6       0      0 :::5355                 :::*                    LISTEN      -                   
tcp6       0      0 :::4555                 :::*                    LISTEN      -                   
tcp6       0      0 :::110                  :::*                    LISTEN      -                   
tcp6       0      0 :::80                   :::*                    LISTEN      -   

Pkexec binary found at: /usr/bin/pkexec                                                                                     
Pkexec binary has SUID bit set!

-rw-r--r-- 1 root root 64804 Aug 22  2017 /opt/james-2.3.2/apps/james/SAR-INF/config.xml
<!-- It assumes you have a DNS server on localhost and assigns a root password of root. -->
            <!-- Change the default login/password. -->
            <account login="root" password="root"/>
         <password></password>
         <password>password</password>
         <password>blahblah</password>
         <password></password>
                  <password>secret</password>
                  <key-password>keysecret</key-password>

══╣ Possible private SSH keys were found!
/etc/ImageMagick-6/mime.xml

uid=1000(james) gid=1000(osboxes) groups=1000(osboxes),24(cdrom),25(floppy),29(audio),30(dip),44(video),46(plugdev),108(netdev),112(bluetooth),114(lpadmin),116(scanner)

```

pspy32

```
2026/01/26 17:18:01 CMD: UID=0     PID=30552  | /bin/sh -c python /opt/tmp.py 
2026/01/26 17:18:01 CMD: UID=0     PID=30553  | python /opt/tmp.py 
2026/01/26 17:18:01 CMD: UID=0     PID=30554  | sh -c rm -r /tmp/* 
```
