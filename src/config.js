//Crear variables de entorno con dotenv
import { config } from 'dotenv';
config();
console.log(process.env.desarrolladorFullStack);
export default {
    port: process.env.PORT || 3000
}