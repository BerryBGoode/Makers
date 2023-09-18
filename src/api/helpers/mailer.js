// requeriendo de nodemailer para poder enviar correo
const MAILER = require('nodemailer');


/**
 * Método para poder enviar mensaje al correo desde una cuenta de gmail especificada
 * @param {*} msg cuerpo del mensaje
 * @param {*} subject objetivo del mensaje
 * @param {*} gmail correo a enviarle el mensaje
 */
const sendMail = async (gmail, subject, msg) => {
    try {
        // creando objeto con los datos de la cuenta que enviará el mail
        let mail = {
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: 'makers.system10@gmail.com',
                pass: 'qyhy ebhm kfhw kcxj'
            }
        }

        let send = {
            from: mail.auth.user,
            to: gmail,
            subject: subject,
            text: msg
        }
        // creando el transportador que enviará el correo
        const transport = MAILER.createTransport(mail);
        // espernado que se envie el mensaje
        await transport.sendMail(send)
    } catch (error) {
        console.log(error);
    }
}
module.exports = { sendMail }
