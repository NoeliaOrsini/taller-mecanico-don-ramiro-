# Checklist de prueba manual — Asignación de mecánico

Contexto: app en navegador (local o GitHub Pages). Tablet o celular preferible.

## Preparación
- [ ] Abrir la app con datos limpios o exportar backup antes de probar
- [ ] Verificar que se ven los 4 mecánicos: Ramiro, Carlos, Ana, Luis

## Alta con asignación
- [ ] Abrir INGRESAR VEHÍCULO
- [ ] Completar datos y elegir mecánico (ej. Ramiro)
- [ ] Guardar → el auto aparece en ROJO con el nombre del mecánico asignado
- [ ] Intentar guardar sin mecánico → no debe permitir (campo obligatorio)

## Panel de 4 recuadros
- [ ] Al dar de alta un auto a Carlos, el contador de Carlos suma 1
- [ ] Los otros contadores no cambian sin motivo
- [ ] Archivar ese auto → el contador de activos de Carlos resta 1

## Edición de asignación
- [ ] En un auto de Ana, cambiar a Luis
- [ ] La tarjeta muestra Luis
- [ ] Contador de Ana baja y el de Luis sube
- [ ] El estado del semáforo y un trabajo extra (si había) se mantienen

## Filtro por mecánico
- [ ] Tocar el recuadro de Ramiro
- [ ] Solo se listan autos activos de Ramiro
- [ ] Volver a la vista general y se ven todos los activos

## Regresión rápida (no romper lo anterior)
- [ ] Semáforo ROJO / AMARILLO / VERDE sigue funcionando
- [ ] + EXTRA y aprobación con marca de tiempo siguen funcionando
- [ ] WhatsApp de un clic sigue armando el mensaje
- [ ] Exportar / Importar conserva el campo mecanicoAsignado

## Resultado
- Fecha de prueba: ________  
- Probado por: ________  
- ¿Pasaron todos los criterios de la SPEC? Sí / No  
- Notas: ________
