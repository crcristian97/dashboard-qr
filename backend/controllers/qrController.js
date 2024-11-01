// backend/controllers/qrController.js
import Guest from '../models/Guest.js';
import QRCode from 'qrcode';

export const createGuest = async (req, res) => {
    console.log('=== Starting Guest Creation ===');
    console.log('Request body:', req.body);

    const { name, email } = req.body;

    try {
        // Create initial guest
        const guest = new Guest({ name, email });
        console.log('Guest object created:', guest);

        // Save guest first time
        const savedGuest = await guest.save();
        console.log('Guest saved initially:', savedGuest);

        // Generate QR code
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(savedGuest._id.toString())}`;
        console.log('Generated QR URL:', qrCodeUrl);

        // Update guest with QR code
        savedGuest.qrCode = qrCodeUrl;
        const finalGuest = await savedGuest.save();
        console.log('Guest saved with QR:', finalGuest);

        res.json({ 
            message: "Invitado creado exitosamente", 
            guest: finalGuest 
        });
    } catch (err) {
        console.error('Error creating guest:', err);
        res.status(500).json({ 
            message: "Error al crear invitado", 
            error: err.message 
        });
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

export const getGuestQR = async (req, res) => {
    try {
        const { guestId } = req.params;
        console.log('Starting QR generation for guestId:', guestId);

        const guest = await Guest.findById(guestId);
        if (!guest) {
            return res.status(404).json({ message: 'Invitado no encontrado' });
        }

        // Create verification URL
        const verificationUrl = `${process.env.FRONTEND_URL}/verify/${guestId}`;
        console.log('Generated verification URL:', verificationUrl);

        // Generate QR code with the verification URL
        const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl);
        
        // Update guest with QR code
        guest.qrCode = qrCodeDataUrl;
        await guest.save();

        return res.json({ qrCode: qrCodeDataUrl });

    } catch (error) {
        console.error('QR generation error:', error);
        return res.status(500).json({ 
            message: 'Error al generar código QR', 
            error: error.message 
        });
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
        const { guestId } = req.params;
        console.log('Verifying guest:', guestId);

        const guest = await Guest.findById(guestId);
        
        if (!guest) {
            console.log('Guest not found:', guestId);
            return res.status(404).json({ 
                success: false, 
                message: 'Invitado no encontrado' 
            });
        }

        if (guest.hasEntered) {
            console.log('Guest already entered:', guestId);
            return res.status(400).json({ 
                success: false, 
                message: 'El invitado ya ha ingresado' 
            });
        }

        // Mark guest as entered
        guest.hasEntered = true;
        guest.enteredAt = new Date();
        await guest.save();

        console.log('Guest verified successfully:', guestId);
        return res.json({ 
            success: true, 
            message: 'Invitado verificado exitosamente',
            guest: {
                name: guest.name,
                email: guest.email,
                enteredAt: guest.enteredAt
            }
        });

    } catch (error) {
        console.error('Verification error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Error al verificar invitado',
            error: error.message 
        });
    }
};
