🏦 MIDAS – Simulación de Plataforma de Liquidaciones
AFP Habitat | Seguridad de Sistemas | Grupo 5

Simulación del módulo de Inversiones y Tesorería del Sistema MIDAS de AFP Habitat, desarrollada como parte del diseño de un Sistema de Gestión de Seguridad de la Información (SGSI) bajo la norma ISO/IEC 27001:2022.


📋 Descripción
Este proyecto simula la interfaz del sistema MIDAS (Heinson Business Technology), específicamente el flujo de registro de liquidaciones financieras del módulo de Inversiones y Tesorería. La simulación implementa controles de seguridad reales alineados al Anexo A de ISO 27001:2022.

🗂️ Estructura del proyecto
📁 proyecto/
├── midas_liquidacion.html   # Estructura visual de la interfaz
├── midas_style.css          # Estilos (tema Windows empresarial)
├── midas_app.js             # Lógica y comportamiento del sistema
├── config.example.js        # Plantilla de configuración (sin clave real)
├── .gitignore               # Excluye config.js del repositorio
└── README.md                # Este archivo

⚠️ El archivo config.js no está en el repositorio. Contiene la clave secreta del sistema. Ver instrucciones de instalación.


⚙️ Instalación y ejecución
1. Clonar el repositorio
bashgit clone https://github.com/tu-usuario/midas-afp-habitat.git
cd midas-afp-habitat
2. Configurar la clave secreta
bash# Copiar la plantilla
cp config.example.js config.js
Luego abrir config.js y reemplazar TU_CLAVE_AQUI con la clave real del sistema.
3. Ejecutar
Abrir midas_liquidacion.html con Live Server en VS Code (clic derecho → Open with Live Server) o cualquier servidor local.

⚠️ No abrir el archivo directamente como file:// porque la Web Crypto API requiere un servidor HTTP para funcionar correctamente.


🔄 Flujo de la aplicación
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

🔐 Controles de seguridad implementados
FeatureControl ISO 27001:2022DescripciónRoles visibles en la barra de herramientasA.5.15 Control de Acceso RBACEl sistema muestra el perfil activo (Analista Junior)Campos de solo lectura autocompletadosA.5.15 Control de AccesoEvita manipulación manual de datos críticosBotón deshabilitado hasta completar camposIntegridad en el ingresoNo permite registros incompletosHMAC-SHA256 del registroA.8.24 Uso de CriptografíaFirma digital que garantiza integridad y autenticidadPendiente de aprobación del SupervisorA.5.3 Segregación de FuncionesQuien registra no puede aprobarClave HMAC embebida en config.js (fuera del repo)Buenas prácticas de seguridadLa clave no se expone en el repositorio público

🔏 Implementación HMAC-SHA256
El sistema genera una firma criptográfica de cada liquidación usando HMAC-SHA256 a través de la Web Crypto API nativa del navegador (estándar W3C).
¿Qué se firma?
La concatenación de todos los campos críticos del formulario:
FONDO | TIPO_OPERACION | FECHA | MONEDA | MONTO | FORMA_PAGO | CONTRAPARTE
¿Por qué HMAC y no SHA-256 simple?
SHA-256HMAC-SHA256Detecta alteración de datos✅✅Verifica origen del sistema❌✅Resistente a falsificación sin clave❌✅
La clave secreta está almacenada en config.js (excluido del repositorio), embebida en el sistema y marcada como no exportable por la Web Crypto API.

🧰 Tecnologías utilizadas
TecnologíaUsoHTML5Estructura de la interfazCSS3Estilos (tema Windows empresarial retro)JavaScript (ES2017+)Lógica del sistemaWeb Crypto API (W3C)HMAC-SHA256 para integridad de registros
Sin frameworks ni dependencias externas. El proyecto corre completamente en el navegador.

👥 Integrantes – Grupo 5
NombreCódigoChurampi Guerrero, Andrés Anthony20210670Diaz Vallejos, Walter Andres20213505Villalva Gomez, Diana Sofia20212903Mamani Valverde, Yerson Daniel20211590