# SwipePlay-Backend
Backend server for the new swipe-up gaming app.

Folder Structure
app.js: The main entry point of the application where the Express server is set up and configured.
routes/posts.js: Contains the route handlers for post-related endpoints.
models/User.js: Defines the User model using Sequelize to represent the database table.
config/db.js: Contains the database configuration code for establishing a connection to the MySQL database using Sequelize.
controllers/postsController.js: Contains the controller logic for handling post-related actions.
middleware/passport.js: Configures Passport.js and sets up the Google Strategy for authentication.
.env: Stores the environment variables, including the database connection details.