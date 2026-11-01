/* ============================================
   Taller Mecánico Don Ramiro - App Logic
   ============================================ */

const MECANICOS = ["Ramiro", "Carlos", "Ana", "Luis"];

const INITIAL_VEHICULOS = [
  {
    id: "veh-1",
    cliente: "Pepito Pérez",
    telefono: "5491112345678",
    vehiculo: "Fiat 500",
    patente: "AB 222 CD",
    motivo: "Pérdida de aceite al estacionar",
    estado: "AMARILLO",
    mecanicoAsignado: "Ramiro",
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
    mecanicoAsignado: "Carlos",
    trabajoExtra: null
  }
];

let vehiculos = [];
let currentFilter = 'TODOS';
let currentMecanicoFilter = null;

window.onload = function() {
  const stored = localStorage.getItem('don_ramiro_vehiculos');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        vehiculos = INITIAL_VEHICULOS;
        saveToLocalStorage();
      } else {
        vehiculos = parsed;
        let changed = false;
        vehiculos.forEach(v => {
          if (!v.mecanicoAsignado || !MECANICOS.includes(v.mecanicoAsignado)) {
            v.mecanicoAsignado = 'Ramiro';
            changed = true;
          }
        });
        if (changed) saveToLocalStorage();
      }
    } catch(e) {
      vehiculos = INITIAL_VEHICULOS;
      saveToLocalStorage();
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

function setMecanicoFilter(nombre) {
  if (nombre === null || currentMecanicoFilter === nombre) {
    currentMecanicoFilter = null;
  } else {
    currentMecanicoFilter = nombre;
  }
  render();
}

function cambiarMecanico(id, nuevoMecanico) {
  if (!MECANICOS.includes(nuevoMecanico)) return;
  const v = vehiculos.find(item => item.id === id);
  if (!v) return;
  v.mecanicoAsignado = nuevoMecanico;
  saveToLocalStorage();
  render();
  showToast(`${v.vehiculo} asignado a ${nuevoMecanico}`);
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
  const mecanico = document.getElementById('input-mecanico').value;
  if (!mecanico || !MECANICOS.includes(mecanico)) {
    showToast('Elegí un mecánico para asignar el vehículo');
    return;
  }
  const nuevo = {
    id: 'veh-' + Date.now(),
    cliente: document.getElementById('input-cliente').value.trim(),
    telefono: document.getElementById('input-telefono').value.trim(),
    vehiculo: document.getElementById('input-vehiculo').value.trim(),
    patente: document.getElementById('input-patente').value.trim().toUpperCase(),
    motivo: document.getElementById('input-motivo').value.trim(),
    estado: 'ROJO',
    mecanicoAsignado: mecanico,
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
    version: '1.1',
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

      vehiculos = lista.map(v => {
        if (!v.mecanicoAsignado || !MECANICOS.includes(v.mecanicoAsignado)) {
          v.mecanicoAsignado = 'Ramiro';
        }
        return v;
      });
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

  const filterStyles = {
    TODOS: {
      active: ['bg-slate-800', 'text-white'],
      idle: ['bg-white', 'text-slate-900'],
      countIdle: 'text-slate-900',
      labelIdle: 'text-slate-700'
    },
    ROJO: {
      active: ['bg-red-500', 'text-white'],
      idle: ['bg-white', 'text-slate-900'],
      countIdle: 'text-red-600',
      labelIdle: 'text-red-700'
    },
    AMARILLO: {
      active: ['bg-yellow-400', 'text-slate-900'],
      idle: ['bg-white', 'text-slate-900'],
      countIdle: 'text-amber-500',
      labelIdle: 'text-amber-800'
    },
    VERDE: {
      active: ['bg-green-500', 'text-white'],
      idle: ['bg-white', 'text-slate-900'],
      countIdle: 'text-emerald-600',
      labelIdle: 'text-emerald-800'
    },
    ARCHIVADO: {
      active: ['bg-slate-600', 'text-white'],
      idle: ['bg-slate-200', 'text-slate-900'],
      countIdle: 'text-slate-600',
      labelIdle: 'text-slate-700'
    }
  };

  ['TODOS', 'ROJO', 'AMARILLO', 'VERDE', 'ARCHIVADO'].forEach(key => {
    const btn = document.getElementById('filter-' + key);
    if (!btn) return;
    const countEl = btn.querySelector('span:first-child');
    const labelEl = btn.querySelector('span:last-child');
    const style = filterStyles[key];
    const isActive = currentFilter === key;

    btn.classList.remove(
      'bg-white', 'bg-slate-200', 'bg-slate-800', 'bg-slate-600',
      'bg-red-500', 'bg-yellow-400', 'bg-green-500', 'text-white', 'text-slate-900'
    );
    if (countEl) {
      countEl.classList.remove(
        'text-slate-900', 'text-red-600', 'text-amber-500', 'text-emerald-600',
        'text-slate-600', 'text-white'
      );
    }
    if (labelEl) {
      labelEl.classList.remove(
        'text-slate-700', 'text-red-700', 'text-amber-800', 'text-emerald-800',
        'text-white', 'text-slate-900'
      );
    }

    if (isActive) {
      style.active.forEach(c => btn.classList.add(c));
      if (key === 'AMARILLO') {
        if (countEl) countEl.classList.add('text-slate-900');
        if (labelEl) labelEl.classList.add('text-slate-900');
      } else {
        if (countEl) countEl.classList.add('text-white');
        if (labelEl) labelEl.classList.add('text-white');
      }
    } else {
      style.idle.forEach(c => btn.classList.add(c));
      if (countEl) countEl.classList.add(style.countIdle);
      if (labelEl) labelEl.classList.add(style.labelIdle);
    }
  });

  MECANICOS.forEach(nombre => {
    const n = vehiculos.filter(v => v.estado !== 'ARCHIVADO' && v.mecanicoAsignado === nombre).length;
    const el = document.getElementById('count-mec-' + nombre);
    if (el) el.innerText = n;
    const btn = document.getElementById('mec-' + nombre);
    if (btn) {
      btn.classList.remove('bg-blue-600', 'text-white', 'bg-white', 'ring-4', 'ring-blue-500');
      const title = btn.querySelector('span:nth-child(2)');
      const countM = btn.querySelector('span:nth-child(3)');
      const sub = btn.querySelector('span:nth-child(4)');
      const small = btn.querySelector('span:nth-child(1)');
      if (currentMecanicoFilter === nombre) {
        btn.classList.add('bg-blue-600', 'text-white');
        if (small) { small.classList.remove('text-slate-500'); small.classList.add('text-blue-100'); }
        if (title) { title.classList.remove('text-slate-900'); title.classList.add('text-white'); }
        if (countM) { countM.classList.remove('text-blue-600'); countM.classList.add('text-white'); }
        if (sub) { sub.classList.remove('text-slate-500'); sub.classList.add('text-blue-100'); }
      } else {
        btn.classList.add('bg-white');
        if (small) { small.classList.add('text-slate-500'); small.classList.remove('text-blue-100'); }
        if (title) { title.classList.add('text-slate-900'); title.classList.remove('text-white'); }
        if (countM) { countM.classList.add('text-blue-600'); countM.classList.remove('text-white'); }
        if (sub) { sub.classList.add('text-slate-500'); sub.classList.remove('text-blue-100'); }
      }
    }
  });

  const hint = document.getElementById('filtro-mecanico-hint');
  const hintName = document.getElementById('filtro-mecanico-nombre');
  if (hint && hintName) {
    const estadoLabel = {
      TODOS: 'Activos',
      ROJO: 'En reparación',
      AMARILLO: 'Cotizando',
      VERDE: 'Listos',
      ARCHIVADO: 'Historial'
    }[currentFilter] || currentFilter;

    if (currentMecanicoFilter) {
      hint.classList.remove('hidden');
      hintName.innerText = currentMecanicoFilter + ' · vista: ' + estadoLabel;
    } else {
      hint.classList.add('hidden');
    }
  }

  let list = [];
  if (currentFilter === 'TODOS') {
    list = vehiculos.filter(v => v.estado !== 'ARCHIVADO');
  } else {
    list = vehiculos.filter(v => v.estado === currentFilter);
  }
  if (currentMecanicoFilter && currentFilter !== 'ARCHIVADO') {
    list = list.filter(v => v.mecanicoAsignado === currentMecanicoFilter);
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
        <div>
          <div class="flex justify-between items-start mb-2">
            <div class="w-full">
              <span class="inline-block border-2 border-black ${badgeColor} text-[10px] sm:text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1.5">
                ${badgeText}
              </span>
              <h2 class="text-xl sm:text-2xl font-black text-slate-900 leading-tight uppercase break-words">${v.vehiculo}</h2>
              <p class="text-xs sm:text-sm font-bold text-slate-500 mt-0.5">${v.cliente} · <span class="bg-slate-200 border border-black px-1.5 py-0.5 rounded text-xs text-slate-900">${v.patente}</span></p>
              <div class="mt-2 flex flex-wrap items-center gap-2">
                <span class="inline-flex items-center gap-1 bg-blue-100 border-2 border-black text-blue-900 text-[10px] sm:text-xs font-black px-2 py-1 rounded-lg uppercase">
                  <i class="fa-solid fa-user-gear"></i> ${v.mecanicoAsignado || 'Ramiro'}
                </span>
                <select onchange="cambiarMecanico('${v.id}', this.value)" class="text-[10px] sm:text-xs font-bold border-2 border-black rounded-lg px-2 py-1 bg-white max-w-[140px]">
                  ${MECANICOS.map(m => `<option value="${m}" ${m === (v.mecanicoAsignado || 'Ramiro') ? 'selected' : ''}>${m}</option>`).join('')}
                </select>
              </div>
            </div>
          </div>

          <div class="bg-slate-100 border-2 border-black rounded-xl p-3 mt-3">
            <span class="text-[10px] font-black text-slate-500 uppercase block">Motivo de ingreso:</span>
            <p class="text-xs sm:text-sm font-bold text-slate-800">${v.motivo}</p>
          </div>

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
                  <i class="fa-solid fa-clock"></i> Registrado el: ${v.trabajoExtra.fechaAprobacion}
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
            <div class="mt-3 text-right">
              <button onclick="archivarVehiculo('${v.id}')" class="w-full arcade-btn-sm bg-slate-200 hover:bg-slate-300 text-slate-800 font-black py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1">
                <i class="fa-solid fa-box-archive"></i>
                <span>ARCHIVAR EN HISTORIAL</span>
              </button>
            </div>
          ` : `
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
