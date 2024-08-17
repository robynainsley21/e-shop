import axios from "axios";

/**saving the token to the variable "Authorization" */
function applyToken (token){
    if(token){
        axios.defaults.headers = {
            Authorization: `${token}`
        }
    }
}
export {
    applyToken
}