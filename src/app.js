//archivo de conf para express
import express from 'express';
const app = express();

import config from './config.js';
app.set('port', config.port);

//Configurar cliente Postman para recibir parametros por body en formato JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Importar las rutas creadas para nuestras apis 
import vehiculoRuta from './routes/Vehiculo.routes.js';

//aplicar configuracion de ruta 
app.use(vehiculoRuta);

export default app;