import { createPool } from "mysql2";
/**imports everything at once */
import'dotenv/config'

/**fetching from the env file */
let connection = createPool({
    host: process.env.hostDb,
    user: process.env.userDb,
    password: process.env.pwdDb,
    database: process.env.dbName,
    /**running multiple statements simultaneously */
    multipleStatements: true,
    connectionLimit: 30
})

/**in case the connection fails 
 * pool returns an array
*/
connection.on('connection', (pool) => {
    if(!pool)throw new Error('Could not connect to database')
})
/**making the variable available */
export {
    connection
}