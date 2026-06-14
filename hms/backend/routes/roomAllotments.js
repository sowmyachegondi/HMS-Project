import express from 'express';
import pool from '../db.js';
import { authAdmin } from '../middleware/auth.js';
import { getPaginationParams, paginatedResponse } from '../utils/pagination.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const { page, limit, offset } = getPaginationParams(req);
    let where = '';
    const params = [];
    if (search) {
      where = ' WHERE ra.room_number LIKE ? OR ra.regd_no LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }
    const [countRes] = await pool.query(`SELECT COUNT(*) as c FROM room_allotments ra${where}`, params);
    const total = countRes[0].c;
    const [rows] = await pool.query(
      `SELECT ra.*, s.branch, s.year, s.photo_base64 FROM room_allotments ra LEFT JOIN students s ON s.regd_no = ra.regd_no${where} ORDER BY ra.room_number, ra.bed_number LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    res.json(paginatedResponse(rows, total, page, limit));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/room/:room_number', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT ra.*, s.branch, s.year FROM room_allotments ra LEFT JOIN students s ON s.regd_no = ra.regd_no WHERE ra.room_number = ?',
      [req.params.room_number]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', authAdmin, async (req, res) => {
  try {
    const { room_number, regd_no, student_name, bed_number } = req.body;
    await pool.query(
      'INSERT INTO room_allotments (room_number, regd_no, student_name, bed_number) VALUES (?,?,?,?)',
      [room_number, regd_no, student_name || '', bed_number || '1']
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/:id', authAdmin, async (req, res) => {
  try {
    const { room_number, regd_no, student_name, bed_number } = req.body;
    await pool.query(
      'UPDATE room_allotments SET room_number=?, regd_no=?, student_name=?, bed_number=? WHERE id=?',
      [room_number, regd_no, student_name, bed_number, req.params.id]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:id', authAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM room_allotments WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
