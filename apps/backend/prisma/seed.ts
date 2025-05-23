import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Insertar usuarios de prueba
  const usersData = Array.from({ length: 50 }, (_, i) => ({
    username: `user${i + 1}`,
    email: `user${i + 1}@example.com`,
    password: 'hashedpassword',
    role: i % 3 === 0 ? 'admin' : i % 3 === 1 ? 'operator' : 'viewer',
    phone: `555000${i}`,
    profileImage: `user${i + 1}.png`,
  }));
  await prisma.user.createMany({ data: usersData, skipDuplicates: true });

  // Insertar datos de prueba para el módulo Picking
  const pickingData = Array.from({ length: 20 }, (_, i) => ({
    orderNumber: `ORD-${(i + 1).toString().padStart(3, '0')}`,
    quantity: Math.floor(Math.random() * 20) + 1,
  }));
  await prisma.picking.createMany({ data: pickingData, skipDuplicates: true });

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
  const putawayData = Array.from({ length: 20 }, (_, i) => ({
    receiptId: `RCPT-${(i + 1).toString().padStart(3, '0')}`,
    location: i % 2 === 0 ? 'LOC-001' : 'LOC-002',
    quantity: Math.floor(Math.random() * 50) + 1,
  }));
  await prisma.putaway.createMany({ data: putawayData, skipDuplicates: true });

  // Insertar datos de prueba para el módulo Item
  const itemsData = Array.from({ length: 100 }, (_, i) => ({
    sku: `SKU-${(i + 1).toString().padStart(3, '0')}`,
    name: `Producto ${i + 1}`,
    description: `Descripción del producto ${i + 1}`,
    price: parseFloat((Math.random() * 100).toFixed(2)),
    stock: Math.floor(Math.random() * 200) + 1,
  }));
  await prisma.item.createMany({ data: itemsData, skipDuplicates: true });
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
