---
title: 网站又被攻击了(宕机)
published: 2025-11-17
updated: 2025-11-17
description: '我是真TM醉了，攻击我有屁用啊！'
image: "api"
tags: [网站,吐槽]
category: '个人随笔'
draft: false 
lang: ''
pinned: false
series: '记录'
---

## 前言

早在年初时，我通过wordpress搭建了一个博客，当时这个博客主要用来分享软件，其中浏览量最高的是IntelliJ IDEA和PyCharm软件安装的相关教程。因为服务器采用的是2核2G的阿里云服务器，所以这个博客不能支持“大量”用户同时访问，不过一天的访问量也有几百人，有时候会出现访问超时，或者访问失败的情况。用户来源基本上是通过B站了解到的，但是我的B站视频被人举报下架，还连同我的账号被封禁了。看着每日腰斩的访问量，我也就索性把网站给关闭了。

## 现在

我也是最近才想起来我特么还有一个服务器，虽然日常吃灰状态，但是想起来了还是用用吧。

于是重新部署一遍word press，毕竟是轻车熟路，弄这玩意简直是毫无压力啊，博客前端还是继续采用子比主题，自从弄了这个博客以后，我一共就写了两篇文章，并且都是IntelliJ IDEA的激活教程，然后就TM的跟见鬼似的，一个月只有1300的访问量还有人会压测我这个网站，我特么也是服了，还特么作死访问后台，一直想要看数据库，我特么也是佩服你这个人才！

首先我后面新建的这个博客都已经禁止所有用户注册了，所有除了我这个管理员账号还会有谁在啊，其次一共才两篇文章，这特么还不明显吗，我没有复原上一次的数据啊，现在的这个网站和空壳没有一点区别。最后我这个网站就重来没有要求过用户需要关注公众号，让你去公众号中获取资源，网盘链接和文字版激活教程都TM直接是一起的，只要打开文章一看就能获取所有东西了，并且你只要把文章复制下来，还特么是一篇markdown格式文档，你特么保存后想怎么看就怎么看，所以我是真的没有想明白弄我这个网站的意义在哪，搞得我后面不得对每一个请求做一个限制。

```js title="限制同一时间同一个IP多次访问请求的配置"
user  www www;
worker_processes auto;
error_log  /www/wwwlogs/nginx_error.log  crit;
pid        /www/server/nginx/logs/nginx.pid;
worker_rlimit_nofile 51200;

stream {
    log_format tcp_format '$time_local|$remote_addr|$protocol|$status|$bytes_sent|$bytes_received|$session_time|$upstream_addr|$upstream_bytes_sent|$upstream_bytes_received|$upstream_connect_time';
  
    access_log /www/wwwlogs/tcp-access.log tcp_format;
    error_log /www/wwwlogs/tcp-error.log;
    include /www/server/panel/vhost/nginx/tcp/*.conf;
}

events {
    use epoll;
    worker_connections 51200;
    multi_accept on;
}

http {
    # 创建一个共享内存区域用于存储访问频率信息
    limit_req_zone $binary_remote_addr zone=one:10m rate=2r/s;
    limit_conn_zone $binary_remote_addr zone=perip:10m;
    limit_conn_zone $server_name zone=perserver:10m;

    include       mime.types;
    include proxy.conf;
    lua_package_path "/www/server/nginx/lib/lua/?.lua;;";

    default_type  application/octet-stream;

    server_names_hash_bucket_size 512;
    client_header_buffer_size 32k;
    large_client_header_buffers 4 32k;
    client_max_body_size 50m;

    sendfile   on;
    tcp_nopush on;

    keepalive_timeout 60;

    tcp_nodelay on;

    fastcgi_connect_timeout 300;
    fastcgi_send_timeout 300;
    fastcgi_read_timeout 300;
    fastcgi_buffer_size 64k;
    fastcgi_buffers 4 64k;
    fastcgi_busy_buffers_size 128k;
    fastcgi_temp_file_write_size 256k;
    fastcgi_intercept_errors on;

    gzip on;
    gzip_min_length  1k;
    gzip_buffers     4 16k;
    gzip_http_version 1.1;
    gzip_comp_level 5;
    gzip_types     text/plain application/javascript application/x-javascript text/javascript text/css application/xml application/json image/jpeg image/gif image/png font/ttf font/otf image/svg+xml application/xml+rss text/x-js;
    gzip_vary on;
    gzip_proxied   expired no-cache no-store private auth;
    gzip_disable   "MSIE [1-6]\.";

    server_tokens off;
    access_log off;

    server {
        listen 888;
        server_name phpmyadmin;
        index index.html index.htm index.php;
        root  /www/server/phpmyadmin;

        #error_page   404   /404.html;
        include enable-php.conf;

        location ~ .*\.(gif|jpg|jpeg|png|bmp|swf)$ {
            expires      30d;
        }

        location ~ .*\.(js|css)?$ {
            expires      12h;
        }

        location ~ /\.
        {
            deny all;
        }

        # 应用限制
        location / {
            limit_req zone=one burst=5 nodelay;
            limit_conn perip 10;
            limit_conn perserver 100;
        }

        access_log  /www/wwwlogs/access.log;
    }

    include /www/server/panel/vhost/nginx/*.conf;
}
```

自从弄这个限制后，我也就没管了，不过网站也安静了一个月，直到今天，我在访问网站时出现了`建立数据库连接时出错`看了一下宝塔面板给出的异常运行日志，

```js title="异常运行日志"
2025/11/15 20:47:50 [error] 1048855#0: *253594 directory index of ＂/www/wwwroot/lzphy.top/wp-admin/css/colors/light/＂ is forbidden, client: 4.197.170.217, server: lzphy.top, request: ＂GET /wp-admin/css/colors/light/ HTTP/1.1＂, host: ＂lzphy.top＂
2025/11/15 20:47:50 [error] 1048855#0: *253594 directory index of ＂/www/wwwroot/lzphy.top/wp-includes/certificates/＂ is forbidden, client: 4.197.170.217, server: lzphy.top, request: ＂GET /wp-includes/certificates/ HTTP/1.1＂, host: ＂lzphy.top＂
2025/11/15 20:48:01 [error] 1048855#0: *253594 directory index of ＂/www/wwwroot/lzphy.top/wp-includes/block-supports/＂ is forbidden, client: 4.197.170.217, server: lzphy.top, request: ＂GET /wp-includes/block-supports/ HTTP/1.1＂, host: ＂lzphy.top＂
2025/11/15 20:48:03 [error] 1048855#0: *253594 directory index of ＂/www/wwwroot/lzphy.top/wp-content/upgrade/＂ is forbidden, client: 4.197.170.217, server: lzphy.top, request: ＂GET /wp-content/upgrade/ HTTP/1.1＂, host: ＂lzphy.top＂
```

所以我觉得换为静态博客非常非常不错，反正我的博客也不需要用户登录注册，cloudflare每天10万访问量完全是搓搓有余，tnnd我还不需要当心其他东西。