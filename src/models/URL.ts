import mongoose, { Document } from 'mongoose';

export interface Url extends Document {
    url: string;
    shortUrl: string;
    urlCode: string;
    createdAt: Date;
    clicks: number;
}

const URLSchema = new mongoose.Schema({
    url: { type: String, required: true },
    shortUrl: { type: String, required: true },
    urlCode: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    clicks: { type: Number, default: 0 },
});

export default mongoose.models.Url || mongoose.model<Url>('Url', URLSchema);
