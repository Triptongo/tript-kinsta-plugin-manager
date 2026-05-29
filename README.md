# Kinsta Plugin Manager

Panel para gestionar plugins de WordPress en Kinsta a través de la API oficial.

## Funcionalidades

- **Vista por sitio**: expandí cada sitio para ver sus plugins, estado, versión y updates disponibles
- **Vista por plugin**: vista global de todos los plugins de la empresa, cuántos sitios los usan y cuáles tienen updates
- **Instalación por ZIP**: subí un `.zip` e instalalo en uno o múltiples sitios a la vez
- **Actualización bulk**: seleccioná múltiples plugins/sitios y actualizá de una sola vez

## Requisitos

- Node.js 18+
- Cuenta de Kinsta con API habilitada (plan Business o superior)

## Desarrollo local

```bash
npm install
npm run dev
```

## Deploy en Vercel (recomendado)

### Opción A — Desde GitHub (más fácil)

1. Subí esta carpeta a un repositorio de GitHub (puede ser privado)
2. Entrá a [vercel.com](https://vercel.com) y conectá tu cuenta de GitHub
3. Importá el repositorio → Vercel detecta Vite automáticamente
4. Click en **Deploy**
5. En 1-2 minutos tenés tu URL (ej: `kinsta-plugin-manager.vercel.app`)

### Opción B — Desde CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

## Deploy en Netlify

```bash
npm run build
# Arrastrá la carpeta /dist a netlify.com/drop
```

## Credenciales

Al abrir la app, te va a pedir:

- **API Token**: MyKinsta → tu usuario (arriba a la derecha) → API Keys → Generate API Key
- **Company ID**: visible en la URL de MyKinsta → `?idCompany=XXXXXXXX`

Las credenciales se guardan en `sessionStorage` del browser (se borran al cerrar la pestaña). No se envían a ningún servidor externo.

## Seguridad

Si la URL va a ser pública o compartida, considerá:
- Agregar autenticación básica via Vercel (en el dashboard de Vercel → Settings → Password Protection)
- O restringir el acceso por IP desde Vercel

## Notas sobre la API de Kinsta

- El endpoint company-wide de plugins requiere la versión de API de enero 2026+
- La instalación de plugins por ZIP puede requerir habilitación por parte del soporte de Kinsta según el plan
- La documentación completa está en [api-docs.kinsta.com](https://api-docs.kinsta.com)
