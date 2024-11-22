<div align="center">
    <a href="https://github.com/whizbangpop/broadorder-ce">
        <img src="assets/bo-logo1.png" alt="BroadOrder logo">
    </a>


</div>

The open-souce cafe system for school barista teams - or just people who need an easy to use and robust mobile ordering system.

## Automated Deployment Guide

Coming soon!

## Manual Deployment Guide

### Prerequisites 

To get started with BroadOrder, make sure you have the following installed on a server with a public facing and accesable IPv4 address.

* Git
* NodeJS
* NPM
* Nginx

You will also need to have the following setup:

* Firebase with Firestore Database
* A FQDN with DNS provider pointing
* An A record pointing at the IPv4 address if your server
    * If using Cloudflare, leave Proxy turned on

For this guide, Cloudflare is the DNS provider being used as they provide DDOS protection and free SSL encryption.

It is assumed you are SSHed into your server, and have updated all software packages.

### Installation

1. Clone the GitHub repository to your **home user directory**.
    ```sh
    git clone https://github.com/whizbangpop/broadorder-ce.git && cd broadorder-ce
    ```

2. Install all required dependancies. This may take a while, just leave it be.
    ```sh
    npm install
    ```

3. Configure your enviroment variables in a `.env` file.
    
   You will need Firebase credentials from the Web SDK - match them up to the following env template:

   ```env
   # .env
   VITE_API_KEY=
   VITE_AUTH_DOMAIN=
   VITE_PROJECT_ID=
   VITE_STORAGE_BUCKET=
   VITE_SENDER_ID=
   VITE_APP_ID=

   VITE_INSTANCE_NAME=
   ```

   We recommend setting the `INSTANCE_NAME` to the name of your school or shop.

4. Build your application using the Vite build tool.
    ```sh
    npm run build
    ```

    > If you get an error saying *Command cannot be found* or something similar, run the following command to install Vite on your machine:
    >
    > `npm install -g vite`

If everything has run successfully, you will now have a folder named `build` with an HTML, JS and CSS file. 

### Setup

Now, Nginx needs to be configured in order to serve the app properly.

1. Remove Nginx's default configuration
    ```sh
    sudo rm /etc/nginx/sites-avaliable/default && sudo rm /etc/nginx/sites-enabled/default
    ```

2. Create a new Nginx configuration
    ```sh
    sudo touch /etc/nginx/sites-avaliable/default && sudo ln -s /etc/nginx/sites-avaliable/default /etc/nginx/sites-enabled/
    ```

3. Add the following lines to the newly created config file
    ```nginx
    # /etc/nginx/sites-avalible/default
    server {
        listen 80;
        listen [::]:80;

        server_name example.com;

        root /var/www/broadorder;
        index index.html;

        location ~ /* {
            try_files $uri /index.html;
        }
    }
    ```

    Make sure to change `example.com` to your FQDN. Subdomains are also supported.

4. Copy over your compiled BroadOrder instance
    ```sh
    sudo mkdir /var/www/broadorder
    sudo cp -r ~/broadorder-ce/build/* /var/www/broadorder

5. Test your Nginx config & setup
    ```sh
    sudo nginx -t
    ```

6. Restart Nginx service
    ```sh
    sudo systemctl restart nginx
    ```

You should now be able to access your BroadOrder service at your FQDN on HTTP or HTTPS if using Cloudflare w/ Proxying!

## Usage

BroadOrder is designed primaraly for use by the cafe team, but does support anonymous order placements if desired.

Upon accessing BOCE (BroadOrder CE), you will be given the option to start an order. Make sure that your order team are able to load the menu before starting service.

Your cafe/shop team can view incoming order at the path `/cafe`. This will allow them to view, manage and track orders as they progress through the shop.

More detailed guides and manuals, as well as easy to understand PDF guides and web tutorials can be viewed [here](https://github.com/whizbangpop/broadorder-ce/wiki).