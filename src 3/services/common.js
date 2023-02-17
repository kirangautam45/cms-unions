const md5=require("md5");

export const secretGenerator = (emailId,password) => {

    var email = emailId.split("").reverse().join("");
    var pwd = password.split("").reverse().join("");

    return md5(email+pwd);

}