# Imaginary marketplace - single page application

## Course project group information 

This project/assignment was part of a WWW programming - course at Tampere University. It was done as a three person group and all the contributors are listed below.

### Internal Server Error
Henri Hakkarainen, henri.hakkarainen@tuni.fi<br>
Antti Pessa, antti.pessa@tuni.fi<br>
Niki Väänänen, niki.vaananen@tuni.fi

## Introduction to assignment

The goal of the assignment is to create a webstore that buys and sells used items.

In the system, you should have these roles: an administrator, shopkeeper, registered customer, and unregistered user. The administrator has the right to edit the roles of others and access / edit everything. Unregistered users can only view what is being sold, but not buy or sell anything. Registered customers can update their own information, unregister, buy and sell. Shopkeepers can accept sales offers from customers, modify prices and add other items to be sold. Customers use a (fake) credit card to pay.

An example of what could happen: A user registers to the system and logs in. The registered user submits an offer to sell a sofa for a price of 100 euros. A shopkeeper decides to accept the offer. The sofa is added to the items on sale and the shopkeeper sets the price to 150 euros. The customer gets paid 100 euros by bank transfer (bank account information is stored for each registered customer who wishes to sell). Another customer then sees the sofa and buys it. The customer pays 150 euros with a credit card.

There can be other functionalities added that make the system more interesting. There is no need to take into account the physical location of the items or their shipment.

## Installation (development and production separately)

### For development

Copy `.env.dist` in the root with the name `.env` (note the dot in the beginning of the file). This can be done on terminal with:

`$ cp -i .env.dist .env`

**Obs:** If `.env`-file already exists, do not overwrite it!

**Note:** Do not modify `.env.dist` file. It is a model to be copied as .env, it neither must not contain any sensitive data!

Also copy `.env.react` in the root with the name `.env` to directory frontend. This makes it that React complies automatically when changes are made to the React code on the local machine. You can use the following command:

`$ cp -i .env.react frontend/.env`

During development, its suggested to start two Vagrant shells. One is for starting the Express-server on port 3000 and the other is for starting the React compiler, which runs on port 3001. This helps in following the logs on the server side. After downloading this folder structure, first run the following command on your local machine:

`$ npm run setup`

 This script installs the required modules for each subdirectory. After that the following commands must be run inside Vagrant on their own terminal windows:

`$ npm run devserver` - starts the Express server (backend)

`$ npm run devapp` - starts the React application (frontend)

Now the React application UI can be viewed on http://localhost:3001.

Server is started with nodemon, so if any changes are made to the code, the server automatically restarts which makes the development and testing much easier. Also changes done to React application are immediately visible on the browser (might require page refresh).

<hr>

### For production / testing

1. Install `nodejs` and `npm`, if not already installed.

2. Copy `.env.dist` in the root with the name `.env` (note the dot in the beginning of the file). This can be done on terminal with:

    `$ cp -i .env.dist .env`

    **Obs:** If `.env`-file already exists, do not overwrite it!

    **Note:** Do not modify `.env.dist` file. It is a model to be copied as .env, it neither must not contain any sensitive data!

3. Execute in the project root folder the following command:

    
    `$ npm run setup` - installs all the modules required for the application to run.
    
    `$ npm run build` - creates a production build of the React application

4. `Vagrantfile` is provided. It defines how the vagrant environment is set up, commands to be run:

    `$ vagrant up`    // sets up the environment<br>
    `$ vagrant ssh`   // moves a user inside vagrant
    
    Inside Vagrant navigate to the directory `/internal-server-error` and
start the app:

    `$ npm start`

5. Open on browser: `http://localhost:3000` to view the application. Admin-users login credentials can be found on `.env` file.

## Functionality

### Implementation order
1. Backend 
- REST API
    - API endpoints
- MongoDB
    - User (Admin, Shopkeeper, Normal)
    - Item
    - Creditcard
2. Frontend 
- React
- Redux

## Pages and navigation    
![picture of navigation](./documentation/navigation.png)

## Node project structure
```
├── backend
│   ├── app.js                  --> express app
│   ├── router.js               --> main router that setups other routes
│   ├── package.json            --> app info and dependencies
│   ├── config                  --> custom environment variables
│   ├── controllers             --> control the application behaviour
│   │   ├── item.js             --> functions for item handling
│   │   ├── payment.js          --> functions for payment handling
│   │   └── user.js             --> functions for user handling
│   ├── middleware              --> own middleware
│   │   └── auth.js             --> for authentication
│   ├── models                  --> models that reflect the db schemas
│   │   ├── creditcard.js       --> hold data about credit cards
│   │   ├── item.js             --> hold data about items
│   │   └── user.js             --> hold data about users
│   ├── routes                  --> a dir for router modules
│   │   ├── items.js            --> /items router
│   │   ├── payments.js         --> /payments router
│   │   └── users.js            --> /users router
│   ├── setup                   --> setup on startup
│   └── └── createusers.js      --> create admin user for the database
│
├── frontend
│   ├── src                     --> all react and redux files
│   │   ├── index.js            --> react app and store creation
│   │   ├── actions             --> redux action creators
│   │   ├── components          --> react presentational components
│   │   ├── containers          --> container components
│   │   ├── constants           --> redux constants
│   │   ├── reducers            --> redux reducers
│   │   └── store               --> redux store config
│   ├── public                  
└── └── package.json            --> app info and dependencies

```
## MongoDB and Mongoose schemas
Models used and their attributes and attribute types:
- User
    - Name (String)
    - Email (String)
    - Password (String)
    - Role (String) [admin/shopkeeper/normal]
    - CreditCard (Creditcard)
- Item
    - Name (String)
    - Owner (User)
    - Price (Number)
    - Description (String)
    - Onsale (Boolean)
- Creditcard
    - Number (String)
    - Balance (Number)
    - Owner (User)

The system holds information about the items that have been saved to the database and also about users that are buying or selling items. Item is saved the first time it is listed to being sold and a user is created the moment they register at the website.

User model contains a username, email and password. User model also has a role, which defaults to normal (registered) user so that the user is able to buy listed items and sell items to the shopkeepers on the webstore. User can be promoted to shopkeeper role (requires admin rights) and that role is able to sell items to all other customers (these offers are listed on the store for everyone). Admin users can edit basically anything.

Item model contains name of the item and the current owner of the item, which points to a user (each item on the database belong to some of the users). Item model also has attribute that holds information if the item is currently on sale or not (true/false). There is also an optional description field, where the item can be described with more detail. If the item is on sale, it also must have price attribute set (price must be >= 0).

Credit card / bank account information is modeled so that the Creditcard model contains number of the credit card and the balance of the card (how much money there is on the corresponding bank account). This model is being kept quite simple and straightforward on this imaginary webstore environment. On a real life application it would of course not be a good idea to keep track of a users bank account information and the payment would require authentication into a specific payment site.

If a user unregisters from the webstore (= user is deleted from database), all items that he/she owns are also removed from the database along with the credit card / bank account information of that user.

## API
Base API path: http://localhost:3000/api

API endpoints:
- GET-request
    - `/users` - list all users from the database
    - `/users/id` - get information about a specific user by id
    - `/items` - list all items from the database
    - `/items/id` - get information about a specific item by id
    - `/items/users/id` - list all items that belong to a specific user
    - `/items/users/id/offers` - list all items that belong to a specific user and are listed for sale
    - `/items/onsale` - list items that are owned by shopkeepers and are listed for sale
    - `/items/offers` - list items that are owned by normal users and are listed for sale
    - `/payments` - list all payment information from the database
    - `/payments/id` - get information about a specific credit card item by id
- POST-request
    - `/users` - creates a new user to database
    - `/items` - creates a new item to database
    - `/payments` - create a new credit card item to database
    - `/purchase` - item changes owner and money is transferred between credit cards
- PUT-request
    - `/users/id` - modify a specific user by id
    - `/users/id/role` - modify a specific user by id (including role - for admins only)
    - `/items/id` - modify a specific item by id
    - `/payments/id` - modify a specific credit card item by id
- DELETE-request
    - `/users/id` - delete a specific user from the database by id
    - `/items/id` - delete a specific item from the database by id
    - `/items/users/id` - delete all items that belong to a specific user
    - `/payments/id` - delete a specific creditcard item from the database by id

Payloads:
- POST-request (all of the listed attributes must be included)
    - `/users` - { username, email, password }
    - `/items` - { name, price, description, owner }
    - `/payments` - { number, owner }
    - `/purchase` - { sellerCCid, buyerCCid, itemId }
- PUT-request (one or more of the listed attributes may be included)
    - `/users/id` - { username, email, password, ccid } | *cc = credit card\**
    - `/users/id/role` - { username, email, password, role }
    - `/items/id` - { name, owner, description, onsale, price }
    - `/payments/id` - { balance }

## React and Redux

[Material-UI](https://material-ui.com/) is used for different components on the website: navigation, surfaces, sidebars, buttons etc.

Rails-style code structure is used, which has separate folders for actions, constants, reducers, containers, store, and components. 
https://github.com/reduxjs/redux/blob/master/docs/faq/CodeStructure.md

## About the implementation

In this section is discussed how the imaginary marketplace functions. Below are listed multiple screenshots from the application where the main functionality can be viewed.

### Some notifications

In the assignment task there was mentioned that "admininstrator has the right to access / edit everything." However we decided to leave the credit card listing out of the administrators possibilities to have an influence on. So only users can access their own credit card information through their Account Information -page on the application. Administrator can edit everything else and create new users / items as they wish.

The application ideology is formed so, that when a user unregisters from the website (the account is deleted from the database) - all the items that are at that moment owned by that user are also removed from the database instead of left hanging around. The credit card information of the user is removed as well when the user unregisters.

About selling the items - it is possible for a user to list his/her own items for sale even if there are not credit card information added for the account. However, when those items are tried to be bought by other users, an alert is displayed that the purchasing of the items from the selected user is currently unavailable. Also there is an visible alert on the users Account information -page if that user has some items on sale but no active credit card information added - you do want the money for your bank account from the sales, right?

### Main page

![main view](./documentation/mainview.PNG)
This is our landing page, where all onsale items by shopkeepers are displayed. From this page the user can register or login with their account details. Items can be sorted by name or price in ascending or descending order.

![register](./documentation/register.PNG)

Register view.

![login](./documentation/login.PNG)

Login view.

### Normal user view

![createitem](./documentation/createitem.PNG)

![updatetem](./documentation/updateitem.PNG)

Once logged in, you can add new items or update owned items from the Sell items tab.

![accountinfo](./documentation/accountinfo.PNG)

From the Account information tab the user can edit his information, add credits, add or delete credit card or unregister from the service.

![editinfo](./documentation/editinfo.PNG)

User can change all his information.
![unreg](./documentation/unreg.PNG)

If the user chooses to unregister all information will be deleted, including all the users items.

### Shopkeeper view

![skbuy](./documentation/skbuy.PNG)

The shopkeeper has a Onsale tab, where he can buy items offered buy users. Shopkeeper can see the item name, price, description and the name of the user who is selling the item.

![skbuy2](./documentation/skbuy2.PNG)

Once the shopkeeper clicks buy, he is confronted with a confirmation message that must be accepted before the transaction is complete.

### Admin view

#### User management
![adminusers](./documentation/adminusers.PNG)

Logged in as admin, you can view all the users in the marketplace from the users tab.

![adminupdate](./documentation/adminupdate.PNG)

Admin can update any users name, email, password or role. Admin can also delete any user.

![adminnewuser](./documentation/adminnewuser.PNG)

Admin can create a new user. 

#### Item management
![adminlisting](./documentation/adminlisting.PNG)

From the all items tab, the admin can view all the items in the marketplace. Admin can change the item sale state.

![adminitems](./documentation/allitems.PNG)

 The admin can update or delete the items.

![admincitem](./documentation/admincitem.PNG)

The admin can also create a new item to the marketplace and assign it to any of the users.

## Future additions
Things we didn't have time to implement during the coursework but could be added later on:
- Tests
- Ability to add pictures for a item or avatars for user
- Bidding feature
- Categories for different items
- Search
