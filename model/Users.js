import { connection as db} from "../config/index.js";
import { createToken } from "../middleware/AuthenticateUser.js";
import { hash, compare } from "bcrypt";

class Users {
  fetchUsers(req, res) {
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
  }
  fetchUser(req, res) {
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
  }
  async registerUser(req, res) {
    try {

      let strQry = `
                INSERT INTO Users
                SET ?;
              `;
      db.query(strQry, [req.body], (err) => {
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
  }
  async updateUser(req, res) {
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
  }
  deleteUser(req, res) {
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
  }
  async login(req, res) {
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
  }
}

export {
    Users
}