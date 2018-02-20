# sb223ce-examination-3
Examination assignment 3 for Buttar Sarpreet Singh, WP2017. The app is running at http://46.101.182.239/github/

## Installation Process
Following are the steps that I have taken to set up the production environment:

1. Create an account on *Digitial Ocean*.

2. Create a droplet:
    
    2.1 Click on *One-click apps* and select *MEAN* image.
    
    2.2 Choose a *size* and *region*.

    2.3 Create a *ssh* keys by follwing the article given by digital ocean.

    2.4 Finally press the *create* button.

3. Once the process is finished, copy the *IP* address of the droplet and paste it inside the terminal.

4. Connect it using *ssh root@ip_address*.

5. Update the machine using *apt-get update*.

6. Install *npm* using *apt-get install npm*.

7. Install *node* using *npm install n -g*.

8. Install *pm2* using *npm install pm2 -g*.

9. Install *nginx* using *apt-get install nginx*.

10. Go to *cd /etc/nginx/site-available* for configuring the nginx.

11. Open the *default* file using *nano default*.

12. Configure this file by getting help from *https://gist.github.com/thajo/d5db8e679c1237dfdb76*. The only part we need to change is *ssl* certificates path and the *host* and *port* on which the node app is running.

13. Export environment variables in the *.profile* file using *nano* editor. The file is located in the root directory.

14. Go to *cd /var/www* and make a new dir *wsApp* using *mkdir* command.

15. Go to the local machine and make production build of the project.

16. Send the build files to the server using *scp -r path_on_local_machine ssh root@server_ip_address:_path_on_server*. In my case, I have to send three folders:
    
    * public (client side)
    * dist (server side)
    * ssl certificates
 
 17. Go to the server and *cd* into the *dist* folder which we have sent in the previous step.

 18. Run *npm install --production* for getting production dependency.

 19. Run *pm2 start app.js* for running the app.

 20. The app is running at *https:server_ip_address*.
