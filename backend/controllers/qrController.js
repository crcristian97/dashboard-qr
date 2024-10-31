// backend/controllers/qrController.js
import Guest from '../models/Guest.js';
import fetch from 'node-fetch';

export const createGuest = async (req, res) => {
    const { name, email } = req.body;

    try {
        const guestData = `${name}-${Date.now()}`;

        const guest = new Guest({ name, email });
        await guest.save();

        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(guestData)}`;

        guest.qrCode = qrCodeUrl;
        await guest.save();

        console.log("QR Code URL:", qrCodeUrl); // <-- Añadir este log
        res.json({ message: "Invitado creado", guest });
    } catch (err) {
        res.status(500).json({ message: "Error al crear invitado", error: err.message });
    }
};

export const scanQR = async (req, res) => {
    const { qrCode } = req.body;

    try {
        // Buscar invitado por el código QR
        const guest = await Guest.findOne({ qrCode });

        if (!guest) {
            return res.status(404).json({ message: "QR inválido" });
        }

        if (guest.hasEntered) {
            return res.json({ message: "QR ya usado" });
        }

        // Marcar el QR como usado
        guest.hasEntered = true;
        await guest.save();

        res.json({ message: "Acceso permitido", guest });
    } catch (err) {
        res.status(500).json({ message: "Error al validar QR", error: err.message });
    }
};

export const getGuests = async (req, res) => {
    try {
        const guests = await Guest.find({});
        res.status(200).json(guests);
    } catch (error) {
        console.error('Error al obtener invitados:', error);
        res.status(500).json({ message: 'Error al obtener la lista de invitados' });
    }
};


export const verifyGuest = async (req, res) => {
    try {
        const { guestId, qrData } = req.body;

        // Find the guest by the scanned QR data (which should be the guest ID)
        const guest = await Guest.findById(qrData);

        if (!guest) {
            return res.status(404).json({ 
                success: false, 
                message: 'Invitado no encontrado' 
            });
        }

        // Verify this is the guest we're trying to check in
        if (guest._id.toString() !== guestId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Código QR no coincide con el invitado' 
            });
        }

        guest.hasEntered = true;
        await guest.save();

        return res.status(200).json({ 
            success: true, 
            message: 'Invitado verificado exitosamente',
            guest 
        });

    } catch (error) {
        console.error('Error al verificar invitado:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Error al verificar invitado' 
        });
    }
};