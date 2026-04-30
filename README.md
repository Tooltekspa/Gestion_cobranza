# 📋 Cobranza Tooltek — Guía de instalación completa

Aplicación de gestión de visitas de cobranza. Funciona **online y offline**, se sincroniza automáticamente con Google Sheets y se instala como app en el celular.

---

## 🗂️ Archivos del repositorio

```
cobranza/
├── index.html        ← La aplicación principal
├── sw.js             ← Service Worker (cache offline)
├── manifest.json     ← PWA (para instalar en celular)
├── gas_backend.js    ← Código para Google Apps Script (NO va en GitHub)
├── icon-192.png      ← Ícono app (192x192px) — debes crearlo
├── icon-512.png      ← Ícono app (512x512px) — debes crearlo
└── README.md         ← Este archivo
```

---

## PASO 1 — Crear los Google Sheets

### Sheet 1: BASE DE CLIENTES
1. Ir a [sheets.google.com](https://sheets.google.com) → Nuevo
2. Nombre: `Cobranza - Clientes`
3. Crear dos hojas (pestañas):
   - **Clientes** con columnas: `RUT | Nombre | Dirección | Ciudad | Email | Teléfono`
   - **Deuda** con columnas: `Nombre | Documento/Factura | Vencimiento | Monto | Días Vencido`
4. Copiar el ID de la URL: `docs.google.com/spreadsheets/d/**ESTE_ID**/edit`

### Sheet 2: REGISTRO DE VISITAS
1. Crear otro Sheet nuevo
2. Nombre: `Cobranza - Registros`
3. Dejarlo vacío (el Apps Script crea las columnas automáticamente)
4. Copiar su ID también

---

## PASO 2 — Configurar Google Apps Script

1. Ir a [script.google.com](https://script.google.com)
2. Clic en **"+ Nuevo proyecto"**
3. Cambiar el nombre a `Cobranza API`
4. Borrar el contenido y **pegar todo el contenido de `gas_backend.js`**
5. En el código, editar las líneas:
   ```javascript
   SHEET_CLIENTES_ID: 'PEGA_AQUI_ID_DEL_SHEET_CLIENTES',
   SHEET_REGISTROS_ID: 'PEGA_AQUI_ID_DEL_SHEET_REGISTROS',
   ```
6. **Guardar** (Ctrl+S)
7. Clic en **"Implementar"** → **"Nueva implementación"**
8. Configurar:
   - Tipo: **Aplicación web**
   - Ejecutar como: **Yo (tu cuenta Google)**
   - Quién tiene acceso: **Cualquier persona**
9. Clic en **"Implementar"** → Autorizar permisos
10. **Copiar la URL** que aparece (se ve así: `https://script.google.com/macros/s/XXXXX/exec`)

---

## PASO 3 — Configurar el index.html

Abrir `index.html` y buscar esta línea:

```javascript
GAS_URL: 'PEGA_AQUI_LA_URL_DEL_APPS_SCRIPT',
```

Reemplazar con la URL copiada en el paso anterior:

```javascript
GAS_URL: 'https://script.google.com/macros/s/TU_URL_REAL/exec',
```

---

## PASO 4 — Crear los íconos (simple)

Necesitas dos imágenes PNG cuadradas con el logo de Tooltek:
- `icon-192.png` (192 × 192 píxeles)
- `icon-512.png` (512 × 512 píxeles)

Puedes crearlos en [favicon.io](https://favicon.io) o cualquier editor de imagen.

---

## PASO 5 — Publicar en GitHub Pages

1. Ir a [github.com](https://github.com) → Crear cuenta si no tienes
2. Clic en **"+"** → **"New repository"**
3. Nombre: `cobranza` (o el que quieras)
4. Marcar como **Public**
5. Clic en **"Create repository"**
6. En la pantalla siguiente, clic en **"uploading an existing file"**
7. **Arrastrar** estos archivos: `index.html`, `sw.js`, `manifest.json`, `icon-192.png`, `icon-512.png`
8. Clic en **"Commit changes"**
9. Ir a **Settings** → **Pages**
10. Source: **Deploy from a branch** → Branch: **main** → Carpeta: **/ (root)**
11. Clic en **Save**
12. En 1-2 minutos tu app estará en: `https://TU_USUARIO.github.io/cobranza`

---

## PASO 6 — Instalar en el celular como app

### Android (Chrome):
1. Abrir la URL en Chrome
2. Menú (⋮) → **"Agregar a pantalla de inicio"**
3. Confirmar → La app aparece como ícono en el escritorio

### iPhone (Safari):
1. Abrir la URL en Safari
2. Botón compartir → **"Agregar a pantalla de inicio"**
3. Confirmar

---

## 🔄 Cómo funciona la sincronización

```
GUARDAR VISITA
     │
     ├── Siempre: guarda en localStorage (instantáneo, funciona offline)
     │
     └── Si hay internet: envía a Google Sheets automáticamente
              │
              ├── ✅ Éxito → marca como sincronizado
              └── ❌ Sin red → queda en cola "pendientes"
                       │
                       └── Al recuperar internet → sync automático
```

El **badge rojo** en la pestaña Historial muestra cuántos registros están pendientes de sincronizar.

---

## 🔧 Actualizar la aplicación

Para actualizar el HTML después de cambios:
1. Ir al repositorio en GitHub
2. Clic en `index.html` → ícono lápiz (editar) → pegar el nuevo contenido
3. O arrastrar el archivo nuevo → "Commit changes"

GitHub Pages se actualiza automáticamente en ~1 minuto.

---

## ❓ Problemas comunes

**"Error al cargar Sheets"**
→ Verifica que la URL en `CONFIG.GAS_URL` sea correcta y que el Apps Script esté desplegado como "Cualquier persona"

**Los clientes no aparecen**
→ Verifica que el Sheet de Clientes tenga las columnas correctas y los IDs en el Apps Script sean los correctos

**La app no funciona offline**
→ Debes haberla abierto al menos una vez con internet para que el Service Worker cachee los archivos

**El badge de pendientes no baja**
→ Verifica conexión a internet y que la URL del Apps Script sea correcta. Prueba el botón "Sincronizar Sheets" manualmente.
