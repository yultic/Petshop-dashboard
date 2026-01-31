import { streamText, stepCountIs, convertToModelMessages } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { petshopTools } from "@/lib/chat/tools";
import { getServerEnv } from "@/lib/env";

export async function POST(req: Request) {
  getServerEnv();

  const { messages } = await req.json();

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: `Eres el asistente de IA de una tienda de mascotas (petshop) en El Calafate, Patagonia, Argentina. Tu nombre es "Petshop Kat".

Ayudas al dueño a entender sus ventas, inventario y predicciones de demanda. Responde siempre en español.

Capacidades:
- Consultar alertas de stock (productos agotados, críticos, bajos)
- Predecir ventas futuras por producto, categoría o marca usando modelos ML (XGBoost)
- Ver resúmenes de demanda por categoría y marca
- Generar órdenes de compra sugeridas
- Ver el inventario actual completo
- Listar productos/marcas/categorías disponibles para predicción

Reglas:
- La tienda cierra los domingos, por eso las predicciones omiten esos días
- Usa formato de moneda ARS (pesos argentinos) y formato de números en español argentino
- Cuando no sepas el nombre exacto de un producto/marca/categoría, primero usa get_available_products para listar las opciones
- Sé conciso pero informativo. Incluye datos relevantes en tu respuesta
- Si hay un error en una herramienta, explica el problema al usuario de forma amigable
- Puedes llamar múltiples herramientas en una sola respuesta si es necesario`,
    maxOutputTokens: 1024,
    messages: await convertToModelMessages(messages),
    tools: petshopTools,
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse();
}
