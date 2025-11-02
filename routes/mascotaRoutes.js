/**
 * Rutas de Mascotas
 * @description Define todas las rutas REST para la gestión de mascotas
 */

const express = require('express');
const router = express.Router();
const MascotaController = require('../controllers/mascotaController');
const { validateMascota, validateMascotaId } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

/**
 * @route GET /mascotas
 * @description Obtiene todas las mascotas con paginación opcional
 * @access Public
 */
router.get('/', authenticateToken, MascotaController.getAllMascotas);

/**
 * @route GET /mascotas/search
 * @description Busca mascotas por nombre o raza
 * @access Public
 */
router.get('/search', authenticateToken, MascotaController.searchMascotas);

/**
 * @route GET /mascotas/stats
 * @description Obtiene estadísticas de mascotas
 * @access Public
 */
router.get('/stats', authenticateToken, MascotaController.getMascotaStats);

/**
 * @route GET /mascotas/:id
 * @description Obtiene una mascota específica por ID
 * @access Public
 */
router.get('/:id', authenticateToken, validateMascotaId, MascotaController.getMascotaById);

/**
 * @route POST /mascotas
 * @description Crea una nueva mascota
 * @access Public
 */
router.post('/', authenticateToken, validateMascota, MascotaController.createMascota);

/**
 * @route PUT /mascotas/:id
 * @description Actualiza una mascota existente
 * @access Public
 */
router.put('/:id', authenticateToken, validateMascotaId, validateMascota, MascotaController.updateMascota);

/**
 * @route DELETE /mascotas/:id
 * @description Elimina una mascota
 * @access Public
 */
router.delete('/:id', authenticateToken, validateMascotaId, MascotaController.deleteMascota);

module.exports = router;
