import createMollieClient from "@mollie/api-client";

const getMollieClient = () => {
  if (!process.env.MOLLIE_API_KEY) {
    console.warn("MOLLIE_API_KEY is not defined - payment processing will be disabled");
    return null;
  }
  return createMollieClient({
    apiKey: process.env.MOLLIE_API_KEY,
  });
};

export const mollieClient = getMollieClient();
