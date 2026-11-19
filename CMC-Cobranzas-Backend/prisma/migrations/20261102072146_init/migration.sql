-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SUPERVISOR', 'COBRADOR', 'AUDITOR');

-- CreateEnum
CREATE TYPE "ClientStatus" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "DebtStatus" AS ENUM ('PENDIENTE', 'PARCIAL', 'PAGADA', 'ANULADA');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('TRANSFERENCIA', 'EFECTIVO', 'TARJETA', 'DEPOSITO', 'OTRO');

-- CreateEnum
CREATE TYPE "PaymentRegisterStatus" AS ENUM ('REGISTRADO', 'PENDIENTE_REVISION', 'ANULADO');

-- CreateEnum
CREATE TYPE "ReconciliationStatus" AS ENUM ('PENDIENTE', 'CONCILIADO_AUTO', 'REVISION_MANUAL', 'CONCILIADO_MANUAL', 'NO_ENCONTRADO', 'CON_DIFERENCIAS');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "rol" "Role" NOT NULL DEFAULT 'COBRADOR',
    "estado" "UserStatus" NOT NULL DEFAULT 'ACTIVO',
    "permisos" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "estado" "ClientStatus" NOT NULL DEFAULT 'ACTIVO',
    "notas" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precio_nominal" DECIMAL(12,2) NOT NULL,
    "estado" "ProductStatus" NOT NULL DEFAULT 'ACTIVO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "debts" (
    "id" TEXT NOT NULL,
    "cliente_id" TEXT NOT NULL,
    "producto_id" TEXT NOT NULL,
    "fecha_adquisicion" TIMESTAMP(3) NOT NULL,
    "precio_nominal_aplicado" DECIMAL(12,2) NOT NULL,
    "precio_acordado" DECIMAL(12,2) NOT NULL,
    "saldo_inicial" DECIMAL(12,2) NOT NULL,
    "saldo_actual" DECIMAL(12,2) NOT NULL,
    "metodo_pago" TEXT,
    "plazo_meses" INTEGER,
    "dia_corte" INTEGER,
    "cuotas" JSONB,
    "observaciones" TEXT,
    "estado" "DebtStatus" NOT NULL DEFAULT 'PENDIENTE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "debts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "deuda_id" TEXT NOT NULL,
    "cliente_id" TEXT NOT NULL,
    "monto" DECIMAL(12,2) NOT NULL,
    "fecha_pago" TIMESTAMP(3) NOT NULL,
    "metodo" "PaymentMethod" NOT NULL DEFAULT 'TRANSFERENCIA',
    "banco_origen" TEXT,
    "numero_transaccion" TEXT,
    "referencia" TEXT,
    "comprobante_url" TEXT,
    "estado_registro" "PaymentRegisterStatus" NOT NULL DEFAULT 'REGISTRADO',
    "estado_conciliacion" "ReconciliationStatus" NOT NULL DEFAULT 'PENDIENTE',
    "observaciones" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_movements" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "monto" DECIMAL(12,2) NOT NULL,
    "numero_transaccion" TEXT NOT NULL,
    "referencia" TEXT,
    "ordenante" TEXT,
    "banco" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'sin_asignar',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bank_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reconciliations" (
    "id" TEXT NOT NULL,
    "pago_id" TEXT NOT NULL,
    "movimiento_bancario_id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'automatica',
    "estado" TEXT NOT NULL DEFAULT 'conciliado',
    "regla_coincidencia" TEXT,
    "observacion" TEXT,
    "fecha_conciliacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "conciliado_por" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reconciliations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "cliente_id" TEXT NOT NULL,
    "deuda_id" TEXT,
    "numero_factura" TEXT NOT NULL,
    "fecha_factura" TIMESTAMP(3) NOT NULL,
    "monto" DECIMAL(12,2) NOT NULL,
    "estado_documental" TEXT NOT NULL DEFAULT 'pendiente_registrar',
    "observaciones" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "fecha_hora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuario_id" TEXT,
    "modulo" TEXT NOT NULL,
    "accion" TEXT NOT NULL,
    "entidad_tipo" TEXT NOT NULL,
    "entidad_id" TEXT NOT NULL,
    "resultado" TEXT NOT NULL DEFAULT 'exitoso',
    "detalles" JSONB,
    "ip_address" TEXT,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "clients_cedula_key" ON "clients"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_numero_factura_key" ON "invoices"("numero_factura");

-- AddForeignKey
ALTER TABLE "debts" ADD CONSTRAINT "debts_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "debts" ADD CONSTRAINT "debts_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_deuda_id_fkey" FOREIGN KEY ("deuda_id") REFERENCES "debts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reconciliations" ADD CONSTRAINT "reconciliations_pago_id_fkey" FOREIGN KEY ("pago_id") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reconciliations" ADD CONSTRAINT "reconciliations_movimiento_bancario_id_fkey" FOREIGN KEY ("movimiento_bancario_id") REFERENCES "bank_movements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_deuda_id_fkey" FOREIGN KEY ("deuda_id") REFERENCES "debts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
