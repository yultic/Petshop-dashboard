# Petshop Sales Dashboard 🐾

Dashboard profesional de predicción de ventas con Machine Learning para petshop, construido con Next.js 16.1.4, TypeScript y FastAPI.

## 🚀 Características

### Funcionalidades Principales

- **Dashboard General**: Vista ejecutiva con KPIs, predicciones y alertas de stock
- **Predicciones de Ventas**: Proyecciones de ventas usando XGBoost ML
  - Predicciones de 7 a 90 días
  - Gráficos interactivos con Recharts
  - Exportación a CSV
  
- **Análisis por Producto**: Drill-down detallado
  - Granularidad por producto, marca o categoría
  - Top 20 productos más vendidos
  - Predicciones de demanda en kilos o ventas
  
- **Gestión de Stock**: Sistema completo de inventario
  - Alertas automáticas (agotado, crítico, bajo, OK)
  - Análisis de cobertura de stock
  - Órdenes de compra sugeridas basadas en ML
  - Exportación de órdenes a CSV
  
- **Upload de Datos**: Procesamiento automatizado
  - Carga de archivos Excel (.xlsx, .xls)
  - Limpieza y deduplicación automática
  - Reentrenamiento de modelos en background

### Stack Tecnológico

**Frontend:**
- ⚡ Next.js 16.1.4 (App Router)
- 🔷 TypeScript strict mode
- 🎨 Tailwind CSS + shadcn/ui
- 📊 Recharts para visualizaciones
- 🔄 TanStack Query para data fetching
- ✨ Framer Motion para animaciones

**Backend:**
- 🐍 Python + FastAPI
- 🤖 XGBoost para predicciones ML
- 🗄️ PostgreSQL (opcional)
- 📦 Railway deployment

## 📦 Instalación

### Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Acceso a la API de FastAPI

### Pasos de Instalación

1. **Clonar el proyecto**
```bash
cd petshop-dashboard
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Crear archivo .env.local
NEXT_PUBLIC_API_URL=https://petshop-sales-forecasting-production.up.railway.app
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🏗️ Estructura del Proyecto

```
src/
├── app/                    # Páginas Next.js (App Router)
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Dashboard home
│   ├── predictions/       # Página de predicciones
│   ├── products/          # Análisis por producto
│   ├── stock/             # Gestión de inventario
│   └── upload/            # Carga de datos
├── components/
│   ├── ui/                # Componentes base (shadcn/ui)
│   ├── charts/            # Componentes de gráficos
│   ├── dashboard/         # Componentes del dashboard
│   ├── layout/            # Sidebar, Header
│   └── providers/         # React Query provider
├── hooks/
│   └── use-api.ts         # Custom hooks con TanStack Query
├── lib/
│   ├── api-client.ts      # Cliente API tipado
│   └── utils.ts           # Funciones utilitarias
└── types/
    └── api.ts             # Types generados desde FastAPI
```

## 🎯 Uso

### Dashboard Principal

El dashboard muestra:
- Ventas proyectadas próximos 30 días
- KPIs principales (total, promedio, próximos 7 días)
- Estado del inventario (críticos, bajos, OK)
- Alertas críticas de stock
- Estadísticas de datos históricos

### Predicciones

1. Selecciona el período (7, 14, 30, 60 o 90 días)
2. Visualiza el gráfico de predicciones
3. Revisa la tabla de detalles
4. Exporta a CSV si necesitas

### Productos

1. Selecciona granularidad (categoría, marca o producto)
2. Elige la entidad específica
3. Define período y métrica (kilos o ventas)
4. Visualiza predicción de demanda
5. Revisa top 20 más vendidos

### Stock

1. Revisa alertas automáticas
2. Analiza cobertura de stock por producto
3. Genera orden de compra sugerida
4. Exporta orden a CSV para procesar

### Upload de Datos

1. Selecciona archivo Excel (.xlsx o .xls)
2. Verifica formato correcto
3. Sube y procesa
4. El sistema automáticamente:
   - Limpia datos
   - Elimina duplicados
   - Actualiza dataset
   - Reentrena modelos en background

## 🔧 Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Build para producción
npm run start        # Ejecutar build
npm run lint         # Linter
npm run type-check   # Verificar tipos TypeScript
```

## 📊 API Integration

El dashboard se conecta a la API FastAPI con los siguientes endpoints principales:

**Predicciones:**
- `POST /api/v1/predict/next/{days}` - Predicciones próximos N días
- `POST /api/v1/predict/range` - Predicciones rango de fechas

**Productos:**
- `POST /api/v1/products/predict` - Predicción por producto
- `GET /api/v1/products/available/{granularity}` - Entidades disponibles
- `GET /api/v1/products/demand/summary` - Resumen de demanda
- `GET /api/v1/products/analysis/top-sellers` - Top vendidos

**Stock:**
- `GET /api/v1/stock/alerts/all` - Alertas de stock
- `GET /api/v1/stock/purchase-order` - Orden de compra sugerida
- `GET /api/v1/stock/analysis/coverage` - Análisis de cobertura

**Upload:**
- `POST /api/v1/upload/excel` - Subir archivo Excel
- `GET /api/v1/upload/status` - Estado del entrenamiento

Todos los endpoints están fuertemente tipados con TypeScript.

## 🎨 Personalización

### Colores y Tema

Edita `src/app/globals.css` para cambiar el tema de colores:

```css
:root {
  --primary: 142 76% 36%;  /* Color primario (verde petshop) */
  --secondary: 240 4.8% 95.9%;
  /* ... más variables */
}
```

### Configuración de API

Edita `src/lib/api-client.ts` si necesitas cambiar la URL base o agregar autenticación.

## 🚢 Deployment

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Build Manual

```bash
npm run build
npm run start
```

## 📝 Notas Importantes

1. **Domingos Excluidos**: El petshop está cerrado los domingos, las predicciones automáticamente excluyen estos días.

2. **Reentrenamiento**: 
   - Automático en background para < 500 registros nuevos
   - Síncrono para datasets grandes

3. **Datos Requeridos**: 
   - Formato Excel específico con columnas: Fecha, Producto, Detalle, Kilos, métodos de pago

4. **Performance**: 
   - TanStack Query cachea datos por 1 minuto
   - Queries optimizadas con staleTime configurado

## 🤝 Contribuciones

Este es un proyecto custom para Yultic/SkinnerSV. Para cambios o mejoras, contacta al equipo de desarrollo.

## 📄 Licencia

Propiedad de Yultic - Software Development Consultancy

## 🛠️ Soporte

Para issues o preguntas sobre el dashboard:
- Email: charles@yultic.com
- Website: yultic.com

---

**Desarrollado por Yultic** 🚀
Technology with Roots - El Salvador
