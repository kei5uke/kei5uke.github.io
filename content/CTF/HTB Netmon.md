---
title: HTB Netmon
author: kei5uke
draft: true
description: Writeup for HTB Netmon
tags:
  - windows
  - writeup
---

```bash
PORT      STATE SERVICE      VERSION                                                                                                                                                                                                                       
21/tcp    open  ftp          Microsoft ftpd                                                                                                                                                                                                                
| ftp-syst:                                                                                                                                                                                                                                                
|_  SYST: Windows_NT                                                                                                                                                                                                                                       
| ftp-anon: Anonymous FTP login allowed (FTP code 230)                                                                                                                                                                                                     
| 02-03-19  12:18AM                 1024 .rnd                                                                                
| 02-25-19  10:15PM       <DIR>          inetpub                                                                             
| 07-16-16  09:18AM       <DIR>          PerfLogs                                                                            
| 02-25-19  10:56PM       <DIR>          Program Files                                                                       
| 02-03-19  12:28AM       <DIR>          Program Files (x86)                                                                 
| 02-03-19  08:08AM       <DIR>          Users                                                                               
|_11-10-23  10:20AM       <DIR>          Windows                                                                             
80/tcp    open  http         Indy httpd 18.1.37.13946 (Paessler PRTG bandwidth monitor)                                      
|_http-server-header: PRTG/18.1.37.13946                                                                                     
| http-methods:                                                                                                              
|_  Supported Methods: GET HEAD POST OPTIONS                                                                                 
|_http-favicon: Unknown favicon MD5: 36B3EF286FA4BEFBB797A0966B456479                                                        
|_http-trane-info: Problem with XML parsing of /evox/about                                                                   
| http-title: Welcome | PRTG Network Monitor (NETMON)                                                                        
|_Requested resource was /index.htm                                                                                          
135/tcp   open  msrpc        Microsoft Windows RPC                                                                           
139/tcp   open  netbios-ssn  Microsoft Windows netbios-ssn                                                                   
445/tcp   open  microsoft-ds Microsoft Windows Server 2008 R2 - 2012 microsoft-ds                                            
5985/tcp  open  http         Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)                                                         
|_http-server-header: Microsoft-HTTPAPI/2.0                                                                                  
|_http-title: Not Found                                       
47001/tcp open  http         Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0      
|_http-title: Not Found                                       
49664/tcp open  msrpc        Microsoft Windows RPC          
49665/tcp open  msrpc        Microsoft Windows RPC
49666/tcp open  msrpc        Microsoft Windows RPC
49667/tcp open  msrpc        Microsoft Windows RPC                                                                           
49668/tcp open  msrpc        Microsoft Windows RPC
49669/tcp open  msrpc        Microsoft Windows RPC
Service Info: OSs: Windows, Windows Server 2008 R2 - 2012; CPE: cpe:/o:microsoft:windows
                                                                                                                             
Host script results:                                          
| smb-security-mode:                                          
|   authentication_level: user                                
|   challenge_response: supported                 
|_  message_signing: disabled (dangerous, but default)    
|_clock-skew: mean: 1s, deviation: 0s, median: 1s                                                                            
| smb2-security-mode:                                                                                                        
|   3:1:1:                                                    
|_    Message signing enabled but not required
| smb2-time:                                                  
|   date: 2026-08-24T20:17:27                                 
|_  start_date: 2026-08-24T20:07:34
```
