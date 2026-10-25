---
title:
author: kei5uke
draft: true
description: Writeup for HTB SecNotres
tags:
  - windows
  - writeup
---
# Enumeration
```bash
PORT     STATE SERVICE      VERSION
80/tcp   open  http         Microsoft IIS httpd 10.0
| http-title: Secure Notes - Login
|_Requested resource was login.php
|_http-server-header: Microsoft-IIS/10.0
| http-methods:
|   Supported Methods: OPTIONS TRACE GET HEAD POST
|_  Potentially risky methods: TRACE
445/tcp  open  microsoft-ds Windows 10 Enterprise 17134 microsoft-ds (workgroup: HTB)
8808/tcp open  http         Microsoft IIS httpd 10.0
| http-methods:
|   Supported Methods: OPTIONS TRACE GET HEAD POST
|_  Potentially risky methods: TRACE
|_http-server-header: Microsoft-IIS/10.0
|_http-title: IIS Windows
Service Info: Host: SECNOTES; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb-security-mode:
|   account_used: <blank>
|   authentication_level: user
|   challenge_response: supported
|_  message_signing: disabled (dangerous, but default)
| smb2-time:
|   date: 2026-10-25T11:53:43
|_  start_date: N/A
|_clock-skew: mean: 2h20m01s, deviation: 4h02m31s, median: 0s
| smb2-security-mode:
|   3:1:1:
|_    Message signing enabled but not required
| smb-os-discovery:
|   OS: Windows 10 Enterprise 17134 (Windows 10 Enterprise 6.3)
|   OS CPE: cpe:/o:microsoft:windows_10::-
|   Computer name: SECNOTES
|   NetBIOS computer name: SECNOTES\x00
|   Workgroup: HTB\x00
|_  System time: 2026-10-25T04:53:46-07:00

```

# Services
## SMB 445
```bash
smbclient -L //10.129.91.155 -U anonymous
Password for [WORKGROUP\anonymous]:
session setup failed: NT_STATUS_LOGON_FAILURE
```
## HTTP 8808
Nothing interesting here.
```bash
404      GET       29l       95w     1245c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter
200      GET      359l     2112w   178556c http://10.129.91.155:8808/iisstart.png
200      GET       32l       54w      696c http://10.129.91.155:8808/
400      GET        6l       26w      324c http://10.129.91.155:8808/error%1F_log
```
## HTTP 80
```bash
404      GET       29l       95w     1245c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter
302      GET        0l        0w        0c http://10.129.91.155/ => login.php
302      GET        0l        0w        0c http://10.129.91.155/logout.php => login.php
302      GET        0l        0w        0c http://10.129.91.155/contact.php => login.php
200      GET       35l       85w     1223c http://10.129.91.155/login.php
200      GET       41l      106w     1569c http://10.129.91.155/register.php
302      GET        0l        0w        0c http://10.129.91.155/home.php => login.php
500      GET       29l       89w     1208c http://10.129.91.155/db.php
500      GET       29l       89w     1208c http://10.129.91.155/auth.php
200      GET       35l       85w     1223c http://10.129.91.155/Login.php
302      GET        0l        0w        0c http://10.129.91.155/Home.php => login.php
302      GET        0l        0w        0c http://10.129.91.155/Contact.php => login.php
500      GET       29l       89w     1208c http://10.129.91.155/DB.php
200      GET       41l      106w     1569c http://10.129.91.155/Register.php
302      GET        0l        0w        0c http://10.129.91.155/Logout.php => login.php
302      GET        0l        0w        0c http://10.129.91.155/HOME.php => login.php
500      GET       29l       89w     1208c http://10.129.91.155/Auth.php
302      GET        0l        0w        0c http://10.129.91.155/CONTACT.php => login.php
200      GET       35l       85w     1223c http://10.129.91.155/LOGIN.php
400      GET        6l       26w      324c http://10.129.91.155/error%1F_log
400      GET        6l       26w      324c http://10.129.91.155/error%1F_log.php
500      GET       29l       89w     1208c http://10.129.91.155/Db.php
302      GET        0l        0w        0c http://10.129.91.155/change_pass.php => login.php
302      GET        0l        0w        0c http://10.129.91.155/LogOut.php => login.php
200      GET       35l       85w     1223c http://10.129.91.155/LogIn.php
302      GET        0l        0w        0c http://10.129.91.155/logOut.php => login.php
500      GET       29l       89w     1208c http://10.129.91.155/AUTH.php
200      GET       35l       85w     1223c http://10.129.91.155/logIn.php

```
![[Pasted image 20261025131749.png]]
tyler@secnotes.htb
Tried following:
- Tried to change password with pass123" where username="tyler" --++##
- Register username with php code inside
- Register note with php code inside

change_password works with GET: GET /change_pass.php?password=abc123&confirm_password=abc123&submit=submit

Found Tyler's note
```bash
\\secnotes.htb\new-site
tyler / 92g!mA8BGjOirkL%OG*&
```

I uploaded php reverse shell and got connection

# Shell
```bash
C:\Users>whoami /priv
whoami /priv

PRIVILEGES INFORMATION
----------------------

Privilege Name                Description                               State
============================= ========================================= ========
SeAssignPrimaryTokenPrivilege Replace a process level token             Disabled
SeIncreaseQuotaPrivilege      Adjust memory quotas for a process        Disabled
SeShutdownPrivilege           Shut down the system                      Disabled
SeAuditPrivilege              Generate security audits                  Disabled
SeChangeNotifyPrivilege       Bypass traverse checking                  Enabled
SeUndockPrivilege             Remove computer from docking station      Disabled
SeImpersonatePrivilege        Impersonate a client after authentication Enabled
SeCreateGlobalPrivilege       Create global objects                     Enabled
SeIncreaseWorkingSetPrivilege Increase a process working set            Disabled
SeTimeZonePrivilege           Change the time zone                      Disabled

systeminfo

Host Name:                 SECNOTES
OS Name:                   Microsoft Windows 10 Enterprise
OS Version:                10.0.17134 N/A Build 17134
OS Manufacturer:           Microsoft Corporation
OS Configuration:          Standalone Workstation
OS Build Type:             Multiprocessor Free
Registered Owner:          wayne
Registered Organization:   
Product ID:                00329-10280-00000-AA051
Original Install Date:     6/21/2018, 2:52:26 PM
System Boot Time:          10/25/2026, 2:42:19 AM
System Manufacturer:       VMware, Inc.
System Model:              VMware Virtual Platform
System Type:               x64-based PC
Processor(s):              2 Processor(s) Installed.
                           [01]: AMD64 Family 25 Model 1 Stepping 1 AuthenticAMD ~2595 Mhz
                           [02]: AMD64 Family 25 Model 1 Stepping 1 AuthenticAMD ~2595 Mhz
BIOS Version:              Phoenix Technologies LTD 6.00, 11/12/2020
Windows Directory:         C:\WINDOWS
System Directory:          C:\WINDOWS\system32
Boot Device:               \Device\HarddiskVolume1
System Locale:             en-us;English (United States)
Input Locale:              en-us;English (United States)
Time Zone:                 (UTC-08:00) Pacific Time (US & Canada)
Total Physical Memory:     4,095 MB
Available Physical Memory: 2,592 MB
Virtual Memory: Max Size:  4,799 MB
Virtual Memory: Available: 3,143 MB
Virtual Memory: In Use:    1,656 MB
Page File Location(s):     C:\pagefile.sys
Domain:                    HTB
Logon Server:              N/A
Hotfix(s):                 2 Hotfix(s) Installed.
                           [01]: KB4343669
                           [02]: KB4343909
Network Card(s):           1 NIC(s) Installed.
                           [01]: vmxnet3 Ethernet Adapter
                                 Connection Name: Ethernet0 2
                                 DHCP Enabled:    Yes
                                 DHCP Server:     10.10.10.2
                                 IP address(es)
                                 [01]: 10.129.91.155
                                 [02]: fe80::851d:798e:6482:6fa3
                                 [03]: dead:beef::2864:e11d:931d:eb9f
                                 [04]: dead:beef::851d:798e:6482:6fa3
Hyper-V Requirements:      A hypervisor has been detected. Features required for Hyper-V will not be displayed.
```
