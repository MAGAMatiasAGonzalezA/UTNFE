var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var novedadesModel = require('../models/novedadesModel');

/* GET home page. */
router.get('/', async function(req, res, next) {
  var novedades = await novedadesModel.getNovedades();
  res.render('index', {
    novedades
  });
});

router.post('/', async (req, res, next ) => {

  var nombre = req.body.nombre;
  var apellido = req.body.apellido;
  var email = req.body.email;
  var telefono = req.body.tel;
  var mensaje = req.body.mensaje;

  var obj = {
    to: 'mafiulalala@gamil.com',
    subject: 'Contacto desde la web',
    html: nombre + ' ' + apellido + ' se contacto a traves del formulario y quiere más información a este correo: ' + email +
    '<br> Ademas, hizo el siguiente comentario: ' + mensaje + '. <br> Su telefono es ' + telefono
  }; //cierra var objeto

  var transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  }); // cierra Transporter

  var info = await transporter.sendMail(obj);

  res.render('index', {
    message: 'Mensaje enviado correctamente',
  });
}); // cierra petición  del post

module.exports = router;