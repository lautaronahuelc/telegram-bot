# CLAUDE.md

Bot de Telegram para **dividir gastos compartidos entre dos personas de forma proporcional a sus ingresos**. Cada usuario carga sus gastos; al hacer el "cierre", el bot calcula cuánto le debe uno al otro según el porcentaje de contribución de cada uno (salario propio / suma de salarios).

Toda la interfaz con el usuario está en **español (Argentina)** y los montos se formatean en ARS.

## Stack

- **Node.js** con ES Modules (`"type": "module"`, imports con extensión `.js`)
- **node-telegram-bot-api 2.x** (`Bot` + middleware, `bot.api.*`) en modo _polling_ (no usa webhooks). Requiere Node ≥ 18
- **MongoDB + Mongoose**
- **dotenv** + **cross-env** para variables de entorno. En dev, `node --watch` reinicia al cambiar archivos (sin nodemon)
- Tests con el runner nativo `node:test`, **ESLint** (flat config) y **Prettier**. Sin TypeScript ni build: Node ejecuta el código tal cual.

## Cómo correrlo

```bash
npm install
cp .env.example .env   # completar valores
npm run dev            # NODE_ENV=development → usa *_TEST (bot y base de prueba), con node --watch
npm start              # NODE_ENV=production → usa BOT_TOKEN / MONGO_URI reales, con node a secas
```

### Calidad de código

| Script                 | Qué hace                                                                   |
| ---------------------- | -------------------------------------------------------------------------- |
| `npm run check`        | Lint + verificación de formato + tests. **Correrlo antes de cada commit.** |
| `npm test`             | Tests de `test/*.test.js` con `node --test`                                |
| `npm run lint`         | ESLint (`eslint.config.js`)                                                |
| `npm run lint:fix`     | ESLint con autocorrección                                                  |
| `npm run format`       | Prettier reescribe todos los archivos                                      |
| `npm run format:check` | Prettier sólo verifica, sin escribir (lo usa `check`)                      |

Configuración:

- **`eslint.config.js`**: `@eslint/js` recommended + globals de Node, más `no-unused-vars` (los argumentos que empiezan con `_` se permiten), `require-await`, `eqeqeq` y `prefer-const`. `eslint-config-prettier` va último y desactiva las reglas de estilo, así ESLint no se pisa con Prettier: **ESLint marca bugs, Prettier decide el formato**.
- **`.prettierrc.json`**: comillas simples, `printWidth` 100, fin de línea LF. El resto son los defaults de Prettier 3 (punto y coma, 2 espacios, trailing commas). `.prettierignore` excluye `node_modules/` y `package-lock.json`.
- **`.gitattributes`** (`* text=auto eol=lf`): fuerza LF en el working copy aunque Windows tenga `core.autocrlf=true`. Sin esto, Prettier marcaría todos los archivos por CRLF.
- No hay hooks de pre-commit ni CI: `npm run check` se corre a mano.

Variables (`.env.example`):

| Variable                             | Uso                                                                                          |
| ------------------------------------ | -------------------------------------------------------------------------------------------- |
| `AUTHORIZED_USERS`                   | Array JSON de IDs de Telegram como strings, ej. `["123","456"]`. Se parsea con `JSON.parse`. |
| `BOT_TOKEN` / `BOT_TOKEN_TEST`       | Token de BotFather (prod / dev)                                                              |
| `BOT_USERNAME` / `BOT_USERNAME_TEST` | Username del bot, para reconocer `/comando@bot` en grupos                                    |
| `MONGO_URI` / `MONGO_URI_TEST`       | Conexión a MongoDB                                                                           |

`config/env.js` elige el set según `NODE_ENV` y sólo _advierte_ (no falla) si falta alguna.

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
eslint.config.js       Configuración de ESLint; .prettierrc.json / .prettierignore para Prettier
models/                Schemas de Mongoose (User, Expense)
queries/               Capa de acceso a datos. Envuelven Mongoose y devuelven { data, error }
```

### Flujo de una petición

```
Telegram ──polling──> bot.use(auth) ──> bot.hears(regex) ──> withMessage(handler) ──> queries/* ──> MongoDB
                                                                   └──> sendMessage / reactToMessage / deleteMessage
```

1. `bot.use(auth)` (`helpers/auth.js`) corre primero para todos los updates: rechaza a quien no esté en `AUTHORIZED_USERS` (responde el `answerCallbackQuery` si era un botón) y no llama a `next()`.
2. `bot.hears(commandRegex(COMMAND.X), withMessage(onX))` matchea `/x` o `/x@BotUsername` exactos. `withMessage` le pasa al handler `ctx.message`, así los handlers siguen recibiendo el `msg` de Telegram y no el contexto.
3. El handler llama a `queries/*` y responde con `sendMessage` (texto, a veces Markdown) o con una reacción emoji.
4. Una excepción en un handler la captura `bot.catch` (en `bot.js`), que la loguea con `❌` y el `update_id`.

**El orden de registro en `bot.js` importa**: primero `use(auth)`, después los `hears` y al final `on('message')` y `on('callback_query')`. Un `hears` que matchea no llama a `next()`, así que `on('message')` sólo recibe los mensajes que no son comandos (las respuestas de los comandos de dos pasos).

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

| Comando          | Handler              | Qué hace                                                                                                                            |
| ---------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `/nuevogasto`    | `add.js`             | Espera un mensaje `"<monto> <descripción>"` (ej. `5000 supermercado`). Crea el Expense y suma a `User.totalExpenses`. Monto entero. |
| `/vergastos`     | `list.js`            | Lista los gastos de todos, agrupados por usuario.                                                                                   |
| `/eliminaruno`   | `delete.js`          | Teclado con los gastos _propios_; elimina uno y resta de `totalExpenses`.                                                           |
| `/eliminartodo`  | `deleteAll.js`       | Confirmación; borra todos los gastos _del usuario que lo ejecuta_ y pone su `totalExpenses` en 0.                                   |
| `/editarsalario` | `editsalary.js`      | Espera un número; actualiza el salario y recalcula `contributionPercentage` de **todos** los usuarios.                              |
| `/verusuarios`   | `showuserdetails.js` | Muestra los documentos User formateados.                                                                                            |
| `/cierre`        | `calculate.js`       | Cálculo de liquidación (ver abajo).                                                                                                 |
| `/ayuda`         | `help.js`            | Lista de comandos desde `COMMANDLIST`.                                                                                              |

### Agregar un comando nuevo

1. Agregar la clave en `COMMAND` y la entrada en `COMMANDLIST` (`constants/commands.js`). `setMyCommands` y `/ayuda` se actualizan solos.
2. Crear `handlers/<nombre>.js` exportando `on<Nombre>(msg)`; re-exportarlo en `handlers/index.js`.
3. Registrarlo en `bot.js` junto a los otros `hears`, antes de `bot.on('message')`: `bot.hears(commandRegex(COMMAND.X), withMessage(onX))`. No hace falta envolverlo con auth: ya lo cubre `bot.use(auth)`.
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
- Las llamadas a Telegram que pueden fallar sin que importe pasan por helpers que nunca lanzan (loguean el error con `❌` y siguen): `helpers/sendMessage.js`, `helpers/reactToMessage.js` (`bot.api.setMessageReaction`), `helpers/deleteMessage.js` (`bot.api.deleteMessage`) y `helpers/removeInlineKeyboard.js` (`bot.api.editMessageReplyMarkup`). Usarlos en vez de llamar a `bot.api.*` directo, sobre todo dentro de un `setTimeout`, donde una excepción no la captura `bot.catch`.
- Los métodos de `bot.api.*` reciben **un objeto de parámetros** en snake_case (`{ chat_id, message_id }`), no argumentos posicionales.
- Las firmas de `node-telegram-bot-api` están en `node_modules/node-telegram-bot-api/dist/`: `core/api.d.ts` (métodos de `bot.api`), `types/schemas.d.ts` (tipos de Telegram: `Message`, `CallbackQuery`, etc.) y `core/{bot,context,longpoll,errors}.d.ts` (`Bot`, `use`/`hears`/`on`/`catch`, el contexto, el polling y los errores). Consultarlas (con grep) antes de llamar a la API de Telegram con `fetch` o de asumir que un método no existe.
- Markdown de Telegram (legacy): cursiva con `_`, negrita con `*`.
- Archivos de handlers en minúsculas sin separadores (`editsalary.js`, `showuserdetails.js`), salvo `deleteAll.js` y `callbackQuery.js`.
- El formato lo define Prettier: no formatear a mano; correr `npm run format`.
- No dejar variables, imports ni argumentos sin usar (ESLint falla). Si un argumento es obligatorio por la firma, prefijarlo con `_`.
- Una función `async` tiene que tener algún `await` (`require-await`); si no lo necesita, que no sea `async`.

## Flujo de trabajo

### Ramas y PRs

- `main` es producción y `develop` es integración. Cada tarea va en su propia rama creada desde `develop`, con prefijo de tipo (`feat/`, `fix/`, `refactor/`, `chore/`, `docs/`).
- Las ramas de tarea se mergean a `develop` con un PR (`gh pr create --base develop`). `develop` se mergea a `main` para publicar.
- La descripción del PR incluye un resumen, los cambios agrupados por commit, cómo se probó y lo que queda pendiente.

### Commits

- En español, con prefijo de tipo: `feat`, `fix`, `refactor`, `chore`, `chore(deps)`, `style`, `docs`, `test`.
- Un commit por tipo de cambio. Los cambios de formato (`npm run format`) van en un commit `style` aparte, nunca mezclados con cambios de lógica.
- Antes de cada commit, `npm run check` tiene que pasar. Si el cambio toca `handlers/`, `helpers/`, `queries/` o `bot.js`, que no tienen tests, además se prueba en el bot de prueba (`npm run dev`) con el recorrido manual.

### Recorrido manual en el bot de prueba

Con `npm run dev`, en Telegram:

1. Arranque sin errores en consola; al escribir `/` aparece el menú de comandos (`setMyCommands`).
2. `/ayuda` lista los comandos.
3. `/nuevogasto` → 👀; `5000 prueba` → 👍 y a los 3 s se borran ambos mensajes. Con `abc` → 🤬.
4. `/vergastos` muestra el gasto agrupado por usuario.
5. `/eliminaruno`: **Cancelar** quita el teclado (sin spinner colgado); eliminar uno → 👍, mensaje en Markdown y limpieza. Sin gastos propios → 🤔.
6. `/eliminartodo`: **Cancelar** y **Confirmar** (`totalExpenses` queda en 0).
7. `/editarsalario` → 👀; un número → 👍. `/verusuarios` muestra el salario y los porcentajes recalculados.
8. `/cierre` se ve con el formato Markdown correcto.
9. `/comando@BotUsername` en un grupo responde.
10. Un usuario no autorizado recibe el mensaje de rechazo.
11. Una reacción o un borrado que falla (borrar a mano el mensaje antes de los 3 s) se loguea con `❌` y el bot sigue respondiendo.
12. Cortar la red unos segundos: el polling loguea el error y el bot vuelve a responder.

Si el cambio es acotado, alcanza con los pasos que toca más el 1.

### Dependencias

- `npm audit fix` **sin** `--force` está bien: respeta los rangos de `package.json`. Después hay que verificar con `npm run check` y probar en el bot.
- **No usar `npm audit fix --force`.** Puede saltar de versión mayor sin avisar.
- `node-telegram-bot-api` está en `^2`. La 2.x fue una reescritura sin compatibilidad con la 1.x (`TelegramBot` + `onText` → `Bot` + middleware + `hears`, `bot.api.*` con un objeto de parámetros). La **2.2.0** vuelve recuperable el error 409 (otra instancia con el mismo token): el polling lo reintenta en vez de cortarse. **Todavía no es estable**: al 19/10/2026, `latest` es la 2.1.0 y la 2.2.0 sólo existe como release candidate (`2.2.0-rc2`, tag `next`). No instalar RC en este proyecto: esperar a que la 2.2.0 salga en `latest` (`npm view node-telegram-bot-api dist-tags`). Al actualizar, revisar si conviene dejar de tratar el 409 como fatal en `bot.js`.
- Las actualizaciones de versión mayor se hacen a mano, en su propia rama, después de leer el changelog.
- Para evaluar una versión sin tocar el proyecto, trabajar en una carpeta temporal:
  - `npm view <paquete>@<versión> engines dependencies` muestra la versión de Node que pide y sus dependencias.
  - `npm pack <paquete>@<versión>` y descomprimir el tarball permite leer los `.d.ts` reales, que son más confiables que el changelog.
  - Copiar `package.json` y `package-lock.json`, correr `npm install <paquete>@<versión> --package-lock-only --ignore-scripts` y después `npm audit` muestra cómo quedaría el audit antes de instalar.

## Problemas conocidos / deuda técnica

Tenerlos en cuenta antes de modificar código cercano:

- **`messageToDeleteId` es una variable de módulo** en `add.js`, `delete.js`, `deleteAll.js`, `editsalary.js`: si dos usuarios usan el mismo comando a la vez, se pisa y se borra el mensaje equivocado.
- **`list.js` y `delete.js` chequean `data.length` antes que `error`**: si la query falla (`data: null`) el handler lanza una excepción. `bot.catch` la loguea y el bot sigue, pero el usuario no recibe ninguna respuesta.
- **`editSalary` no valida el número**: `parseInt("abc")` → `NaN` se guarda como salario.
- **Un 409 corta el proceso**: con la 2.1.0 (hasta que salga la 2.2.0 estable), si hay otra instancia corriendo con el mismo token (ej. `npm run dev` abierto dos veces), el polling falla de forma fatal y `bot.js` hace `process.exit(1)`.
- **Los updates se procesan de a uno**: una llamada lenta o colgada (a Telegram o a Mongo) frena a todos los demás. Por eso `bot.js` baja el timeout de las llamadas a 30 s.
- **`showuserdetails.js`** itera todas las claves del documento; un campo sin entrada en `formatValue` (ej. `__v` si el documento lo tiene) rompe el comando.
- **`/cierre` sólo funciona bien con dos usuarios.**
- **`totalExpenses` puede desincronizarse** de la colección Expense si falla el segundo paso de alta/baja (no hay transacciones).
- `/eliminartodo` dice "Eliminar todos los gastos" pero sólo borra los del usuario que lo ejecuta.
- `helpers/deleteall.js` es código muerto (todo comentado).
- Los tests sólo cubren `lib/`: los handlers y queries se verifican corriendo el bot de prueba (`npm run dev`) en Telegram. Nueva lógica pura → va en `lib/` con su test.

## Roadmap

- **IA (Claude):** casos de uso propuestos, prioridades y decisiones de diseño en [`docs/ia-casos-de-uso.md`](docs/ia-casos-de-uso.md). Leerlo antes de empezar cualquier trabajo con IA en el bot.
