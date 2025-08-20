# Frontend Technical Plan — Street Photo Scout (React + TypeScript + Vite)

## Feature Summary

**Feature Name**: Street Photo Scout Frontend  
**Descripción**: Aplicación React con dos páginas principales: Manual (consulta por lat/lon) y Simulador (recorrido A→B en mapa). Permite consultar spots fotográficos cercanos, obtener tips creativos y visualizar logs, integrando la API backend.  
**Objetivo Técnico**: Implementar UI modular, validación de inputs, integración con API REST, manejo de errores y experiencia de usuario clara y simple.

---

## Directory Structure

```
src/
├── types/
│   ├── api.dto.ts
│   ├── places.types.ts
│   ├── copy.types.ts
│   ├── logs.types.ts
│   └── common.enums.ts
├── constants/
│   ├── api/endpoints.ts
│   ├── theme/colors.ts
│   └── ui-kit/navigation.ts
├── components/
│   ├── ui/                # ShadCN UI base components
│   ├── layout/
│   │   ├── AppHeader.tsx
│   │   └── DocumentationLayout.tsx
│   ├── docs/
│   │   ├── manual/
│   │   │   ├── ManualFormSection.tsx
│   │   │   └── ManualResult.tsx
│   │   ├── simulator/
│   │   │   ├── SimulatorMapSection.tsx
│   │   │   └── SimulatorResult.tsx
│   │   └── logs/
│   │       └── LogsTable.tsx
├── app/
│   └── pages/
│       ├── ManualPage.tsx
│       ├── SimulatorPage.tsx
│       └── LogsPage.tsx
├── hooks/
│   ├── use-api.ts
│   ├── use-simulator.ts
│   └── use-toast.ts
├── utils/
│   ├── format-distance.ts
│   ├── interpolate-route.ts
│   └── validate-coords.ts
└── main.tsx
```

---

## Pages

- **ManualPage**: Formulario lat/lon, muestra spot y frase.
- **SimulatorPage**: Inputs A/B, mapa con marker, play/pause, actualiza mensaje según recorrido.
- **LogsPage**: Tabla con logs de inferencias.

---

## Componentes Clave

- **ManualFormSection**: Inputs lat/lon, botón generar.
- **ManualResult**: Spot, distancia y frase.
- **SimulatorMapSection**: Mapa Leaflet, marker cámara, interpolación A→B.
- **SimulatorResult**: Mensaje y estado actual.
- **LogsTable**: Listado de logs.

---

## Types & DTOs

- Definir interfaces y enums en `/src/types/` (ej: `CopyResponse`, `PlaceItem`, `LogItem`).

---

## Constants

- Endpoints API en `/constants/api/endpoints.ts`
- Colores y navegación en `/constants/theme/colors.ts` y `/constants/ui-kit/navigation.ts`

---

## Hooks & Utils

- `use-api.ts`: Requests a la API, manejo de loading/error.
- `use-simulator.ts`: Lógica de recorrido y avance del marker.
- `use-toast.ts`: Mensajes de error y feedback.
- `format-distance.ts`: Formatea metros.
- `interpolate-route.ts`: Calcula puntos entre A y B.
- `validate-coords.ts`: Valida lat/lon.

---

## Data Flow

- Las páginas componen secciones y resultados desde `/components/docs/{module}/`
- Los hooks gestionan estado y lógica de negocio.
- Los endpoints y tipos se importan desde `/constants` y `/types`.

---

## Checklist

- [ ] Tipos en `/types/`
- [ ] Constantes en `/constants/`
- [ ] Componentes en el directorio correcto
- [ ] Nombres claros y descriptivos
- [ ] Imports absolutos con `@/`
- [ ] Validación y errores centralizados
- [ ] Simulador con debounce/interval para requests

---

**Notas Finales**:  
- Validar inputs antes de llamar a la API.
- Mostrar errores claros (toast/bloque).
- Usar ellipsis para frases largas.
- Mantener componentes simples y reutilizables.
- Documentar endpoints y tipos en `/types/api.dto.ts` y `/constants/api/endpoints.ts`.