import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prismaClientSingleton = () => {
  if (process.env.NODE_ENV === 'production') {
    // Try multiple locations for the db file
    const possiblePaths = [
      path.join(process.cwd(), 'prisma', 'dev.db'),
      path.join(process.cwd(), 'dev.db'),
      './prisma/dev.db'
    ];

    let sourceDb = possiblePaths.find(p => fs.existsSync(p));
    
    if (sourceDb) {
      console.log(`Found database at: ${sourceDb}`);
      const tmpDbPath = '/tmp/dev.db';
      try {
        fs.copyFileSync(sourceDb, tmpDbPath);
        console.log(`Database copied to ${tmpDbPath}`);
        return new PrismaClient({
          datasourceUrl: `file:${tmpDbPath}`
        });
      } catch (error) {
        console.error('Failed to copy database to /tmp:', error);
      }
    } else {
        console.error('Could not find database file in any expected location');
        console.error('CWD:', process.cwd());
        console.error('Files in CWD:', fs.readdirSync(process.cwd()));
        if (fs.existsSync(path.join(process.cwd(), 'prisma'))) {
            console.error('Files in prisma dir:', fs.readdirSync(path.join(process.cwd(), 'prisma')));
        }
    }
  }

  return new PrismaClient();
};

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
