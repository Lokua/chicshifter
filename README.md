# chic-shifter

> Source code for chicshifter.com

**NOTE**: This project has been developed on an Ubuntu machine.
package.json npm scripts will need some tweaking to run on Windows.

# Dev

Process images:
```sh
./bin/run process-images <inputDir> <outputDir>
```

# Frontend Layout (initial notes)

+ Home
  + Faux Pas/Yeah

+ about
  + mission
  + letter from editor
  + credits / contact
    + chicshifter16@gmail.com

+ Issue (Spring/Summer, Fall/Winter)

  + consideringchic
    + texts + sketch

  + limitingchic
    + weeks [#/name]
      + contributors
        + Ana
          + photos, text snippet

  + seeingchic
    + designers
      + photos, text

  + shoppingchic
    + shops
      + photos, text

  + streetchic
    + neighborhoods
      + photo & caption


  + touringchic
    + Cities/Places
      + photo, text


# Digital Ocean Ubuntu 14.04 Droplet Setup

> Just recording my steps. These instructions are not complete.

From https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-14-04

As root:
```sh
# create new user, create password
adduser web

#---
# add web to superuser group
gpasswd -a web sudo

#---
# AFTER making sure you can log in as web, disallow logging in as root
sudo nano /etc/ssh/sshd_config
# then change `PermitRootLogin yes` to PermitRootLogin no`
sudo service ssh restart
# in NEW terminal - make sure you can log in again before disconnecting
```

From https://www.digitalocean.com/community/tutorials/additional-recommended-steps-for-new-ubuntu-14-04-servers

As web:
```sh
sudo ufw allow ssh

# enable HTTP traffic
sudo ufw allow 80/tcp

# enable SSL traffic
sudo ufw allow 443/tcp

# test additions
sudo ufw show added

# enable
sudo ufw enable

# ----------------

# configure timezones
sudo dpkg-reconfigure tzdata

# configure NTP
sudo apt-get update
sudo apt-get install ntp

# ----------------
# INSTALL GIT
sudo apt-get update
sudo apt-get install git

git config --global user.name lokua
git config --global user.email lokua@lokua.net

# verify
git config --list

# ----------------
# INSTALL NGINX
# https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-14-04-lts
sudo apt-get install nginx
# got to http://IP_ADDRESS to confirm nginx is running

# make sure nginx is config to start on reboot
sudo update-rc.d nginx defaults

# I guess we have to do this to...
# http://stackoverflow.com/a/25642930/2416000
sudo rm -Rf /etc/nginx/sites-enabled/sites-available

# ----------------
# INSTALL NODE.JS

# or _5.x, _6.x
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs

# might not need this....
sudo apt-get install -y build-essential
# -----------------
# clone repo into wwww
cd /var/www # might have to `sudo mkdir www`
git clone https://github.com/lokua/chicshifter.git chicshifter.com

# run webown so nginx/node can serve statics
./bin/webown

# install pm2
npm i -g pm2

# generate startup config
pm2 startup ubuntu
```
