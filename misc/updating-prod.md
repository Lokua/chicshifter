# IMPORTANT!

Though Nginx is not required in development, you should install it and
symlink `config/chic.dev.conf` to nginx sites-enabled, so you can be sure that
nginx indeed serves the `assets` and `dist` folders in prod. After building,
run `npm start` (which runs the node server in production mode)
and point your browser at `localhost:9000` to ensure that Nginx is proxying
all non-static requests to the node server on port 3000, and serving all static
requests (assets, dist).

# Prod

Steps to push new version:

```sh
# make sure all tests are passing
npm t

# run the production build
npm run build

# git...
git add --all && git commit -m <message>

# tag
npm version <patch|minor|major>

git push origin master --tags

# server-side
ssh web@<DROPLET_IP>
cd chic
git pull && npm i && pm2 restart chic

# if git pull fails,
# most likely any server-side changes were simply debugging,
# in which case you can skip the merge process by running:
# `./bin/force-pull`
```
