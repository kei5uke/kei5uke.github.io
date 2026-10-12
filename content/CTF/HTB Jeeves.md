---
title: HTB Jeeves
date: 2026-09-08
author: kei5uke
draft: true
description: Writeup for HTB Jeeves
tags:
  - windows
  - writeup
---

# Nmap

```
80/tcp    open  http         Microsoft IIS httpd 10.0
| http-methods:
|   Supported Methods: OPTIONS TRACE GET HEAD POST
|_  Potentially risky methods: TRACE
|_http-server-header: Microsoft-IIS/10.0
|_http-title: Ask Jeeves
135/tcp   open  msrpc        Microsoft Windows RPC
445/tcp   open  microsoft-ds Microsoft Windows 7 - 10 microsoft-ds (workgroup: WORKGROUP)
50000/tcp open  http         Jetty 9.4.z-SNAPSHOT
|_http-title: Error 404 Not Found
|_http-server-header: Jetty(9.4.z-SNAPSHOT)
Service Info: Host: JEEVES; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb-security-mode:
|   account_used: guest
|   authentication_level: user
|   challenge_response: supported
|_  message_signing: disabled (dangerous, but default)
| smb2-security-mode:
|   3.1.1:
|_    Message signing enabled but not required
| smb2-time:
|   date: 2026-09-04T19:12:23
|_  start_date: 2026-09-04T19:09:14
|_clock-skew: mean: 23h29m48s, deviation: 0s, median: 23h29m47s

```

# HTTP 80

![[HTB Jeeves - Screenshot_2026-09-08_at_16.26.01.png]]

# HTTP 50000

jenkins without auth

![[HTB Jeeves - Screenshot_2026-09-08_at_16.26.34.png]]

[https://github.com/Brzozova/reverse-shell-via-Jenkins](https://github.com/Brzozova/reverse-shell-via-Jenkins)

jeeves/kohsuke

```
type secret.key
58d05496da2496d09036d36c99b56f1e89cc662f3e65a4023de71de7e1df8afb

type initialAdminPassword
ccd3bc435b3c4f80bea8acca28aec491

```

`keepass2john CEH.kdbx | grep -o "$keepass$.*" > keepass_hash`

`hashcat -m 13400 keepass_hash /usr/share/wordlists/rockyou.txt.gz`

```
$keepass$*2*6000*0*1af405cc00f979ddb9bb387c4594fcea2fd01a6a0757c000e1873f3c71941d3d*3869fe357ff2d7db1555cc668d1d606b1dfaf02b9dba2621cbe9ecb63c7a4091*393c97beafd8a820db9142a6a94f03f6*b73766b61e656351c3aca0282f1617511031f0156089b6c5647de4671972fcff*cb409dbc0fa660fcffa4f1cc89f728b68254db431a21ec33298b612fe647db48:moonshine1
```

```
dir /R
 Volume in drive C has no label.
 Volume Serial Number is 71A1-6FA1

 Directory of C:\Users\Administrator\Desktop

11/08/2017  10:05 AM    <DIR>          .
11/08/2017  10:05 AM    <DIR>          ..
12/24/2017  03:51 AM                36 hm.txt
                                    34 hm.txt:root.txt:$DATA
11/08/2017  10:05 AM               797 Windows 10 Update Assistant.lnk
               2 File(s)            833 bytes
               2 Dir(s)   2,644,672,512 bytes free

```

https://hacking-notes.jord4n.pro/post-exploitation/alternate-data-streams-ads
