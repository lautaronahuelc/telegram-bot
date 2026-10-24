# Casos de uso de IA (Claude) para el bot

Propuesta del 19/10/2026. **Nada de esto está implementado todavía.** Cuando se implemente un caso, marcarlo acá y documentarlo en `CLAUDE.md`.

## Principios

- **La IA interpreta, el código calcula.** El cierre (`lib/settlement.js`) y cualquier suma de montos siguen siendo determinísticos. La IA no calcula ni "explica" el cierre.
- **Confirmación antes de guardar.** Todo dato que la IA extrae (monto, fecha, descripción) se confirma con botones inline (✅/❌) antes de escribir en la base, reusando el patrón de `handlers/callbackQuery.js` con un prefijo de `callback_data` propio.
- **La IA es opcional.** Si falta `ANTHROPIC_API_KEY` o la llamada falla, el bot funciona como hoy (formato manual) y responde con `❌` cuando corresponde.
- **Lógica pura en `lib/` con tests.** La validación del JSON que devuelve Claude va en `lib/` con su test en `test/`. La llamada a la API va en una capa que nunca lanza y devuelve `{ data, error }` (como `queries/`).

## Casos de uso (en orden de prioridad)

### 1. Carga de gastos en lenguaje natural — próximo a implementar

`/nuevogasto` acepta textos como `12 lucas súper`, `1.500,50 farmacia`, `ayer pagué 8k de luz` o `nafta 35000`.

- Primero se intenta `parseExpenseInput` (regex actual). Sólo si falla, se le pregunta a Claude: lo que hoy funciona no cambia ni suma costo o latencia.
- Claude devuelve JSON con un formato fijo (`output_config.format`): `{ amount, desc, date }`.
- Se confirma con botones antes de crear el `Expense`.
- Resuelve de paso que hoy los montos tienen que ser enteros.
- Deja armada la base (cliente, JSON con formato fijo, confirmación) para los casos 2, 3 y 5.

### 2. Foto del ticket o factura

El usuario manda una foto y Claude extrae el total y el comercio con visión. Se baja con `bot.api.getFile` y se manda en base64. Mismo flujo de JSON y confirmación que el caso 1.

### 3. Categorías automáticas

Claude asigna una categoría al cargar (súper, servicios, salidas, transporte…). Requiere un campo `category` **opcional** en `models/expenses.js`, compatible con los datos existentes. Habilita el caso 4 y un desglose por categoría en `/cierre`.

### 4. Preguntas sobre los gastos (`/preguntar`)

Por ejemplo "¿cuánto gastamos en delivery este mes?" o "¿quién pagó más servicios?". Hay pocos gastos, así que alcanza con pasar la lista del período junto con la pregunta. Es de sólo lectura. Para totales exactos, Claude elige los filtros y la suma la hace el código.

### 5. Aviso de duplicados

"Ya cargaste $5.000 súper hace 10 minutos, ¿es otro?". Sale casi gratis una vez hecho el caso 1.

### Descartados

- Que la IA calcule o explique el cierre: ya es determinístico y el mensaje muestra la cuenta.
- Transcribir audios: la API de Claude no transcribe audio; haría falta otro servicio.

## Consideraciones técnicas

- **Latencia:** los updates se procesan de a uno (ver "Problemas conocidos" en `CLAUDE.md`). Una llamada a Claude tarda unos segundos y frena al otro usuario. Usar un timeout corto y reaccionar 👀 mientras procesa.
- **Configuración:** agregar `ANTHROPIC_API_KEY` a `.env.example` y a `config/env.js` (que sólo advierta si falta, como las demás), y `@anthropic-ai/sdk` como dependencia.
- **Modelo:** el default es Claude Opus 5.5 (`claude-opus-5-5`, $4 / $20 por millón de tokens de entrada / salida). Para extraer un gasto alcanza con Claude Haiku 5.5 (`claude-haiku-5-5`, $0,10 / $0,50). Con el uso de dos personas, cualquiera de los dos sale barato. **Decisión pendiente del usuario.**
- **Privacidad:** los montos y descripciones se mandan a la API de Anthropic. En el caso 4 viaja la lista de gastos del período; los salarios no se mandan salvo que se decida lo contrario.
- **Tests:** como en el resto del proyecto, `lib/` lleva tests con `node:test`. La integración con Telegram y la API se prueba en el bot de prueba (`npm run dev`).
