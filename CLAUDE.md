# CLAUDE.md

Bot de Telegram para **dividir gastos compartidos entre dos personas de forma proporcional a sus ingresos**. Cada usuario carga sus gastos; al hacer el "cierre", el bot calcula cuánto le debe uno al otro según el porcentaje de contribución de cada uno (salario propio / suma de salarios).

Toda la interfaz con el usuario está en **español (Argentina)** y los montos se formatean en ARS.

## Stack

- **Node.js** con ES Modules (`"type": "module"`, imports con extensión `.js`)
- **node-telegram-bot-api** en modo *polling* (no usa webhooks)
- **MongoDB + Mongoose**
- **dotenv** + **cross-env** para variables de entorno, **nodemon** para correr
- Tests con el runner nativo `node:test` (`npm test`), sin linter, sin TypeScript

## Cómo correrlo

```bash
npm install
cp .env.example .env   # completar valores
npm run dev            # NODE_ENV=development → usa *_TEST (bot y base de prueba)
npm start              # NODE_ENV=production → usa BOT_TOKEN / MONGO_URI reales
```

Variables (`.env.example`):

| Variable | Uso |
|---|---|
| `AUTHORIZED_USERS` | Array JSON de IDs de Telegram como strings, ej. `["123","456"]`. Se parsea con `JSON.parse`. |
| `BOT_TOKEN` / `BOT_TOKEN_TEST` | Token de BotFather (prod / dev) |
| `BOT_USERNAME` / `BOT_USERNAME_TEST` | Username del bot, para reconocer `/comando@bot` en grupos |
| `MONGO_URI` / `MONGO_URI_TEST` | Conexión a MongoDB |

`config/env.js` elige el set según `NODE_ENV` y sólo *advierte* (no falla) si falta alguna.

## Estructura

```
bot.js                 Entry point: conecta DB, crea el bot, registra comandos y handlers.
                       Exporta `bot` y `waitingForResponse` (los importan otros módulos).
config/                db.js (conexión Mongo), env.js (selección de variables por entorno)
constants/commands.js  COMMAND (nombres de comandos) y COMMANDLIST (nombre + descripción)
handlers/              Un archivo por comando. Reciben `msg` de Telegram y responden.
helpers/               Utilidades: auth, envío de mensajes, reacciones, formato de moneda, regex
lib/                   Lógica pura sin Telegram ni Mongo: settlement.js (cierre), expenseInput.js
                       (parseo de "<monto> <desc>"), contribution.js (porcentajes)
test/                  Tests de lib/ con node:test (`npm test`)
models/                Schemas de Mongoose (User, Expense)
queries/               Capa de acceso a datos. Envuelven Mongoose y devuelven { data, error }
```

### Flujo de una petición

```
Telegram ──polling──> bot.onText(regex) ──> withAuth(handler) ──> handler ──> queries/* ──> MongoDB
                                                                     └──> sendMessage / reactToMessage
```

1. `bot.onText(commandRegex(COMMAND.X), withAuth(onX))` matchea `/x` o `/x@BotUsername` exactos.
2. `withAuth` rechaza a quien no esté en `AUTHORIZED_USERS`.
3. El handler llama a `queries/*` y responde con `sendMessage` (texto, a veces Markdown) o con una reacción emoji.

### Comandos de dos pasos (estado conversacional)

`/nuevogasto` y `/editarsalario` no reciben argumentos. El handler:
1. Guarda `waitingForResponse.set(userId, COMMAND.X)` y reacciona 👀.
2. El **siguiente mensaje** del usuario lo captura `handlers/message.js` (`bot.on('message')`), que despacha a `addExpense` o `editSalary` y borra el estado.

`waitingForResponse` es un `Map` en memoria: se pierde al reiniciar el proceso.

### Botones inline (callback queries)

`/eliminaruno` y `/eliminartodo` muestran un teclado inline. Los clics llegan a `handlers/callbackQuery.js`, que despacha por prefijo de `callback_data` (`delete_<id>`, `delete_cancel`, `deleteall_confirm`, `deleteall_cancel`) y siempre llama a `answerCallbackQuery`.

### Limpieza del chat

Tras completar una acción, los handlers borran el mensaje del comando y la respuesta del usuario con `setTimeout(..., 3000)` para mantener el chat limpio.

## Comandos

| Comando | Handler | Qué hace |
|---|---|---|
| `/nuevogasto` | `add.js` | Espera un mensaje `"<monto> <descripción>"` (ej. `5000 supermercado`). Crea el Expense y suma a `User.totalExpenses`. Monto entero. |
| `/vergastos` | `list.js` | Lista los gastos de todos, agrupados por usuario. |
| `/eliminaruno` | `delete.js` | Teclado con los gastos *propios*; elimina uno y resta de `totalExpenses`. |
| `/eliminartodo` | `deleteAll.js` | Confirmación; borra todos los gastos *del usuario que lo ejecuta* y pone su `totalExpenses` en 0. |
| `/editarsalario` | `editsalary.js` | Espera un número; actualiza el salario y recalcula `contributionPercentage` de **todos** los usuarios. |
| `/verusuarios` | `showuserdetails.js` | Muestra los documentos User formateados. |
| `/cierre` | `calculate.js` | Cálculo de liquidación (ver abajo). |
| `/ayuda` | `help.js` | Lista de comandos desde `COMMANDLIST`. |

### Agregar un comando nuevo

1. Agregar la clave en `COMMAND` y la entrada en `COMMANDLIST` (`constants/commands.js`). `setMyCommands` y `/ayuda` se actualizan solos.
2. Crear `handlers/<nombre>.js` exportando `on<Nombre>(msg)`; re-exportarlo en `handlers/index.js`.
3. Registrarlo en `bot.js`: `bot.onText(commandRegex(COMMAND.X), withAuth(onX))`.
4. Si necesita una respuesta de seguimiento: usar `waitingForResponse` y agregar el `case` en `handlers/message.js`.
5. Si usa botones: elegir un prefijo de `callback_data` único y despacharlo en `handlers/callbackQuery.js`.

## Modelo de datos

**User** (`models/users.js`) — los usuarios **se crean a mano en la base**; no hay comando de registro.
- `userId` (String, ID de Telegram), `username`
- `salary` — ingreso
- `contributionPercentage` — `salary / sum(salaries)`, redondeado a 4 decimales; se recalcula al editar salario
- `totalExpenses` — suma desnormalizada de los gastos del usuario (se mantiene con `$inc`, no se recalcula desde Expense)
- `amountDueToUser` — existe en el schema pero el código no lo actualiza

**Expense** (`models/expenses.js`): `userId`, `username`, `amount`, `desc`, `date`.

## Lógica del cierre (`/cierre`)

Diseñada para **exactamente dos usuarios** (toma el de mayor y el de menor `totalExpenses`):

```
A recibe de B:  B.contributionPercentage × A.totalExpenses
B recibe de A:  A.contributionPercentage × B.totalExpenses
Resultado:      el que tiene el valor mayor recibe la diferencia
```

Ejemplo: A gana 60%, B 40%. A gastó 100.000, B gastó 50.000 → A recibe 0,4×100.000 = 40.000; B recibe 0,6×50.000 = 30.000 → **A recibe 10.000**. Equivale a que cada uno termine pagando su porcentaje del gasto total (150.000 × 60% = 90.000 para A).

## Convenciones

- Las funciones de `queries/` nunca lanzan: devuelven `{ data, error }` y loguean con `console.error('❌ ...')`. Los handlers chequean `error` y responden con un mensaje de error en español.
- Los mensajes de error para el usuario empiezan con `❌`.
- Las reacciones se envían con `fetch` directo a la API de Telegram (`helpers/reactToMessage.js`) porque la librería no expone `setMessageReaction`.
- Markdown de Telegram (legacy): cursiva con `_`, negrita con `*`.
- Archivos de handlers en minúsculas sin separadores (`editsalary.js`, `showuserdetails.js`), salvo `deleteAll.js` y `callbackQuery.js`.

## Problemas conocidos / deuda técnica

Tenerlos en cuenta antes de modificar código cercano:

- **`messageToDeleteId` es una variable de módulo** en `add.js`, `delete.js`, `deleteAll.js`, `editsalary.js`: si dos usuarios usan el mismo comando a la vez, se pisa y se borra el mensaje equivocado.
- **`list.js` y `delete.js` chequean `data.length` antes que `error`**: si la query falla (`data: null`) el handler lanza una excepción.
- **`editSalary` no valida el número**: `parseInt("abc")` → `NaN` se guarda como salario.
- **`handlers/message.js` no hace `await` de `handleCommand`**: los errores ahí quedan como promesas rechazadas sin manejar.
- **`showuserdetails.js`** itera todas las claves del documento; un campo sin entrada en `formatValue` (ej. `__v` si el documento lo tiene) rompe el comando.
- **`/cierre` sólo funciona bien con dos usuarios.**
- **`totalExpenses` puede desincronizarse** de la colección Expense si falla el segundo paso de alta/baja (no hay transacciones).
- `/eliminartodo` dice "Eliminar todos los gastos" pero sólo borra los del usuario que lo ejecuta.
- `helpers/deleteall.js` es código muerto (todo comentado).
- `npm start` usa `nodemon` también en producción.
- Los tests sólo cubren `lib/`: los handlers y queries se verifican corriendo el bot de prueba (`npm run dev`) en Telegram. Nueva lógica pura → va en `lib/` con su test.
