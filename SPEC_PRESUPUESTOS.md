# SPEC_PRESUPUESTOS.md  
## Feature principal: Cotización y aprobación de trabajos extras

### 1. El problema (tal como lo vive el taller)

En el taller pasa seguido: se desarma el auto y aparecen cosas que no estaban en el presupuesto original.

Hoy el proceso suele ser así:
- El mecánico avisa por WhatsApp o por teléfono.
- El cliente dice “dale, hacelo”.
- No queda un registro claro de **qué** se aprobó, **cuánto** costaba ni **en qué momento** se autorizó.

Después, al retirar el auto, aparecen las discusiones.  
“Yo no dije que sí a eso.”  
“Nunca me hablaron de ese monto.”

Además, mientras tanto, el taller sigue recibiendo llamadas preguntando si ya está listo.  
Cada interrupción corta el trabajo y genera más fricción.

Lo que se necesita no es una solución genérica de “gestión de presupuestos”.  
Se necesita algo simple, rápido y confiable que deje asentado, sin lugar a dudas, que el cliente aprobó ese trabajo extra en tal fecha y a tal hora.

---

### 2. Cómo se resuelve

#### Carga de un vehículo nuevo
Desde el botón **INGRESAR VEHÍCULO** se cargan los datos del cliente, teléfono (formato internacional), modelo, patente y motivo de ingreso.  
El auto entra automáticamente en estado **ROJO** (en reparación).

#### Trabajo extra y aprobación
1. El mecánico detecta el trabajo extra.
2. Desde la tarjeta del vehículo toca **+ EXTRA**.
3. Escribe el detalle y el costo.
4. Al guardar:
   - Queda registrado el trabajo extra
   - El auto pasa a estado **AMARILLO** (esperando aprobación)
5. Desde ahí puede mandar WhatsApp con el mensaje ya armado (detalle + costo).
6. Cuando el cliente aprueba, el mecánico registra esa aprobación:
   - Se guarda una **marca de tiempo** (fecha, hora y segundos)
   - Esa marca **no se puede modificar** después
   - La tarjeta muestra claramente que el presupuesto fue aprobado y cuándo
7. Para volver a trabajarlo, el mecánico presiona el botón **ROJO**. El auto sale del amarillo y pasa a reparación.

#### Cuando el auto está listo
El mecánico cambia el estado a **VERDE**.  
Desde ahí puede tocar **WHATSAPP** y se abre el chat con un mensaje predeterminado avisando que el vehículo ya está listo para retirar.

#### Cuando el cliente retira el auto
Se archiva el vehículo (pasa a **HISTORIAL**).  
Desde el historial se puede:
- Reactivarlo si hace falta
- Eliminarlo definitivamente (por ejemplo después de haber exportado el backup)

#### Persistencia de los datos
Los datos se guardan en el navegador (`localStorage`).  
Si se borra la caché del navegador, se pierden.  
Por eso la app permite **EXPORTAR** e **IMPORTAR** un archivo JSON para hacer respaldo o pasar la información a otro dispositivo.

#### Datos que se guardan del trabajo extra
```js
trabajoExtra: {
  detalle: string,
  costo: number,
  aprobado: boolean,
  fechaAprobacion: string | null,
  timestamp: number | null
}
```

---

### 3. Criterios de aceptación (tienen que poder comprobarse)

1. **Carga de vehículo nuevo**  
   Al ingresar un vehículo, queda en estado ROJO con todos sus datos visibles.

2. **Cambio automático a AMARILLO al cargar trabajo extra**  
   Al registrar un trabajo extra, el vehículo pasa a AMARILLO y en la tarjeta se ve el detalle y el costo.

3. **Marca de tiempo al aprobar**  
   Existe una acción que registra la aprobación del cliente y genera una marca con fecha, hora y segundos visibles. Esa marca no se puede editar después.

4. **Paso manual de AMARILLO a ROJO**  
   Después de aprobar, el mecánico debe poder volver el auto a ROJO presionando el botón correspondiente del semáforo.

5. **WhatsApp con mensaje predeterminado**  
   - En estado AMARILLO: el mensaje incluye cliente, vehículo, detalle del trabajo extra y costo.  
   - En estado VERDE: el mensaje avisa que el vehículo está listo para retirar.

6. **Archivado y eliminación**  
   Desde el historial se puede reactivar un vehículo o eliminarlo definitivamente.

7. **Exportar / Importar**  
   Se puede descargar un backup JSON y volver a cargarlo. Si se borra la caché, los datos se pierden salvo que se haya exportado antes.

---

### 4. Lo que queda fuera (por ahora)
- Firma digital del cliente
- Envío automático de WhatsApp (solo se abre el chat con el texto listo)
- Backend o sincronización entre dispositivos
- Poder editar el trabajo extra una vez aprobado
