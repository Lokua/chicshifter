#!/bin/bash

/home/web/certbot-auto renew \
  --quiet \
  --no-self-upgrade \
  --post-hook "service nginx restart"
