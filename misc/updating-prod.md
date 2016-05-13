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
# web@chic-shifter:/home/web/chic$ ./bin/force-pull
```
