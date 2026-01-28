import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import { Resend } from "resend";

const prisma = new PrismaClient();
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

type ErrorCode = "VALIDATION_ERROR" | "DATABASE_ERROR" | "EMAIL_ERROR" | "RATE_LIMIT" | "UNKNOWN_ERROR";

interface ContactResponse {
  success: boolean;
  message: string;
  errorCode?: ErrorCode;
  submissionId?: number;
  fallbackContact?: boolean;
}

function getErrorResponse(code: ErrorCode, details?: string): ContactResponse {
  const messages: Record<ErrorCode, string> = {
    VALIDATION_ERROR: "Please fill in all required fields correctly.",
    DATABASE_ERROR: "We're experiencing technical difficulties. Your message could not be saved, but you can reach us directly at hello@yumeramen.nl or call +31 20 123 4567.",
    EMAIL_ERROR: "Your message was saved, but we couldn't send confirmation emails. We'll still respond within 24 hours.",
    RATE_LIMIT: "Too many requests. Please wait a moment before trying again.",
    UNKNOWN_ERROR: "Something went wrong. Please try again or contact us directly at hello@yumeramen.nl",
  };

  console.error(`[Contact API] ${code}:`, details);
  
  return {
    success: false,
    message: messages[code],
    errorCode: code,
    fallbackContact: code === "DATABASE_ERROR",
  };
}

export async function POST(request: NextRequest) {
  let submissionId: number | undefined;
  let emailsSent = { notification: false, confirmation: false };

  try {
    const body = await request.json();
    const { name, email, phone, inquiryType, subject, message, preferredContact } = body;

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim() || !inquiryType) {
      return NextResponse.json(
        getErrorResponse("VALIDATION_ERROR", "Missing fields"),
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        getErrorResponse("VALIDATION_ERROR", "Invalid email format"),
        { status: 400 }
      );
    }

    try {
      const contactSubmission = await prisma.contactSubmission.create({
        data: {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone?.trim() || null,
          inquiryType,
          subject: subject.trim(),
          message: message.trim(),
          preferredContact: preferredContact || "email",
        },
      });
      submissionId = contactSubmission.id;
    } catch (dbError) {
      if (dbError instanceof Prisma.PrismaClientKnownRequestError) {
        return NextResponse.json(
          getErrorResponse("DATABASE_ERROR", `Prisma error ${dbError.code}: ${dbError.message}`),
          { status: 503 }
        );
      }
      if (dbError instanceof Prisma.PrismaClientInitializationError) {
        return NextResponse.json(
          getErrorResponse("DATABASE_ERROR", `Database connection failed: ${dbError.message}`),
          { status: 503 }
        );
      }
      return NextResponse.json(
        getErrorResponse("DATABASE_ERROR", `Unknown database error: ${dbError}`),
        { status: 503 }
      );
    }

    if (resend && submissionId) {
      try {
        await resend.emails.send({
          from: "Yume Ramen Contact <noreply@yumeramen.nl>",
          to: "hello@yumeramen.nl",
          replyTo: email,
          subject: `New Contact Form: ${inquiryType} - ${subject}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>From:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
            <p><strong>Inquiry Type:</strong> ${inquiryType}</p>
            <p><strong>Preferred Contact:</strong> ${preferredContact}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, "<br>")}</p>
            <hr>
            <p><small>Submission ID: ${submissionId} | Time: ${new Date().toLocaleString()}</small></p>
          `,
        });
        emailsSent.notification = true;
      } catch (notificationError) {
        console.error("[Contact API] Failed to send notification email:", notificationError);
      }

      try {
        await resend.emails.send({
          from: "Yume Ramen <noreply@yumeramen.nl>",
          to: email,
          subject: "We received your message - Yume Ramen",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #D64933;">Thank you for contacting Yume Ramen!</h2>
              <p>Hi ${name},</p>
              <p>We've received your message and will get back to you within 24 hours via ${preferredContact}.</p>
              
              <div style="background: #F5E6D3; padding: 20px; margin: 20px 0;">
                <p><strong>Your message:</strong></p>
                <p style="white-space: pre-wrap;">${message}</p>
              </div>
              
              <p>If you need immediate assistance, feel free to call us at <a href="tel:+31201234567">+31 20 123 4567</a>.</p>
              
              <p>Best regards,<br>The Yume Ramen Team</p>
              
              <hr>
              <p style="font-size: 12px; color: #666;">Reference ID: ${submissionId}</p>
            </div>
          `,
        });
        emailsSent.confirmation = true;
      } catch (confirmationError) {
        console.error("[Contact API] Failed to send confirmation email:", confirmationError);
      }
    }

    const response: ContactResponse = {
      success: true,
      message: "Your message has been received! We'll get back to you within 24 hours.",
      submissionId,
    };

    if (submissionId && (!emailsSent.notification || !emailsSent.confirmation)) {
      response.message = "Your message was saved successfully! We'll respond within 24 hours. (Note: Email confirmation may be delayed)";
    }

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      getErrorResponse("UNKNOWN_ERROR", `Unexpected error: ${error}`),
      { status: 500 }
    );
  } finally {
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error("[Contact API] Failed to disconnect Prisma:", disconnectError);
    }
  }
}
