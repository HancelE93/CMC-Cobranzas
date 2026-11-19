# CMC COBRANZAS

### Sistema Integral de Gestión de Cartera, Conciliación Bancaria y Facturación

\<p align="center">   \*\*Clear Minds Consultores\*\* \</p>

\<p align="center">   Plataforma empresarial para la automatización de procesos financieros, gestión de cartera académica, conciliación bancaria y trazabilidad documental. \</p>

\<p align="center">   \<img src="[https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white](https://img.shields.io/badge/React-19-61DAFB?logo=react\&logoColor=white)" alt="React 19" />   \<img src="[https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs\&logoColor=white)" alt="NestJS 11" />   \<img src="[https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript\&logoColor=white)" alt="TypeScript" />   \<img src="[https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql\&logoColor=white)" alt="PostgreSQL" />   \<img src="[https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma\&logoColor=white)" alt="Prisma ORM" />   \<img src="[https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker\&logoColor=white)" alt="Docker" /> \</p>

---

## Índice

- [Descripción del proyecto](#-descripción-del-proyecto)
- [Objetivos del sistema](#-objetivos-del-sistema)
- [Arquitectura](#-arquitectura)
- [Stack tecnológico](#-stack-tecnológico)
- [Módulos funcionales](#-módulos-funcionales)
- [Requisitos](#-requisitos-del-entorno)
- [Instalación](#-instalación-y-ejecución)
- [Seguridad y auditoría](#-seguridad-y-auditoría)
- [Estándares de desarrollo](#-estándares-de-desarrollo)
- [Identidad visual](#-identidad-visual)

---

## 📌 Descripción del proyecto

**CMC Cobranzas** es una plataforma empresarial desarrollada para **Clear Minds Consultores**, enfocada en centralizar y optimizar la administración de cuentas por cobrar de programas de formación académica.

El sistema integra procesos financieros y administrativos mediante una arquitectura desacoplada, permitiendo gestionar información de clientes, compromisos de pago, movimientos bancarios, documentación tributaria y auditoría de operaciones.

Su propósito es proporcionar información financiera organizada, mejorar el seguimiento de cartera y facilitar la conciliación de transacciones mediante procesos automatizados y trazables.

## 🎯 Objetivos del sistema

- Centralizar la información financiera de alumnos y clientes.
- Automatizar el seguimiento de cuentas por cobrar.
- Controlar compromisos de pago y vencimientos.
- Proyectar ingresos y comparar valores esperados frente a los ejecutados.
- Facilitar la conciliación de transferencias bancarias.
- Gestionar comprobantes de pago y documentación tributaria.
- Mantener trazabilidad de las operaciones y cambios del sistema.
- Administrar accesos mediante roles y permisos granulares.

## 🏗️ Arquitectura

El proyecto utiliza una arquitectura desacoplada, separando la aplicación frontend de la API backend.

```text
CMC-Cobranzas/
│
├── CMC-Cobranzas/
│   └── Frontend SPA
│
├── CMC-Cobranzas-Backend/
│   └── Backend API REST
│
└── README.md
```

### Frontend

Aplicación web de una sola página (SPA), encargada de la interfaz de usuario, navegación, visualización de información y comunicación con los servicios backend.

### Backend

API REST desarrollada con NestJS, organizada bajo principios de arquitectura hexagonal, separación de responsabilidades y acceso a datos mediante Prisma ORM.

### Base de datos

PostgreSQL como motor relacional para la persistencia de información financiera, administrativa y documental.

## 💻 Stack tecnológico

| Capa                 | Tecnologías                       |
| -------------------- | --------------------------------- |
| Frontend             | React 19, TypeScript, Vite        |
| Estilos              | Tailwind CSS v4                   |
| Iconografía          | Lucide Icons                      |
| Backend              | NestJS 11, TypeScript             |
| Arquitectura         | Hexagonal / Puertos y Adaptadores |
| ORM                  | Prisma ORM 7                      |
| Base de datos        | PostgreSQL 16                     |
| Infraestructura      | Docker Compose                    |
| Autenticación        | JWT, cookies httpOnly             |
| Seguridad            | bcrypt, class-validator           |
| Control de versiones | Git y GitHub                      |

## 🧩 Módulos funcionales

| Módulo                | Descripción                                                                  |
| --------------------- | ---------------------------------------------------------------------------- |
| Dashboard             | Indicadores ejecutivos, KPIs financieros y pagos recientes.                  |
| Clientes              | Directorio de alumnos, estados de cuenta e historial de pagos.               |
| Catálogo de programas | Administración de programas, precios y matrículas.                           |
| Deudas y compromisos  | Control de obligaciones, cronogramas y vencimientos.                         |
| Flujo de efectivo     | Proyección de ingresos y comparación entre valores proyectados y ejecutados. |
| Conciliación bancaria | Importación de extractos y conciliación automática o manual.                 |
| Facturación           | Control documental de facturas y expedientes tributarios.                    |
| Reportes              | Exportación de información financiera en formato CSV.                        |
| Usuarios y permisos   | Administración de usuarios, roles y permisos.                                |
| Auditoría             | Registro y consulta de eventos y modificaciones del sistema.                 |

## ⚙️ Requisitos del entorno

Antes de iniciar el proyecto, asegúrate de tener instalado:

- Node.js 22 LTS o superior.
- npm o pnpm.
- Docker y Docker Compose.
- Git.
- PostgreSQL 16, si no se utiliza Docker para la base de datos.

## 🚀 Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone (Repositorio de gitHub)

cd CMC-Cobranzas
```

### 2. Configurar el backend

```bash
cd CMC-Cobranzas-Backend

npm install
```

Configurar las variables de entorno:

```bash
cp .env.example .env
```

Iniciar PostgreSQL:

```bash
docker compose up -d
```

Generar el cliente Prisma y ejecutar las migraciones:

```bash
npm run prisma:generate
npm run prisma:migrate
```

Iniciar el servidor backend:

```bash
npm run start:dev
```

**Servicios disponibles:**

- API REST: `http://localhost:3000`
- Swagger: `http://localhost:3000/api/docs`
- Health Check: `http://localhost:3000/health`

### 3. Configurar el frontend

Abrir una nueva terminal y regresar a la carpeta raíz:

```bash
cd CMC-Cobranzas
```

Entrar al frontend:

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

**Aplicación web:** `http://localhost:5173`

> Nota: Configura las variables de entorno del frontend según los nombres definidos en su archivo de ejemplo y la URL de la API backend.

## 🔐 Seguridad y auditoría

El sistema contempla mecanismos de seguridad orientados a proteger la información financiera y controlar las operaciones realizadas por los usuarios.

### Autenticación y autorización

- Autenticación mediante JWT.
- Cookies httpOnly.
- Hash de contraseñas mediante bcrypt.
- Control de acceso basado en roles (RBAC).
- Permisos granulares por módulo y acción.

### Matriz de permisos

| Acción    | Descripción                                      |
| --------- | ------------------------------------------------ |
| Ver       | Consultar información.                           |
| Crear     | Registrar nuevos elementos.                      |
| Modificar | Actualizar información existente.                |
| Eliminar  | Ejecutar operaciones de eliminación autorizadas. |
| Aprobar   | Autorizar operaciones específicas.               |
| Exportar  | Descargar reportes e información.                |

### Bitácora de auditoría

El requisito RF-11 contempla el registro de eventos relevantes, incluyendo:

- Creación de registros.
- Modificación de información.
- Anulación de operaciones.
- Cambios en los accesos y permisos.
- Trazabilidad de las acciones realizadas.

La bitácora está diseñada para conservar el historial de eventos sin permitir su eliminación desde las operaciones habituales del sistema.

## 📐 Estándares de desarrollo

El proyecto sigue criterios orientados a mantener un código organizado, escalable y mantenible.

**Clean Code**

- Archivos de máximo 150 líneas como referencia.
- Separación de responsabilidades.
- Componentes y servicios con funciones específicas.
- Tipado estricto con TypeScript.
- Evitar duplicación de lógica.

**Git y control de versiones**

Se utiliza Conventional Commits:

```text
feat(auth): implement user authentication
fix(payments): correct payment validation
refactor(clients): separate client services
style(dashboard): improve responsive layout
chore(deps): update project dependencies
```

**Organización del trabajo**

- Ramas estructuradas por funcionalidad.
- Commits descriptivos.
- Separación entre frontend y backend.
- Validación de datos en las capas correspondientes.

## 🎨 Identidad visual

La interfaz utiliza una identidad visual corporativa inspirada en la marca Clear Minds.

| Elemento           | Color     |
| ------------------ | --------- |
| Azul institucional | `#2C3E50` |
| Azul principal     | `#00A3E0` |
| Azul oscuro        | `#1A252F` |

Características de diseño:

- Interfaz corporativa y empresarial.
- Diseño adaptable a diferentes dispositivos.
- Modo claro y modo oscuro.
- Tipografía tabular monoespaciada para cifras financieras.
- Componentes visuales consistentes.

---

\<p align="center">
&#x20; \*\*CMC COBRANZAS\*\*
&#x20; \<br />
&#x20; Sistema Integral de Gestión Financiera
&#x20; \<br />
&#x20; \<sub>Desarrollado para Clear Minds Consultores\</sub>
\</p>
