import app from "./app.js";

//configuracion de puerto de escucha HTTP
app.listen(app.get('port'));

console.log("Servidor en el puerto", app.get('port'));