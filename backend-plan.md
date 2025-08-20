# Backend Technical Plan — Street Photo Scout (Express + Node.js)

## Feature Summary

**Feature Name**: Street Photo Scout API  
**Descripción**: API que permite consultar spots fotográficos cercanos con Google Places (coordenadas GPS), obtener tips fotográficos personalizados (Gemini), registrar inferencias en MySQL y servir datos a dos frontends (manual y simulador).  
**Objetivo Técnico**: Implementar endpoints RESTful para integración con Google Places, Gemini, cache in-memory, cálculo de distancia, registro en MySQL y servir datos a los frontends.

---

## Routes to be Created

| Method | Path           | Auth Required | Controller       | Description                                                |
|--------|----------------|-- ------------|------------------|------------------------------------------------------------|
| GET    | /health        | No            | HealthController | Chequeo de salud de la API                                 |
| GET    | /places/nearby | No            | PlacesController | Top 5 spots cercanos vía Google Places (con cache)         |
| GET    | /nearest       | No            | PlacesController | Spot más cercano, distancia y within_radius                |
| POST   | /copy          | No            | CopyController   | Genera tip fotográfico (Gemini/fallback), registra en MySQL|
| GET    | /logs          | No            | LogsController   | Últimos registros de inferencias                           |

---

## Directory Structure (New Files)

```
src/
├── modules/
│   ├── places/
│   │   ├── places.controller.ts
│   │   ├── places.service.ts
│   │   ├── places.routes.ts
│   │   ├── places.validator.ts
│   ├── copy/
│   │   ├── copy.controller.ts
│   │   ├── copy.service.ts
│   │   ├── copy.routes.ts
│   │   ├── copy.validator.ts
│   ├── logs/
│   │   ├── logs.controller.ts
│   │   ├── logs.service.ts
│   │   ├── logs.routes.ts
│   ├── health/
│   │   ├── health.controller.ts
│   │   ├── health.routes.ts
│   └── __tests__/
│       ├── places.controller.test.ts
│       ├── copy.controller.test.ts
│       ├── logs.controller.test.ts
├── middlewares/
│   ├── error.middleware.ts
│   ├── validate.middleware.ts
├── utils/
│   ├── logger.ts
│   ├── haversine.ts
│   ├── cache.ts
│   ├── gemini.ts
│   ├── placesTypes.ts
├── db/
│   ├── mysql.ts
├── index.ts
```

---

## Controllers & Services

### `PlacesController`
- `nearby(req, res)`: Devuelve spots cercanos (Google Places + cache)
- `nearest(req, res)`: Calcula spot más cercano, distancia y within_radius

### `CopyController`
- `generate(req, res)`: Usa nearest, consulta Gemini/fallback, registra en MySQL

### `LogsController`
- `list(req, res)`: Devuelve últimos registros de inferencias

### `HealthController`
- `check(req, res)`: Devuelve `{ ok: true }`

### Services
- `PlacesService`: Integración con Google Places, cache, lógica de filtrado
- `CopyService`: Prompt Gemini/fallback, registro en MySQL
- `LogsService`: Consulta de logs en MySQL

---

## Validation Rules

**Archivo**: `places.validator.ts`, `copy.validator.ts`  
**Libs usadas**: `zod`  
**Ejemplo de esquema**:
```ts
import { z } from 'zod'

export const coordsSchema = z.object({
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180)
})

export const copySchema = coordsSchema
```

---

## Packages to Install

### Core Dependencies
```bash
npm install express cors dotenv mysql2 axios
```

### Dev Tools
```bash
npm install -D typescript ts-node nodemon eslint prettier jest supertest
```

### Helpers & Utils
```bash
npm install zod
```

---

## Middlewares

- `error.middleware.ts`: Manejo global de errores
- `validate.middleware.ts`: Valida request usando schemas

---

## Environment Variables (.env)

```
PORT=3001
GOOGLE_MAPS_API_KEY=xxx
GEMINI_API_KEY=xxx
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=secret
MYSQL_DB=street_photo_scout
RADIUS_M=300
CACHE_TTL_SEC=180
PLACES_RADIUS_M=800
```

---

## External Integrations

- Google Places API (Nearby Search)
- Gemini API (generación de copy)
- MySQL (registro de inferencias)

---

## Helpers / Utils

| Helper Name    | Ubicación        | Uso previsto                          |
|----------------|------------------|---------------------------------------|
| `logger.ts`    | `utils/`         | Logging unificado                     |
| `haversine.ts` | `utils/`         | Cálculo de distancia en metros        |
| `cache.ts`     | `utils/`         | Cache in-memory con TTL               |
| `gemini.ts`    | `utils/`         | Prompt y fallback para copy           |
| `placesTypes.ts`| `utils/`        | Tipos de lugares soportados           |

---

## Unit Tests Plan

**Framework**: Jest  
**Ubicación**: `modules/__tests__/`  
**Cobertura esperada**:
- Controladores (mock de servicios)
- Servicios (mock de integraciones externas y DB)
- Validaciones (unitarias con `zod.safeParse`)
- Test simple de distancia (haversine)

---

## API Contract (Ejemplo)

### GET `/places/nearby?lat&lon`
**Response**
```json
{
  "items": [
    {"place_id":"...", "name":"...", "lat":-34.6, "lon":-58.4, "types":["park"] }
  ],
  "source": "api"
}
```

### GET `/nearest?lat&lon`
**Response**
```json
{
  "place": {"place_id":"...","name":"...","lat":-34.6,"lon":-58.4,"types":["park"]},
  "distance_m": 127,
  "within_radius": true,
  "source": "cache"
}
```

### POST `/copy`
**Request**
```json
{ "lat": -34.6, "lon": -58.4 }
```
**Response**
```json
{
  "text": "luz suave entre los jacarandás, hoy vale subexponer un toque",
  "place": {...},
  "distance_m": 127,
  "within_radius": true
}
```

### GET `/logs?limit=50`
**Response**
```json
[
  {
    "id": 1,
    "lat": -34.6,
    "lon": -58.4,
    "nearest_place_id": "...",
    "nearest_name": "...",
    "nearest_distance_m": 127,
    "within_radius": true,
    "text": "...",
    "created_at": "2025-08-20T12:00:00Z"
  }
]
```

---

## Database Schema

**Archivo**: `schema.sql`
```sql
CREATE TABLE copy_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lat DOUBLE NOT NULL,
  lon DOUBLE NOT NULL,
  nearest_place_id VARCHAR(128) NOT NULL,
  nearest_name VARCHAR(255) NOT NULL,
  nearest_distance_m INT NOT NULL,
  within_radius TINYINT(1) NOT NULL,
  text VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_created_at (created_at)
);
```

---

## Diagram Summary

```plaintext
Client ---> Express Route ---> Controller ---> Service ---> [Google Places | Gemini | MySQL]
                                   |            |               |
                              validate      lógica/caché     integración
```

---

## Checklist de Revisión Técnica

- [ ] ¿Las rutas están bien definidas?
- [ ] ¿Hay separación clara Controller/Service?
- [ ] ¿Hay validaciones para inputs del usuario?
- [ ] ¿Se usan middlewares correctamente?
- [ ] ¿Incluye tests unitarios?
- [ ] ¿Se declararon variables de entorno?
- [ ] ¿El código es modular y escalable?
- [ ] ¿Integraciones externas bien desacopladas?
- [ ] ¿Cache TTL y source funcionan?
- [ ] ¿Registro en MySQL correcto?

---

**Notas Finales**:  
- Riesgo: límites de rate en Google Places y Gemini.
- Validar inputs y manejo de errores en integraciones.
- Documentar prompt Gemini en README.
- Docker opcional para facilitar setup.
- Cooldown/histeresis para evitar spam de copy.
- UX y flows validados con Insomnia antes de front.