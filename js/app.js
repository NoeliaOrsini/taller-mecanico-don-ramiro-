/* ============================================
   Taller Mecánico Don Ramiro - App Logic
   ============================================ */

// Initial Seed Data
const INITIAL_VEHICULOS = [
  {
    id: "veh-1",
    cliente: "Pepito Pérez",
    telefono: "5491112345678",
    vehiculo: "Fiat 500",
    patente: "AB 222 CD",
    motivo: "Pérdida de aceite al estacionar",
    estado: "AMARILLO",
    trabajoExtra: {
      detalle: "Cambio de junta de carter y filtro de aceite adicional",
      costo: 85000,
      aprobado: false,
      fechaAprobacion: null,
      timestamp: null
    }
  },
  {
    id: "veh-2",
    cliente: "Laura Gómez",
    telefono: "5491187654321",
    vehiculo: "Toyota Corolla",
    patente: "AC 888 EF",
    motivo: "Service de 50.000km y alineación",
    estado: "ROJO",
    trabajoExtra: null
  }
];

let vehiculos = [];
let currentFilter = 'TODOS';

window.onload = function() {
  const stored = localStorage.getItem('don_ramiro_vehiculos');
  if (stored) {
    try {
      vehiculos = JSON.parse(stored);
    } catch(e) {
      vehiculos = INITIAL_VEHICULOS;
    }
  } else {
    vehiculos = INITIAL_VEHICULOS;
    saveToLocalStorage();
  }
  render();
};

function saveToLocalStorage() {
  localStorage.setItem('don_ramiro_vehiculos', JSON.stringify(vehiculos));
}

function setFilter(filter) {
  currentFilter = filter;
  render();
}

function changeEstado(id, nuevoEstado) {
  const v = vehiculos.find(item => item.id === id);
  if (v) {
    v.estado = nuevoEstado;
    saveToLocalStorage();
    render();
    showToast(`Estado de ${v.vehiculo} cambiado a ${nuevoEstado}`);
  }
}

function openIngresarModal() {
  document.getElementById('modal-ingresar').classList.remove('hidden');
}

function closeIngresarModal() {
  document.getElementById('modal-ingresar').classList.add('hidden');
  document.getElementById('form-ingresar').reset();
}

function openExtraModal(id) {
  document.getElementById('input-extra-vehiculo-id').value = id;
  document.getElementById('modal-extra').classList.remove('hidden');
}

function closeExtraModal() {
  document.getElementById('modal-extra').classList.add('hidden');
  document.getElementById('form-extra').reset();
}

function handleIngresarVehiculo(e) {
  e.preventDefault();
  const nuevo = {
    id: 'veh-' + Date.now(),
    cliente: document.getElementById('input-cliente').value.trim(),
    telefono: document.getElementById('input-telefono').value.trim(),
    vehiculo: document.getElementById('input-vehiculo').value.trim(),
    patente: document.getElementById('input-patente').value.trim().toUpperCase(),
    motivo: document.getElementById('input-motivo').value.trim(),
    estado: 'ROJO',
    trabajoExtra: null
  };

  vehiculos.unshift(nuevo);
  saveToLocalStorage();
  closeIngresarModal();
  render();
  showToast("¡Vehículo ingresado con éxito!");
}

function handleGuardarExtra(e) {
  e.preventDefault();
  const id = document.getElementById('input-extra-vehiculo-id').value;
  const detalle = document.getElementById('input-extra-detalle').value.trim();
  const costo = parseFloat(document.getElementById('input-extra-costo').value);

  const v = vehiculos.find(item => item.id === id);
  if (v) {
    v.trabajoExtra = {
      detalle: detalle,
      costo: costo,
      aprobado: false,
      fechaAprobacion: null,
      timestamp: Date.now()
    };
    v.estado = 'AMARILLO';
    saveToLocalStorage();
    closeExtraModal();
    render();
    showToast("Trabajo extra registrado. Estado cambiado a AMARILLO.");
  }
}

function simularAprobacionCliente(id) {
  const v = vehiculos.find(item => item.id === id);
  if (v && v.trabajoExtra) {
    v.trabajoExtra.aprobado = true;
    v.trabajoExtra.fechaAprobacion = new Date().toLocaleString('es-AR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    v.estado = 'ROJO';
    saveToLocalStorage();
    render();
    showToast("¡Presupuesto aprobado con registro de marca de tiempo!");
  }
}

function archivarVehiculo(id) {
  const v = vehiculos.find(item => item.id === id);
  if (!v) return;
  
  v.estado = 'ARCHIVADO';
  saveToLocalStorage();
  render();
  showToast(`${v.vehiculo} archivado en el Historial.`);
}

function reactivarVehiculo(id) {
  const v = vehiculos.find(item => item.id === id);
  if (!v) return;
  
  v.estado = 'ROJO';
  saveToLocalStorage();
  render();
  showToast(`${v.vehiculo} reactivado en el taller.`);
}

function eliminarVehiculo(id) {
  const v = vehiculos.find(item => item.id === id);
  if (!v) return;

  const confirmar = confirm(`¿Eliminar definitivamente el vehículo ${v.vehiculo} (${v.patente})?\n\nEsta acción no se puede deshacer. Asegurate de haber exportado el backup si necesitás conservar el historial.`);
  if (!confirmar) return;

  vehiculos = vehiculos.filter(item => item.id !== id);
  saveToLocalStorage();
  render();
  showToast(`${v.vehiculo} eliminado definitivamente.`);
}

function exportarBackup() {
  const data = {
    exportadoEn: new Date().toISOString(),
    version: '1.0',
    total: vehiculos.length,
    vehiculos: vehiculos
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const fecha = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `don-ramiro-backup-${fecha}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Backup exportado correctamente');
}

function importarBackup(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      let lista = [];

      if (Array.isArray(data)) {
        lista = data;
      } else if (data.vehiculos && Array.isArray(data.vehiculos)) {
        lista = data.vehiculos;
      } else {
        throw new Error('Formato no válido');
      }

      const confirmar = confirm(`Se van a importar ${lista.length} vehículo(s).\n\nEsto reemplazará los datos actuales de la app.\n¿Continuar?`);
      if (!confirmar) {
        event.target.value = '';
        return;
      }

      vehiculos = lista;
      saveToLocalStorage();
      render();
      showToast(`Importados ${lista.length} vehículos`);
    } catch (err) {
      showToast('Error: archivo no válido');
      console.error(err);
    }
    event.target.value = '';
  };
  reader.readAsText(file);
}

function enviarWhatsAppAviso(id) {
  const v = vehiculos.find(item => item.id === id);
  if (!v) return;

  const telefonoLimpio = v.telefono.replace(/\D/g, '');

  if (!telefonoLimpio) {
    showToast("Número de teléfono no válido");
    return;
  }

  let mensaje = "";
  if (v.estado === 'AMARILLO' && v.trabajoExtra) {
    mensaje = `Hola ${v.cliente}, te escribimos de Taller Don Ramiro. Al revisar tu ${v.vehiculo} (${v.patente}) encontramos una reparación adicional necesaria: *${v.trabajoExtra.detalle}*. El costo adicional es de *$${v.trabajoExtra.costo.toLocaleString()}*. Por favor responde este mensaje para autorizar el trabajo. Gracias!`;
  } else if (v.estado === 'VERDE') {
    mensaje = `Hola ${v.cliente}, te avisamos de Taller Don Ramiro que tu vehículo *${v.vehiculo}* (${v.patente}) ya está LISTO para retirar. Podés pasar a buscarlo!`;
  } else {
    mensaje = `Hola ${v.cliente}, te escribimos de Taller Don Ramiro sobre tu vehículo *${v.vehiculo}* (${v.patente}).`;
  }

  const url = `https://wa.me/${telefonoLimpio}?text=${encodeURIComponent(mensaje)}`;
  window.location.href = url;
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  toastMsg.innerText = msg;
  toast.classList.remove('hidden');
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

function render() {
  // Update counters
  const countActivos = vehiculos.filter(v => v.estado !== 'ARCHIVADO').length;
  const countRojo = vehiculos.filter(v => v.estado === 'ROJO').length;
  const countAmarillo = vehiculos.filter(v => v.estado === 'AMARILLO').length;
  const countVerde = vehiculos.filter(v => v.estado === 'VERDE').length;
  const countArchivado = vehiculos.filter(v => v.estado === 'ARCHIVADO').length;

  document.getElementById('count-todos').innerText = countActivos;
  document.getElementById('count-rojo').innerText = countRojo;
  document.getElementById('count-amarillo').innerText = countAmarillo;
  document.getElementById('count-verde').innerText = countVerde;
  document.getElementById('count-archivado').innerText = countArchivado;

  // Filter vehicles
  let list = [];
  if (currentFilter === 'TODOS') {
    list = vehiculos.filter(v => v.estado !== 'ARCHIVADO');
  } else {
    list = vehiculos.filter(v => v.estado === currentFilter);
  }

  const container = document.getElementById('vehiculos-container');
  const emptyState = document.getElementById('empty-state');

  if (list.length === 0) {
    container.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  container.innerHTML = list.map(v => {
    let badgeColor = "bg-red-500 text-white";
    let badgeText = "EN REPARACIÓN";
    if (v.estado === 'AMARILLO') {
      badgeColor = "bg-amber-400 text-slate-900";
      badgeText = "ESPERANDO APROBACIÓN";
    } else if (v.estado === 'VERDE') {
      badgeColor = "bg-emerald-500 text-white";
      badgeText = "LISTO PARA RETIRAR";
    } else if (v.estado === 'ARCHIVADO') {
      badgeColor = "bg-slate-600 text-white";
      badgeText = "ARCHIVADO EN HISTORIAL";
    }

    return `
      <div class="bg-white rounded-3xl p-4 sm:p-5 arcade-card flex flex-col justify-between space-y-4">
        
        <!-- Card Header -->
        <div>
          <div class="flex justify-between items-start mb-2">
            <div class="w-full">
              <span class="inline-block border-2 border-black ${badgeColor} text-[10px] sm:text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1.5">
                ${badgeText}
              </span>
              <h2 class="text-xl sm:text-2xl font-black text-slate-900 leading-tight uppercase break-words">${v.vehiculo}</h2>
              <p class="text-xs sm:text-sm font-bold text-slate-500 mt-0.5">${v.cliente} · <span class="bg-slate-200 border border-black px-1.5 py-0.5 rounded text-xs text-slate-900">${v.patente}</span></p>
            </div>
          </div>

          <!-- Motivo Inicial -->
          <div class="bg-slate-100 border-2 border-black rounded-xl p-3 mt-3">
            <span class="text-[10px] font-black text-slate-500 uppercase block">Motivo de ingreso:</span>
            <p class="text-xs sm:text-sm font-bold text-slate-800">${v.motivo}</p>
          </div>

          <!-- Sección Trabajo Extra Adicional (si existe) -->
          ${v.trabajoExtra ? `
            <div class="mt-3 p-3 sm:p-3.5 border-3 border-black rounded-2xl ${v.trabajoExtra.aprobado ? 'bg-emerald-50 border-emerald-600' : 'bg-amber-50 border-amber-500'}">
              <div class="flex flex-wrap items-center justify-between gap-1">
                <span class="text-xs font-black uppercase ${v.trabajoExtra.aprobado ? 'text-emerald-800' : 'text-amber-800'} flex items-center gap-1">
                  <i class="fa-solid ${v.trabajoExtra.aprobado ? 'fa-circle-check text-emerald-600' : 'fa-triangle-exclamation text-amber-600'}"></i>
                  ${v.trabajoExtra.aprobado ? 'Presupuesto Aprobado' : 'Trabajo Adicional Pendiente'}
                </span>
                <span class="text-sm sm:text-base font-black text-slate-900">$${v.trabajoExtra.costo.toLocaleString('es-AR')}</span>
              </div>
              <p class="text-xs sm:text-sm font-bold text-slate-800 mt-1">${v.trabajoExtra.detalle}</p>
              
              ${v.trabajoExtra.aprobado ? `
                <div class="mt-2 text-[10px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-400 p-1.5 rounded-lg">
                  <i class="fa-solid fa-clock-check"></i> Registrado el: ${v.trabajoExtra.fechaAprobacion}
                </div>
              ` : `
                <button onclick="simularAprobacionCliente('${v.id}')" class="mt-3 w-full arcade-btn-sm bg-emerald-500 hover:bg-emerald-400 text-white font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center space-x-2">
                  <i class="fa-solid fa-check-double text-sm"></i>
                  <span>SIMULAR APROBACIÓN DEL CLIENTE</span>
                </button>
              `}
            </div>
          ` : ''}
        </div>

        <!-- Botones Semáforo Táctiles -->
        <div>
          ${v.estado !== 'ARCHIVADO' ? `
            <span class="block text-[10px] font-black text-slate-500 uppercase mb-1.5">Cambiar estado del auto:</span>
            <div class="grid grid-cols-3 gap-1.5 sm:gap-2">
              <button onclick="changeEstado('${v.id}', 'ROJO')" class="arcade-btn-sm py-2.5 px-1 rounded-xl font-black text-[11px] sm:text-xs uppercase flex items-center justify-center gap-1 ${v.estado === 'ROJO' ? 'btn-rojo-active' : 'bg-slate-100 text-slate-700 hover:bg-red-100'}">
                <span>🔴</span> <span class="hidden sm:inline">Reparando</span><span class="sm:hidden">Repara</span>
              </button>

              <button onclick="changeEstado('${v.id}', 'AMARILLO')" class="arcade-btn-sm py-2.5 px-1 rounded-xl font-black text-[11px] sm:text-xs uppercase flex items-center justify-center gap-1 ${v.estado === 'AMARILLO' ? 'btn-amarillo-active' : 'bg-slate-100 text-slate-700 hover:bg-amber-100'}">
                <span>🟡</span> <span class="hidden sm:inline">Cotizando</span><span class="sm:hidden">Cotiza</span>
              </button>

              <button onclick="changeEstado('${v.id}', 'VERDE')" class="arcade-btn-sm py-2.5 px-1 rounded-xl font-black text-[11px] sm:text-xs uppercase flex items-center justify-center gap-1 ${v.estado === 'VERDE' ? 'btn-verde-active' : 'bg-slate-100 text-slate-700 hover:bg-emerald-100'}">
                <span>🟢</span> <span>Listo</span>
              </button>
            </div>

            <!-- Acciones WhatsApp y Extra -->
            <div class="grid grid-cols-2 gap-2 mt-3 pt-3 border-t-2 border-slate-200">
              <button onclick="openExtraModal('${v.id}')" class="arcade-btn-sm bg-amber-400 hover:bg-amber-300 text-slate-900 font-black py-2.5 px-2 rounded-xl text-xs flex items-center justify-center space-x-1">
                <i class="fa-solid fa-plus-circle"></i>
                <span>+ EXTRA</span>
              </button>

              <button onclick="enviarWhatsAppAviso('${v.id}')" class="arcade-btn-sm bg-emerald-600 hover:bg-emerald-500 text-white font-black py-2.5 px-2 rounded-xl text-xs flex items-center justify-center space-x-1">
                <i class="fa-brands fa-whatsapp text-sm sm:text-base"></i>
                <span>WHATSAPP</span>
              </button>
            </div>

            <!-- Botón de Archivar -->
            <div class="mt-3 text-right">
              <button onclick="archivarVehiculo('${v.id}')" class="w-full arcade-btn-sm bg-slate-200 hover:bg-slate-300 text-slate-800 font-black py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1">
                <i class="fa-solid fa-box-archive"></i>
                <span>ARCHIVAR EN HISTORIAL</span>
              </button>
            </div>
          ` : `
            <!-- Estado Archivados -->
            <div class="pt-2 border-t-2 border-slate-200 grid grid-cols-2 gap-2">
              <button onclick="reactivarVehiculo('${v.id}')" class="arcade-btn-sm bg-blue-600 hover:bg-blue-500 text-white font-black py-2 px-2 rounded-xl text-xs flex items-center justify-center gap-1">
                <i class="fa-solid fa-rotate-left"></i>
                <span>REACTIVAR</span>
              </button>
              <button onclick="eliminarVehiculo('${v.id}')" class="arcade-btn-sm bg-red-500 hover:bg-red-400 text-white font-black py-2 px-2 rounded-xl text-xs flex items-center justify-center gap-1">
                <i class="fa-solid fa-trash"></i>
                <span>ELIMINAR</span>
              </button>
            </div>
          `}
        </div>

      </div>
    `;
  }).join('');
}
