const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  // host: "smtp.office365.com", // outlook
  // port: 587, // outlook
  // secure: false, // outlook, true for port 465, false for other ports
  host: 'smtp.gmail.com', // gmail
  port: 465, // gmail
  secure: true, // gmail
  auth: {
  	user: '1992menezes@gmail.com',
  	pass: ''
  },
  tls: { rejectUnauthorized: false }
});

const mailOptions = {
  from: 'a.amenezes@hotmail.com',
  to: '1992menezes@gmail.com',
  subject: 'E-mail enviado usando Node!',
  text: 'Bem fácil, não? ;)',
  html: '<h2>Agora vai</h2><p>Texto</p>'
};

/**
 * Destinatário: todo+yx0fgeaprkt3@mail.ticktick.com
 * Assunto: Título da página ~Blogs
 * Corpo: URL
 * 
 * Ou
 * 
 * Destinatário: todo+yx0fgeaprkt3@mail.ticktick.com
 * Assunto: URL ~Blogs
 * Corpo: (nada)
 */

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email enviado: ' + info.response);
  }
});