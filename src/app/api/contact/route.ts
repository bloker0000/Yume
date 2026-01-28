import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import { sendContactConfirmationEmail, sendContactNotificationEmail } from "@/lib/email";

const prisma = new PrismaClient();

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

    if (submissionId) {
      try {
        await sendContactNotificationEmail({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone?.trim(),
          inquiryType,
          subject: subject.trim(),
          message: message.trim(),
          preferredContact: preferredContact || "email",
          submissionId,
        });
        emailsSent.notification = true;
      } catch (notificationError) {
        console.error("[Contact API] Failed to send notification email:", notificationError);
      }

      try {
        await sendContactConfirmationEmail({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          subject: subject.trim(),
          message: message.trim(),
          preferredContact: preferredContact || "email",
          submissionId,
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
