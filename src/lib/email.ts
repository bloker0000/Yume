import { Resend } from "resend";

const getResendClient = () => {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not defined - email sending will be disabled");
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
};

export const resend = getResendClient();

export const emailFrom = process.env.EMAIL_FROM || "Yume Ramen <noreply@yumeramen.nl>";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yume-ebon.vercel.app/";

interface OrderEmailItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderConfirmationEmailProps {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: OrderEmailItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  orderType: "DELIVERY" | "PICKUP";
  estimatedTime: string;
  address?: string;
  orderId?: string;
}

export async function sendOrderConfirmationEmail(props: OrderConfirmationEmailProps) {
  const {
    orderNumber,
    customerName,
    customerEmail,
    items,
    subtotal,
    deliveryFee,
    discount,
    total,
    orderType,
    estimatedTime,
    address,
    orderId,
  } = props;

  const itemsHtml = items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${item.quantity}x ${item.name}</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right;">EUR ${item.price.toFixed(2)}</td>
        </tr>`
    )
    .join("");

  const deliveryFeeHtml =
    deliveryFee > 0
      ? `<tr>
          <td style="padding: 10px 0; color: #666;">Delivery Fee</td>
          <td style="padding: 10px 0; text-align: right; color: #666;">EUR ${deliveryFee.toFixed(2)}</td>
        </tr>`
      : "";

  const discountHtml =
    discount > 0
      ? `<tr>
          <td style="padding: 10px 0; color: #22c55e;">Discount</td>
          <td style="padding: 10px 0; text-align: right; color: #22c55e;">-EUR ${discount.toFixed(2)}</td>
        </tr>`
      : "";

  const addressHtml = address
    ? `<p style="margin: 10px 0 0 0; color: #666;"><strong>Delivery Address:</strong> ${address}</p>`
    : "";

  const trackingUrl = orderId ? `${siteUrl}/track/${orderNumber}` : "";
  const trackingButtonHtml = trackingUrl
    ? `<div style="text-align: center; margin: 30px 0;">
        <a href="${trackingUrl}" style="display: inline-block; background: #D64933; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold;">Track Your Order</a>
      </div>`
    : "";

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
      <h1 style="color: #D4AF37; margin: 0; font-size: 28px;">YUME</h1>
      <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px;">Authentic Japanese Ramen</p>
    </div>
    
    <div style="background: #ffffff; padding: 30px; border-radius: 0 0 12px 12px;">
      <h2 style="color: #1a1a2e; margin: 0 0 20px 0;">Thank you for your order, ${customerName}!</h2>
      
      <div style="background: #22c55e; color: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
        <p style="margin: 0; font-weight: bold; font-size: 16px;">✓ Payment Confirmed</p>
        <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Your order has been received and is being processed</p>
      </div>
      
      <div style="background: #f8f8f8; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0; color: #666;"><strong>Order Number:</strong> ${orderNumber}</p>
        <p style="margin: 10px 0 0 0; color: #666;"><strong>Order Type:</strong> ${orderType === "DELIVERY" ? "Delivery" : "Pickup"}</p>
        <p style="margin: 10px 0 0 0; color: #666;"><strong>Estimated Time:</strong> ${estimatedTime}</p>
        ${addressHtml}
      </div>
      
      ${trackingButtonHtml}
      
      <h3 style="color: #1a1a2e; margin: 0 0 15px 0;">Order Summary</h3>
      <table style="width: 100%; border-collapse: collapse;">
        ${itemsHtml}
        <tr>
          <td style="padding: 10px 0; color: #666;">Subtotal</td>
          <td style="padding: 10px 0; text-align: right; color: #666;">EUR ${subtotal.toFixed(2)}</td>
        </tr>
        ${deliveryFeeHtml}
        ${discountHtml}
        <tr>
          <td style="padding: 15px 0; font-weight: bold; font-size: 18px; border-top: 2px solid #1a1a2e;">Total</td>
          <td style="padding: 15px 0; font-weight: bold; font-size: 18px; text-align: right; border-top: 2px solid #1a1a2e; color: #D4AF37;">EUR ${total.toFixed(2)}</td>
        </tr>
      </table>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px;">
        <p>Questions about your order? Contact us at info@yumeramen.nl</p>
        <p>Yume Ramen. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>`;

  if (!resend) {
    console.warn(`Email sending disabled - Order confirmation for ${orderNumber} not sent`);
    return { data: null, error: null };
  }

  return resend.emails.send({
    from: emailFrom,
    to: customerEmail,
    subject: `Order Confirmed - ${orderNumber}`,
    html,
  });
}

interface OrderStatusUpdateEmailProps {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: string;
  message: string;
}

export async function sendOrderStatusUpdateEmail(props: OrderStatusUpdateEmailProps) {
  const { orderNumber, customerName, customerEmail, status, message } = props;

  const statusColors: Record<string, string> = {
    CONFIRMED: "#3b82f6",
    PREPARING: "#f59e0b",
    READY: "#22c55e",
    OUT_FOR_DELIVERY: "#8b5cf6",
    DELIVERED: "#22c55e",
    COMPLETED: "#22c55e",
    CANCELLED: "#ef4444",
  };

  const statusColor = statusColors[status] || "#666666";

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
      <h1 style="color: #D4AF37; margin: 0; font-size: 28px;">YUME</h1>
      <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px;">Order Update</p>
    </div>
    
    <div style="background: #ffffff; padding: 30px; border-radius: 0 0 12px 12px;">
      <h2 style="color: #1a1a2e; margin: 0 0 20px 0;">Hi ${customerName},</h2>
      
      <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
        <p style="margin: 0 0 10px 0; color: #666;">Order <strong>${orderNumber}</strong></p>
        <div style="display: inline-block; padding: 8px 20px; background-color: ${statusColor}; color: white; border-radius: 20px; font-weight: bold;">
          ${status.replace(/_/g, " ")}
        </div>
      </div>
      
      <p style="color: #333; line-height: 1.6;">${message}</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px;">
        <p>Questions about your order? Contact us at bingbingchingcong@gmail.com</p>
        <p>Yume Ramen. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>`;

  if (!resend) {
    console.warn(`Email sending disabled - Status update for ${orderNumber} not sent`);
    return { data: null, error: null };
  }

  return resend.emails.send({
    from: emailFrom,
    to: customerEmail,
    subject: `Order ${orderNumber} - ${status.replace(/_/g, " ")}`,
    html,
  });
}

interface ContactConfirmationEmailProps {
  name: string;
  email: string;
  subject: string;
  message: string;
  preferredContact: string;
  submissionId: number;
}

export async function sendContactConfirmationEmail(props: ContactConfirmationEmailProps) {
  const { name, email, subject, message, preferredContact, submissionId } = props;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
      <h1 style="color: #D4AF37; margin: 0; font-size: 28px;">YUME</h1>
      <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px;">We Got Your Message</p>
    </div>
    
    <div style="background: #ffffff; padding: 30px; border-radius: 0 0 12px 12px;">
      <h2 style="color: #1a1a2e; margin: 0 0 20px 0;">Thank you for contacting us, ${name}!</h2>
      
      <p style="color: #333; line-height: 1.6;">We've received your message and will get back to you within 24 hours via ${preferredContact}.</p>
      
      <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0 0 10px 0; color: #666;"><strong>Subject:</strong> ${subject}</p>
        <p style="margin: 0; color: #666;"><strong>Your message:</strong></p>
        <p style="margin: 10px 0 0 0; color: #333; white-space: pre-wrap;">${message}</p>
      </div>
      
      <p style="color: #333; line-height: 1.6;">If you need immediate assistance, feel free to call us at <a href="tel:+31201234567" style="color: #D64933;">+31 20 123 4567</a>.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px;">
        <p>Reference ID: ${submissionId}</p>
        <p>Yume Ramen - Authentic Japanese Ramen</p>
      </div>
    </div>
  </div>
</body>
</html>`;

  if (!resend) {
    console.warn(`Email sending disabled - Contact confirmation for ${email} not sent`);
    return { data: null, error: null };
  }

  return resend.emails.send({
    from: emailFrom,
    to: email,
    subject: "We received your message - Yume Ramen",
    html,
  });
}

interface ContactNotificationEmailProps {
  name: string;
  email: string;
  phone?: string;
  inquiryType: string;
  subject: string;
  message: string;
  preferredContact: string;
  submissionId: number;
}

export async function sendContactNotificationEmail(props: ContactNotificationEmailProps) {
  const { name, email, phone, inquiryType, subject, message, preferredContact, submissionId } = props;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: Arial, sans-serif; padding: 20px;">
  <h2 style="color: #D64933;">New Contact Form Submission</h2>
  <table style="width: 100%; border-collapse: collapse;">
    <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>From:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${name}</td></tr>
    <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td></tr>
    ${phone ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="tel:${phone}">${phone}</a></td></tr>` : ""}
    <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Inquiry Type:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${inquiryType}</td></tr>
    <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Preferred Contact:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${preferredContact}</td></tr>
    <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Subject:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${subject}</td></tr>
  </table>
  <div style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 8px;">
    <strong>Message:</strong>
    <p style="white-space: pre-wrap;">${message}</p>
  </div>
  <hr style="margin-top: 20px;">
  <p style="font-size: 12px; color: #666;">Submission ID: ${submissionId} | Time: ${new Date().toLocaleString()}</p>
</body>
</html>`;

  if (!resend) {
    console.warn(`Email sending disabled - Contact notification not sent`);
    return { data: null, error: null };
  }

  return resend.emails.send({
    from: "Yume Ramen Contact <noreply@yumeramen.nl>",
    to: "bingbingchingcong@gmail.com",
    replyTo: email,
    subject: `New Contact Form: ${inquiryType} - ${subject}`,
    html,
  });
}

interface OrderOnItsWayEmailProps {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  driverName?: string;
  estimatedMinutes: number;
  trackingUrl: string;
}

export async function sendOrderOnItsWayEmail(props: OrderOnItsWayEmailProps) {
  const { orderNumber, customerName, customerEmail, driverName, estimatedMinutes, trackingUrl } = props;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
      <h1 style="color: #D4AF37; margin: 0; font-size: 28px;">YUME</h1>
      <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px;">Your Order Is On Its Way!</p>
    </div>
    
    <div style="background: #ffffff; padding: 30px; border-radius: 0 0 12px 12px;">
      <h2 style="color: #1a1a2e; margin: 0 0 20px 0;">Great news, ${customerName}!</h2>
      
      <div style="background: #8b5cf6; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
        <p style="margin: 0; font-size: 24px; font-weight: bold;">Your ramen is on the way!</p>
        ${driverName ? `<p style="margin: 10px 0 0 0; opacity: 0.9;">${driverName} is heading to you</p>` : ""}
      </div>
      
      <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
        <p style="margin: 0; color: #666;">Order <strong>${orderNumber}</strong></p>
        <p style="margin: 10px 0 0 0; color: #333; font-size: 18px;">
          Estimated arrival: <strong style="color: #D64933;">${estimatedMinutes} minutes</strong>
        </p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${trackingUrl}" style="display: inline-block; background: #D64933; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold;">Track Your Order</a>
      </div>
      
      <p style="color: #666; font-size: 14px; text-align: center;">Tip: Have your phone nearby - the driver may call when they arrive!</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px;">
        <p>Questions? Contact us at bingbingchingcong@gmail.com</p>
        <p>Yume Ramen. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>`;

  if (!resend) {
    console.warn(`Email sending disabled - Order on its way notification for ${orderNumber} not sent`);
    return { data: null, error: null };
  }

  return resend.emails.send({
    from: emailFrom,
    to: customerEmail,
    subject: `Your ramen is on the way! - ${orderNumber}`,
    html,
  });
}

interface FeedbackRequestEmailProps {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  orderId: string;
}

export async function sendFeedbackRequestEmail(props: FeedbackRequestEmailProps) {
  const { orderNumber, customerName, customerEmail, orderId } = props;
  
  const feedbackUrl = `${siteUrl}/feedback/${orderId}`;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
      <h1 style="color: #D4AF37; margin: 0; font-size: 28px;">YUME</h1>
      <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px;">How Was Your Meal?</p>
    </div>
    
    <div style="background: #ffffff; padding: 30px; border-radius: 0 0 12px 12px;">
      <h2 style="color: #1a1a2e; margin: 0 0 20px 0;">Hope you enjoyed it, ${customerName}!</h2>
      
      <p style="color: #333; line-height: 1.6;">We'd love to hear about your experience with order <strong>${orderNumber}</strong>. Your feedback helps us keep making delicious ramen!</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <p style="margin-bottom: 15px; color: #666;">How would you rate your experience?</p>
        <div style="display: inline-block;">
          <a href="${feedbackUrl}?rating=5" style="text-decoration: none; font-size: 28px; margin: 0 5px;">⭐</a>
          <a href="${feedbackUrl}?rating=5" style="text-decoration: none; font-size: 28px; margin: 0 5px;">⭐</a>
          <a href="${feedbackUrl}?rating=5" style="text-decoration: none; font-size: 28px; margin: 0 5px;">⭐</a>
          <a href="${feedbackUrl}?rating=5" style="text-decoration: none; font-size: 28px; margin: 0 5px;">⭐</a>
          <a href="${feedbackUrl}?rating=5" style="text-decoration: none; font-size: 28px; margin: 0 5px;">⭐</a>
        </div>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${feedbackUrl}" style="display: inline-block; background: #D64933; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold;">Leave Feedback</a>
      </div>
      
      <div style="background: #FEF3C7; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <p style="margin: 0; color: #92400E;">Leave a review and get <strong>10% off</strong> your next order!</p>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px;">
        <p>Thank you for choosing Yume Ramen!</p>
        <p>Yume Ramen. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>`;

  if (!resend) {
    console.warn(`Email sending disabled - Feedback request for ${orderNumber} not sent`);
    return { data: null, error: null };
  }

  return resend.emails.send({
    from: emailFrom,
    to: customerEmail,
    subject: `How was your ramen? - ${orderNumber}`,
    html,
  });
}

interface AbandonedCartEmailProps {
  customerEmail: string;
  customerName?: string;
  items: OrderEmailItem[];
  subtotal: number;
  cartUrl: string;
}

export async function sendAbandonedCartEmail(props: AbandonedCartEmailProps) {
  const { customerEmail, customerName, items, subtotal, cartUrl } = props;
  
  const greeting = customerName ? `Hi ${customerName}` : "Hi there";
  
  const itemsHtml = items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${item.quantity}x ${item.name}</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right;">EUR ${item.price.toFixed(2)}</td>
        </tr>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
      <h1 style="color: #D4AF37; margin: 0; font-size: 28px;">YUME</h1>
      <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px;">You Left Something Behind...</p>
    </div>
    
    <div style="background: #ffffff; padding: 30px; border-radius: 0 0 12px 12px;">
      <h2 style="color: #1a1a2e; margin: 0 0 20px 0;">${greeting}, your ramen is waiting!</h2>
      
      <p style="color: #333; line-height: 1.6;">Looks like you didn't finish your order. Don't worry, we saved your cart for you!</p>
      
      <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 15px 0; color: #1a1a2e;">Your Cart</h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${itemsHtml}
          <tr>
            <td style="padding: 15px 0; font-weight: bold; border-top: 2px solid #1a1a2e;">Subtotal</td>
            <td style="padding: 15px 0; font-weight: bold; text-align: right; border-top: 2px solid #1a1a2e; color: #D4AF37;">EUR ${subtotal.toFixed(2)}</td>
          </tr>
        </table>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${cartUrl}" style="display: inline-block; background: #D64933; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold;">Complete Your Order</a>
      </div>
      
      <div style="background: #FEF3C7; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <p style="margin: 0; color: #92400E;">Use code <strong>COMEBACK10</strong> for 10% off!</p>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px;">
        <p>Craving ramen? We're here for you!</p>
        <p>Yume Ramen. All rights reserved.</p>
        <p style="margin-top: 10px; font-size: 11px;">
          <a href="${siteUrl}/unsubscribe?email=${encodeURIComponent(customerEmail)}" style="color: #999;">Unsubscribe from cart reminders</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;

  if (!resend) {
    console.warn(`Email sending disabled - Abandoned cart email not sent`);
    return { data: null, error: null };
  }

  return resend.emails.send({
    from: emailFrom,
    to: customerEmail,
    subject: "Your ramen is getting cold! Complete your order",
    html,
  });
}

interface OrderReadyForPickupEmailProps {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  pickupAddress: string;
}

export async function sendOrderReadyForPickupEmail(props: OrderReadyForPickupEmailProps) {
  const { orderNumber, customerName, customerEmail, pickupAddress } = props;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
      <h1 style="color: #D4AF37; margin: 0; font-size: 28px;">YUME</h1>
      <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px;">Your Order Is Ready!</p>
    </div>
    
    <div style="background: #ffffff; padding: 30px; border-radius: 0 0 12px 12px;">
      <h2 style="color: #1a1a2e; margin: 0 0 20px 0;">Time to pick up, ${customerName}!</h2>
      
      <div style="background: #22c55e; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
        <p style="margin: 0; font-size: 24px; font-weight: bold;">Your ramen is ready!</p>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Order ${orderNumber}</p>
      </div>
      
      <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0 0 10px 0; color: #666;"><strong>Pickup Location:</strong></p>
        <p style="margin: 0; color: #333; font-size: 16px;">${pickupAddress}</p>
      </div>
      
      <p style="color: #666; font-size: 14px; text-align: center;">Please pick up your order within 30 minutes for the best taste experience!</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px;">
        <p>Questions? Call us at +31 20 123 4567</p>
        <p>Yume Ramen. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>`;

  if (!resend) {
    console.warn(`Email sending disabled - Order ready notification for ${orderNumber} not sent`);
    return { data: null, error: null };
  }

  return resend.emails.send({
    from: emailFrom,
    to: customerEmail,
    subject: `Your order is ready for pickup! - ${orderNumber}`,
    html,
  });
}
