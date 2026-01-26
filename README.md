# Petshop Sales Dashboard

Dashboard de predicción de ventas con Machine Learning para petshop.

## Descripcion

Sistema de visualización y análisis de ventas que conecta con una API de FastAPI para generar predicciones usando modelos XGBoost.

### Funcionalidades

- **Dashboard**: Vista general con KPIs, predicciones de ventas y alertas de stock
- **Predicciones**: Proyecciones de 7 a 90 días con exportación a CSV
- **Productos**: Análisis por producto, marca o categoría
- **Stock**: Alertas de inventario y órdenes de compra sugeridas
- **Upload**: Carga de archivos Excel para actualizar datos

### Tecnologías

- Next.js 16
- TypeScript
- Tailwind CSS
- TanStack Query
- Recharts

### Backend

API de FastAPI con XGBoost deployada en Railway.

## Notas

- El petshop está cerrado los domingos, las predicciones excluyen estos días automáticamente
- Formato de moneda y fechas en español (es-SV)

---

Proyecto- Yultic
