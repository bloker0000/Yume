import { Resend } from "resend";

const getResendClient = () => {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not defined - email sending will be disabled");
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
};

export const resend = getResendClient();

export const emailFrom = process.env.EMAIL_FROM || "Yume <noreply@yumeramen.nl>";

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
      
      <div style="background: #f8f8f8; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0; color: #666;"><strong>Order Number:</strong> ${orderNumber}</p>
        <p style="margin: 10px 0 0 0; color: #666;"><strong>Order Type:</strong> ${orderType === "DELIVERY" ? "Delivery" : "Pickup"}</p>
        <p style="margin: 10px 0 0 0; color: #666;"><strong>Estimated Time:</strong> ${estimatedTime}</p>
        ${addressHtml}
      </div>
      
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
        <p>Questions about your order? Contact us at info@yumeramen.nl</p>
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
