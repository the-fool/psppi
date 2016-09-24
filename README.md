PSPPI

This project is for the Paul Simon Public Policy Institute, but its patterns can be used for other cases.

It gobbles up data, and then creates a nice way to explore it, visually, in a web browser.  

Docker is the best way to build this.  Just try:

```bash

docker-compose -f dev.yml build

# wait 5 minutes
# . . . 

# initialize the postgresql database
docker-compose -f dev.yml run django python manage.py migrate

# feed in some data
docker-compose -f dev.yml run django make datasets

# boot up the api server
docker-compose -f dev.yml up

# frontend asset installation
npm install

# wait 3 minutes
# . . .

# boot up the frontend dev server
npm start
```

Note that the web-client stuff is not Dockerized, so you will need some system-wide dependencies (like npm and node, for starters).
This is not ideal, but neither is rebuilding a Docker container every time you want to make a change to a node package.
  
