import express from 'express';
import { obtenerTarifas, obtenerTarifasID, insertarTarifas, eliminarTarifas, actualizarTarifa, obtenerRegistro, obtenerRegistroID, insertarRegistro, eliminarRegistro, actualizarRegistro } from '../controllers/Entregable_1.js';

const router = express.Router();

router.get('/Tarifas', obtenerTarifas);
router.get('/TarifasID/:IDTARIFA', obtenerTarifasID);
router.post('/insertarTarifas/', insertarTarifas);
router.get('/eliminarTarifas/:IDTARIFA', eliminarTarifas);
router.put('/actualizarTarifas/:IDTARIFA', actualizarTarifa);

router.get('/Registra', obtenerRegistro);
router.get('/RegistroID/:IDREGISTRO', obtenerRegistroID);
router.post('/insertarRegistroVehicular', insertarRegistro);
router.get('/eliminarRegistro/:IDREGISTRO', eliminarRegistro);
router.put('/actualizarRegistro/:IDREGISTRO', actualizarRegistro);

export default router;
