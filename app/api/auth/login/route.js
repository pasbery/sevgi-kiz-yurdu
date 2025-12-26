import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const MAX_ATTEMPTS = 3;
const BAN_DURATION = 10 * 60 * 1000; // 10 dakika (ms)

function getClientIP(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0]?.trim() || realIP || 'unknown';
}

async function getLoginAttempt(ip) {
  try {
    return await prisma.loginAttempt.findUnique({ where: { ip } });
  } catch {
    return null; // Tablo yoksa null dön
  }
}

async function isIPBanned(ip) {
  try {
    const record = await getLoginAttempt(ip);
    if (!record || !record.bannedUntil) return false;
    
    // Ban süresi dolmuş mu kontrol et
    if (new Date() > record.bannedUntil) {
      // Ban süresi dolmuş, kaydı sıfırla
      await prisma.loginAttempt.update({
        where: { ip },
        data: { attempts: 0, bannedUntil: null }
      });
      return false;
    }
    
    return true;
  } catch {
    return false; // Hata durumunda ban yok say
  }
}

async function getRemainingBanTime(ip) {
  const record = await getLoginAttempt(ip);
  if (!record || !record.bannedUntil) return 0;
  const remaining = Math.ceil((record.bannedUntil.getTime() - Date.now()) / 1000 / 60);
  return Math.max(0, remaining);
}

async function recordFailedAttempt(ip) {
  try {
    const record = await getLoginAttempt(ip);
    const newAttempts = (record?.attempts || 0) + 1;
    
    const data = {
      attempts: newAttempts,
      lastAttempt: new Date(),
      bannedUntil: newAttempts >= MAX_ATTEMPTS ? new Date(Date.now() + BAN_DURATION) : null
    };
    
    await prisma.loginAttempt.upsert({
      where: { ip },
      update: data,
      create: { ip, ...data }
    });
    
    return { banned: newAttempts >= MAX_ATTEMPTS, attempts: newAttempts };
  } catch {
    // Tablo yoksa IP banning devre dışı, sadece şifre kontrolü yap
    return { banned: false, attempts: 0 };
  }
}

async function clearAttempts(ip) {
  try {
    await prisma.loginAttempt.delete({ where: { ip } });
  } catch {
    // Kayıt yoksa veya tablo yoksa hata verme
  }
}

export async function POST(request) {
  try {
    const ip = getClientIP(request);
    
    // IP banlı mı kontrol et
    if (await isIPBanned(ip)) {
      const remainingMinutes = await getRemainingBanTime(ip);
      return NextResponse.json({ 
        success: false, 
        banned: true,
        message: `Çok fazla hatalı giriş! ${remainingMinutes} dakika sonra tekrar deneyin.`
      }, { status: 429 });
    }
    
    const { password } = await request.json();
    
    // Şifreyi environment variable'dan al veya varsayılan kullan
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (password === adminPassword) {
      // Başarılı giriş - denemeleri temizle
      await clearAttempts(ip);
      
      // Basit bir token oluştur (production'da JWT kullanılmalı)
      const token = Buffer.from(`admin:${Date.now()}`).toString('base64');
      
      return NextResponse.json({ 
        success: true, 
        token,
        message: 'Giriş başarılı!' 
      });
    }
    
    // Başarısız giriş - denemeyi kaydet
    const result = await recordFailedAttempt(ip);
    const remainingAttempts = MAX_ATTEMPTS - result.attempts;
    
    if (result.banned) {
      return NextResponse.json({ 
        success: false,
        banned: true,
        message: `Çok fazla hatalı giriş! 10 dakika sonra tekrar deneyin.`
      }, { status: 429 });
    }
    
    // Tablo yoksa sadece "Yanlış şifre" göster
    const message = result.attempts > 0 
      ? `Yanlış şifre! ${remainingAttempts} deneme hakkınız kaldı.`
      : 'Yanlış şifre!';
    
    return NextResponse.json({ 
      success: false, 
      message
    }, { status: 401 });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Bir hata oluştu.' 
    }, { status: 500 });
  }
}
