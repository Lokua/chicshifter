# CMS

+ ~~add admin link footer (lower right dot)~~
  + change to `/login`
+ ~~refactor admin api~~
+ add gzip (server & nginx)
+ change admin/section "objectName" in list to just display full url
+ ~~add slug path to section/entry edit components~~
+ show image preview
+ post image rotation for `limiting`
+ add image replace for `limiting`

+ login
  + server:
    + jwt create/verify
    + middleware
    + IMPORTANT!: disable cors in production (we only need it for dev server)
  + client
    + login component
    + login route
      + if not auth, show login form
        + research form exploits
      + if is auth, reroute to admin
    + check if auth on admin route

+ Limiting
  + ~~save text~~
  + change title to inputs
  + add new images
  + add delete entry
    + add delete confirmation
