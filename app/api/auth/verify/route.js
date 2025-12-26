import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json({ valid: false });
    }
    
    // Token'ı decode et ve kontrol et
    try {
      const decoded = Buffer.from(token, 'base64').toString();
      const [user, timestamp] = decoded.split(':');
      
      // Token 24 saat geçerli
      const tokenAge = Date.now() - parseInt(timestamp);
      const maxAge = 24 * 60 * 60 * 1000; // 24 saat
      
      if (user === 'admin' && tokenAge < maxAge) {
        return NextResponse.json({ valid: true });
      }
    } catch {
      return NextResponse.json({ valid: false });
    }
    
    return NextResponse.json({ valid: false });
    
  } catch (error) {
    return NextResponse.json({ valid: false });
  }
}
