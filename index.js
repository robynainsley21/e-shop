import { userRouter, express } from './controller/UserController.js'
import { productRouter } from './controller/ProductController.js';
import path from "path";

/**Creating the express app */
const app = express();
const port = +process.env.PORT || 4000;
//one can create a dynamic endpoint when using router from express
const router = express.Router();

/**Middleware
 * the sequence in this process is important, it has to be written in this order
 */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Request-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Expose-Headers", "Authorization");
  /**without 'next', the lines following will not run */
  next()
})
app.use('/user', userRouter)
app.use('/product', productRouter)
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
