import express from "express";
import path from "path";
import { connection as db } from "./config/index.js";
import { createToken } from "./middleware/AuthenticateUser.js";
import { hash, compare } from "bcrypt";
import bodyParser from "body-parser";

/**Creating the express app */
const app = express();
const port = +process.env.PORT || 4000;
//one can create a dynamic endpoint when using router from express
const router = express.Router();

/**Middleware
 * the sequence in this process is important, it has to be written in this order
 */
app.use(
  router,
  express.static("./static"),
  /**the request data is being returned as json data */
  express.json(),
  /**converts the data to a valid url
   * this will ensure the data is in the correct format when it goes to the server
   */
  express.urlencoded({ extended: true })
);
/**
 * specifying body parser in order to retrieve the request data
 * -in order for the server to read the data from the frontend, we need to specify the below line 
 * to be applied on all the routes (then we do not have to specify it in every route) so that the 
 * data can be converted to json
 */
router.use(bodyParser.json()); 

/**Endpoint
 * (where the user is headed)
 * allows the user to redirect to other pages with the / in the search bar
 * */
router.get("^/$|/eShop", (req, res) => {
  res.status(200).sendFile(path.resolve("./static/html/index.html"));
});

router.get("/users", (req, res) => {
  try {
    const strQry = `
        SELECT firstName, lastName, age, emailAdd, userRole, profileURL
        FROM Users;
        `;
    db.query(strQry, (err, results) => {
      if (err) throw new Error(`Unable to fetch all users`);
      /**what is being sent to the client
       * data is stored in "results"
       */
      res.json({
        status: res.statusCode,
        results,
      });
    });
  } catch (error) {
    res.json({
      status: 404,
      message: error.message,
    });
  }
});

/**Endpoint for a specific user
 *the change of id's is dynamic - we do not want it to stay a specific value
 */
router.get("/user/:id", (req, res) => {
  try {
    const strQry = `
        SELECT firstName, lastName, age, emailAdd, userID, userRole, profileURL
        FROM Users
        WHERE userID = ${req.params.id};
        `;
    db.query(strQry, (err, result) => {
      if (err) throw new Error(`Specified user was not found`);

      res.json({
        status: res.statusCode,
        result: result[0],
      });
    });
  } catch (error) {
    res.json({ status: 404, message: error.message });
  }
});

/**
 * Registering a new user (login)
 */
router.post("/register", bodyParser.json(), async (req, res) => {
  try {
    let data = req.body;
    /**the salt is the additional characters that is added to a user's password that allows the password to be encrypted
     * this is done to prevent the password from being stored in plain text
     */
    data.pwd = await hash(data.pwd, 12);
    /**payload
     * allows us to create a token
     * all the information coming from the user
     */
    let user = {
      emailAdd: data.emailAdd,
      pwd: data.pwd,
    };
    let strQry = `
        INSERT INTO Users
        SET ?;
      `;
    db.query(strQry, [data], (err) => {
      if (err) {
        res.json({
          status: res.statusCode,
          msg: "This email has already been taken.",
        });
      } else {
        const token = createToken(user);
        res.json({
          token,
          msg: "You are now registered.",
        });
      }
    });
  } catch (error) {
    res.json({ status: 404, message: error.message });
  }
});

/**
 * Updating a user's password
 */
router.patch("/user/:id", async (req, res) => {
  try {
    let data = req.body;
    if (data.pwd) {
      data.pwd = await hash(data.pwd, 12);
    }
    const strQry = `
      UPDATE Users
      SET ?
      WHERE userID = ${req.params.id};
    `;

    db.query(strQry, [data], (err) => {
      if (err) throw new Error(`Unable to update user.`);
      res.json({
        status: res.statusCode,
        message: "User updated successfully",
      });
    });
  } catch (error) {
    res.json({ status: 404, message: error.message });
  }
});

/**
 * Deleting a specific user
 */
router.delete("/user/:id", (req, res) => {
  try {
    /**
     * we're using the WHERE clause because we are deleting only one user
     * without it, we would delete all users
     */
    const strQry = `
      DELETE FROM Users
      WHERE userID = ${req.params.id};
    `;
    db.query(strQry, (err) => {
      if (err)
        throw new Error(`To delete a user, please review your delete query.`);
      res.json({
        status: res.statusCode,
        message: "User's account has been deleted.",
      });
    });
  } catch (error) {
    res.json({ status: 404, message: error.message });
  }
});

/**
 * Login
 */
router.post("/login", (req, res) => {
  try {
    const { emailAdd, pwd } = req.body;
    const strQry = `
      SELECT userID, firstName, lastName, age, emailAdd, pwd, userRole, profileURL
      FROM Users
      WHERE emailAdd = '${emailAdd}'
      ;
    `;
    db.query(strQry, async (err, result) => {
      if (err) throw new Error(`To login, please review your query.`);
      if (!result?.length) {
        res.json({
          status: 401,
          message: "You provided the wrong email.",
        });
      } else {
        //first argument is the user's password, the second is the password from the database
        const isValidPass = await compare(pwd, result[0].pwd);
        if (isValidPass) {
          const token = createToken({ emailAdd, pwd });
          res.json({
            status: res.statusCode,
            token,
            //returning the first in the array returns it as a single object instead of the entire array
            result: result[0],
          });
        } else {
          res.json({
            status: 401,
            message: `Invalid password or you have not registered.`,
          });
        }
      }
    });
  } catch (error) {
    res.json({
      status: 401,
      message: error.message,
    });
  }
});

/**
 * This functions as a catch-all for any routes that havent been explicitly defined
 * if the user goes to a route that does not exist, this will be called
 * useful for debugging
 */
router.get("*", (req, res) => {
  res.json({
    status: 404,
    message: "Resource not found",
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
