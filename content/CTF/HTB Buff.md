---
title: HTB Buff
author: kei5uke
draft: true
description: Writeup for HTB Buff
tags:
  - windows
  - writeup
---
# Enumeration
```bash

```
# Services
## HTTP 8080
![[Screenshot 2026-10-13 at 15.07.11.png]]
Gym Management Software 1.0 

Found [Exploit](https://www.exploit-db.com/exploits/48506)

# Shell
### Shell as shaun
![[Screenshot 2026-10-13 at 15.54.21.png|415]]

```bash
C:\Users\shaun>whoami
whoami
buff\shaun

C:\Users\shaun>whoami /priv
whoami /priv

PRIVILEGES INFORMATION
----------------------

Privilege Name                Description                          State
============================= ==================================== ========
SeShutdownPrivilege           Shut down the system                 Disabled
SeChangeNotifyPrivilege       Bypass traverse checking             Enabled
SeUndockPrivilege             Remove computer from docking station Disabled
SeIncreaseWorkingSetPrivilege Increase a process working set       Disabled
SeTimeZonePrivilege           Change the time zone                 Disabled
```

```bash
+---Downloads
|       CloudMe_1112.exe
```
CloudMe.exe is running and shaun has original binary in his download folder.
