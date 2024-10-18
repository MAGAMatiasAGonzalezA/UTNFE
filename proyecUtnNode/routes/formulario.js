var express = require('express');
var router = express.Router();

var nodemailer = require('nodemailer');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('formulario');
});

/* POST home formulario page. */
router.post('/', async (req, res, next ) => {

  var nombre = req.body.nombre;
  var apellido = req.body.apellido;
  var email = req.body.email;
  var telefono = req.body.celular;
  var mensaje = req.body.descripcion;

  var obj = {
    to: 'mafiulalala@gamil.com',
    subject: 'Contacto desde la web de proyectos',
    html: nombre + ' ' + apellido + ' se contacto a traves del formulario de proyecyos y quiere mas información a este correo: ' + email +
    '<br> Ademas, hizo el siguiente aporte sobre su proyecto: ' + mensaje + '. <br> Su telefono es ' + telefono
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

  res.render('formulario', {
    message: 'Mensaje enviado correctamente. Su proyecto sera evaluado',
  });
}); // cierra petición  del post


module.exports = router;
