/**
 * Payment provider abstraction for Paynow/EcoCash integration.
 * Currently uses placeholder logic — swap implementations when ready.
 */

export type PaymentProvider = "PAYNOW" | "ECOCASH" | "BANK_TRANSFER" | "CASH_ON_DELIVERY";

export interface PaymentRequest {
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  customerEmail: string;
  customerPhone?: string;
  description: string;
}

export interface PaymentResult {
  success: boolean;
  reference?: string;
  redirectUrl?: string;
  message: string;
  provider: PaymentProvider;
}

export interface PaymentProviderInterface {
  initiatePayment(request: PaymentRequest): Promise<PaymentResult>;
  verifyPayment(reference: string): Promise<PaymentResult>;
}

/** Placeholder Paynow provider — replace with real API calls */
class PaynowPlaceholder implements PaymentProviderInterface {
  async initiatePayment(request: PaymentRequest): Promise<PaymentResult> {
    const reference = `PN-${Date.now()}-${request.orderNumber}`;
    return {
      success: true,
      reference,
      redirectUrl: `/checkout/payment?ref=${reference}&provider=paynow&order=${request.orderId}`,
      message: "Paynow payment initiated (placeholder). Complete payment on the next screen.",
      provider: "PAYNOW",
    };
  }

  async verifyPayment(reference: string): Promise<PaymentResult> {
    return {
      success: true,
      reference,
      message: "Payment verified (placeholder).",
      provider: "PAYNOW",
    };
  }
}

/** Placeholder EcoCash provider — replace with real API calls */
class EcocashPlaceholder implements PaymentProviderInterface {
  async initiatePayment(request: PaymentRequest): Promise<PaymentResult> {
    const reference = `EC-${Date.now()}-${request.orderNumber}`;
    return {
      success: true,
      reference,
      redirectUrl: `/checkout/payment?ref=${reference}&provider=ecocash&order=${request.orderId}`,
      message: "EcoCash payment initiated (placeholder). Enter your PIN on the next screen.",
      provider: "ECOCASH",
    };
  }

  async verifyPayment(reference: string): Promise<PaymentResult> {
    return {
      success: true,
      reference,
      message: "EcoCash payment verified (placeholder).",
      provider: "ECOCASH",
    };
  }
}

class CashOnDeliveryProvider implements PaymentProviderInterface {
  async initiatePayment(request: PaymentRequest): Promise<PaymentResult> {
    return {
      success: true,
      reference: `COD-${request.orderNumber}`,
      message: "Order placed. Pay on delivery.",
      provider: "CASH_ON_DELIVERY",
    };
  }

  async verifyPayment(reference: string): Promise<PaymentResult> {
    return {
      success: true,
      reference,
      message: "Cash on delivery confirmed.",
      provider: "CASH_ON_DELIVERY",
    };
  }
}

const providers: Record<PaymentProvider, PaymentProviderInterface> = {
  PAYNOW: new PaynowPlaceholder(),
  ECOCASH: new EcocashPlaceholder(),
  BANK_TRANSFER: new PaynowPlaceholder(),
  CASH_ON_DELIVERY: new CashOnDeliveryProvider(),
};

export function getPaymentProvider(provider: PaymentProvider): PaymentProviderInterface {
  return providers[provider];
}

export async function processPayment(
  provider: PaymentProvider,
  request: PaymentRequest
): Promise<PaymentResult> {
  const paymentProvider = getPaymentProvider(provider);
  return paymentProvider.initiatePayment(request);
}

export async function verifyPayment(
  provider: PaymentProvider,
  reference: string
): Promise<PaymentResult> {
  const paymentProvider = getPaymentProvider(provider);
  return paymentProvider.verifyPayment(reference);
}

export const PAYMENT_METHODS = [
  {
    id: "PAYNOW" as PaymentProvider,
    name: "Paynow",
    description: "Pay with Visa, Mastercard, or mobile money via Paynow",
    icon: "💳",
    available: true,
  },
  {
    id: "ECOCASH" as PaymentProvider,
    name: "EcoCash",
    description: "Pay directly from your EcoCash wallet",
    icon: "📱",
    available: true,
  },
  {
    id: "CASH_ON_DELIVERY" as PaymentProvider,
    name: "Cash on Delivery",
    description: "Pay when your order arrives",
    icon: "💵",
    available: true,
  },
  {
    id: "BANK_TRANSFER" as PaymentProvider,
    name: "Bank Transfer",
    description: "Transfer to our bank account (details provided after checkout)",
    icon: "🏦",
    available: true,
  },
];
