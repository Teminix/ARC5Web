const crypto = require('crypto');
function encrypt(data, password,cipher='aes-256-cbc') {
  try {
    var cipher = crypto.createCipher(cipher, password);
    return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
  }
  catch(e){
    if(e.message.toLowerCase() == 'unknown cipher'){
      throw 'Invalid cipher';
    }
    else {
      throw e
    }
  }
}
function decrypt(data,password,decipher='aes-256-cbc') {
    try{
      var cipher = crypto.createDecipher(decipher, password);
      return cipher.update(data, 'hex', 'utf8') + cipher.final('utf8');
    }
    catch(e){
      if (e instanceof TypeError) {
        throw 'Invalid String'
      }
      else if (e instanceof Error){
        if (e.message.toLowerCase() == 'unknown cipher') {
          throw 'Invalid Decipher provided'
        }
        else {
            throw 'Invalid key'
            // throw e
        }

      }
       else {
        throw e
      }
    }

}
module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;
/*
function encrypt(data) {
  var cipher = crypto.createCipher('aes-256-ecb', 'password');
  return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
}
*/
