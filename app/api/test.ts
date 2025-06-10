import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db(); // gets default database from URI
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    res.status(200).json({ collections: collectionNames });
  } catch (error) {
    console.error('Connection error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
