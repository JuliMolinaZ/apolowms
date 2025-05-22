import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Insertar usuarios de prueba
  await prisma.user.createMany({
    data: [
      {
        username: 'admin',
        email: 'admin@example.com',
        password: 'hashedpassword', // Recuerda usar contraseñas hasheadas en producción
        role: 'admin',
        phone: '1234567890',
        profileImage: 'admin.png',
      },
      {
        username: 'operator',
        email: 'operator@example.com',
        password: 'hashedpassword',
        role: 'operator',
        phone: '0987654321',
        profileImage: 'operator.png',
      },
    ],
    skipDuplicates: true,
  });

  // Insertar datos de prueba para el módulo Picking
  await prisma.picking.createMany({
    data: [
      { orderNumber: 'ORD-001', quantity: 10 },
      { orderNumber: 'ORD-002', quantity: 20 },
    ],
    skipDuplicates: true,
  });

  // Insertar datos de prueba para el módulo Slotting
  await prisma.slotting.createMany({
    data: [
      { location: 'A1', product: 'Producto X', quantity: 50 },
      { location: 'B2', product: 'Producto Y', quantity: 30 },
    ],
    skipDuplicates: true,
  });

  // Insertar datos de prueba para el módulo Packing
  await prisma.packing.createMany({
    data: [
      { packageId: 'PKG-001', itemsCount: 5, status: 'Pending' },
      { packageId: 'PKG-002', itemsCount: 3, status: 'Completed' },
    ],
    skipDuplicates: true,
  });

  // Insertar datos de prueba para el módulo Location
  await prisma.location.createMany({
    data: [
      { code: 'LOC-001', description: 'Almacén principal', capacity: 100 },
      { code: 'LOC-002', description: 'Almacén secundario', capacity: 50 },
    ],
    skipDuplicates: true,
  });

  // Insertar datos de prueba para el módulo Arrival
  await prisma.arrival.createMany({
    data: [
      {
        shipmentId: 'SHIP-001',
        carrier: 'Transportes S.A.',
        arrivalDate: new Date(),
        status: 'Received',
      },
      {
        shipmentId: 'SHIP-002',
        carrier: 'Logística Express',
        arrivalDate: new Date(),
        status: 'In Transit',
      },
    ],
    skipDuplicates: true,
  });

  // Insertar datos de prueba para el módulo Putaway
  await prisma.putaway.createMany({
    data: [
      { receiptId: 'RCPT-001', location: 'LOC-001', quantity: 25 },
      { receiptId: 'RCPT-002', location: 'LOC-002', quantity: 15 },
    ],
    skipDuplicates: true,
  });

  // Insertar datos de prueba para el módulo Item
  await prisma.item.createMany({
    data: [
      {
        sku: 'SKU-001',
        name: 'Producto A',
        description: 'Descripción del producto A',
        price: 9.99,
        stock: 100,
      },
      {
        sku: 'SKU-002',
        name: 'Producto B',
        description: 'Descripción del producto B',
        price: 19.99,
        stock: 50,
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await prisma.$disconnect();
  });
