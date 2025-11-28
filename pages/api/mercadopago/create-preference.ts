import { NextApiRequest, NextApiResponse } from "next";
import { MercadoPagoConfig, Preference } from "mercadopago";

import { getReturnUrls } from "../../../lib/mercadopago";
import { logger } from "../../../lib/logger";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    const { items, payer } = req.body;

    
    const useTestCredentials = !!process.env.MERCADOPAGO_ACCESS_TOKEN_TEST;
    const accessToken = useTestCredentials
      ? process.env.MERCADOPAGO_ACCESS_TOKEN_TEST!
      : process.env.MERCADOPAGO_ACCESS_TOKEN!;

    
    const client = new MercadoPagoConfig({
      accessToken: accessToken,
      options: {
        timeout: 5000,
        idempotencyKey: `preference-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      },
    });

    const preference = new Preference(client);

    
    const returnUrls = getReturnUrls();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    
    const isLocalhost = baseUrl.includes("localhost");
    const validReturnUrls = isLocalhost
      ? {
          success: "https://www.lapertenencia.com/payment/success",
          failure: "https://www.lapertenencia.com/payment/failure",
          pending: "https://www.lapertenencia.com/payment/pending",
        }
      : returnUrls;

    
    const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    
    const preferenceData = {
      items: items.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description || "",
        quantity: item.quantity,
        unit_price: item.unit_price,
        currency_id: "ARS",
        category_id: "MLA1403", 
      })),
      back_urls: validReturnUrls,
      external_reference: orderId,
      
      ...(isLocalhost
        ? {}
        : { notification_url: `${baseUrl}/api/mercadopago/webhook` }),
      
      ...(payer &&
        (payer.phone || payer.address) && {
          payer: {
            ...(payer.phone && {
              phone: {
                area_code: payer.phone.area_code || "",
                number: payer.phone.number || "",
              },
            }),
            ...(payer.address && {
              address: {
                street_name: payer.address.street_name || "",
                street_number: payer.address.street_number || "",
                zip_code: payer.address.zip_code || "",
              },
            }),
          },
        }),
      metadata: {
        order_id: orderId,
        order_date: new Date().toISOString(),
        items: items.map((item: any) => ({
          wine_id: item.id,
          quantity: item.quantity,
        })),
        
        ...(payer &&
          (payer.phone || payer.address) && {
            shipping_info: {
              phone: payer.phone
                ? `${payer.phone.area_code}${payer.phone.number}`
                : "",
              address: payer.address ? payer.address.street_name : "",
              postal_code: payer.address ? payer.address.zip_code : "",
            },
          }),
      },
    };

    
    logger.info("Creando preferencia de pago", {
      order_id: orderId,
      total_items: items.length,
      shipping_info: preferenceData.metadata.shipping_info || "No incluida",
      payer_info: preferenceData.payer || "No incluido",
    });

    const result = await preference.create({ body: preferenceData });

    
    const isProduction = !useTestCredentials;

    
    const initPoint = isProduction
      ? result.init_point
      : result.sandbox_init_point;

    res.status(200).json({
      preferenceId: result.id,
      initPoint: initPoint,
      isProduction: isProduction,
      
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
    });
  } catch (error) {
    logger.error("Error creating preference", error);
    res.status(500).json({
      message: "Error al crear la preferencia de pago",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
