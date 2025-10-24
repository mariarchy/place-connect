import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    const publicDir = join(process.cwd(), 'public');
    const communitiesDir = join(publicDir, 'communities');
    const testImagePath = join(communitiesDir, 'five-points-project-1.png');
    
    const diagnostics = {
      cwd: process.cwd(),
      publicDirExists: existsSync(publicDir),
      communitiesDirExists: existsSync(communitiesDir),
      testImageExists: existsSync(testImagePath),
      nodeEnv: process.env.NODE_ENV,
      files: existsSync(communitiesDir) ? require('fs').readdirSync(communitiesDir) : [],
    };
    
    return NextResponse.json(diagnostics);
  } catch (error) {
    return NextResponse.json({ 
      error: String(error),
      message: 'Failed to check image paths'
    }, { status: 500 });
  }
}

