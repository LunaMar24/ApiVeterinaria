/**
 * Modelo de Mascota
 * @description Maneja todas las operaciones CRUD para la entidad Mascota
 *
 * Nota: Este archivo asume que existe la tabla `mascota` con las columnas:
 * - idMascota (INT, PK, autonumerico)
 * - Propietario (INT) -- FK hacia propietarios.idPropietario
 * - Nombre (VARCHAR)
 * - Raza (VARCHAR)
 * - Edad (VARCHAR)
 */

const { pool } = require('../config/database');

class Mascota {
    /**
     * Constructor para crear una instancia de Mascota
     * @param {Object} data
     * @param {number} data.id - ID de la mascota
     * @param {number} data.propietario - ID del propietario
     * @param {string} data.nombre - Nombre
     * @param {string} data.raza - Raza
     * @param {string} data.edad - Edad
     */
    constructor(data) {
        this.id = data.id;
        this.propietario = data.propietario;
        this.nombre = data.nombre;
        this.raza = data.raza;
        this.edad = data.edad;
    }

    static async findAll() {
        try {
            const [rows] = await pool.execute(
                'SELECT idMascota as id, Propietario as propietario, Nombre as nombre, Raza as raza, Edad as edad FROM mascota ORDER BY Nombre'
            );
            return rows;
        } catch (error) {
            console.error('Error en Mascota.findAll:', error);
            throw new Error('Error al obtener mascotas');
        }
    }

    static async findById(id) {
        try {
            const [rows] = await pool.execute(
                'SELECT idMascota as id, Propietario as propietario, Nombre as nombre, Raza as raza, Edad as edad FROM mascota WHERE idMascota = ?',
                [id]
            );
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Error en Mascota.findById:', error);
            throw new Error('Error al buscar mascota por ID');
        }
    }

    static async create(data) {
        try {
            const { propietario, nombre, raza, edad } = data;
            const [result] = await pool.execute(
                'INSERT INTO mascota (Propietario, Nombre, Raza, Edad) VALUES (?, ?, ?, ?)',
                [propietario, nombre, raza, edad]
            );

            const newMascota = await this.findById(result.insertId);
            return newMascota;
        } catch (error) {
            console.error('Error en Mascota.create:', error);
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Entrada duplicada');
            }
            throw new Error('Error al crear mascota');
        }
    }

    static async update(id, data) {
        try {
            const { propietario, nombre, raza, edad } = data;

            const query = 'UPDATE mascota SET Propietario = ?, Nombre = ?, Raza = ?, Edad = ? WHERE idMascota = ?';
            const params = [propietario, nombre, raza, edad, id];

            const [result] = await pool.execute(query, params);
            if (result.affectedRows === 0) return null;

            const updated = await this.findById(id);
            return updated;
        } catch (error) {
            console.error('Error en Mascota.update:', error);
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Entrada duplicada');
            }
            throw new Error('Error al actualizar mascota');
        }
    }

    static async delete(id) {
        try {
            const [result] = await pool.execute('DELETE FROM mascota WHERE idMascota = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error en Mascota.delete:', error);
            throw new Error('Error al eliminar mascota');
        }
    }

    static async searchByName(term) {
        try {
            const [rows] = await pool.execute(
                'SELECT idMascota as id, Propietario as propietario, Nombre as nombre, Raza as raza, Edad as edad FROM mascota WHERE Nombre LIKE ? OR Raza LIKE ? ORDER BY Nombre',
                [`%${term}%`, `%${term}%`]
            );
            return rows;
        } catch (error) {
            console.error('Error en Mascota.searchByName:', error);
            throw new Error('Error al buscar mascotas por nombre');
        }
    }

    static async count() {
        try {
            const [rows] = await pool.execute('SELECT COUNT(*) as total FROM mascota');
            return rows[0].total;
        } catch (error) {
            console.error('Error en Mascota.count:', error);
            throw new Error('Error al contar mascotas');
        }
    }

    static async paginate(page = 1, limit = 10) {
        try {
            let pageInt = parseInt(page) || 1;
            let limitInt = parseInt(limit) || 10;
            if (pageInt < 1) pageInt = 1;
            if (limitInt < 1) limitInt = 10;
            if (limitInt > 100) limitInt = 100;

            const offset = (pageInt - 1) * limitInt;

            const [rows] = await pool.execute(
                `SELECT idMascota as id, Propietario as propietario, Nombre as nombre, Raza as raza, Edad as edad FROM mascota ORDER BY Nombre LIMIT ${limitInt} OFFSET ${offset}`
            );

            const total = await this.count();
            const totalPages = Math.ceil(total / limitInt);

            return {
                mascotas: rows,
                pagination: {
                    currentPage: pageInt,
                    totalPages,
                    totalMascotas: total,
                    hasNextPage: pageInt < totalPages,
                    hasPrevPage: pageInt > 1,
                    limit: limitInt
                }
            };
        } catch (error) {
            console.error('Error en Mascota.paginate:', error);
            throw new Error('Error al paginar mascotas');
        }
    }
}

module.exports = Mascota;
