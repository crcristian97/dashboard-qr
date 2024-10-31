import express from 'express';
import { createGuest, scanQR, getGuests, verifyGuest } from '../controllers/qrController.js';

const router = express.Router();

// Rutas para invitados
router.post('/createGuest', createGuest);
router.post('/scanQR', scanQR);
router.get('/getGuests', getGuests);
router.post('/verifyGuest', verifyGuest);

export default router;