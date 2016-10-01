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

# boot up the servers
docker-compose -f dev.yml up

# waith 5 minutes for that npm install
# . . . . 
# njoy

```

