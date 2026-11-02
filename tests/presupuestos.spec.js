// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Humo del flujo de presupuestos (SPEC clase 1 / SPEC_PRESUPUESTOS)
 * Sin WhatsApp (se valida manual en celular).
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

test.describe('Presupuestos y trabajo extra (humo)', () => {
  test.beforeEach(async ({ page }) => {
    await resetApp(page);
  });

  test('Alta + EXTRA: registra trabajo, costo y pasa a esperando aprobación', async ({ page }) => {
    await ingresarVehiculo(page, {
      cliente: 'Cliente Extra',
      telefono: '5491166666666',
      vehiculo: 'Focus Extra',
      patente: 'EX666FF',
      motivo: 'Ruido en motor',
      mecanico: 'Carlos',
    });

    const tarjeta = page.locator('#vehiculos-container .arcade-card').filter({ hasText: /Focus Extra/i }).first();
    await tarjeta.getByRole('button', { name: /EXTRA/i }).click();
    await expect(page.locator('#modal-extra')).toBeVisible();

    await page.locator('#input-extra-detalle').fill('Cambio de kit de distribución');
    await page.locator('#input-extra-costo').fill('120000');
    await page.locator('#form-extra').getByRole('button', { name: /REGISTRAR/i }).click();
    await expect(page.locator('#modal-extra')).toBeHidden({ timeout: 10000 });

    await expect(tarjeta).toContainText(/Cambio de kit de distribución/i);
    await expect(tarjeta).toContainText(/120/);
    await expect(tarjeta).toContainText(/ESPERANDO APROBACIÓN|Trabajo Adicional Pendiente|PENDIENTE/i);
  });

  test('Aprobación: marca de tiempo y vuelve a en reparación', async ({ page }) => {
    await ingresarVehiculo(page, {
      cliente: 'Cliente Aprobado',
      telefono: '5491177777777',
      vehiculo: 'Corolla Aprobado',
      patente: 'AP777GG',
      motivo: 'Service',
      mecanico: 'Ana',
    });

    const tarjeta = page.locator('#vehiculos-container .arcade-card').filter({ hasText: /Corolla Aprobado/i }).first();
    await tarjeta.getByRole('button', { name: /EXTRA/i }).click();
    await page.locator('#input-extra-detalle').fill('Pastillas de freno');
    await page.locator('#input-extra-costo').fill('45000');
    await page.locator('#form-extra').getByRole('button', { name: /REGISTRAR/i }).click();
    await expect(page.locator('#modal-extra')).toBeHidden({ timeout: 10000 });

    await tarjeta.getByRole('button', { name: /SIMULAR APROBACIÓN/i }).click();

    await expect(tarjeta).toContainText(/Presupuesto Aprobado|APROBADO/i);
    await expect(tarjeta).toContainText(/Registrado el:/i);
    await expect(tarjeta).toContainText(/EN REPARACIÓN/i);
  });

  test('Botón WhatsApp visible en tarjeta activa (sin abrir wa.me)', async ({ page }) => {
    await ingresarVehiculo(page, {
      cliente: 'Cliente WA',
      telefono: '5491188888888',
      vehiculo: 'Gol WhatsApp',
      patente: 'WA888HH',
      motivo: 'Control botón',
      mecanico: 'Luis',
    });

    const tarjeta = page.locator('#vehiculos-container .arcade-card').filter({ hasText: /Gol WhatsApp/i }).first();
    await expect(tarjeta.getByRole('button', { name: /WHATSAPP/i })).toBeVisible();
  });
});
