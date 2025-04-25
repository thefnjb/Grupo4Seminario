//importamos el modulo de mssql
import sql from 'mssql';

//importamos el modulo de dotenv
const parametrosSQL = 
{
    user : process.env.user,
    password : process.env.password,
    server : process.env.server,
    database : process.env.database,
    trustServerCertificate :Boolean(process.env.trustServerCertificate)
}

export async function getConnection()
{
    try {
        const miconexion = await sql.connect(parametrosSQL);
        return miconexion;
    } catch (error) {
        console.error(error);
    }
}
export {sql};
