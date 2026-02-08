import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    const dbExists = fs.existsSync(dbPath);
    const dbSize = dbExists ? fs.statSync(dbPath).size : 0;
    
    // Check files in prisma directory
    const prismaDir = path.join(process.cwd(), 'prisma');
    const prismaFiles = fs.existsSync(prismaDir) ? fs.readdirSync(prismaDir) : [];

    let users: { email: string; role: string }[] = [];
    let userCount = 0;
    let error = null;

    try {
      userCount = await prisma.user.count();
      users = await prisma.user.findMany({
        select: { email: true, role: true } // Only select safe fields
      });
    } catch (e: any) {
      error = e.message;
    }

    return NextResponse.json({
      env: {
        DATABASE_URL: process.env.DATABASE_URL ? 'Set (Hidden)' : 'Not Set',
        NODE_ENV: process.env.NODE_ENV,
      },
      fileSystem: {
        cwd: process.cwd(),
        dbPath,
        dbExists,
        dbSize,
        prismaFiles,
      },
      database: {
        connected: !error,
        userCount,
        users,
        error
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
