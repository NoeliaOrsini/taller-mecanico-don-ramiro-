// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Suite basada en TEST_CHECKLIST_ASIGNACION.md
 */

async function resetApp(page) {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.locator('#panel-mecanicos')).toBeVisible({ timeout: 10000 });
}

async function ingresarVehiculo(page, data) {
  await page.getByRole('button', { name: /INGRESAR VEHÍCULO/i }).click();
  await expect(page.locator('#modal-ingresar')).toBeVisible();

  await page.locator('#input-cliente').fill(data.cliente);
  await page.locator('#input-telefono').fill(data.telefono);
  await page.locator('#input-vehiculo').fill(data.vehiculo);
  await page.locator('#input-patente').fill(data.patente);
  await page.locator('#input-mecanico').selectOption({ label: data.mecanico });
  await page.locator('#input-motivo').fill(data.motivo);

  await page.locator('#form-ingresar').getByRole('button', { name: /GUARDAR/i }).click();
  await expect(page.locator('#modal-ingresar')).toBeHidden({ timeout: 10000 });
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

  test('Alta: ingreso con mecánico y badge visible en la tarjeta', async ({ page }) => {
    await ingresarVehiculo(page, {
      cliente: 'Cliente QA',
      telefono: '5491111111111',
      vehiculo: 'VW Gol QA',
      patente: 'QA111AA',
      motivo: 'Prueba automatizada de ingreso',
      mecanico: 'Ana',
    });

    await expect(page.locator('#vehiculos-container')).toContainText(/VW Gol QA/i);
    await expect(page.locator('#vehiculos-container')).toContainText(/Ana/i);
  });

  test('Panel: el contador del mecánico sube al asignar un auto activo', async ({ page }) => {
    const antes = Number(await page.locator('#count-mec-Carlos').innerText());
    await ingresarVehiculo(page, {
      cliente: 'Cliente Contador',
      telefono: '5491122222222',
      vehiculo: 'Fiat Contador',
      patente: 'CT222BB',
      motivo: 'Ver contador',
      mecanico: 'Carlos',
    });
    const despues = Number(await page.locator('#count-mec-Carlos').innerText());
    expect(despues).toBeGreaterThan(antes);
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
    await expect(page.locator('#filtro-mecanico-hint')).toBeVisible();
    await expect(page.locator('#filtro-mecanico-nombre')).toContainText(/Luis/i);
    await expect(page.locator('#vehiculos-container')).toContainText(/Peugeot Luis/i);
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
    await expect(page.locator('#filtro-mecanico-nombre')).toContainText(/Ramiro/i);
    await expect(page.locator('#vehiculos-container')).toContainText(/Renault Combo/i);
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

    const tarjeta = page.locator('#vehiculos-container .arcade-card').filter({ hasText: /Toyota Reasignar/i }).first();
    await tarjeta.locator('select').selectOption({ label: 'Luis' });
    await expect(tarjeta).toContainText(/Luis/i);
  });

  test('Semáforo: el filtro activo de reparación se marca en rojo', async ({ page }) => {
    await page.locator('#filter-ROJO').click();
    await expect(page.locator('#filter-ROJO')).toHaveClass(/bg-red-500/);
  });
});
