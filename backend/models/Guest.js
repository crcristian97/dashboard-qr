// backend/models/Guest.js
import mongoose from 'mongoose';

const guestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    qrData: { type: String },
    hasEntered: { type: Boolean, default: false }
});

export default mongoose.model('Guest', guestSchema);
