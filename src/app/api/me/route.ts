import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    data: { 
      id: 1, 
      name: "Admin IPNU", 
      email: "admin@ipnuloteng.or.id", 
      roles: ['Super Admin'] 
    } 
  });
}
