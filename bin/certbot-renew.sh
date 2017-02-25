#!/bin/bash

/home/web/certbot-auto renew \
  --no-self-upgrade \
  --post-hook "service nginx restart" > /home/web/certbot-renew.log
