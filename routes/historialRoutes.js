/**
 * Rutas de Historial Médico
 */

const express = require('express');
const router = express.Router();
const HistorialController = require('../controllers/historialController');
const { validateHistorial, validateHistorialId } = require('../middleware/validation');

router.get('/', HistorialController.getAllHistoriales);
router.get('/search', HistorialController.searchHistoriales);
router.get('/stats', HistorialController.getHistorialStats);
router.get('/:id', validateHistorialId, HistorialController.getHistorialById);
router.post('/', validateHistorial, HistorialController.createHistorial);
router.put('/:id', validateHistorialId, validateHistorial, HistorialController.updateHistorial);
router.delete('/:id', validateHistorialId, HistorialController.deleteHistorial);

module.exports = router;
