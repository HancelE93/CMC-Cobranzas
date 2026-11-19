 <div align="center">

# CMC COBRANZAS

### ENTERPRISE FINANCIAL MANAGEMENT PLATFORM

**Sistema Integral de Gestión de Cartera, Conciliación Bancaria y Facturación**

Desarrollado para **Clear Minds Consultores**

<br/>

<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/NestJS-11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" />
<img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />

<img src="https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
<img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
<img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />

<br/><br/>

**Gestión financiera · Automatización · Conciliación · Auditoría**

</div>

---

## 01. Descripción del proyecto

**CMC Cobranzas** es una plataforma empresarial diseñada para centralizar y optimizar la gestión financiera y administrativa de cuentas por cobrar correspondientes a programas de formación académica.

La solución integra procesos de cartera, compromisos de pago, conciliación bancaria, control documental, facturación y auditoría, mediante una arquitectura desacoplada y tecnologías modernas.

Su objetivo es mejorar el control financiero, facilitar el seguimiento de obligaciones y proporcionar trazabilidad sobre las operaciones realizadas dentro de la organización.

<br/>

## 02. Objetivos estratégicos

<table>
<tr>
<td width="50%">

### Gestión financiera
- Centralización de cartera académica.
- Control de cuentas por cobrar.
- Seguimiento de compromisos.
- Gestión de vencimientos y mora.

</td>
<td width="50%">

### Automatización
- Conciliación bancaria.
- Proyección de ingresos.
- Control documental.
- Automatización de procesos operativos.

</td>
</tr>
<tr>
<td width="50%">

### Seguridad
- Control de acceso RBAC.
- Permisos granulares.
- Protección de información.
- Autenticación segura.

</td>
<td width="50%">

### Trazabilidad
- Registro de operaciones.
- Historial de modificaciones.
- Control de anulaciones.
- Bitácora de auditoría.

</td>
</tr>
</table>

---

## 03. Arquitectura del sistema

La solución utiliza una arquitectura desacoplada que separa la interfaz de usuario, la lógica de negocio y la persistencia de datos.

```text
CMC-Cobranzas/
│
├── CMC-Cobranzas/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── Frontend SPA
│
├── CMC-Cobranzas-Backend/
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   └── Backend API REST
│
└── README.md
```

### Frontend — Aplicación web

Interfaz SPA desarrollada con React y TypeScript, responsable de la experiencia de usuario, navegación, visualización de información y comunicación con la API.

### Backend — API REST

Servicio desarrollado con NestJS, estructurado bajo principios de arquitectura hexagonal, separación de responsabilidades y organización por dominios.

### Persistencia — Base de datos

PostgreSQL como motor relacional, con Prisma ORM para la gestión de modelos, consultas y migraciones.

---

## 04. Stack tecnológico

| Componente | Tecnología |
|:---|:---|
| Interfaz | React 19 |
| Lenguaje frontend | TypeScript |
| Herramienta de desarrollo | Vite |
| Estilos | Tailwind CSS v4 |
| Iconografía | Lucide Icons |
| API | NestJS 11 |
| Arquitectura | Hexagonal |
| ORM | Prisma ORM 7 |
| Base de datos | PostgreSQL 16 |
| Contenedores | Docker Compose |
| Autenticación | JWT |
| Sesiones | Cookies httpOnly |
| Contraseñas | bcrypt |
| Validaciones | class-validator |
| Versionamiento | Git / GitHub |

---

## 05. Módulos funcionales

<table>
<thead>
<tr>
<th>Módulo</th>
<th>Funcionalidad</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Dashboard</strong></td>
<td>Indicadores ejecutivos, KPIs financieros, cartera y pagos recientes.</td>
</tr>
<tr>
<td><strong>Clientes</strong></td>
<td>Directorio de alumnos, estados de cuenta e historial financiero.</td>
</tr>
<tr>
<td><strong>Catálogo de programas</strong></td>
<td>Administración de programas académicos, precios y matrículas.</td>
</tr>
<tr>
<td><strong>Deudas y compromisos</strong></td>
<td>Control de obligaciones, cronogramas y vencimientos.</td>
</tr>
<tr>
<td><strong>Flujo de efectivo</strong></td>
<td>Proyección de ingresos y comparación entre valores esperados y ejecutados.</td>
</tr>
<tr>
<td><strong>Conciliación bancaria</strong></td>
<td>Importación de extractos y conciliación automática o manual.</td>
</tr>
<tr>
<td><strong>Facturación</strong></td>
<td>Control documental de facturas y expedientes tributarios.</td>
</tr>
<tr>
<td><strong>Reportes</strong></td>
<td>Exportación de información financiera y discrepancias en CSV.</td>
</tr>
<tr>
<td><strong>Usuarios y permisos</strong></td>
<td>Administración de usuarios, roles y permisos granulares.</td>
</tr>
<tr>
<td><strong>Auditoría</strong></td>
<td>Registro y consulta de eventos y modificaciones del sistema.</td>
</tr>
</tbody>
</table>

---

## 06. Conciliación bancaria

El sistema contempla procesos de conciliación de transferencias y movimientos financieros de entidades y plataformas utilizadas en Ecuador.

**Entidades contempladas:**

- Banco Pichincha.
- Banco Guayaquil.
- Banco del Pacífico.
- Produbanco.
- PayPhone.
- PayPal.

**Flujo de conciliación:**

```text
Comprobante de pago
        │
        ▼
Registro de transacción
        │
        ▼
Importación de extracto bancario
        │
        ▼
Comparación de movimientos
        │
        ▼
┌─────────────────────────┐
│ Coincidencia encontrada │
└─────────────────────────┘
        │
        ▼
Validación de transacción
        │
        ▼
Conciliación confirmada
```

El flujo contempla también la revisión manual de movimientos que no encuentren coincidencias automáticas.

---

## 07. Seguridad y auditoría

La solución contempla controles de acceso y mecanismos de protección para las operaciones financieras.

### Autenticación y autorización

- Autenticación mediante JWT.
- Cookies httpOnly.
- Hash de contraseñas con bcrypt.
- Control de acceso basado en roles (RBAC).
- Permisos por módulo y acción.

### Matriz de permisos

| Permiso | Acción |
|:---|:---|
| Ver | Consultar información. |
| Crear | Registrar nuevos elementos. |
| Modificar | Actualizar registros. |
| Eliminar | Ejecutar operaciones autorizadas. |
| Aprobar | Autorizar operaciones específicas. |
| Exportar | Descargar información y reportes. |

### Auditoría — RF-11

La bitácora contempla el registro de eventos relevantes:

- Creación de registros.
- Modificación de información.
- Anulación de operaciones.
- Cambios de acceso y permisos.
- Trazabilidad de las acciones realizadas.

El diseño contempla la conservación del historial de eventos y evita su eliminación mediante las operaciones habituales del sistema.

---

## 08. Requisitos del entorno

Antes de ejecutar el proyecto, se requiere:

| Herramienta | Requisito |
|:---|:---|
| Node.js | 22 LTS o superior |
| npm / pnpm | Gestor de paquetes |
| Docker | Instalado y configurado |
| Docker Compose | Disponible |
| Git | Control de versiones |
| PostgreSQL | 16, mediante Docker o instalación local |

---

## 09. Instalación y ejecución

### 01 — Clonar el repositorio

```bash
git clone https://github.com/Krakedev-Development/CMC-Cobranzas.git

cd CMC-Cobranzas
```

### 02 — Configurar el backend

Abrir una terminal:

```bash
cd CMC-Cobranzas-Backend
```

Instalar dependencias:

```bash
npm install
```

Configurar variables de entorno:

```bash
cp .env.example .env
```

Iniciar PostgreSQL:

```bash
docker compose up -d
```

Generar el cliente Prisma y ejecutar migraciones:

```bash
npm run prisma:generate
npm run prisma:migrate
```

Iniciar el servidor:

```bash
npm run start:dev
```

**Servicios disponibles:**

| Servicio | Dirección |
|:---|:---|
| API REST | http://localhost:3000 |
| Swagger | http://localhost:3000/api/docs |
| Health Check | http://localhost:3000/health |

### 03 — Configurar el frontend

Abrir una segunda terminal desde la raíz del repositorio:

```bash
cd CMC-Cobranzas
```

Instalar dependencias:

```bash
npm install
```

Iniciar la aplicación:

```bash
npm run dev
```

**Aplicación web:** http://localhost:5173

> Configura las variables de entorno del frontend de acuerdo con el archivo de ejemplo del proyecto y la dirección de la API backend.

---

## 10. Estándares de desarrollo

El proyecto sigue criterios de calidad y mantenibilidad orientados al desarrollo de software empresarial.

### Clean Code

- Archivos de máximo 150 líneas como referencia.
- Separación de responsabilidades.
- Tipado estricto con TypeScript.
- Componentes y servicios con responsabilidades específicas.
- Evitar duplicación de lógica.

### Conventional Commits

Formato:

```text
<type>(<scope>): <short description>
```

Ejemplos:

```text
feat(auth): implement user authentication
fix(payments): correct payment validation
refactor(clients): separate client services
style(dashboard): improve responsive layout
chore(deps): update project dependencies
```

### Organización del repositorio

- Ramas estructuradas por funcionalidad.
- Commits descriptivos.
- Separación entre frontend y backend.
- Validación de datos en las capas correspondientes.

---

## 11. Identidad visual

La interfaz está basada en una identidad corporativa inspirada en Clear Minds Consultores.

| Identidad | Color |
|:---|:---|
| Azul institucional | `#2C3E50` |
| Azul principal | `#00A3E0` |
| Azul oscuro | `#1A252F` |

**Lineamientos visuales:**

- Diseño empresarial y profesional.
- Interfaz adaptable a diferentes dispositivos.
- Soporte para modo claro y oscuro.
- Cifras financieras con tipografía tabular monoespaciada.
- Componentes visuales consistentes.

---

<div align="center">

---

### CMC COBRANZAS

**FINANCIAL MANAGEMENT · BANK RECONCILIATION · AUDITABILITY**

Desarrollado para **Clear Minds Consultores**

<sub>Arquitectura desacoplada · React · NestJS · PostgreSQL</sub>

</div>