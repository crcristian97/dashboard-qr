// backend/models/Guest.js
import mongoose from 'mongoose';

const guestSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    qrCode: { 
        type: String 
    },
    hasEntered: { 
        type: Boolean, 
        default: false 
    }
}, {
    timestamps: true
});

export default mongoose.model('Guest', guestSchema);
