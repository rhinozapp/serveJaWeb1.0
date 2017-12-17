exports.emailSend = function(emailSend, emailReceiver, subject, text, message) {
    let nodemailer = require('nodemailer'),
        transporter = nodemailer.createTransport({
            service : 'Gmail',
            auth:{
                user : 'rhinozapp@gmail.com',
                pass : 'glec2017'
            }
        }),
        mailOptions = {
        from: emailSend, // sender address
        to: emailReceiver, // list of receivers
        subject: subject, // Subject line
        text: text, // plaintext body
        html: message // html body
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }else{
            return console.log('Message sent: ' + info.response);
        }
    });

    //region TEST MODULE - COMO USAR
    /*var email = require('./emailSender');
     email.emailSend('QUEM ENVIA', 'RECEPTOR', 'ASSUNTO', 'TEXTO', 'TEXTO EM HTML');*/
    //endregion
};