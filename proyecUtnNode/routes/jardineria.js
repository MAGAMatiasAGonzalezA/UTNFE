var express = require('express');
var router = express.Router();

var nodemailer = require('nodemailer');

router.get('/', function(req, res, next) {
    res.render('jardineria');
});

/* POST jardineria formulario page. */
router.post('/', async (req, res, next ) => {

    var nombre = req.body.nombre;
    var apellido = req.body.apellido;
    var email = req.body.email;
    var telefono = req.body.tel;
    var mensaje = req.body.mensaje;
  
    var obj = {
      to: 'mafiulalala@gamil.com',
      subject: 'Contacto desde la web',
      html: nombre + ' ' + apellido + ' se contacto a traves del formulario de jardineria y quiere más información a este correo: ' + email +
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
  
    res.render('jardineria', {
      message: 'Plantaste tu primer semilla, pronto crecera con un mensaje de respuesta',
    });
  }); // cierra petición  del post

module.exports = router;