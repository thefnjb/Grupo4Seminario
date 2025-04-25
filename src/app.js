// archivo de configuracion para express
import express from 'express';
const app = express();


import config  from './config.js';
app.set('port', config.port);

//configurar cliente Postman para recibir parametros por body en formato JSON
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//Importar las rutas creadas para nuestros APIS
import Tarifario from './routes/Tarifario.routes.js';

//aplicar configuraciones de la rutas 
app.use(Tarifario);

export default app;