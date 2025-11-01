/**
 * Controlador de Propietarios
 * @description Maneja todas las operaciones HTTP para la entidad Propietario
 */

const Propietario = require('../models/Propietario');
const { validationResult } = require('express-validator');

class PropietarioController {
    static async getAllPropietarios(req, res) {
        try {
            // Soportar page/limit en query string o en body; valores por defecto: page=1, limit=10
            const rawPage = req.query?.page ?? req.body?.page;
            const rawLimit = req.query?.limit ?? req.body?.limit;

            let page = 0;
            let limit = 0;
            
            if (isNaN(rawPage) || page < 1) page = 1;
            if (isNaN(rawPage) || limit < 1) limit = 10;
            if (limit > 100) limit = 100;
            const search = req.query?.search ?? req.body?.search;

            let result;

            if (search) {
                const propietarios = await Propietario.searchByName(search);
                result = {
                    propietarios,
                    pagination: {
                        currentPage: 1,
                        totalPages: 1,
                        totalPropietarios: propietarios.length,
                        hasNextPage: false,
                        hasPrevPage: false
                    }
                };
            } else {
                result = await Propietario.paginate(page, limit);
            }

            res.status(200).json({
                success: true,
                message: 'Propietarios obtenidos correctamente',
                data: result.propietarios,
                pagination: result.pagination
            });
        } catch (error) {
            console.error('Error en getAllPropietarios:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    static async getPropietarioById(req, res) {
        try {
            const { id } = req.params;

            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'El ID debe ser un número válido'
                });
            }

            const prop = await Propietario.findById(id);

            if (!prop) {
                return res.status(404).json({
                    success: false,
                    message: 'Propietario no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Propietario obtenido correctamente',
                data: prop
            });
        } catch (error) {
            console.error('Error en getPropietarioById:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    static async createPropietario(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Errores de validación',
                    errors: errors.array()
                });
            }

            const { nombre, apellidos, cedula, telefono, correo } = req.body;

            const newProp = await Propietario.create({ nombre, apellidos, cedula, telefono, correo });

            res.status(201).json({
                success: true,
                message: 'Propietario creado correctamente',
                data: newProp
            });
        } catch (error) {
            console.error('Error en createPropietario:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    static async updatePropietario(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Errores de validación',
                    errors: errors.array()
                });
            }

            const { id } = req.params;
            const { nombre, apellidos, cedula, telefono, correo } = req.body;

            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'El ID debe ser un número válido'
                });
            }

            const existing = await Propietario.findById(id);
            if (!existing) {
                return res.status(404).json({
                    success: false,
                    message: 'Propietario no encontrado'
                });
            }

            const updated = await Propietario.update(id, { nombre, apellidos, cedula, telefono, correo });

            res.status(200).json({
                success: true,
                message: 'Propietario actualizado correctamente',
                data: updated
            });
        } catch (error) {
            console.error('Error en updatePropietario:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    static async deletePropietario(req, res) {
        try {
            const { id } = req.params;

            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'El ID debe ser un número válido'
                });
            }

            const existing = await Propietario.findById(id);
            if (!existing) {
                return res.status(404).json({
                    success: false,
                    message: 'Propietario no encontrado'
                });
            }

            await Propietario.delete(id);

            res.status(200).json({
                success: true,
                message: 'Propietario eliminado correctamente'
            });
        } catch (error) {
            console.error('Error en deletePropietario:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    static async searchPropietarios(req, res) {
        try {
            const { q } = req.query;

            if (!q || q.trim().length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'El parámetro de búsqueda es requerido'
                });
            }

            const propietarios = await Propietario.searchByName(q.trim());

            res.status(200).json({
                success: true,
                message: 'Búsqueda completada',
                data: propietarios,
                count: propietarios.length
            });
        } catch (error) {
            console.error('Error en searchPropietarios:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    static async getPropietarioStats(req, res) {
        try {
            const total = await Propietario.count();

            res.status(200).json({
                success: true,
                message: 'Estadísticas obtenidas correctamente',
                data: {
                    totalPropietarios: total,
                    timestamp: new Date().toISOString()
                }
            });
        } catch (error) {
            console.error('Error en getPropietarioStats:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }
}

module.exports = PropietarioController;
