# async-forms

# About
URL Mappings

- Register: /register
- Login: /login
- Get all users: /user/getAll
- Get user: /user/get
- Forgot password send: /forgot/send
- Forgot password reset: /forgot/reset

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