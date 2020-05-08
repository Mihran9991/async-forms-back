# async-forms

# About
URL Mappings

- Auth
    - Register
        - URL: [/register](http://localhost:3001/register)
        - Method: <b>POST</b>
        - <b>Body</b> Parameters:
            - name
            - surname
            - email
            - password
    - Login
        - URL: [/login](http://localhost:3001/login)
        - Method: <b>POST</b>
        - <b>Body</b> Parameters:
            - email
            - password
- User
    - Get
        - URL: [/user/get](http://localhost:3001/user/get)
        - Method: <b>GET</b>
    - Get all
        - URL: [/user/getAll](http://localhost:3001/user/getAll)
        - Method: <b>GET</b>
    - Edit profile
        - URL: [/user/edit](http://localhost:3001/user/edit)
        - Method: <b>POST</b>
        - <b>Body</b> Parameters:
            - name
            - surname
            - picture (file)
- Forgot Password
    - Send
        - URL: [/forgot/send](http://localhost:3001/forgot/send)
        - Method: <b>POST</b>
        - <b>Body</b> Parameters:
            - email
    - Reset
        - URL: [/forgot/reset](http://localhost:3001/forgot/reset)
        - Method: <b>POST</b>
        - <b>Body</b> Parameters:
            - requestId
            - newPassword
- Form
    - Get
        - URL: [/form/get](http://localhost:3001/form/get)
        - Method: <b>GET</b>
        - <b>Query</b> Parameters:
            - formName
    - Get all
        - URL: [/form/getAll](http://localhost:3001/form/getAll)
        - Method: <b>GET</b>
    - Create
        - URL: [/form/create](http://localhost:3001/form/create)
        - Method: <b>POST</b>
        - <b>Body</b> Parameters:
            - form
            - fields
            - style
            - optional
- Form Instance
    - Get
        - URL: [/form/instance/get](http://localhost:3001/form/instance/get)
        - Method: <b>GET</b>
        - <b>Query</b> Parameters:
            - formName
            - instanceName
    - Get all
        - URL: [/form/instance/getAll](http://localhost:3001/form/instance/getAll)
        - Method: <b>GET</b>
        - <b>Query</b> Parameters:
            - formName
    - Create
        - URL: [/form/instance/create](http://localhost:3001/form/instance/create)
        - Method: <b>POST</b>
        - <b>Body</b> Parameters:
            - formName
            - instanceName
    - Insert value
        - URL: [/form/instance/insert](http://localhost:3001/form/instance/insert)
        - Method: <b>POST</b>
        - <b>Body</b> Parameters:
            - formName
            - instanceName
            - field
---

## Quick Start

To install dependencies use:

```
npm install

```
To run the server in development mode:

```
npm run dev

```
To run the server in production mode:

```
npm run prod

```
To add postgres user with required grants:

```
1) Login to ps console (psql -U username)
2) Type: "createuser --interactive --pwprompt"
3) Enter the username and password (also confirm password) as 'async_forms' in the following 3 lines
4) Type "n" in the next line, as we don't want the user to be a superuser
5) Type "y" in the next line, as we want the user to be able to create a database later
6) Type "n" in the next line, as we don' want the user to be able to create other users
7) Now login with newly created user credentials
INFO: If you can't login with error message like this one: "FATAL: Peer authentication failed for user...", than look here: https://stackoverflow.com/questions/18664074/getting-error-peer-authentication-failed-for-user-postgres-when-trying-to-ge

8) After successful login, type: createdb -O async_forms async_forms
INFO: If database somehow already exists, you can change the ownership with the following command:
GRANT permissions ON async_forms dbname TO async_forms;

```