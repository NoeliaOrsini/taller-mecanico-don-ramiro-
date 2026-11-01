# SPEC — Asignación de mecánico al vehículo

## 1. Definición del problema

En un taller de 4 mecánicos que comparten una tablet, el semáforo de estados resuelve “cómo está el auto”, pero no resuelve **quién lo está trabajando**.

Hoy eso queda en la cabeza de Ramiro o en mensajes de WhatsApp. Consecuencia:
- Se pierde tiempo preguntando de quién es cada unidad
- Al cambiar de turno o de mano, el contexto se confunde
- La vista “de todos” no ayuda a organizar el trabajo del día

**Usuario principal:** Ramiro y el equipo (Carlos, Ana, Luis), en tablet compartida.

**Objetivo del feature:**  
Al ingresar un vehículo, **asignarlo a un mecánico**. Mostrar en la interfaz los 4 mecánicos y los autos que tiene cada uno. Permitir editar la asignación después.

**Supuesto de producto:**  
Todo vehículo activo se asigna a alguien al ingresar (no hay flujo de “sin asignar” en el ingreso). Si hace falta corregir, se puede editar.

---

## 2. Diseño de la solución

### Mecánicos del sistema
Lista fija de 4:
- Ramiro  
- Carlos  
- Ana  
- Luis  

### Al ingresar un vehículo
En el formulario **INGRESAR VEHÍCULO** se agrega un campo obligatorio:
- **Mecánico asignado** (selector con los 4 nombres)

Al guardar, el vehículo queda en estado ROJO (en reparación) **y** con mecánico asignado.

### En la tarjeta del vehículo
- Se muestra el nombre del mecánico asignado (badge o línea visible).
- Se puede **cambiar** el mecánico (selector o acción de edición simple), sin perder estado ni presupuesto.

### Panel de equipo (4 recuadros)
En un lugar visible (lateral en pantallas grandes / bloque superior o inferior en móvil):
- 4 recuadros: Ramiro, Carlos, Ana, Luis  
- En cada uno: cantidad de vehículos **activos** (no archivados) asignados  
- Al tocar un recuadro, filtrar la lista por ese mecánico  

### Filtro
Además de los filtros de semáforo existentes (Todos / Reparando / Cotizando / Listos / Historial):
- Poder filtrar por mecánico desde los recuadros

### Estética
- Se mantienen bordes y sombras del estilo arcade del proyecto.
- Se actualizan los colores de los botones del semáforo (rojo, amarillo y verde) para que el estado se lea con más claridad, sin cambiar el resto de la identidad visual.

### Datos a guardar (por vehículo)
```js
mecanicoAsignado: "Ramiro" | "Carlos" | "Ana" | "Luis"
```

Se guarda en `localStorage` junto con el resto de los datos del vehículo.

---

## 3. Criterios de aceptación

1. Al ingresar un vehículo nuevo, es **obligatorio** elegir un mecánico entre Ramiro, Carlos, Ana y Luis; sin eso no se guarda.
2. La tarjeta del vehículo muestra el **nombre del mecánico asignado**.
3. Existen **4 recuadros** (uno por mecánico) que muestran cuántos vehículos activos tiene cada uno.
4. Se puede **editar** el mecánico de un vehículo ya cargado y el cambio se refleja en la tarjeta y en los contadores de los recuadros.
5. Al tocar el recuadro de un mecánico, la lista muestra solo sus vehículos activos.

---

## 4. Métricas de éxito

| Métrica | Definición | Meta orientativa |
|--------|------------|------------------|
| **Cobertura de asignación** | % de vehículos activos con mecánico asignado | 100% en nuevos ingresos (campo obligatorio) |
| **Tiempo de asignación** | Esfuerzo al ingresar para dejar el auto asignado | ≤ 1 selección extra en el formulario de ingreso |
| **Uso del panel de equipo** | Responder “¿cuántos tiene Carlos?” mirando solo los recuadros | Contadores correctos en cada alta, edición o archivo |
| **Corrección de asignación** | Cambiar de mecánico sin romper estado ni presupuesto | 0 pérdidas de datos de estado o trabajo extra al reasignar |

Estas métricas se validan en uso del taller o con prueba manual (checklist). No requieren un dashboard en esta versión.

---

## 5. Fuera de alcance

- Login por mecánico o contraseñas  
- “Sin asignar” en el alta (el alta siempre asigna)  
- Notificaciones push al mecánico  
- Backend / sincronización entre dispositivos  
- Más de 4 mecánicos configurables desde la UI  

---

## 6. Pruebas

Las pruebas de este feature son **manuales**, según los criterios de aceptación.  
El detalle de pasos está en `TEST_CHECKLIST_ASIGNACION.md` (base para prueba manual ahora y, si en el futuro se desea, para automatizar).
