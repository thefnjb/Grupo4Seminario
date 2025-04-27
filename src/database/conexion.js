import sql from 'mssql';

const parametrosSQL = {
    user: process.env.user,
    password: process.env.password,
    server: process.env.server,
    database: process.env.database,
    trustServerCertificate: Boolean(process.env.trustServerCertificate),
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
}

export async function obtenerConexion() {
    try {
        const miconexion = await sql.connect(parametrosSQL);
        return miconexion;
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
        throw error;
    }
}

export { sql };