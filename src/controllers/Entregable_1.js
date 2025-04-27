import { obtenerConexion, sql } from '../database/conexion.js';
import moment from 'moment-timezone';


// Obtener todos los vehículos
export const obtenerTarifas = async (req, res) => {
    const conexion = await obtenerConexion();
    const resultado = await conexion.request().query('SELECT * FROM TARIFAS');
    console.log(resultado); // Resultado en consola (DEV)
    res.json(resultado.recordset); // Resultado al navegador
}

// Mostrar los vehículos en función del ID
export const obtenerTarifasID = async (req, res) => {
    const { IDTARIFA } = req.params;
    const conexion = await obtenerConexion();
    const resultado = await conexion.request()
        .input('IDTARIFA', sql.Int, IDTARIFA)
        .query("SELECT * FROM TARIFAS WHERE IDTARIFA = @IDTARIFA");

    console.log(resultado); // Resultado en consola (DEV)
    res.json(resultado.recordset); // Resultado al navegador
}


export const insertarTarifas = async (req, res) => {
    try {
        const { DESCRIPTARIFA, COSTOTARIFA } = req.body;
        8
        // Validación de parámetros
        if (!DESCRIPTARIFA, !COSTOTARIFA) {
            return res.status(400).json({ message: 'Parámetros insuficientes.' });
        }

        const conexion = await obtenerConexion();
        const resultado = await conexion.request()
            .input('DESCRIPTARIFA', sql.VarChar, DESCRIPTARIFA)
            .input('COSTOTARIFA', sql.Float, COSTOTARIFA)
            .query("INSERT INTO TARIFAS (DESCRIPTARIFA, COSTOTARIFA) VALUES (@DESCRIPTARIFA, @COSTOTARIFA)");

        console.log(resultado);

        res.status(201).json({
            message: "Tarifa insertado exitosamente",
            datos: { DESCRIPTARIFA, COSTOTARIFA }
        });
    } catch (error) {
        console.error("Error al insertar Tarifa:", error);
        res.status(500).json({ message: "Error del servidor" });
    }
}


export const eliminarTarifas = async (req, res) => {
    const { IDTARIFA } = req.params;
    const conexion = await obtenerConexion();
    const resultado = await conexion.request()
        .input('IDTARIFA', sql.Int, IDTARIFA)
        .query("DELETE FROM TARIFAS WHERE IDTARIFA = @IDTARIFA");

    console.log(resultado); // Resultado en consola (DEV)
    res.json(resultado.recordset); // Resultado al navegador
}


export const actualizarTarifa = async (req, res) => {
    try {
        const { IDTARIFA } = req.params;  // Obtener el ID desde los parámetros de la URL
        const { DESCRIPTARIFA, COSTOTARIFA } = req.body;

        // Validación de parámetros
        if (!IDTARIFA || !DESCRIPTARIFA || !COSTOTARIFA) {
            return res.status(400).json({ message: 'Parámetros insuficientes.' });
        }

        const conexion = await obtenerConexion();

        // Primero, obtener la tarifa actual antes de actualizarla
        const tarifaActual = await conexion.request()
            .input('IDTARIFA', sql.Int, IDTARIFA)
            .query('SELECT * FROM TARIFAS WHERE IDTARIFA = @IDTARIFA');

        if (tarifaActual.recordset.length === 0) {
            return res.status(404).json({ message: 'Tarifa no encontrada.' });
        }

        // Mostrar los datos actuales antes de la actualización
        console.log("Datos actuales de la tarifa:", tarifaActual.recordset[0]);

        // Actualizar la tarifa con los nuevos datos
        const resultado = await conexion.request()
            .input('IDTARIFA', sql.Int, IDTARIFA)
            .input('DESCRIPTARIFA', sql.VarChar, DESCRIPTARIFA)
            .input('COSTOTARIFA', sql.Float, COSTOTARIFA)
            .query(`
                UPDATE TARIFAS
                SET DESCRIPTARIFA = @DESCRIPTARIFA,
                    COSTOTARIFA = @COSTOTARIFA
                WHERE IDTARIFA = @IDTARIFA
            `);

        console.log(resultado);

        res.status(200).json({
            message: "Tarifa actualizada exitosamente",
            datos: { IDTARIFA, DESCRIPTARIFA, COSTOTARIFA }
        });
    } catch (error) {
        console.error("Error al actualizar Tarifa:", error);
        res.status(500).json({ message: "Error del servidor" });
    }
}


//Registro Api 

export const obtenerRegistro = async (req, res) => {
    const conexion = await obtenerConexion();
    const resultado = await conexion.request().query('SELECT * FROM REGISTROVEHICULAR');
    console.log(resultado);
    res.json(resultado.recordset);
}

export const obtenerRegistroID = async (req, res) => {
    const { IDREGISTRO } = req.params;
    const conexion = await obtenerConexion();

    try {
        const resultadoRegistro = await conexion.request()
            .input('IDREGISTRO', sql.Int, IDREGISTRO)
            .query("SELECT * FROM REGISTROVEHICULAR WHERE IDREGISTRO = @IDREGISTRO");

        const resultadoTarifas = await conexion.request()
            .input('IDTARIFA', sql.Int, IDREGISTRO)
            .query("SELECT * FROM TARIFAS WHERE IDTARIFA = @IDTARIFA");

        res.json({
            registro: resultadoRegistro.recordset,
            tarifas: resultadoTarifas.recordset
        });
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
}


export const insertarRegistro = async (req, res) => {
    try {
        const { VEHICULO, HORASPARQUEO, IDTARIFA } = req.body;
        // Nota: Ya no necesitamos COSTOTOTAL del req.body porque lo calcularemos

        // Validación de parámetros
        if (!VEHICULO || !HORASPARQUEO || !IDTARIFA) {
            return res.status(400).json({ message: 'Parámetros insuficientes.' });
        }

        // Obtener conexión
        const conexion = await obtenerConexion();

        // Obtener COSTOTARIFA de la tabla TARIFAS según el IDTARIFA
        const resultadoTarifa = await conexion.request()
            .input('IDTARIFA', sql.Int, IDTARIFA)
            .query("SELECT COSTOTARIFA FROM TARIFAS WHERE IDTARIFA = @IDTARIFA");

        // Verificar si se encontró la tarifa
        if (resultadoTarifa.recordset.length === 0) {
            return res.status(404).json({ message: "Tarifa no encontrada para el IDTARIFA proporcionado" });
        }

        // Obtener el COSTOTARIFA
        const COSTOTARIFA = resultadoTarifa.recordset[0].COSTOTARIFA;
        console.log(`COSTOTARIFA obtenido: ${COSTOTARIFA}`);

        // Calcular COSTOTOTAL multiplicando HORASPARQUEO por COSTOTARIFA
        const COSTOTOTAL = HORASPARQUEO * COSTOTARIFA;
        console.log(`Cálculo: ${HORASPARQUEO} horas × ${COSTOTARIFA} = ${COSTOTOTAL}`);

        // Obtener la fecha y hora actual - asegurando que sea la más reciente
        const horaActual = new Date(Date.now());

        // Log para verificar la hora actual
        console.log('Hora actual obtenida:', horaActual);

        // Aseguramos que la fecha esté en formato correcto YYYY-MM-DD usando la fecha local
        const FECHAREGISTRO = `${horaActual.getFullYear()}-${String(horaActual.getMonth() + 1).padStart(2, '0')}-${String(horaActual.getDate()).padStart(2, '0')}`;

        console.log(`Fecha formateada (local): ${FECHAREGISTRO}`);

        // Función mejorada para formatear hora en formato HH:MM:SS
        const formatoHora = (hora) => {
            // Usamos métodos locales para asegurar que la hora sea la correcta
            const horas = hora.getHours().toString().padStart(2, '0');
            const minutos = hora.getMinutes().toString().padStart(2, '0');
            const segundos = hora.getSeconds().toString().padStart(2, '0');
            return `${horas}:${minutos}:${segundos}`;
        };

        // Aseguramos que la hora esté en formato correcto HH:MM:SS
        const HORAREGISTRO = formatoHora(horaActual);

        // Log para verificar el formato de hora
        console.log(`Hora formateada: ${HORAREGISTRO}`);

        // Insertar en la base de datos con el COSTOTOTAL calculado
        const resultado = await conexion.request()
            .input('VEHICULO', sql.VarChar, VEHICULO)
            .input('HORASPARQUEO', sql.Int, HORASPARQUEO)
            .input('COSTOTOTAL', sql.Float, COSTOTOTAL) // Usamos el valor calculado
            .input('IDTARIFA', sql.Int, IDTARIFA)
            .input('FECHAREGISTRO', sql.VarChar, FECHAREGISTRO)
            .input('HORAREGISTRO', sql.VarChar, HORAREGISTRO)
            .query(
                'INSERT INTO REGISTROVEHICULAR(VEHICULO, HORASPARQUEO, COSTOTOTAL, IDTARIFA, FECHAREGISTRO, HORAREGISTRO) ' +
                'VALUES(@VEHICULO, @HORASPARQUEO, @COSTOTOTAL, @IDTARIFA, @FECHAREGISTRO, @HORAREGISTRO)'
            );

        console.log('Resultado de la inserción:', resultado);

        // Respuesta exitosa
        res.status(201).json({
            message: "Registro insertado exitosamente",
            datos: {
                VEHICULO,
                HORASPARQUEO,
                COSTOTARIFA,
                COSTOTOTAL, // Incluimos el valor calculado
                IDTARIFA,
                FECHAREGISTRO,
                HORAREGISTRO,
                calculo: `${HORASPARQUEO} horas × ${COSTOTARIFA} = ${COSTOTOTAL}` // Incluimos el detalle del cálculo
            }
        });
    } catch (error) {
        console.error("Error al insertar registro:", error);
        console.error("Detalles del error:", error.message);
        if (error.stack) console.error("Stack:", error.stack);
        res.status(500).json({ message: "Error del servidor", error: error.message });
    }
};

export const actualizarRegistro = async (req, res) => {
    try {
        const { IDREGISTRO } = req.params; // Obtener IDREGISTRO de los parámetros de ruta
        const datosActualizados = req.body || {}; // Asegurar que datosActualizados sea al menos un objeto vacío

        // Validar que al menos llegue el IDREGISTRO
        if (!IDREGISTRO) {
            return res.status(400).json({ message: 'Se requiere el ID del registro.' });
        }

        const conexion = await obtenerConexion();

        // Primero buscar si existe el registro
        const busqueda = await conexion.request()
            .input('IDREGISTRO', sql.Int, IDREGISTRO)
            .query('SELECT r.*, t.COSTOTARIFA FROM REGISTROVEHICULAR r LEFT JOIN TARIFAS t ON r.IDTARIFA = t.IDTARIFA WHERE r.IDREGISTRO = @IDREGISTRO');

        if (busqueda.recordset.length === 0) {
            return res.status(404).json({ message: 'Registro no encontrado.' });
        }

        // Obtener los datos actuales del registro
        const registroActual = busqueda.recordset[0];

        // Verificar si hay datos para actualizar
        const hayDatosParaActualizar = datosActualizados && Object.keys(datosActualizados).length > 0;
        
        // Si no hay datos para actualizar, devolver los datos actuales
        if (!hayDatosParaActualizar) {
            return res.status(200).json({
                message: 'Datos del registro encontrados.',
                registro: registroActual
            });
        }

        // Combinar los datos actuales con los datos actualizados
        const VEHICULO = datosActualizados.VEHICULO || registroActual.VEHICULO;
        const HORASPARQUEO = datosActualizados.HORASPARQUEO || registroActual.HORASPARQUEO;
        const IDTARIFA = datosActualizados.IDTARIFA || registroActual.IDTARIFA;

        // Si se cambió la tarifa, obtener el nuevo COSTOTARIFA
        let COSTOTARIFA = registroActual.COSTOTARIFA;
        if (IDTARIFA !== registroActual.IDTARIFA) {
            const resultadoTarifa = await conexion.request()
                .input('IDTARIFA', sql.Int, IDTARIFA)
                .query("SELECT COSTOTARIFA FROM TARIFAS WHERE IDTARIFA = @IDTARIFA");

            if (resultadoTarifa.recordset.length === 0) {
                return res.status(404).json({ message: "Tarifa no encontrada para el IDTARIFA proporcionado" });
            }

            COSTOTARIFA = resultadoTarifa.recordset[0].COSTOTARIFA;
        }

        // Calcular el nuevo COSTOTOTAL
        const COSTOTOTAL = HORASPARQUEO * COSTOTARIFA;
        console.log(`Cálculo actualizado: ${HORASPARQUEO} horas × ${COSTOTARIFA} = ${COSTOTOTAL}`);

        // Obtener la fecha y hora actual para el registro de la actualización
        const horaActual = new Date(Date.now());
        const FECHAREGISTRO = `${horaActual.getFullYear()}-${String(horaActual.getMonth() + 1).padStart(2, '0')}-${String(horaActual.getDate()).padStart(2, '0')}`;
        
        const formatoHora = (hora) => {
            const horas = hora.getHours().toString().padStart(2, '0');
            const minutos = hora.getMinutes().toString().padStart(2, '0');
            const segundos = hora.getSeconds().toString().padStart(2, '0');
            return `${horas}:${minutos}:${segundos}`;
        };
        
        const HORAREGISTRO = formatoHora(horaActual);

        // Proceder a actualizar con todos los datos
        const resultado = await conexion.request()
            .input('IDREGISTRO', sql.Int, IDREGISTRO)
            .input('VEHICULO', sql.VarChar, VEHICULO)
            .input('HORASPARQUEO', sql.Int, HORASPARQUEO)
            .input('COSTOTOTAL', sql.Float, COSTOTOTAL)
            .input('IDTARIFA', sql.Int, IDTARIFA)
            .input('FECHAREGISTRO', sql.VarChar, FECHAREGISTRO)
            .input('HORAREGISTRO', sql.VarChar, HORAREGISTRO)
            .query(`
                UPDATE REGISTROVEHICULAR
                SET VEHICULO = @VEHICULO,
                    HORASPARQUEO = @HORASPARQUEO,
                    COSTOTOTAL = @COSTOTOTAL,
                    IDTARIFA = @IDTARIFA,
                    FECHAREGISTRO = @FECHAREGISTRO,
                    HORAREGISTRO = @HORAREGISTRO
                WHERE IDREGISTRO = @IDREGISTRO
            `);

        console.log('Resultado de la actualización:', resultado);

        // Obtener el registro actualizado para devolverlo en la respuesta
        const registroActualizado = await conexion.request()
            .input('IDREGISTRO', sql.Int, IDREGISTRO)
            .query('SELECT * FROM REGISTROVEHICULAR WHERE IDREGISTRO = @IDREGISTRO');

        res.status(200).json({
            message: 'Registro actualizado exitosamente.',
            registroAnterior: registroActual,
            registroActualizado: registroActualizado.recordset[0],
            detalleCalculo: {
                horasParqueo: HORASPARQUEO,
                costoTarifa: COSTOTARIFA,
                costoTotal: COSTOTOTAL
            }
        });

    } catch (error) {
        console.error("Error al actualizar registro:", error);
        console.error("Detalles del error:", error.message);
        if (error.stack) console.error("Stack:", error.stack);
        res.status(500).json({ message: "Error del servidor", error: error.message });
    }
};


export const eliminarRegistro = async (req, res) => {
    const { IDREGISTRO } = req.params;
    const conexion = await obtenerConexion();
    const resultado = await conexion.request()
        .input('IDREGISTRO', sql.Int, IDREGISTRO)
        .query("DELETE FROM REGISTROVEHICULAR WHERE IDREGISTRO = @IDREGISTRO");

    console.log(resultado);
    res.json(resultado.recordset);
}


