# SSL Setup

Follow the instructions at
https://certbot.eff.org/all-instructions/#ubuntu-14-04-trusty-nginx

Email used for notices: `lokua@lokua.net`
Domains registered: `chicshifter.com www.chicshifter.com`

Renew with `cd /home/web && ./certbot-auto renew --webroot-path /home/web/chic`
use dry run to test `./certbot-auto renew --webroot-path /home/web/chic --dry-run`
