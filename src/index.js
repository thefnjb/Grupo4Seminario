import app from './app.js';
import './database/conexion.js';

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: "Error interno del servidor",
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

app.listen(app.get('port'));
console.log("Servidor IBM Server proliant iniciado en el puerto ", app.get('port'));