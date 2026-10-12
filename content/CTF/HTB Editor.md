---
title: HTB Editor
date: 2026-01-04
author: kei5uke
draft: true
description: Writeup for HTB Editor
tags:
  - linux
  - writeup
---

### **nmap**

```
# Nmap 7.95 scan initiated Sun Jan  4 10:47:14 2026 as: /usr/lib/nmap/nmap -sC -sV -T4 -p- -oN nmap.txt -vv 10.129.5.35
Nmap scan report for 10.129.5.35
Host is up, received echo-reply ttl 63 (0.041s latency).
Scanned at 2026-01-04 10:47:15 EST for 25s
Not shown: 65532 closed tcp ports (reset)
PORT     STATE SERVICE REASON         VERSION
22/tcp   open  ssh     syn-ack ttl 63 OpenSSH 8.9p1 Ubuntu 3ubuntu0.13 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 3e:ea:45:4b:c5:d1:6d:6f:e2:d4:d1:3b:0a:3d:a9:4f (ECDSA)
| ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBJ+m7rYl1vRtnm789pH3IRhxI4CNCANVj+N5kovboNzcw9vHsBwvPX3KYA3cxGbKiA0VqbKRpOHnpsMuHEXEVJc=
|   256 64:cc:75:de:4a:e6:a5:b4:73:eb:3f:1b:cf:b4:e3:94 (ED25519)
|_ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOtuEdoYxTohG80Bo6YCqSzUY9+qbnAFnhsk4yAZNqhM
80/tcp   open  http    syn-ack ttl 63 nginx 1.18.0 (Ubuntu)
|_http-server-header: nginx/1.18.0 (Ubuntu)
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-title: Did not follow redirect to http://editor.htb/
8080/tcp open  http    syn-ack ttl 63 Jetty 10.0.20
| http-robots.txt: 50 disallowed entries (40 shown)
| /xwiki/bin/viewattachrev/ /xwiki/bin/viewrev/ 
| /xwiki/bin/pdf/ /xwiki/bin/edit/ /xwiki/bin/create/ 
| /xwiki/bin/inline/ /xwiki/bin/preview/ /xwiki/bin/save/ 
| /xwiki/bin/saveandcontinue/ /xwiki/bin/rollback/ /xwiki/bin/deleteversions/ 
| /xwiki/bin/cancel/ /xwiki/bin/delete/ /xwiki/bin/deletespace/ 
| /xwiki/bin/undelete/ /xwiki/bin/reset/ /xwiki/bin/register/ 
| /xwiki/bin/propupdate/ /xwiki/bin/propadd/ /xwiki/bin/propdisable/ 
| /xwiki/bin/propenable/ /xwiki/bin/propdelete/ /xwiki/bin/objectadd/ 
| /xwiki/bin/commentadd/ /xwiki/bin/commentsave/ /xwiki/bin/objectsync/ 
| /xwiki/bin/objectremove/ /xwiki/bin/attach/ /xwiki/bin/upload/ 
| /xwiki/bin/temp/ /xwiki/bin/downloadrev/ /xwiki/bin/dot/ 
| /xwiki/bin/delattachment/ /xwiki/bin/skin/ /xwiki/bin/jsx/ /xwiki/bin/ssx/ 
| /xwiki/bin/login/ /xwiki/bin/loginsubmit/ /xwiki/bin/loginerror/ 
|_/xwiki/bin/logout/
| http-methods: 
|   Supported Methods: OPTIONS GET HEAD PROPFIND LOCK UNLOCK
|_  Potentially risky methods: PROPFIND LOCK UNLOCK
| http-title: XWiki - Main - Intro
|_Requested resource was http://10.129.5.35:8080/xwiki/bin/view/Main/
|_http-server-header: Jetty(10.0.20)
| http-cookie-flags: 
|   /: 
|     JSESSIONID: 
|_      httponly flag not set
|_http-open-proxy: Proxy might be redirecting requests
| http-webdav-scan: 
|   Allowed Methods: OPTIONS, GET, HEAD, PROPFIND, LOCK, UNLOCK
|   WebDAV type: Unknown
|_  Server Type: Jetty(10.0.20)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

### Port 80 — Application Page

redirect to [http://editor.htb/](http://editor.htb/)

### Port 8080 — Xwiki

version: Debian 15.10.8

This is vulnerable to: [https://github.com/a1baradi/Exploit/blob/main/CVE-2025-24893.py](https://github.com/a1baradi/Exploit/blob/main/CVE-2025-24893.py)

Error: Invalid credentials

[https://github.com/dollarboysushil/CVE-2025-24893-XWiki-Unauthenticated-RCE-Exploit-POC/blob/main/CVE-2025-24893-dbs.py](https://github.com/dollarboysushil/CVE-2025-24893-XWiki-Unauthenticated-RCE-Exploit-POC/blob/main/CVE-2025-24893-dbs.py)

bash -c ‘some command’ works

```
╔══════════╣ Systemd Information
╚ https://book.hacktricks.wiki/en/linux-hardening/privilege-escalation/index.html#systemd-path---relative-paths                                                               
═╣ Systemd version and vulnerabilities? .............. 249.11                          
3.16
═╣ Services running as root? ..... 
═╣ Running services with dangerous capabilities? ... 
═╣ Services with writable paths? . containerd.service: Uses relative path 'overlay' (from ExecStartPre=-/sbin/modprobe overlay)                                               
dbus.service: Uses relative path '@dbus-daemon' (from ExecStart=@/usr/bin/dbus-daemon @dbus-daemon --system --address=systemd: --nofork --nopidfile --systemd-activation --syslog-only)                                                                              
mysql.service: Uses relative path 'pre' (from ExecStartPre=/usr/share/mysql/mysql-systemd-start pre)                                                                          
networkd-dispatcher.service: Uses relative path '$networkd_dispatcher_args' (from ExecStart=/usr/bin/networkd-dispatcher $networkd_dispatcher_args)                           
rsyslog.service: Uses relative path '-n' (from ExecStart=/usr/sbin/rsyslogd -n -iNONE)

```

```
$ cat hibernate.cfg.xml | grep password
    <property name="hibernate.connection.password">theEd1t0rTeam99</property>
    <property name="hibernate.connection.password">xwiki</property>
    <property name="hibernate.connection.password">xwiki</property>
    <property name="hibernate.connection.password"></property>
    <property name="hibernate.connection.password">xwiki</property>
    <property name="hibernate.connection.password">xwiki</property
```

**theEd1t0rTeam99**

# Privilege Escalation (Oliver)

No sudoer

no .bash_history

Internal port: 8125, 19999, 3306, 53, 45415, 33060, 8079

`ssh -L 45415:localhost:45415 oliver@editor.htb`

Check port 19999

[https://github.com/dollarboysushil/CVE-2024-32019-Netdata-ndsudo-PATH-Vulnerability-Privilege-Escalation](https://github.com/dollarboysushil/CVE-2024-32019-Netdata-ndsudo-PATH-Vulnerability-Privilege-Escalation)
