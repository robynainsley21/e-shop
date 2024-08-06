import express from "express";
import path from "path";
import { connection as db } from "./config/index.js";

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
        SELECT firstName, lastName, age, emailAdd
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
router.get("/users/:id", (req, res) => {
  try {
    const strQry = `
        SELECT firstName, lastName, age, emailAdd, userID
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

router.get('*', (req, res) => {
    res.json({
        status: 404,
        message: 'Resource not found'
    })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
