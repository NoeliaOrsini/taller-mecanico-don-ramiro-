# AGENT_CONTEXT.md  
## Contexto del proyecto — Taller Mecánico Don Ramiro

Aplicación web pensada para el día a día real de un taller mecánico.  
Nació de un problema concreto: interrupciones constantes, manos sucias, celular difícil de usar y discusiones por trabajos que el cliente aprobó… y después niega.

Permite registrar vehículos, seguir su estado con un semáforo visual, cotizar trabajos extras, dejar registrada la aprobación del cliente con fecha y hora exactas, y avisar por WhatsApp sin escribir el mensaje cada vez.

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
   Cuando se registra la aprobación de un trabajo extra, se guarda fecha, hora y segundos. Ese dato no se edita después.

5. **Cuidado de los datos personales**  
   Nombre, teléfono y patente son datos sensibles. En esta versión beta todo queda en el dispositivo. No se envía nada a servidores externos. Si en el futuro se agregara almacenamiento en la nube, habría que sumar los avisos y resguardos correspondientes.

### Estados del vehículo
- 🔴 **ROJO** → En reparación  
- 🟡 **AMARILLO** → Cotizando / Esperando aprobación del cliente  
- 🟢 **VERDE** → Listo para retirar  
- **ARCHIVADO** → Ya se entregó (queda en historial)

### Flujo general de la app
1. **Ingreso de vehículo**  
   Desde **INGRESAR VEHÍCULO** se cargan cliente, teléfono, modelo, patente y motivo.  
   El auto entra en estado **ROJO**.

2. **Durante la reparación**  
   El mecánico puede cambiar el estado con los botones del semáforo (ROJO / AMARILLO / VERDE).

3. **Trabajo extra**  
   Se registra con **+ EXTRA**. El auto pasa a AMARILLO.  
   El detalle de cotización y aprobación está definido en `SPEC_PRESUPUESTOS.md`.

4. **Auto listo**  
   El mecánico pasa el auto a **VERDE**.  
   Desde ahí puede tocar **WHATSAPP** y se abre el chat con un mensaje predeterminado avisando que ya está listo para retirar.

5. **Retiro**  
   Se archiva el vehículo (pasa a **HISTORIAL**).  
   Desde el historial se puede reactivar o eliminar definitivamente (por ejemplo después de exportar el backup).

### Persistencia
Los datos se guardan en el navegador (`localStorage`).  
Si se borra la caché, se pierden.  
La app permite **EXPORTAR** e **IMPORTAR** un archivo JSON para respaldo o para pasar la información a otro dispositivo.

### Cómo debe trabajar el agente
- Priorizar la usabilidad real del taller por sobre lo “técnicamente interesante”.
- No agregar complejidad (backend, login, etc.) si no se pide explícitamente.
- Respetar el estilo visual de `BRAND_SKILL.md`.
- Si se toca la lógica de presupuestos o aprobaciones, revisar primero `SPEC_PRESUPUESTOS.md`.
- Mantener el enfoque en el problema humano concreto, no en una solución genérica.

### Archivos del proyecto
```
index.html
css/styles.css
js/app.js
assets/
AGENT_CONTEXT.md
SPEC_PRESUPUESTOS.md
BRAND_SKILL.md
```
