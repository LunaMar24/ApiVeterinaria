/**
 * Controlador de Mascotas
 * @description Maneja todas las operaciones HTTP para la entidad Mascota
 */

const Mascota = require('../models/Mascota');
const { validationResult } = require('express-validator');

class MascotaController {
    static async getAllMascotas(req, res) {
        try {
            const rawPage = req.query?.page ?? req.body?.page;
            const rawLimit = req.query?.limit ?? req.body?.limit;

            let page = parseInt(rawPage) || 1;
            let limit = parseInt(rawLimit) || 10;
            if (page < 1) page = 1;
            if (limit < 1) limit = 10;
            if (limit > 100) limit = 100;

            const search = req.query?.search ?? req.body?.search;

            let result;

            if (search) {
                const mascotas = await Mascota.searchByName(search);
                result = {
                    mascotas,
                    pagination: {
                        currentPage: 1,
                        totalPages: 1,
                        totalMascotas: mascotas.length,
                        hasNextPage: false,
                        hasPrevPage: false
                    }
                };
            } else {
                result = await Mascota.paginate(page, limit);
            }

            res.status(200).json({
                success: true,
                message: 'Mascotas obtenidas correctamente',
                data: result.mascotas,
                pagination: result.pagination
            });
        } catch (error) {
            console.error('Error en getAllMascotas:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    static async getMascotaById(req, res) {
        try {
            const { id } = req.params;

            if (isNaN(id)) {
                return res.status(400).json({ success: false, message: 'El ID debe ser un número válido' });
            }

            const mascota = await Mascota.findById(id);

            if (!mascota) {
                return res.status(404).json({ success: false, message: 'Mascota no encontrada' });
            }

            res.status(200).json({ success: true, message: 'Mascota obtenida correctamente', data: mascota });
        } catch (error) {
            console.error('Error en getMascotaById:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
        }
    }

    static async createMascota(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, message: 'Errores de validación', errors: errors.array() });
            }

            const { propietario, nombre, raza, edad } = req.body;

            const newMascota = await Mascota.create({ propietario, nombre, raza, edad });

            res.status(201).json({ success: true, message: 'Mascota creada correctamente', data: newMascota });
        } catch (error) {
            console.error('Error en createMascota:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
        }
    }

    static async updateMascota(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, message: 'Errores de validación', errors: errors.array() });
            }

            const { id } = req.params;
            const { propietario, nombre, raza, edad } = req.body;

            if (isNaN(id)) {
                return res.status(400).json({ success: false, message: 'El ID debe ser un número válido' });
            }

            const existing = await Mascota.findById(id);
            if (!existing) {
                return res.status(404).json({ success: false, message: 'Mascota no encontrada' });
            }

            const updated = await Mascota.update(id, { propietario, nombre, raza, edad });

            res.status(200).json({ success: true, message: 'Mascota actualizada correctamente', data: updated });
        } catch (error) {
            console.error('Error en updateMascota:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
        }
    }

    static async deleteMascota(req, res) {
        try {
            const { id } = req.params;

            if (isNaN(id)) {
                return res.status(400).json({ success: false, message: 'El ID debe ser un número válido' });
            }

            const existing = await Mascota.findById(id);
            if (!existing) {
                return res.status(404).json({ success: false, message: 'Mascota no encontrada' });
            }

            await Mascota.delete(id);

            res.status(200).json({ success: true, message: 'Mascota eliminada correctamente' });
        } catch (error) {
            console.error('Error en deleteMascota:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
        }
    }

    static async searchMascotas(req, res) {
        try {
            const { q } = req.query;
            if (!q || q.trim().length === 0) {
                return res.status(400).json({ success: false, message: 'El parámetro de búsqueda es requerido' });
            }

            const mascotas = await Mascota.searchByName(q.trim());

            res.status(200).json({ success: true, message: 'Búsqueda completada', data: mascotas, count: mascotas.length });
        } catch (error) {
            console.error('Error en searchMascotas:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
        }
    }

    static async getMascotaStats(req, res) {
        try {
            const total = await Mascota.count();
            res.status(200).json({ success: true, message: 'Estadísticas obtenidas correctamente', data: { totalMascotas: total, timestamp: new Date().toISOString() } });
        } catch (error) {
            console.error('Error en getMascotaStats:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
        }
    }
}

module.exports = MascotaController;
