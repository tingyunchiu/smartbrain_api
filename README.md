## This is the backend for smartbrain.
Smartbrain is a website that designs to help you improve your English writing skills by praticing paraphrasing. Try out at: Smartbrain (https://ancient-badlands-61242.herokuapp.com/) 

## Structures 
1. Used **Express** as a server and handle cors (Cross-Origin Resource Sharing)
2. Used **Knex** to communicate with Postgres database
3. Connected to the frontend with **restful APIs**
4. Deployed to **Heroku**

### Feactures
Database: <br>
- login: store user's name, email, hashed password, and joined date
- scores: store user's score and date (of the score). <br>
To make the database more efficient, the serialized id from the login table is used to identify user in the scores table.
1. login: this is a post request. <br>
Select the user with matched the email from the table, and compare the password with stored bcrypt hash. If success, return user's uid, name and email.
2. sign up: this is a post request. <br>
Insert new user into two tables and use transaction to make sure that the two table are creating together at the same time in this action.
3. get records: this is a get request. <br>
Select the user's scores.
4. add new score: this is a post request. <br>
add new score into database.

## Frontend at: [Frontend](https://github.com/tingyunchiu/smartbrain)
## User Journey 
![States](/images/flow.jpg)

