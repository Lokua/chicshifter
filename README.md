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

TODO: Dockerize this whole process

From https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-14-04

As root:
```sh
# create new user, create password
adduser web

# add web to superuser group
gpasswd -a web sudo

# AFTER making sure you can log in as web, disallow logging in as root
sudo nano /etc/ssh/sshd_config
# then change `PermitRootLogin yes` to PermitRootLogin no`
sudo service ssh restart
# in NEW terminal - make sure you can log in again before disconnecting
```

From https://www.digitalocean.com/community/tutorials/additional-recommended-steps-for-new-ubuntu-14-04-servers

(as web user)
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
```

Configure timezones + NTP
```sh
sudo dpkg-reconfigure tzdata
sudo apt-get update
sudo apt-get install ntp
```

Install GIT
```sh
sudo apt-get update
sudo apt-get install git

git config --global user.name <username>
git config --global user.email <email>

# verify
git config --list
```

Install Nginx (as web user)
Adapted from https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-14-04-lts

```sh
sudo apt-get install nginx
# go to http://IP_ADDRESS to confirm nginx is running

# make sure nginx is configured to start on reboot
sudo update-rc.d nginx defaults

# We have to do this too, otherwise Nginx will always go to the default
# regardless of our own site config
# http://stackoverflow.com/a/25642930/2416000
sudo rm -Rf /etc/nginx/sites-enabled/sites-available
```

Install Node.js + global node deps (as web user)
```sh
# or _5.x, _6.x
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs

# Only needed if native modules need to be built
sudo apt-get install -y build-essential

# install pm2
npm i -g pm2

# generate startup config
pm2 startup ubuntu
```

Set up project (as web user)
```sh
cd /home/web
git clone https://github.com/lokua/chicshifter.git chic

# run webown so nginx/node can serve statics
./bin/webown
```
