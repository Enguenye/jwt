let jwt = require( 'jsonwebtoken' );
let config = require( './config' );
let getUser= require('./connection.js');
var Q= require('q');
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = Buffer.from('õb5*§í6fÈ-º@ÑEå¬àÝ3}»Wµ', 'ascii');
const iv =Buffer.from('iæÝSþé¾9N','ascii'); 
let rol = "No autorizado";

function encrypt(text) {
  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
 }
 
 function decrypt(text) {
  let encryptedText = Buffer.from(text, 'hex');
  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
 }

// Clase encargada de la creación del token
class HandlerGenerator {

  login( req, res ) {
    
    // Extrae el usuario y la contraseña especificados en el cuerpo de la solicitud
    let username = req.body.username;
    let password = req.body.password;
    
    // Este usuario y contraseña, en un ambiente real, deben ser traidos de la BD


    // Si se especifico un usuario y contraseña, proceda con la validación
    // de lo contrario, un mensaje de error es retornado
    if( username && password ) {

        let iguales = false;
        getUser((docs)=>{
          let desencriptada = decrypt(docs[0].password);
            if(desencriptada==password){
                iguales = true;
            }
            // Si los usuarios y las contraseñas coinciden, proceda con la generación del token
      // de lo contrario, un mensaje de error es retornado
      if( iguales ) {
        
        if(username=="Dario"){
          rol="Administrador"//Puede cambiar la información.
        }
        else if(username=="Dario2"){
          rol = "Moderador"//Tambien puede modificar información.
        }
        else{
          rol = "Usuario"//Solo puede leer la información
        }
        // Se genera un nuevo token para el nombre de usuario el cuál expira en 24 horas
        let token = jwt.sign( { username: username },
          config.secret, { expiresIn: '24h' } );
        
        // Retorna el token el cuál debe ser usado durante las siguientes solicitudes
        res.json( {
          success: true,
          message: 'Authentication successful!',
          role: rol,
          token: token
        } );

      } else {
        
        // El error 403 corresponde a Forbidden (Prohibido) de acuerdo al estándar HTTP
        res.send( 403 ).json( {
          success: false,
          message: 'Incorrect username or password'
        } );

      }
        },username);     

    } else {

      // El error 400 corresponde a Bad Request de acuerdo al estándar HTTP
      res.send( 400 ).json( {
        success: false,
        message: 'Authentication failed! Please check the request'
      } );

    }

  }

  index( req, res ) {
    
    // Retorna una respuesta exitosa con previa validación del token
    res.json( {
      success: true,
      message: 'Index page'
    } );

  }
}

module.exports = HandlerGenerator;