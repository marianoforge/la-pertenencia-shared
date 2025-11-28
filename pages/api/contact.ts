import type { NextApiRequest, NextApiResponse } from "next";

import { Resend } from "resend";

// Inicializar Resend con la API key
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
  res: NextApiResponse<ResponseData>,
) {
  // Solo aceptar POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Método no permitido",
    });
  }

  try {
    const { nombre, apellido, email, motivo, consulta }: ContactFormData =
      req.body;

    // Validación básica
    if (!nombre || !apellido || !email || !motivo || !consulta) {
      return res.status(400).json({
        success: false,
        error: "Todos los campos son requeridos",
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Email inválido",
      });
    }

    // Enviar email usando Resend
    const { data, error } = await resend.emails.send({
      from: "La Pertenencia <onboarding@resend.dev>",
      to: ["info@lapertenencia.com"],
      replyTo: email, // El email del cliente para poder responder fácilmente
      subject: `Nuevo mensaje de contacto: ${motivo}`,
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
                  <div class="field-value">${nombre} ${apellido}</div>
                </div>
                
                <div class="field">
                  <div class="field-label">Email</div>
                  <div class="field-value">
                    <a href="mailto:${email}" style="color: #d4af37; text-decoration: none;">
                      ${email}
                    </a>
                  </div>
                </div>
                
                <div class="field">
                  <div class="field-label">Motivo de Consulta</div>
                  <div class="field-value">${motivo}</div>
                </div>
                
                <div class="field">
                  <div class="field-label">Consulta</div>
                  <div class="consulta-box">${consulta}</div>
                </div>
              </div>
              
              <div class="footer">
                <p>Este email fue enviado desde el formulario de contacto de La Pertenencia</p>
                <p style="margin-top: 10px;">Para responder, simplemente responde a este email o escribe a: ${email}</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("❌ Error sending email:", error);

      return res.status(500).json({
        success: false,
        error: "Error al enviar el email. Por favor intenta nuevamente.",
      });
    }

    console.log("✅ Email sent successfully:", data);

    return res.status(200).json({
      success: true,
      message: "Mensaje enviado correctamente",
    });
  } catch (error) {
    console.error("❌ Error in contact API:", error);

    return res.status(500).json({
      success: false,
      error: "Error al procesar la solicitud",
    });
  }
}
