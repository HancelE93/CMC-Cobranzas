import 'dotenv/config';
import { PrismaClient, Role, UserStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL;
const adapter = connectionString ? new PrismaPg({ connectionString }) : undefined;
const prisma = new PrismaClient(adapter ? { adapter } : undefined);

async function main() {
  console.log('🌱 Starting seed...');

  const adminEmail = 'admin@clearminds.com';
  const existingAdmin = await prisma.user.findFirst({
    where: {
      OR: [{ email: adminEmail }, { username: 'admin' }],
    },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('Admin123*', 10);
    const admin = await prisma.user.create({
      data: {
        username: 'admin',
        email: adminEmail,
        passwordHash,
        nombre: 'Administrador CMC',
        cargo: 'Administrador General',
        rol: Role.ADMIN,
        estado: UserStatus.ACTIVO,
      },
    });
    console.log(`✅ Admin user created: ${admin.email} (username: admin)`);
  } else {
    console.log(`ℹ️ Admin user already exists: ${existingAdmin.email}`);
  }

  // Productos Oficiales de la empresa en PostgreSQL
  const officialProducts = [
    {
      nombre: 'Móviles Nivel 1',
      descripcion: 'Programa integral de desarrollo de aplicaciones móviles multiplataforma - Fundamentos y Arquitectura.',
      precioNominal: 890.0,
      estado: 'ACTIVO' as const,
    },
    {
      nombre: 'Móviles Nivel 2',
      descripcion: 'Programa avanzado: microservicios, seguridad, offline-first y despliegue continuo en tiendas.',
      precioNominal: 1200.0,
      estado: 'ACTIVO' as const,
    },
    {
      nombre: 'Taller de Especialización',
      descripcion: 'Taller intensivo de testing automatizado, optimización de rendimiento y CI/CD para apps móviles.',
      precioNominal: 350.0,
      estado: 'ACTIVO' as const,
    },
  ];

  for (const prod of officialProducts) {
    const existing = await prisma.product.findFirst({ where: { nombre: prod.nombre } });
    if (!existing) {
      await prisma.product.create({
        data: {
          nombre: prod.nombre,
          descripcion: prod.descripcion,
          precioNominal: prod.precioNominal,
          estado: prod.estado,
        },
      });
      console.log(`✅ Producto oficial registrado en PostgreSQL: ${prod.nombre}`);
    } else {
      console.log(`ℹ️ Producto ya registrado en PostgreSQL: ${existing.nombre}`);
    }
  }

  console.log('🌱 Seed finished successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

