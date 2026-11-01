# Checklist de prueba manual — Asignación de mecánico

Contexto: app en navegador (local, rama `feature/asignacion-mecanico`). Tablet o celular preferible.

**Prueba realizada:** 01/11/2026 · 19:24 (hora Argentina)  
**Probado por:** Noelia Orsini  
**Resultado general:** Criterios de la SPEC cumplidos (con corrección de filtro en Historial durante la prueba).

## Preparación
- [x] Abrir la app con la estructura completa (`index.html` + `js/` + `css/`)
- [x] Verificar que se ven los 4 mecánicos: Ramiro, Carlos, Ana, Luis

## Alta con asignación
- [x] Abrir INGRESAR VEHÍCULO
- [x] Completar datos y elegir mecánico
- [x] Guardar → el auto aparece con el nombre del mecánico asignado
- [x] Intentar guardar sin mecánico → no permite (campo obligatorio)

## Panel de 4 recuadros
- [x] Al dar de alta / reasignar, los contadores de activos se actualizan
- [x] Archivar un auto → el contador de activos de ese mecánico resta

## Edición de asignación
- [x] Cambiar mecánico desde la tarjeta
- [x] La tarjeta y los contadores reflejan el cambio
- [x] Estado del semáforo y trabajo extra se mantienen

## Filtro por mecánico y semáforo
- [x] Tocar un mecánico filtra la lista
- [x] La vista activa del semáforo se distingue por color sólido
- [x] El mecánico seleccionado se distingue (azul)
- [x] Leyenda de filtro visible (mecánico · vista)
- [x] Historial + mecánico solo muestra autos de ese mecánico (bug corregido en la prueba)
- [x] “Ver todos” quita el filtro de mecánico

## Regresión
- [x] Semáforo ROJO / AMARILLO / VERDE
- [x] + EXTRA y aprobación con marca de tiempo
- [x] WhatsApp de un clic
- [x] Exportar conserva datos (incl. mecánico)
- [x] Eliminar desde historial

## Notas
- Datos de ejemplo previos se reasignaron en prueba; el flujo de uso diario arranca con asignación al ingresar.
- Captura de referencia del feature: `assets/panel_mecanicos_filtro.png`
