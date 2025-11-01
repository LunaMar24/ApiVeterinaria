/**
 * Rutas de Propietarios
 * @description Define todas las rutas REST para la gestión de propietarios
 */

const express = require('express');
const router = express.Router();
const PropietarioController = require('../controllers/propietarioController');
const { validatePropietario, validatePropietarioId } = require('../middleware/validation');

/**
 * @route GET /propietarios
 * @description Obtiene todos los propietarios con paginación opcional
 * @access Public
 */
router.get('/', PropietarioController.getAllPropietarios);

/**
 * @route GET /propietarios/search
 * @description Busca propietarios por nombre o apellidos
 * @access Public
 */
router.get('/search', PropietarioController.searchPropietarios);

/**
 * @route GET /propietarios/stats
 * @description Obtiene estadísticas de propietarios
 * @access Public
 */
router.get('/stats', PropietarioController.getPropietarioStats);

/**
 * @route GET /propietarios/:id
 * @description Obtiene un propietario específico por ID
 * @access Public
 */
router.get('/:id', validatePropietarioId, PropietarioController.getPropietarioById);

/**
 * @route POST /propietarios
 * @description Crea un nuevo propietario
 * @access Public
 */
router.post('/', validatePropietario, PropietarioController.createPropietario);

/**
 * @route PUT /propietarios/:id
 * @description Actualiza un propietario existente
 * @access Public
 */
router.put('/:id', validatePropietarioId, validatePropietario, PropietarioController.updatePropietario);

/**
 * @route DELETE /propietarios/:id
 * @description Elimina un propietario
 * @access Public
 */
router.delete('/:id', validatePropietarioId, PropietarioController.deletePropietario);

module.exports = router;
