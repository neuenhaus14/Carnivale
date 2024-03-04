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
| PostgreSQL    | 5432         |  VM-public-IP/32 | Instance Postgres server access | There's a preset for Postgres in the Type dropdown |
| HTTP          | 80          |  Any (0.0.0.0/0) | ||
| HTTPS         | 443         | Any (0.0.0.0/0) ||

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

Change your directory and run npm install to pull in the dependencies:

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

The config file looks like this:

{
  "development": {
    "username": "postgres",
    "password": "password",
    "database": "carnivale",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "username": "postgres",
    "password": " ",
    "database": "carnivale",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "username": "postgres",
    "password": " ",
    "database": "carnivale",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}

Next you'll set some environment variables, some of which are database-oriented.

### 5. Set environment variables

There are a number of environment variables that support the app, and they must be assigned in the instance thru a .env file or with the following command, administered from the project's root directory:

> export SOME_ENV_VAR = 'someValue'

Run that command on all items in the list below, or place the following in the instance's .env file:

|  Env. Var.   |   Value   | Notes |
| ------------ | --------- | ----- |
| DATABASE_USERNAME | 'postgres' | 'postgres' is default user |
| DATABASE_PASSWORD | 'password' | You've have to set this value |
| WEATHER_API_KEY | << string of alphanumerics >> | You'll probably need a new one |
| CLOUDINARY_API_KEY | << string of digits >> | Samesies |
| CLOUDINARY_API_SECRET | << string of alphanumerics >> | Samesies |
| CLOUDINARY_NAME| << string of alphanumerics >> | |
| AUTH0_CLIENT_ID       |  << string of alphanumerics >> |  |
| AUTH0_CLIENT_SECRET   |  << string of alphanumerics >> |  |
| ISSUER | << web site>>| For Auth0|

### 5.5 Adding redirect links

Change the redirect links in server/index.ts and client/index.tsx to the appropriate url.

### 6. Building & Running

Thus far we've done the following:

1. Launched an AWS instance
2. Installed nvm and node
3. Cloned the repo down and installed dependencies
4. Installed and configured postgres
5. Defined environment variables

Now run the build and start scripts:

> npm run build
> npm run start

Next, navigate to the instance's public IPv4 address in your browser. From the instance panel in AWS, there's a link 'open address', which will take you to an 'https://...' address, so switch that to 'http://...' and add the port to the end of the url to access the site, like so:

> http://some.AWS.address.numbers:4000

Should be good.

### NGINX & CertBot

Nginx
https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-20-04

CertBot
https://certbot.eff.org/instructions?ws=nginx&os=ubuntufocal

You may have to create the certificate and install them separately. Run the commands from the root of the instance just to be sure (probably not necessary).

After installing certificates, reconnect to the instance.

Install NGINX with

FROM CAITY (validity not verified)

this is a recap of the base config we just added to help y’all get started, but you may need to add additional things to work with all parts of your project (ex: adding websockets may require additional configuration with nginx)
it’s best practice to separate the reverse proxy config to a project-specific file (naming it clearly will remind you in the future that this file was not included in the original nginx install)
example: /etc/nginx/conf.d/revprox-yourdomainname.conf
there should already be a catchall include statement in the main config that will include any additional .conf files in that dir
as always, every project is different but your bare necessities in that file will include:
server {
    listen 80;
    server_name yourdomainname.com www.yourdomainname.com;
    location / {
        proxy_pass http://localhost:<YOUR_APP_PORT_HERE>;
    }
}
80 is the nginx port, but you should replace the proxy_pass port with the port your project is running on. after nginx is set up, your traffic will be routed through nginx’s default port and you will no longer need to use a port to visit your app in the browser
:caution-neon: note: any time you change the config, you will need to restart the service
then we added certbot to get SSL after setting up nginx. if you peek back inside of the conf file you created, you should see some additional lines that were injected by certbot
and y’all had already opened the necessary ports to traffic (80, 443) in your security rules :complete-checkbox-lg:


# Configuration files

## Webpack
The output is CommonJS because ts-node does not support ECMAScript modules (ie, export.modules and require() syntax).


# Testing
Here's a link describing the Mocha set-up with typescript: https://typestrong.org/ts-node/docs/recipes/mocha/ running mocha from cli will run test files in ts-node land.

Run the "test" script to test. It
1. drops and
2. recreates the test database (carnivale_test) provided the configuration from postgresConfig.json. Then
3. the NODE_ENV variable is set to 'test' (from 'development'), which tells sequelize to connect to the test db (carnivale_test), then
4. ts-mocha runs, starting from test/index.test.ts

