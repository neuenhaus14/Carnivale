# Carnivale
Thesis for Foxtrot Senior


# Deployment

Deploy this bad boy to an AWS EC2 Ubuntu 22.04

## Inbound Traffic Rules

Set the following at some point after launching the instance.

|     TYPE      |  PORT RANGE   |     SOURCE    |      WHY?    |   NOTES   |
| ------------- | ------------- | ------------- | ------------ | --------- |
| SSH           |  22           | Local-Dev-IP/32  |  SSH into instance from your computer | N/A |
| Custom TCP    | server port (4000)  | 0.0.0.0/0 | User access from internet | N/A |
| PostgreSQL    | 5432         |  VM-public-IP/32 | Instance Postgres server access | There's a preset for Postgres in the Type dropdown

## Setting Up an Instance

### 1. Launch a fresh instance!

Then save a key where you'll find it and PuTtY or SSH into the instance. More detailed instructions are available by clicking the 'Connect' button on the instance's main panel. This opens a 'Connect to Instance' page which provides instructions for accessing your instance. Mac users can run the following command in the terminal from the directory in which the instance's key is saved:

> ssh -i "your-Key.pem" ubuntu@public-DNS-Address

### 2. Once you're inside the instance...

...metaphorically, of course, you'll need to install nvm and node. The instance comes with git, so you're good there.

Install nvm as follows:

> curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

Then run the three commands as directed in the terminal. They are as follows:

> export NVM_DIR="$HOME/.nvm"
> [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
> [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

Next install Node version 20.9.0, which was used to develop this project:

> nvm install v20.9.0

You can check your versions with the next commands:

>git --version
>nvm --version
>node --version
>npm --version

### 3. Next, clone your repo down and install packages

Run the following command:

> git clone https://github.com/user-Name/repo-Name

The repo's name, as of writing, is Carnivale.

This will be designated as your origin, so you'll push and pull to origin main. We tried our best to avoid adding and committing to the instance through git, since it seems like it'd be a pain to resolve conflicts in an editor in the instance.

Change your directory and run npm install:

> cd Carnivale
> npm install

### 4. Install and configuring postgres

To install postgres locally, using instructions gleaned from these posts:
https://medium.com/ruralscript/install-and-setuppostgresql-on-ubuntu-amazon-ec2-5d1af79b4fca
https://ubuntu.com/server/docs/databases-postgresql

> sudo apt-get update // runs pre-installation updates on instance
> sudo apt-get install postgresql postgresql-contrib

Log in and access the postgres command line with the command below. The installation created a default user 'postgres' with a default role, and we'll just work with that user throughout this install.

> sudo -i -u postgres

You should also be able to log in as the 'postgres' user with the following:

> sudo -u postgres psql

From the postgres cli, create a new database 'carnivale':

> psql CREATE DATABASE carnivale;

Then set a new password that's associated with the 'postgres' user/role situation.

> ALTER USER postgres with encrypted password 'password';

Just use 'password', it's super easy to remember.

Next you're going to configure the app's access to the carnivale database via the 'postgres' user and its ingenious password 'password' by editing the postgres config file. From the project's root directory, do the following:

> cd config
> sudo vi config.json

Then change the username, password and database of the development server configuration to 'postgres', 'password' and 'carnivale', respectively. To save your changes by clicking the Escape key, then typing ':wq" and Enter. It stands for 'write-quit'.

Next you'll set some environment variables, some of which are database-oriented.

### 5. Set environment variables

There are a number of environment variables that support the app, and they must be assigned in the instance with the following command, administered from the project's root directory:

> export SOME_ENV_VAR = 'someValue'

Run that command on all items in the list below:

|  Env. Var.   |   Value   | Notes |
| ------------ | --------- | ----- |
| DATABASE_USERNAME | 'postgres' |
| DATABASE_PASSWORD | 'password' |
| WEATHER_API_KEY | << string of alphanumerics >> | You'll probably need a new one |
| CLOUDINARY_API_KEY | << string of digits >> | Samesies |
| CLOUDINARY_API_SECRET | << string of alphanumerics >> | Samesies |


