# 🏦 MIDAS – Simulación de Plataforma de Liquidaciones
### AFP Habitat | Seguridad de Sistemas | Grupo 5

> Simulación del módulo de Inversiones y Tesorería del Sistema MIDAS de AFP Habitat, desarrollada como parte del diseño de un Sistema de Gestión de Seguridad de la Información (SGSI) bajo la norma **ISO/IEC 27001:2022**.

---

## 📋 Descripción

Este proyecto simula la interfaz del sistema **MIDAS** (Heinson Business Technology), específicamente el flujo de registro de liquidaciones financieras del módulo de Inversiones y Tesorería. La simulación implementa controles de seguridad reales alineados al Anexo A de ISO 27001:2022.

---

## 🗂️ Estructura del proyecto

```
📁 proyecto/
├── midas_liquidacion.html   # Estructura visual de la interfaz
├── midas_style.css          # Estilos (tema Windows empresarial)
├── midas_app.js             # Lógica y comportamiento del sistema
├── config.example.js        # Plantilla de configuración (sin clave real)
├── .gitignore               # Excluye config.js del repositorio
└── README.md                # Este archivo
```

> ⚠️ El archivo `config.js` **no está en el repositorio**. Contiene la clave secreta del sistema. Ver instrucciones de instalación.

---

## ⚙️ Instalación y ejecución

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/midas-afp-habitat.git
cd midas-afp-habitat
```

### 2. Configurar la clave secreta
```bash
# Copiar la plantilla
cp config.example.js config.js
```
Luego abrir `config.js` y reemplazar `TU_CLAVE_AQUI` con la clave real del sistema.

### 3. Ejecutar
Abrir `midas_liquidacion.html` con **Live Server** en VS Code (clic derecho → *Open with Live Server*) o cualquier servidor local.

> ⚠️ No abrir el archivo directamente como `file://` porque la Web Crypto API requiere un servidor HTTP para funcionar correctamente.

---

## 🔄 Flujo de la aplicación

```
1. Seleccionar Fondo (Negocio)
        ↓
2. Elegir Tipo de Operación
        ↓
3. Seleccionar Moneda → autocompleta tipo de cambio y equivalente en soles
        ↓
4. Ingresar Monto a Liquidar
        ↓
5. Seleccionar Forma de Pago → si es Transferencia Interna, aparece campo Contraparte
        ↓
6. Seleccionar Banco Contraparte
        ↓
7. Botón "Generar Liquidación" se habilita (todos los campos completos)
        ↓
8. Ventana de Resumen → muestra todos los datos + HMAC-SHA256 del registro
        ↓
9. Registrar → número de referencia generado → pendiente de aprobación del Supervisor
```

---

## 🔐 Controles de seguridad implementados

| Feature | Control ISO 27001:2022 | Descripción |
|---|---|---|
| Roles visibles en la barra de herramientas | **A.5.15** Control de Acceso RBAC | El sistema muestra el perfil activo (Analista Junior) |
| Campos de solo lectura autocompletados | **A.5.15** Control de Acceso | Evita manipulación manual de datos críticos |
| Botón deshabilitado hasta completar campos | Integridad en el ingreso | No permite registros incompletos |
| HMAC-SHA256 del registro | **A.8.24** Uso de Criptografía | Firma digital que garantiza integridad y autenticidad |
| Pendiente de aprobación del Supervisor | **A.5.3** Segregación de Funciones | Quien registra no puede aprobar |
| Clave HMAC embebida en `config.js` (fuera del repo) | Buenas prácticas de seguridad | La clave no se expone en el repositorio público |

---

## 🔏 Implementación HMAC-SHA256

El sistema genera una firma criptográfica de cada liquidación usando **HMAC-SHA256** a través de la **Web Crypto API** nativa del navegador (estándar W3C).

### ¿Qué se firma?
La concatenación de todos los campos críticos del formulario:
```
FONDO | TIPO_OPERACION | FECHA | MONEDA | MONTO | FORMA_PAGO | CONTRAPARTE
```

### ¿Por qué HMAC y no SHA-256 simple?

| | SHA-256 | HMAC-SHA256 |
|---|---|---|
| Detecta alteración de datos | ✅ | ✅ |
| Verifica origen del sistema | ❌ | ✅ |
| Resistente a falsificación sin clave | ❌ | ✅ |

La clave secreta está almacenada en `config.js` (excluido del repositorio), embebida en el sistema y marcada como **no exportable** por la Web Crypto API.

---

## 🧰 Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura de la interfaz |
| CSS3 | Estilos (tema Windows empresarial retro) |
| JavaScript (ES2017+) | Lógica del sistema |
| Web Crypto API (W3C) | HMAC-SHA256 para integridad de registros |

Sin frameworks ni dependencias externas. El proyecto corre completamente en el navegador.

---

## 👥 Integrantes – Grupo 5

| Nombre | Código |
|---|---|
| Churampi Guerrero, Andrés Anthony | 20210670 |
| Diaz Vallejos, Walter Andres | 20213505 |
| Villalva Gomez, Diana Sofia | 20212903 |
| Mamani Valverde, Yerson Daniel | 20211590 |

**Curso:** Seguridad de Sistemas  
**Docente:** Carlos Martin Torres Paredes  
**Universidad de Lima** — Facultad de Ingeniería, Carrera de Ingeniería de Sistemas  
**Febrero 2026**