# Statim

Statim es el chat de grupo del equipo. Funciona en el navegador del móvil o del ordenador y se puede instalar como una app.

Hay **una única sala** para todo el equipo. Los mensajes viajan **directamente de dispositivo a dispositivo**: ningún servidor los guarda ni los reparte. Confluence solo se usa como "tablón de anuncios" para que los compañeros se encuentren.

---

## Lo más importante antes de empezar

- **Solo recibes mensajes de quien está conectado a la vez que tú.** No hay servidor que los guarde.
- **Si se te cierra la app un rato, recuperas lo perdido al volver**, siempre que el autor siga conectado. Cada compañero reenvía sus mensajes de las últimas 10 horas; lo mismo vale si llegas tarde.
- **Lo que escribió alguien que ya cerró Statim no te llegará** hasta que vuelva a conectarse y escriba de nuevo.
- **Déjalo abierto durante tu jornada.** Está pensado para arrancarlo por la mañana y tenerlo abierto todo el día.
- **Los mensajes se guardan solo en tu dispositivo.** Si cambias de móvil u ordenador, la conversación anterior no viene contigo.
- **Al entrar, conectar con el equipo tarda alrededor de un minuto.** Es normal: Statim consulta Confluence con poca frecuencia para no saturarlo.

---

## Qué necesitas

1. Un navegador actual: Chrome, Edge, Safari o Firefox.
2. Tu **email de Atlassian** y un **API token** personal. Se crea en <https://id.atlassian.com/manage-profile/security/api-tokens>.
3. El **ID de la página de Confluence** que usa el equipo como punto de encuentro. Te lo dará quien administre Statim. Es el número que aparece en la dirección de la página: `.../pages/123456789/...`.
4. La **URL de Confluence** que hay que poner en Statim. Te la dará también quien lo administre (por ejemplo `http://localhost:8787` si usáis el proxy local).

---

## Primer acceso

1. Abre Statim en el navegador.
2. Rellena **Email de Atlassian**, **API token**, **ID de la página** y **URL de Confluence**.
3. Pulsa **Entrar**.
4. Si el navegador pregunta si quieres recibir notificaciones, acepta. Así te avisará de los mensajes nuevos cuando Statim esté en segundo plano.

La próxima vez entrarás directamente, sin volver a escribir los datos.

### Instalarlo como app

- **Android (Chrome):** menú ⋮ → *Instalar aplicación* o *Añadir a pantalla de inicio*.
- **iPhone/iPad (Safari):** botón Compartir → *Añadir a pantalla de inicio*.
- **Ordenador (Chrome/Edge):** icono de instalar en la barra de direcciones.

---

## Uso diario

| Quiero… | Cómo |
|---|---|
| Enviar un mensaje | Escribe abajo y pulsa **Enviar** o la tecla **Enter**. |
| Hacer un salto de línea | **Mayúsculas + Enter**. |
| Ver quién está conectado | Botón **Equipo (n)** arriba a la derecha. En pantallas grandes la lista se ve siempre a la derecha. El punto verde indica conexión directa. |
| Saber cuántos me leen | La cabecera muestra "*n* conectados". |
| Salir | Botón **Salir**. Se borra tu token del dispositivo; el resto de datos se mantiene para la próxima vez. |

Cada persona tiene un **avatar** de cuadros de colores generado a partir de su email. Siempre es el mismo, así puedes reconocer a cada compañero de un vistazo.

Si aparece el aviso **"Nadie conectado: tus mensajes llegarán cuando alguien se conecte (hasta 10 h)"**, tu mensaje se guarda en tu dispositivo. Les llegará a tus compañeros cuando se conecten mientras tú sigues con Statim abierto, durante las siguientes 10 horas.

Los mensajes recuperados aparecen en su sitio según la hora en que se escribieron, no al final. Si estás leyendo mensajes antiguos, la pantalla no se mueve cuando llegan otros: aparece un aviso **"N mensajes nuevos ↓"** que te lleva a lo último.

---

## En el móvil

Los móviles pausan las apps web que no están en pantalla para ahorrar batería:

- **iPhone/iPad:** Statim deja de recibir casi en cuanto cambias de app o bloqueas la pantalla.
- **Android:** suele aguantar unos minutos en segundo plano.

Cuando el sistema pausa Statim, cuenta como si te hubieras desconectado. Al volver a abrirlo se reconecta solo, en aproximadamente un minuto.

---

## Privacidad y seguridad

- Los mensajes van **directos entre dispositivos**, cifrados en el trayecto. **No pasan por Confluence** ni por ningún otro servidor.
- En Confluence solo se publican datos técnicos para encontrarse: tu email, datos de conexión y una clave de cifrado que cambia cada hora. Aparecen como comentarios ilegibles en la página del equipo.
- **Quien tenga acceso a esa página de Confluence podría leer esas claves.** No uses Statim para información confidencial.
- Tu **API token se guarda sin cifrar en el dispositivo**. Usa **Salir** en equipos compartidos.

---

## Problemas frecuentes

| Mensaje o síntoma | Qué hacer |
|---|---|
| *Credenciales o permisos no válidos en Confluence* | Revisa email y token, y que tengas acceso a la página. |
| *No se encuentra la página de Confluence* | Revisa el ID de la página. |
| *No se pudo contactar con Confluence (revisa red, CORS o proxy)* | Revisa la URL de Confluence. Si usáis el proxy local, comprueba que está arrancado. |
| *Confluence está limitando las peticiones* | Espera; Statim reintenta solo. |
| "0 conectados" durante más de 2–3 minutos | Puede que no haya nadie más con Statim abierto, o que tu red bloquee conexiones directas. Avisa a quien lo administre. |
| No me llegan notificaciones | Revisa el permiso de notificaciones del navegador para Statim. |

---

## Apartado técnico

Arquitectura, protocolo, decisiones de diseño, desarrollo local, pruebas y limitaciones conocidas: **[TECHNICAL_BRIEF.md](TECHNICAL_BRIEF.md)**.

Arranque rápido para desarrollo:

```bash
pnpm install
pwsh localproxy/localproxy.ps1 http://localhost:8790            # proxy CORS (puerto 8787)
pnpm dev                                                        # app en http://localhost:5173
```

Entra con cualquier email y token, cualquier ID de página y la URL `http://localhost:8787`.
