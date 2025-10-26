import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      );
    }

    // Create transporter using your Exahost email
    const transporter = nodemailer.createTransport({
      host: 'mail.itspopcast.com', // Your mail server
      port: 465, // SSL port
      secure: true, // Use SSL
      auth: {
        user: process.env.EMAIL_USER, // contact@itspopcast.com
        pass: process.env.EMAIL_PASSWORD, // Your email password
      },
    });

    // Email content
    const emailContent = `
      <div style="direction: rtl; text-align: right; font-family: Arial, sans-serif;">
        <h2>رسالة جديدة من نموذج التواصل</h2>
        <hr style="border: 1px solid #ddd; margin: 20px 0;">
        
        <p><strong>الاسم:</strong> ${name}</p>
        <p><strong>البريد الإلكتروني:</strong> ${email}</p>
        <p><strong>الموضوع:</strong> ${subject}</p>
        
        <hr style="border: 1px solid #ddd; margin: 20px 0;">
        
        <h3>الرسالة:</h3>
        <p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
          ${message.replace(/\n/g, '<br>')}
        </p>
        
        <hr style="border: 1px solid #ddd; margin: 20px 0;">
        
        <p style="font-size: 12px; color: #666;">
          تم الإرسال من موقع PopCast في ${new Date().toLocaleString('ar-SA')}
        </p>
      </div>
    `;

    // Send email to both addresses
    await transporter.sendMail({
      from: `"PopCast Contact Form" <${process.env.EMAIL_USER}>`,
      to: 'info@itspopcast.com, contact@itspopcast.com', // Both emails
      replyTo: email, // User's email for easy reply
      subject: `رسالة جديدة: ${subject}`,
      html: emailContent,
    });

    // Optional: Send confirmation email to the user
    await transporter.sendMail({
      from: `"PopCast" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'شكراً لتواصلك معنا - PopCast',
      html: `
        <div style="direction: rtl; text-align: right; font-family: Arial, sans-serif;">
          <h2>شكراً لتواصلك معنا!</h2>
          <p>عزيزي/عزيزتي ${name}،</p>
          <p>تم استلام رسالتك بنجاح. سنقوم بالرد عليك في أقرب وقت ممكن.</p>
          <hr style="border: 1px solid #ddd; margin: 20px 0;">
          <p><strong>تفاصيل رسالتك:</strong></p>
          <p><strong>الموضوع:</strong> ${subject}</p>
          <p><strong>الرسالة:</strong></p>
          <p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
            ${message.replace(/\n/g, '<br>')}
          </p>
          <hr style="border: 1px solid #ddd; margin: 20px 0;">
          <p>مع تحيات فريق PopCast</p>
        </div>
      `,
    });

    return NextResponse.json(
      { message: 'تم إرسال الرسالة بنجاح' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إرسال الرسالة' },
      { status: 500 }
    );
  }
}