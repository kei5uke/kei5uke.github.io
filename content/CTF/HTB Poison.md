---
title: HTB Poison
author: kei5uke
draft: true
description: Writeup for HTB Poison
tags:
  - freebsd
  - writeup
---

# HTTP p80

![[HTB Poison - image.png]]

 `root@releng2.nyi.freebsd.org`

`Array ( [0] => . [1] => .. [2] => browse.php [3] => index.php [4] => info.php [5] => ini.php [6] => listfiles.php [7] => phpinfo.php [8] => pwdbackup.txt )` 

Found Charlix password: `Charix!2#4%6&8(0`

`ssh charix@10.129.1.254`

`root   608   0.0  0.9  23620  8868 v0- I    22:18    0:00.02 Xvnc :1 -desktop X -httpd /usr/local/share/tightvnc/classes -auth /root/.Xauthority -geometry 1280x800 -depth 24 -rfbwait 120000 -rfbauth /root/.vnc/passwd -rfbport 5901 -localhost -nolisten tcp :1`
Found interesting process
