var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// serca de plublic el uso del siguiente librería
app.use(session ( {
  secret: 'ñsorn38f9emcyejsaopw9',
  resave: false,
  saveUninitialized: true
}));
// antes de las routas de acceso

// app.use('/', indexRouter);
// app.use('/users', usersRouter); 


app.get('/', function (req, res) {
  var conocido = Boolean(req.session.nombre);
  var comentario = ''
  if (req.session.edad < 1) {
    comentario = '¿Estas seguro que esa es tu edad?'
  } else if (req.session.edad < 18 ) {
    comentario = 'Estas por buen camino, no pares'
  } else if (req.session.edad < 30) {
    comentario = 'Explorando un nuevo mundo. ¡¡¡NO PARES!!!'
  } else if (req.session.edad < 45) {
    comentario = 'Seguir aprendiendo, lindo concepto...'
  } else if (req.session.edad < 90) {
    comentario = 'Bueno desde casa si funciona'
  } else if (req.session.edad < 150) {
    comentario = 'Entretenimiento de despedida :-O'
  } else {
    comentario =  'Ehhhh creo que venis de Melmack... ¡¡¡CUAK!!!'
  };


  if (req.session.hobby == 'estudiante') {
    var sumando = 'Si estas jugando con if-else es... ¿porque entendiste? VERDAD'
  } else if (req.session.hobby == 'gamer') {
    var sumando = 'Por que no descansas y te haces unos turnos  ;-)'
  } else if (req.session.hobby == 'flavia') {
    var sumando = 'Gracias profe, me cuesta banda... pero creo venir mejorando'
  } else {
    sumando = '';
  };

  res.render('index', {
    title: 'Prueba de Sesiones en Express.js',
    conocido: conocido,
    nombre: req.session.nombre,
    edad: req.session.edad,
    comentario: comentario,
    hobby: req.session.hobby,
    sumando: sumando
  });

  

});

app.post('/ingresar', function(req, res) {
   
  if (req.body.nombre) {
    req.session.nombre = req.body.nombre;
    req.session.edad = req.body.edad;
    req.session.hobby = req.body.hobby
  };
  
  res.redirect('/');
  // else {
  //   res.send('Hola usuario desconocido.');
});

app.get('/salir', function (req, res) {
  req.session.destroy();
  res.redirect('/');
});






// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
