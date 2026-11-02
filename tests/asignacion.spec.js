// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Suite basada en TEST_CHECKLIST_ASIGNACION.md
 * (criterios de aceptación del feature de asignación de mecánico)
 */

async function resetApp(page) {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.reload();
  await expect(page.locator('#panel-mecanicos')).toBeVisible();
}

async function ingresarVehiculo(page, { cliente, telefono, vehiculo, patente, motivo, mecanico }) {
  await page.locator('button', { hasText: 'INGRESAR VEHÍCULO' }).click();
  await expect(page.locator('#modal-ingresar')).not.toHaveClass(/hidden/);
  await page.locator('#input-cliente').fill(cliente);
  await page.locator('#input-telefono').fill(telefono);
  await page.locator('#input-vehiculo').fill(vehiculo);
  await page.locator('#input-patente').fill(patente);
  await page.locator('#input-mecanico').selectOption(mecanico);
  await page.locator('#input-motivo').fill(motivo);
  await page.locator('#form-ingresar button[type="submit"]').click();
  await expect(page.locator('#modal-ingresar')).toHaveClass(/hidden/);
}

test.describe('Asignación de mecánico (checklist)', () => {
  test.beforeEach(async ({ page }) => {
    await resetApp(page);
  });

  test('Preparación: se ven los 4 mecánicos del equipo', async ({ page }) => {
    for (const nombre of ['Ramiro', 'Carlos', 'Ana', 'Luis']) {
      await expect(page.locator(`#mec-${nombre}`)).toBeVisible();
      await expect(page.locator(`#count-mec-${nombre}`)).toBeVisible();
    }
  });

  test('Alta: ingreso con mecánico obligatorio y visible en la tarjeta', async ({ page }) => {
    await ingresarVehiculo(page, {
      cliente: 'Cliente QA',
      telefono: '5491111111111',
      vehiculo: 'VW Gol QA',
      patente: 'QA111AA',
      motivo: 'Prueba automatizada de ingreso',
      mecanico: 'Ana',
    });

    const tarjeta = page.locator('#vehiculos-container').locator('div.arcade-card', { hasText: 'VW GOL QA' }).first();
    await expect(tarjeta).toBeVisible();
    await expect(tarjeta.getByText('ANA', { exact: false })).toBeVisible();
  });

  test('Panel: el contador del mecánico sube al asignar un auto activo', async ({ page }) => {
    const antes = await page.locator('#count-mec-Carlos').innerText();
    await ingresarVehiculo(page, {
      cliente: 'Cliente Contador',
      telefono: '5491122222222',
      vehiculo: 'Fiat Contador',
      patente: 'CT222BB',
      motivo: 'Ver contador',
      mecanico: 'Carlos',
    });
    const despues = await page.locator('#count-mec-Carlos').innerText();
    expect(Number(despues)).toBeGreaterThan(Number(antes));
  });

  test('Filtro por mecánico: al tocar un recuadro filtra y muestra leyenda', async ({ page }) => {
    await ingresarVehiculo(page, {
      cliente: 'Solo Luis',
      telefono: '5491133333333',
      vehiculo: 'Peugeot Luis',
      patente: 'LU333CC',
      motivo: 'Filtro mecánico',
      mecanico: 'Luis',
    });

    await page.locator('#mec-Luis').click();
    await expect(page.locator('#filtro-mecanico-hint')).not.toHaveClass(/hidden/);
    await expect(page.locator('#filtro-mecanico-nombre')).toContainText('Luis');
    await expect(page.locator('#vehiculos-container')).toContainText('PEUGEOT LUIS');
  });

  test('Filtro combinado: estado + mecánico', async ({ page }) => {
    await ingresarVehiculo(page, {
      cliente: 'Combo',
      telefono: '5491144444444',
      vehiculo: 'Renault Combo',
      patente: 'CB444DD',
      motivo: 'Filtro combinado',
      mecanico: 'Ramiro',
    });

    await page.locator('#filter-ROJO').click();
    await page.locator('#mec-Ramiro').click();
    await expect(page.locator('#filtro-mecanico-nombre')).toContainText('Ramiro');
    await expect(page.locator('#vehiculos-container')).toContainText('RENAULT COMBO');
  });

  test('Edición: se puede cambiar el mecánico desde la tarjeta', async ({ page }) => {
    await ingresarVehiculo(page, {
      cliente: 'Reasignar',
      telefono: '5491155555555',
      vehiculo: 'Toyota Reasignar',
      patente: 'RS555EE',
      motivo: 'Cambio de mecánico',
      mecanico: 'Ana',
    });

    const tarjeta = page.locator('#vehiculos-container').locator('div.arcade-card', { hasText: 'TOYOTA REASIGNAR' }).first();
    await tarjeta.locator('select').selectOption('Luis');
    await expect(tarjeta.getByText('LUIS', { exact: false })).toBeVisible();
  });

  test('Semáforo: el filtro activo de reparación se marca en rojo', async ({ page }) => {
    await page.locator('#filter-ROJO').click();
    await expect(page.locator('#filter-ROJO')).toHaveClass(/bg-red-500/);
  });
});
