// ══════════════════════════════════════
// MIDAS – AFP Habitat
// Archivo: midas_app.js
// ══════════════════════════════════════

// ─── DATA ───────────────────────────
const FONDOS = [
  { code: 'FOND',   desc: 'Negocio del Fondo' },
  { code: 'FONDO1', desc: 'Fondo Tipo 1 – Conservador' },
  { code: 'FONDO2', desc: 'Fondo Tipo 2 – Mixto' },
  { code: 'FONDO3', desc: 'Fondo Tipo 3 – Crecimiento' },
];

const BANCOS = [
  { code: '108', desc: 'BBVA SECURITIES INC' },
  { code: '001', desc: 'BANCO DE CRÉDITO DEL PERÚ (BCP)' },
  { code: '011', desc: 'INTERBANK' },
  { code: '018', desc: 'BANCO DE LA NACIÓN' },
  { code: '023', desc: 'BANCO PICHINCHA' },
  { code: '056', desc: 'SCOTIABANK PERÚ' },
];

const TIPO_CAMBIO = { USD: 3.72, EUR: 4.01 };
const MONEDA_DESC = { USD: 'Dólares Americanos', EUR: 'Euros' };

const PAGO_CODIGOS = {
  CHEQUE:    'CHEQ',
  CHEQUE_GER:'CHGE',
  CXP:       'CXP',
  TRANS_BCR: 'TRBC',
  TRANS_EXT: 'TREX',
  TRANS_INT: 'TRNS',
  TRANS_SB:  'TRSB',
};

let selectedFondo = null;
let selectedBanco = null;
let tmpFondo = null;
let tmpBanco = null;


// ─── INICIALIZACIÓN ─────────────────
window.onload = function () {
  // Fecha de hoy automática
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  document.getElementById('fecha-liq').value = `${yyyy}-${mm}-${dd}`;
  document.getElementById('status-fecha').textContent = `${dd}/${mm}/${yyyy}`;

  // Construir lista de fondos
  const fl = document.getElementById('fondo-list');
  FONDOS.forEach((f, i) => {
    const div = document.createElement('div');
    div.className = 'fondo-item';
    div.dataset.index = i;
    div.innerHTML = `<span class="fcode">${f.code}</span><span>${f.desc}</span>`;
    div.onclick = () => selectFondoItem(i);
    fl.appendChild(div);
  });

  // Construir lista de bancos
  const bl = document.getElementById('banco-list');
  BANCOS.forEach((b, i) => {
    const div = document.createElement('div');
    div.className = 'fondo-item';
    div.dataset.index = i;
    div.innerHTML = `<span class="fcode">${b.code}</span><span>${b.desc}</span>`;
    div.onclick = () => selectBancoItem(i);
    bl.appendChild(div);
  });

  // Cerrar modales al hacer clic fuera
  document.getElementById('fondo-overlay').addEventListener('click', function (e) {
    if (e.target === this) closeFondoModal();
  });
  document.getElementById('contraparte-overlay').addEventListener('click', function (e) {
    if (e.target === this) closeContraparteModal();
  });
  document.getElementById('resumen-overlay').addEventListener('click', function (e) {
    if (e.target === this) closeResumenModal();
  });
};


// ─── MODAL: FONDO ───────────────────
function openFondoModal() {
  document.getElementById('fondo-overlay').classList.add('active');
}

function closeFondoModal() {
  document.getElementById('fondo-overlay').classList.remove('active');
}

function selectFondoItem(i) {
  tmpFondo = i;
  document.querySelectorAll('#fondo-list .fondo-item').forEach((el, idx) => {
    el.classList.toggle('selected', idx === i);
  });
}

function confirmFondo() {
  if (tmpFondo === null) return;
  selectedFondo = FONDOS[tmpFondo];
  document.getElementById('fondo-code').value = selectedFondo.code;
  document.getElementById('fondo-desc').value = selectedFondo.desc;
  closeFondoModal();
  setStatus(`Fondo seleccionado: ${selectedFondo.code}`);
  validateForm();
}


// ─── TIPO DE OPERACIÓN ──────────────
function onTipoOpChange() {
  validateForm();
}


// ─── MONEDA ─────────────────────────
function onMonedaChange() {
  const code = document.getElementById('moneda-code').value;
  if (code) {
    document.getElementById('moneda-desc').value = MONEDA_DESC[code];
    document.getElementById('tipo-cambio').value = TIPO_CAMBIO[code].toFixed(3);
    document.getElementById('monto-moneda').textContent = code;
  } else {
    document.getElementById('moneda-desc').value = '';
    document.getElementById('tipo-cambio').value = '';
    document.getElementById('monto-moneda').textContent = '';
  }
  calcularSoles();
}


// ─── FORMA DE PAGO ──────────────────
function onFormaPagoChange() {
  const val = document.getElementById('forma-pago').value;
  const rowCP = document.getElementById('row-contraparte');

  // Autocompleta el código de forma de pago
  document.getElementById('pago-code').value = val ? PAGO_CODIGOS[val] : '';

  if (val === 'TRANS_INT') {
    rowCP.classList.remove('hidden');
  } else {
    rowCP.classList.add('hidden');
    document.getElementById('contraparte-code').value = '';
    document.getElementById('contraparte-desc').value = '';
    selectedBanco = null;
  }
  validateForm();
}


// ─── MODAL: CONTRAPARTE (BANCO) ─────
function openContraparteModal() {
  document.getElementById('contraparte-overlay').classList.add('active');
}

function closeContraparteModal() {
  document.getElementById('contraparte-overlay').classList.remove('active');
}

function selectBancoItem(i) {
  tmpBanco = i;
  document.querySelectorAll('#banco-list .fondo-item').forEach((el, idx) => {
    el.classList.toggle('selected', idx === i);
  });
}

function confirmBanco() {
  if (tmpBanco === null) return;
  selectedBanco = BANCOS[tmpBanco];
  document.getElementById('contraparte-code').value = selectedBanco.code;
  document.getElementById('contraparte-desc').value = selectedBanco.desc;
  closeContraparteModal();
  validateForm();
}

function onContraparteInput() {
  const code = document.getElementById('contraparte-code').value.trim();
  const found = BANCOS.find(b => b.code === code);
  if (found) {
    document.getElementById('contraparte-desc').value = found.desc;
    selectedBanco = found;
  } else {
    document.getElementById('contraparte-desc').value = '';
  }
  validateForm();
}


// ─── CÁLCULO EQUIVALENTE EN SOLES ───
function calcularSoles() {
  const monto = parseFloat(document.getElementById('monto').value);
  const tc    = parseFloat(document.getElementById('tipo-cambio').value);
  const campo = document.getElementById('monto-soles');

  if (!isNaN(monto) && !isNaN(tc) && monto > 0) {
    const enSoles = (monto * tc).toFixed(2);
    campo.value = 'S/. ' + Number(enSoles).toLocaleString('es-PE', { minimumFractionDigits: 2 });
  } else {
    campo.value = '';
  }
  validateForm();
}

// ─── VALIDACIÓN DEL FORMULARIO ──────
function validateForm() {
  const fondo  = document.getElementById('fondo-code').value.trim();
  const tipoOp = document.getElementById('tipo-op').value;
  const moneda = document.getElementById('moneda-code').value;
  const monto  = parseFloat(document.getElementById('monto').value);
  const pago   = document.getElementById('forma-pago').value;
  const esInt  = pago === 'TRANS_INT';
  const contra = document.getElementById('contraparte-code').value.trim();

  let ok = fondo && tipoOp && moneda && monto > 0 && pago;
  if (esInt) ok = ok && contra;

  document.getElementById('btn-generar').disabled = !ok;
  if (ok) setStatus('Datos completos. Listo para generar liquidación.');
}


// ─── MODAL: RESUMEN ─────────────────
async function openResumenModal() {
  const fondoCode = document.getElementById('fondo-code').value;
  const fondoDesc = document.getElementById('fondo-desc').value;
  const tipoOp    = document.getElementById('tipo-op');
  const fecha     = document.getElementById('fecha-liq').value;
  const monedaC   = document.getElementById('moneda-code').value;
  const monedaD   = document.getElementById('moneda-desc').value;
  const tc        = document.getElementById('tipo-cambio').value;
  const monto     = parseFloat(document.getElementById('monto').value).toFixed(2);
  const pago      = document.getElementById('forma-pago');
  const contraC   = document.getElementById('contraparte-code').value;
  const contraD   = document.getElementById('contraparte-desc').value;

  const [y, m, d] = fecha.split('-');
  const fechaFmt = `${d}/${m}/${y}`;

  document.getElementById('sum-fondo').textContent     = `${fondoCode} – ${fondoDesc}`;
  document.getElementById('sum-tipo').textContent      = tipoOp.options[tipoOp.selectedIndex].text;
  document.getElementById('sum-fecha').textContent     = fechaFmt;
  document.getElementById('sum-moneda').textContent    = `${monedaC} – ${monedaD}`;
  document.getElementById('sum-tc').textContent        = `S/. ${parseFloat(tc).toFixed(3)}`;
  const montoSoles = document.getElementById('monto-soles').value;
  document.getElementById('sum-monto').textContent     = `${monedaC} ${Number(monto).toLocaleString('es-PE', { minimumFractionDigits: 2 })} (${montoSoles})`;
  document.getElementById('sum-pago').textContent      = pago.options[pago.selectedIndex].text;
  document.getElementById('sum-contraparte').textContent = contraD ? `${contraC} – ${contraD}` : 'N/A';

  // Calcular SHA-256 del registro
  const payload = `${fondoCode}|${tipoOp.value}|${fecha}|${monedaC}|${monto}|${pago.value}|${contraC}`;
  const hash = await hmacSha256(payload);
  document.getElementById('sum-hash').textContent = hash;

  document.getElementById('resumen-overlay').classList.add('active');
}

function closeResumenModal() {
  document.getElementById('resumen-overlay').classList.remove('active');
}

function registrarLiquidacion() {
  closeResumenModal();
  const ref = 'LIQ-' + Date.now().toString().slice(-8);
  document.getElementById('confirm-ref').textContent = `N° de Referencia: ${ref}`;
  document.getElementById('confirm-overlay').classList.add('active');
}

function closeConfirm() {
  document.getElementById('confirm-overlay').classList.remove('active');
  setStatus('Liquidación registrada. Pendiente de aprobación.');
  resetForm();
}

function resetForm() {
  document.getElementById('fondo-code').value = '';
  document.getElementById('fondo-desc').value = '';
  document.getElementById('tipo-op').value = '';
  document.getElementById('moneda-code').value = '';
  document.getElementById('moneda-desc').value = '';
  document.getElementById('tipo-cambio').value = '';
  document.getElementById('monto').value = '';
  document.getElementById('monto-soles').value = '';
  document.getElementById('monto-moneda').textContent = '';
  document.getElementById('forma-pago').value = '';
  document.getElementById('pago-code').value = '';
  document.getElementById('row-contraparte').classList.add('hidden');
  document.getElementById('contraparte-code').value = '';
  document.getElementById('contraparte-desc').value = '';
  document.getElementById('btn-generar').disabled = true;
  selectedFondo = null;
  selectedBanco = null;
  tmpFondo = null;
  tmpBanco = null;
}


// HMAC-SHA256 (Web Crypto API)
// Clave secreta embebida en el sistema y que no sea visible para el usuario
const HMAC_SECRET_KEY = CONFIG.HMAC_SECRET_KEY;


async function hmacSha256(message) {
  const encoder  = new TextEncoder();

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(HMAC_SECRET_KEY),
    { name: 'HMAC', hash: 'SHA-256' },
    false,           
    ['sign']       
  );

  const signature = await crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    encoder.encode(message)
  );

  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}


// ─── STATUS BAR ─────────────────────
function setStatus(msg) {
  document.getElementById('status-msg').textContent = msg;
}