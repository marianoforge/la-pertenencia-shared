import { NextApiRequest, NextApiResponse } from "next";
import { MercadoPagoConfig, Payment } from "mercadopago";

import { reduceWineStockServerSide } from "@/lib/firestore-server";

// Detectar y configurar credenciales correctas
const useTestCredentials = !!process.env.MERCADOPAGO_ACCESS_TOKEN_TEST;
const accessToken = useTestCredentials
  ? process.env.MERCADOPAGO_ACCESS_TOKEN_TEST!
  : process.env.MERCADOPAGO_ACCESS_TOKEN!;

// Configurar Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: accessToken,
});

const payment = new Payment(client);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    const { type, data } = req.body;

    if (type === "payment") {
      const paymentId = data.id;

      // Obtener los detalles del pago
      const paymentInfo = await payment.get({ id: paymentId });

      console.log("\n🔔 ===== NUEVO PAGO RECIBIDO =====");
      console.log("💰 Payment ID:", paymentInfo.id);
      console.log(
        "📋 Order ID:",
        paymentInfo.external_reference || "Sin referencia"
      );
      console.log("💵 Monto:", `$${paymentInfo.transaction_amount}`);
      console.log("✅ Estado:", paymentInfo.status);

      // Mostrar información de envío del cliente
      if (paymentInfo.metadata && paymentInfo.metadata.shipping_info) {
        console.log("\n📦 INFORMACIÓN DE ENVÍO:");
        console.log(
          "   📍 Dirección:",
          paymentInfo.metadata.shipping_info.address
        );
        console.log(
          "   📞 Teléfono:",
          paymentInfo.metadata.shipping_info.phone
        );
        console.log(
          "   📮 CP:",
          paymentInfo.metadata.shipping_info.postal_code
        );
      }

      // Mostrar información del comprador (payer)
      if (paymentInfo.payer) {
        console.log("\n👤 INFORMACIÓN DEL COMPRADOR:");
        console.log("   📧 Email:", paymentInfo.payer.email);
        if (paymentInfo.payer.phone) {
          console.log(
            "   📞 Teléfono:",
            `${paymentInfo.payer.phone.area_code}-${paymentInfo.payer.phone.number}`
          );
        }
        const fullName =
          `${paymentInfo.payer.first_name || ""} ${paymentInfo.payer.last_name || ""}`.trim();
        if (fullName) {
          console.log("   👤 Nombre:", fullName);
        }
      }

      // Mostrar items del pedido
      if (paymentInfo.metadata && paymentInfo.metadata.items) {
        console.log("\n🍷 PRODUCTOS:");
        paymentInfo.metadata.items.forEach((item: any, index: number) => {
          console.log(
            `   ${index + 1}. Wine ID: ${item.wine_id} - Cantidad: ${item.quantity}`
          );
        });
      }

      console.log("================================\n");

      // Aquí puedes agregar lógica adicional como:
      // - Actualizar el estado del pedido en tu base de datos
      // - Enviar emails de confirmación
      // - Actualizar el stock de productos

      switch (paymentInfo.status) {
        case "approved":
          console.log("Payment approved:", paymentInfo.external_reference);

          // Reducir stock de los vinos comprados
          if (paymentInfo.metadata && paymentInfo.metadata.items) {
            console.log("Processing stock reduction for approved payment");

            try {
              const items = paymentInfo.metadata.items as Array<{
                wine_id: string;
                quantity: number;
              }>;

              // Procesar cada item para reducir stock
              for (const item of items) {
                const result = await reduceWineStockServerSide(
                  item.wine_id,
                  item.quantity
                );

                if (result.success) {
                  console.log(
                    `✅ Stock reduced for wine ${item.wine_id}: ${item.quantity} units. New stock: ${result.newStock}`
                  );
                } else {
                  console.error(
                    `❌ Failed to reduce stock for wine ${item.wine_id}: ${result.error}`
                  );

                  // En un caso real, aquí podrías implementar lógica adicional como:
                  // - Enviar notificación al administrador
                  // - Registrar el error en un sistema de logs
                  // - Intentar la operación nuevamente más tarde
                }
              }
            } catch (error) {
              console.error("Error processing stock reduction:", error);
            }
          } else {
            console.warn(
              "No metadata.items found in payment, cannot reduce stock"
            );
          }

          break;
        case "pending":
          console.log("Payment pending:", paymentInfo.external_reference);
          // Lógica para pago pendiente
          break;
        case "rejected":
          console.log("Payment rejected:", paymentInfo.external_reference);
          // Lógica para pago rechazado
          break;
        default:
          console.log("Payment status unknown:", paymentInfo.status);
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({
      message: "Error processing webhook",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
