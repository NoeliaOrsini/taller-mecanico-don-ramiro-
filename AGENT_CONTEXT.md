# AGENT_CONTEXT.md  
## Contexto del proyecto — Taller Mecánico Don Ramiro

### De qué se trata
Esta es una aplicación web pensada para el día a día real de un taller mecánico.  
No nació como un ejercicio abstracto de programación, sino a partir de un problema concreto: las interrupciones constantes, las manos sucias, el celular que cuesta usar y las discusiones por trabajos que el cliente aprobó… y después niega.

La app permite registrar vehículos, seguir su estado con un semáforo visual, cotizar trabajos extras y dejar registrada la aprobación del cliente con fecha y hora exactas. También facilita avisar por WhatsApp sin tener que escribir el mensaje cada vez.

Se usan los colores de un semáforo para que el estado de cada pedido se comprenda de forma rápida y sin esfuerzo.

### Tecnologías
- HTML5
- Tailwind CSS
- JavaScript
- localStorage (los datos se guardan solo en el navegador del dispositivo)
- No hay servidores, ni cuentas, ni nubes de terceros
- Diseño mobile-first, pensado para usarse con el celular en la mano

### Diseño
1. **Botones grandes y fáciles de tocar**  
   Mínimo 48px de alto. Tiene que poder usarse aunque las manos estén sucias o se tenga poco tiempo.

2. **Claridad visual por encima de todo**  
   Alto contraste, tipografía fuerte, semáforo de estados bien visible. No puede haber dudas de en qué estado está cada auto.

3. **Teléfono en formato internacional limpio**  
   Solo números, con código de país, sin espacios ni signos. Ejemplo Argentina: `5491112345678`.

4. **Marcas de tiempo inalterables**  
   Cuando se registra la aprobación de un trabajo extra, se guarda fecha, hora y segundos. Ese dato no se edita después. Es el respaldo frente a discusiones futuras.

5. **Cuidado de los datos personales**  
   Nombre, teléfono y patente son datos sensibles. Por eso en esta versión beta todo queda en el dispositivo. No se envía nada a servidores externos. Si en el futuro se agregara almacenamiento en la nube, habría que sumar los avisos y resguardos correspondientes.

### Estados del vehículo
- 🔴 **ROJO** → En reparación  
- 🟡 **AMARILLO** → Cotizando / Esperando aprobación del cliente  
- 🟢 **VERDE** → Listo para retirar  
- **ARCHIVADO** → Ya se entregó (queda en historial)

### Cómo debe trabajar el agente
- Priorizar siempre la usabilidad real del taller por sobre lo “técnicamente interesante”.
- No agregar complejidad (backend, login, etc.) si no se pide explícitamente.
- Respetar el estilo visual definido en `BRAND_SKILL.md`.
- Si se toca la lógica de presupuestos o aprobaciones, revisar primero `SPEC_PRESUPUESTOS.md`.
- Mantener el enfoque en el problema humano concreto, no en una solución genérica para “cualquier taller”.

### Archivos del proyecto
```
index.html
css/styles.css
js/app.js
assets/                 ← capturas e imágenes para el README
AGENT_CONTEXT.md
SPEC_PRESUPUESTOS.md
BRAND_SKILL.md
```
