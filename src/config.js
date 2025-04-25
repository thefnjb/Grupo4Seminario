// Crear variables de entorno con DOTENV
import { config } from "dotenv";
config();

console.log(process.env.desarrolladorFullstack);
export default
{
    port:process.env.port
}