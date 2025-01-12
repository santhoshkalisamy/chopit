import db from './mongoose';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace NodeJS {
        interface Global {
            mongoose: typeof db | undefined;
        }
    }
}

export async function init() {
    const globalWithMongoose = global as typeof globalThis & { mongoose?: typeof db };

    if (globalWithMongoose.mongoose) {
        return;
    }

    await db.dbConnect();
    globalWithMongoose.mongoose = db;
}
