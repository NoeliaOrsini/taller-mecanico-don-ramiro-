# SPEC_PRESUPUESTOS.md  
## Feature: Cotización y aprobación de trabajos extras

### 1. Definición del problema

En el taller pasa seguido: se desarma el auto y aparecen cosas que no estaban en el presupuesto original.

Hoy el proceso suele ser informal:
- El mecánico avisa por WhatsApp o por teléfono.
- El cliente dice “dale, hacelo”.
- No queda registro claro de **qué** se aprobó, **cuánto** costaba ni **cuándo** se autorizó.

Después, al retirar el auto, aparecen las discusiones:  
“Yo no dije que sí a eso.”  
“Nunca me hablaron de ese monto.”

Se necesita algo simple y confiable que deje asentado, sin lugar a dudas, que el cliente aprobó ese trabajo extra en tal fecha y a tal hora.

---

### 2. Diseño de la solución

1. Desde la tarjeta del vehículo, el mecánico toca **+ EXTRA**.
2. Completa detalle del arreglo adicional y costo.
3. Al guardar:
   - Queda registrado el trabajo extra
   - El auto pasa a estado **AMARILLO** (esperando aprobación)
4. Puede enviar WhatsApp con un solo clic: se abre el chat con el mensaje ya armado, incluyendo los datos del presupuesto (detalle y costo).
5. Cuando el cliente aprueba, el mecánico registra esa aprobación en la app:
   - Se guarda una **marca de tiempo** (fecha, hora y segundos)
   - Esa marca **no se puede modificar** después
   - La tarjeta muestra que el presupuesto fue aprobado y cuándo
6. Para seguir reparando, el mecánico presiona el botón **ROJO** del semáforo y el vehículo vuelve al estado de reparación.

#### Datos del trabajo extra
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

### 3. Criterios de aceptación (verificables)

1. Al registrar un trabajo extra, el vehículo pasa a **AMARILLO** y en la tarjeta se ven el detalle y el costo.
2. Existe una acción para registrar la aprobación del cliente que genera una marca de tiempo visible (fecha, hora y segundos).
3. Una vez generada, la marca de tiempo **no se puede editar** desde la interfaz.
4. El botón WhatsApp en estado AMARILLO, con un solo clic, abre el chat con un mensaje que incluye cliente, vehículo, detalle del trabajo extra y costo.
5. Después de aprobar, el mecánico puede presionar el botón **ROJO** del semáforo: el auto vuelve al estado de reparación y la tarjeta sigue mostrando que el presupuesto fue aprobado.

---

### 4. Fuera de alcance
- Firma digital del cliente
- No hay envío automático de WhatsApp: requiere un solo clic, que abre un mensaje confeccionado de forma automática con los datos del presupuesto
- Edición del trabajo extra una vez aprobado
