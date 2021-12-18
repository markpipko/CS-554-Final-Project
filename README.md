# Jobaroo
#### Members: Christopher Moon, Edward, Yaraslavsky, Mark Pipko, Matt Evanego, Matt Koerner

## To run this app:  
1. Install [ImageMagick](https://imagemagick.org/script/download.php). Make sure to click the ```Install legacy utilities (e.g. convert)``` in the Additional Tasks. We recommend restarting after installing to ensure that the binaries are set.   
2. Install [Redis (Stable)](https://redis.io/download) and run the redis-server once downloaded.  
3. In the source directory, do ```cd server``` and then ```npm install```. Once everything is installed, run ```npm start```. If everything was done correctly, you should see ```Your routes will now be running on http://localhost:4000``` outputted.  
4. Open another terminal in the source directory and do ```cd client``` and then ```npm install```. Once everything is installed, run ```npm start``` and it should redirect you to the home page.   

## When running the app:  
We recommend using real emails that you have access to when signing up for either a job seeker or employer as we have nodemailer set up to send emails to the email you have signed up with.  

## To seed the database:  
We have already populated the Firestore DB, but you can do ```cd server``` and then ```npm run seed``` for some additional seeding.   
