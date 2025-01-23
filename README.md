# Blog Management API 

A Node.js-based REST API for managing users, blogs, and comments with role-based authentication and authorization. The application uses MongoDB for the database, JWT for authentication, and bcrypt for password hashing.


## Features

- User Authentication: Signup and login functionality with hashed passwords and JWT-based authentication.
- Role-Based Authorization: Admin, Editor, and User roles with specific permissions.
- Blog Management: Admins can create blogs and assign them to Editors. Editors can update assigned blogs.
- Email Integration: Nodemailer setup for email notifications (e.g., account verification).


## Steps to Test API's

- #### Create an app.http file:
    Created file named app.http in a text editor.

- #### Write HTTP Requests:
    Use the syntax above to define different HTTP requests like GET, POST, PUT, DELETE, etc. You can also add headers and request bodies as needed.
    Each request in the .http file is separated by ### to signify distinct requests.

- #### Install Thunder Client:
    Thunder Client is a popular REST client for VSCode. Install the extension in VSCode by searching for "Thunder Client" in the extensions marketplace.

- #### Open app.http File in VSCode:
    Open the app.http file in your VSCode editor where you installed Thunder Client.

- #### Manually Transfer Requests to Thunder Client: 
    Thunder Client doesn't automatically parse .http files, so you need to manually create the requests in the Thunder Client interface based on the content of your .http file.

    Here's how you do that:

    - Open Thunder Client (you can open it from the sidebar in VSCode and typing "Thunder Client: New Request").
    - For each request in the app.http file, replicate it inside Thunder Client:

            1. Select HTTP Method (GET, POST, etc.) from the dropdown.
            2. Enter the URL for the API endpoint.
            3. Add Headers if needed (like Authorization, Content-Type, etc.).
            4. Enter the Body (if required for POST, PUT, etc.).
            5. Click Send to execute the request.


## Technologies Used

- Node.js: Backend runtime environment.
- Express.js: Web framework for routing and middleware.
- MongoDB: NoSQL database for data storage.
- JWT: Authentication and authorization.
- Bcrypt: Password hashing for secure storage.
- Nodemailer: Email notifications.