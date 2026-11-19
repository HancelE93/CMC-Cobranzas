# Clean Code — Reglas del Backend (CMC-Cobranzas-Backend)

Reglas y estándares de ingeniería obligatorios para todo el código del backend de **CMC Cobranzas**.

---

## 1. Tamaño de archivos y funciones

- **Límite de líneas por archivo:** Ningún archivo debe superar las **100 líneas** de código. Si una clase o caso de uso realmente lo justifica, el límite máximo absoluto es **150 líneas**.
- **Límite de funciones / métodos:** Un método debe tener una única responsabilidad (SRP) y preferentemente no superar las **25-30 líneas**. Si un método requiere comentarios paso a paso para entenderse, debe descomponerse en funciones privadas o colaboradores específicos.
- **División modular:** Si un controlador o caso de uso crece demasiado, se extraen submódulos, servicios de aplicación o validadores dedicados.

---

## 2. Arquitectura Hexagonal y Dirección de Dependencias

Se aplica una arquitectura por capas dentro de cada módulo funcional (`modules/<feature>/`):

```
modules/<feature>/
  api/
    controllers/       # Solo orquestan peticiones HTTP y delegan a casos de uso
    dtos/              # Request / Response DTOs con class-validator
  application/
    use-cases/         # Un caso de uso = una clase con método .execute()
    services/          # Lógica de aplicación transversal al módulo
  domain/
    interfaces/        # Ports (contratos abstractos que infraestructura implementa)
    types/             # Entidades y tipos puros de dominio
  infrastructure/
    adapters/          # Implementaciones externas (hashing, email, integraciones)
    repositories/      # Implementación de los puertos de persistencia usando Prisma
  <feature>.module.ts  # Inyección de dependencias (bind de Ports -> Adapters/Repos)
```

### Reglas de Dependencias:
1. `domain/` y `application/` **nunca** importan Prisma, Express ni librerías de infraestructura directamente.
2. Dependen exclusivamente de interfaces (`*.port.ts`).
3. La infraestructura implementa los puertos y se inyecta en los casos de uso mediante tokens de NestJS (`@Inject(PORT_TOKEN)`).
4. No se admiten dependencias circulares entre módulos.

---

## 3. Manejo de Datos y Persistencia

- Todo acceso a la base de datos se realiza a través de repositorios en `infrastructure/repositories` consumiendo el servicio de Prisma (`PrismaService` / adapter PostgreSQL).
- Los esquemas y cambios en base de datos se gestionan exclusivamente mediante migraciones controladas de Prisma (`prisma migrate dev`).
- **Transacciones:** Toda operación de cobranza que afecte múltiples tablas (ej. registrar pago, actualizar deuda y generar auditoría) debe ejecutarse dentro de una transacción atómica (`prisma.$transaction`).
- Nunca usar consultas SQL directas sin parametrizar.

---

## 4. Validación y Frontera HTTP (DTOs)

- La validación de entrada ocurre estrictamente en el límite de la API (capa `api/dtos`).
- Todo DTO de entrada debe estar decorado con `class-validator` y `class-transformer`.
- `ValidationPipe` global debe tener activo:
  - `whitelist: true` (ignora campos no permitidos)
  - `forbidNonWhitelisted: true` (falla si envían propiedades extra)
  - `transform: true` (convierte payloads a instancias de sus DTOs).

---

## 5. Seguridad y Autenticación

- **Contraseñas:** Hasheadas siempre con `bcrypt` (vía `HasherPort` / `BcryptAdapter`). Nunca comparar cadenas con `===` ni loguear contraseñas en claro.
- **Autenticación JWT:**
  - Token de acceso (`accessToken`) de corta duración (`JWT_EXPIRES_IN`), entregado en el body de respuesta.
  - Token de refresco (`refreshToken`) de larga duración (`JWT_REFRESH_EXPIRES_IN`), transportado únicamente en una cookie segura `httpOnly` (`SameSite=lax` o `none` en cross-site).
  - Ambos tokens usan un claim `typ: 'access' | 'refresh'`.
- **Protección por defecto:**
  - `JwtAuthGuard` es global. Toda ruta requiere autenticación a menos que esté explícitamente marcada con `@Public()`.
  - Autorización basada en roles (`@Roles(...)`) en rutas críticas del sistema de cobranzas (administrador, supervisor, cobrador, etc.).

---

## 6. Manejo de Errores y Excepciones

- Los casos de uso lanzan excepciones semánticas de dominio o `HttpException` controladas (`NotFoundException`, `ConflictException`, `BadRequestException`, `ForbiddenException`).
- Un filtro global (`HttpExceptionFilter`) captura todas las excepciones y genera respuestas uniformes:
  ```json
  {
    "statusCode": 400,
    "timestamp": "2026-10-28T12:00:00.000Z",
    "path": "/api/v1/payments",
    "message": "Descripción amigable del error"
  }
  ```
- **Nunca** exponer en producción trazas de error internas (stack traces de PostgreSQL/Prisma) al cliente consumidor.

---

## 7. Logging y Trazabilidad

- Usar la clase `Logger` de `@nestjs/common`. Prohibido el uso de `console.log`.
- Se registran únicamente eventos clave de negocio (inicio de sesión, pagos registrados, conciliaciones, cierres) y fallos HTTP / excepciones no controladas.
- **Privacidad:** Prohibido registrar credenciales, números completos de tarjetas o cuentas bancarias, tokens o información sensible del cliente de cobranzas.

---

## 8. Nombres y Convenciones de Código

- Código fuente en **inglés** (nombres de variables, funciones, clases, DTOs, entidades y archivos).
- Endpoints REST en **inglés**, plurales y en minúscula (ej. `/api/v1/clients`, `/api/v1/debts`, `/api/v1/payments`).
- Nombres explícitos y descriptivos; evitar abreviaturas crípticas (`usrCtrl` -> `UsersController`).
- Prohibido el uso de emojis en código, comentarios, mensajes de error y commits.
- Principio YAGNI: No crear abstracciones, tablas o capas para funcionalidades no solicitadas.

---

## 9. Control de Versiones y Commits

- Todo cambio debe realizarse mediante ramas de trabajo (`feature/*`, `fix/*`, `refactor/*`) y ser integrado vía Pull Request.
- Los mensajes de commit deben seguir el estándar de **Conventional Commits**:
  - `feat: add client search use case`
  - `fix: validate duplicate payment receipt number`
  - `refactor: extract token issuer service`
  - `test: add unit test for debt calculation`
  - `docs: update clean code guidelines`
