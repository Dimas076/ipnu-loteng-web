import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ 
    status: 'success', 
    data: { 
      access_token: 'dummy_token_123', 
      user: { id: 1, name: "Admin IPNU", email: "admin@ipnuloteng.or.id", roles: ['Super Admin'] } 
    } 
  });
}
