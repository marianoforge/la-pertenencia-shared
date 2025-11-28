import type { NextApiRequest, NextApiResponse } from "next";

import { Resend } from "resend";
import { apiRateLimit } from "@/lib/rateLimit";
import { sanitizeText, sanitizeEmail } from "@/lib/sanitize";
import { sendError, sendSuccess, ApiResponse } from "@/lib/apiHelpers";
import { ValidationError } from "@/lib/errors";
import { logger } from "@/lib/logger";


const resend = new Resend(process.env.RESEND_API_KEY || "");

interface ContactFormData {
  nombre: string;
  apellido: string;
  email: string;
  motivo: string;
  consulta: string;
}

type ResponseData = {
  success: boolean;
  message?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
) {
  
  if (req.method !== "POST") {
    return sendError(res, new Error("Method not allowed"), "Método no permitido");
  }

  
  const rateLimitResult = apiRateLimit(req);
  if (!rateLimitResult.success) {
    return res.status(429).json({
      success: false,
      error: rateLimitResult.message || "Too many requests",
    });
  }

  try {
    const { nombre, apellido, email, motivo, consulta }: ContactFormData =
      req.body;

    
    if (!nombre || !apellido || !email || !motivo || !consulta) {
      throw new ValidationError("Todos los campos son requeridos");
    }

    
    const sanitizedNombre = sanitizeText(nombre);
    const sanitizedApellido = sanitizeText(apellido);
    const sanitizedEmail = sanitizeEmail(email);
    const sanitizedMotivo = sanitizeText(motivo);
    const sanitizedConsulta = sanitizeText(consulta);

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(sanitizedEmail)) {
      throw new ValidationError("Email inválido");
    }

    
    const { data, error } = await resend.emails.send({
      from: "La Pertenencia <onboarding@resend.dev>",
      to: ["info@lapertenencia.com"],
      replyTo: sanitizedEmail, 
      subject: `Nuevo mensaje de contacto: ${sanitizedMotivo}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: 'Lora', Georgia, serif;
                line-height: 1.6;
                color: #333;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 20px auto;
                background: white;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              }
              .header {
                background: #1a1a1a;
                color: #d4af37;
                padding: 30px;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 24px;
                letter-spacing: 2px;
                text-transform: uppercase;
              }
              .content {
                padding: 30px;
              }
              .field {
                margin-bottom: 20px;
              }
              .field-label {
                font-weight: bold;
                color: #d4af37;
                text-transform: uppercase;
                font-size: 12px;
                letter-spacing: 1px;
                margin-bottom: 5px;
              }
              .field-value {
                color: #333;
                font-size: 16px;
                padding: 10px;
                background: #f9f9f9;
                border-left: 3px solid #d4af37;
                margin-top: 5px;
              }
              .consulta-box {
                background: #f9f9f9;
                padding: 20px;
                border-radius: 4px;
                border-left: 3px solid #d4af37;
                margin-top: 10px;
                white-space: pre-wrap;
              }
              .footer {
                background: #f4f4f4;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🍷 La Pertenencia</h1>
                <p style="margin: 10px 0 0 0; font-size: 14px; letter-spacing: 1px;">Nuevo mensaje de contacto</p>
              </div>
              
              <div class="content">
                <div class="field">
                  <div class="field-label">Nombre Completo</div>
                  <div class="field-value">${sanitizedNombre} ${sanitizedApellido}</div>
                </div>
                
                <div class="field">
                  <div class="field-label">Email</div>
                  <div class="field-value">
                    <a href="mailto:${sanitizedEmail}" style="color: #d4af37; text-decoration: none;">
                      ${sanitizedEmail}
                    </a>
                  </div>
                </div>
                
                <div class="field">
                  <div class="field-label">Motivo de Consulta</div>
                  <div class="field-value">${sanitizedMotivo}</div>
                </div>
                
                <div class="field">
                  <div class="field-label">Consulta</div>
                  <div class="consulta-box">${sanitizedConsulta}</div>
                </div>
              </div>
              
              <div class="footer">
                <p>Este email fue enviado desde el formulario de contacto de La Pertenencia</p>
                <p style="margin-top: 10px;">Para responder, simplemente responde a este email o escribe a: ${sanitizedEmail}</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      logger.error("Error sending email", error);
      return sendError(res, error, "Error al enviar el email. Por favor intenta nuevamente.");
    }

    logger.info("Email sent successfully", { emailId: data?.id });
    return sendSuccess(res, { message: "Mensaje enviado correctamente" });
  } catch (error) {
    return sendError(res, error, "Error al procesar la solicitud");
  }
}
