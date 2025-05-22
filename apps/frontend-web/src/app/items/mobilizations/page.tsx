"use client";

import React, { useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import CappasityViewer from "../../../components/Items/CappasityViewer";

/** Modelo de datos */
interface LocationInfo {
  location: string;
  quantity: number;
  lastUpdate: string;
  status: "OK" | "LOW" | "OUT";
}

interface Item {
  id: number;
  name: string;
  brand: string;
  price: string;
  stock: number;
  sku: string;
  description: string;
  image: string;
  viewerUrl?: string;
  barcode: string;
  otherStock: LocationInfo[];
}

/** Datos de ejemplo: 
 * Los primeros 4 ítems son Nike, V-block, Sofá Reclinable y Taladro Inalámbrico (con API 3D).
 * Luego se agregan 8 ítems adicionales con datos demo.
 */
const mockItems: Item[] = [
  // ==================== PRIMEROS 4 ITEMS ====================
  {
    id: 1,
    name: "Nike Zoom Pro",
    brand: "Nike",
    price: "$129.99",
    stock: 48,
    sku: "SKU-NIKE-ZOOM-001",
    description:
      "Zapatillas deportivas de alta gama, ideales para running y entrenamiento profesional.",
    image: "/images/items/deportivos.png",
    viewerUrl:
      "https://api.cappasity.com/api/player/1a7a1215-c5a0-4a83-bccd-ce334eb34b41/embedded?arbutton=0&autorun=0",
    barcode: "1234567890123",
    otherStock: [
      { location: "CDMX-WH1", quantity: 25, lastUpdate: "2025-03-20", status: "OK" },
      { location: "Monterrey-WH2", quantity: 15, lastUpdate: "2025-03-18", status: "LOW" },
      { location: "Tokio-WH9", quantity: 8, lastUpdate: "2025-03-22", status: "OK" },
    ],
  },
  {
    id: 2,
    name: "V-block",
    brand: "TechOne",
    price: "$899.99",
    stock: 12,
    sku: "SKU-LAPTOP-002",
    description:
      "Laptop de alto rendimiento con procesador Intel i9, 16GB RAM y pantalla 4K.",
    image: "/images/items/V-block.png",
    viewerUrl:
      "https://api.cappasity.com/api/player/59f608a5-937e-430c-8fa0-8f43aa942ba7/embedded?arbutton=0&autorun=0",
    barcode: "9876543210987",
    otherStock: [
      { location: "Houston-WH3", quantity: 5, lastUpdate: "2025-03-21", status: "OK" },
      { location: "Los Angeles-WH5", quantity: 2, lastUpdate: "2025-03-19", status: "LOW" },
      { location: "Tokio-WH9", quantity: 5, lastUpdate: "2025-03-23", status: "OK" },
    ],
  },
  {
    id: 3,
    name: "Sofá Reclinable Luxe",
    brand: "HomeComfort",
    price: "$1,299.99",
    stock: 5,
    sku: "SKU-SOFA-003",
    description:
      "Sofá premium reclinable de cuero sintético, con soporte lumbar y reposabrazos ajustables.",
    image: "/images/items/silla.png",
    viewerUrl:
      "https://api.cappasity.com/api/player/97f8ef1b-a4db-462e-899b-f8c0059c9896/embedded?arbutton=0&autorun=0",
    barcode: "1122334455667",
    otherStock: [
      { location: "Monterrey-WH2", quantity: 2, lastUpdate: "2025-03-20", status: "OK" },
      { location: "CDMX-WH1", quantity: 1, lastUpdate: "2025-03-21", status: "LOW" },
      { location: "Houston-WH3", quantity: 2, lastUpdate: "2025-03-22", status: "OK" },
    ],
  },
  {
    id: 4,
    name: "Taladro Inalámbrico ProMax",
    brand: "ToolMaster",
    price: "$149.99",
    stock: 30,
    sku: "SKU-TALADRO-004",
    description:
      "Taladro inalámbrico con batería de larga duración y torque ajustable de hasta 50Nm.",
    image: "/images/items/herramientas.png",
    viewerUrl:
      "https://api.cappasity.com/api/player/8840c5f0-1f88-4c47-aae8-93f139875895/embedded?arbutton=0&autorun=0",
    barcode: "1234509876543",
    otherStock: [
      { location: "Guadalajara-WH4", quantity: 10, lastUpdate: "2025-03-19", status: "OK" },
      { location: "CDMX-WH1", quantity: 10, lastUpdate: "2025-03-20", status: "OK" },
      { location: "Monterrey-WH2", quantity: 10, lastUpdate: "2025-03-18", status: "OK" },
    ],
  },

  // ==================== 8 ITEMS ADICIONALES ====================
  {
    id: 5,
    name: "Camisa Casual",
    brand: "UrbanStyle",
    price: "$29.99",
    stock: 60,
    sku: "SKU-CAMISA-005",
    description:
      "Camisa de algodón de alta calidad, perfecta para uso diario o reuniones informales.",
    image: "/images/items/camisa.jpg",
    barcode: "3456789012345",
    otherStock: [
      { location: "CDMX-WH1", quantity: 20, lastUpdate: "2025-03-20", status: "OK" },
      { location: "Houston-WH3", quantity: 20, lastUpdate: "2025-03-18", status: "OK" },
      { location: "Tokio-WH9", quantity: 20, lastUpdate: "2025-03-22", status: "OK" },
    ],
  },
  {
    id: 6,
    name: "Chamarra Acolchada",
    brand: "WinterPro",
    price: "$59.99",
    stock: 25,
    sku: "SKU-CHAMARRA-006",
    description:
      "Chamarra abrigadora para climas fríos, con relleno de alta calidad y diseño moderno.",
    image: "/images/items/chamarra.jpg",
    viewerUrl:
      "https://api.cappasity.com/api/player/8840c5f0-1f88-4c47-aae8-93f139875895/embedded?arbutton=0&autorun=0",
    barcode: "4567890123456",
    otherStock: [
      { location: "Monterrey-WH2", quantity: 10, lastUpdate: "2025-03-20", status: "LOW" },
      { location: "Los Angeles-WH5", quantity: 5, lastUpdate: "2025-03-19", status: "OK" },
      { location: "CDMX-WH1", quantity: 10, lastUpdate: "2025-03-23", status: "OK" },
    ],
  },
  {
    id: 7,
    name: "Gorra Deportiva",
    brand: "ActiveGear",
    price: "$14.99",
    stock: 100,
    sku: "SKU-GORRA-007",
    description:
      "Gorra ajustable disponible en varios colores, ideal para actividades al aire libre.",
    image: "/images/items/gorra.jpg",
    barcode: "5678901234567",
    otherStock: [
      { location: "CDMX-WH1", quantity: 40, lastUpdate: "2025-03-18", status: "OK" },
      { location: "Houston-WH3", quantity: 30, lastUpdate: "2025-03-19", status: "OK" },
      { location: "Tokio-WH9", quantity: 30, lastUpdate: "2025-03-21", status: "OK" },
    ],
  },
  {
    id: 8,
    name: "Pantalones Mezclilla",
    brand: "DenimCo",
    price: "$39.99",
    stock: 45,
    sku: "SKU-PANTALONES-008",
    description:
      "Pantalones de mezclilla resistentes, corte clásico y bolsillos reforzados.",
    image: "/images/items/pantalones.jpg",
    barcode: "6789012345678",
    otherStock: [
      { location: "Guadalajara-WH4", quantity: 15, lastUpdate: "2025-03-17", status: "OK" },
      { location: "CDMX-WH1", quantity: 15, lastUpdate: "2025-03-20", status: "OK" },
      { location: "Monterrey-WH2", quantity: 15, lastUpdate: "2025-03-22", status: "OK" },
    ],
  },
  {
    id: 9,
    name: "Zapatos Casual",
    brand: "UrbanStyle",
    price: "$49.99",
    stock: 35,
    sku: "SKU-ZAPATOS-009",
    description:
      "Zapatos cómodos para el día a día, suela antideslizante y plantilla acolchada.",
    image: "/images/items/skechers.jpg",
    barcode: "7890123456789",
    otherStock: [
      { location: "Monterrey-WH2", quantity: 15, lastUpdate: "2025-03-19", status: "OK" },
      { location: "CDMX-WH1", quantity: 10, lastUpdate: "2025-03-20", status: "LOW" },
      { location: "Houston-WH3", quantity: 10, lastUpdate: "2025-03-21", status: "OK" },
    ],
  },
  {
    id: 10,
    name: "Laptop X-5000",
    brand: "TechOne",
    price: "$999.99",
    stock: 8,
    sku: "SKU-LAPTOP-010",
    description:
      "Laptop de alto rendimiento con pantalla 4K y batería de larga duración.",
    image: "/images/items/laptop.jpg",
    barcode: "8901234567890",
    otherStock: [
      { location: "Houston-WH3", quantity: 3, lastUpdate: "2025-03-21", status: "OK" },
      { location: "Los Angeles-WH5", quantity: 2, lastUpdate: "2025-03-19", status: "LOW" },
      { location: "Tokio-WH9", quantity: 3, lastUpdate: "2025-03-23", status: "OK" },
    ],
  },
  {
    id: 11,
    name: "Sombrero de Playa",
    brand: "SunnyCo",
    price: "$19.99",
    stock: 50,
    sku: "SKU-SOMBRERO-011",
    description:
      "Sombrero amplio para proteger del sol, con cinta ajustable y tejido transpirable.",
    image: "/images/items/sombrero.png",
    barcode: "9012345678901",
    otherStock: [
      { location: "CDMX-WH1", quantity: 20, lastUpdate: "2025-03-20", status: "OK" },
      { location: "Houston-WH3", quantity: 15, lastUpdate: "2025-03-18", status: "OK" },
      { location: "Monterrey-WH2", quantity: 15, lastUpdate: "2025-03-22", status: "OK" },
    ],
  },
  {
    id: 12,
    name: "Sudadera Deportiva",
    brand: "ActiveGear",
    price: "$34.99",
    stock: 60,
    sku: "SKU-SUDADERA-012",
    description:
      "Sudadera con capucha, ideal para entrenamiento o uso casual en climas frescos.",
    image: "/images/items/chamarra.jpg",
    barcode: "0123456789012",
    otherStock: [
      { location: "Guadalajara-WH4", quantity: 20, lastUpdate: "2025-03-19", status: "OK" },
      { location: "CDMX-WH1", quantity: 20, lastUpdate: "2025-03-20", status: "OK" },
      { location: "Tokio-WH9", quantity: 20, lastUpdate: "2025-03-22", status: "OK" },
    ],
  },
];

export default function ItemsPage() {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  return (
    <PageContainer>
      <HeaderWrapper>
        <GreenCircle>
          <IconImage src="/logos/cube.svg" alt="Cube Icon" />
        </GreenCircle>
        <HeaderText>
          Items <span>{mockItems.length}</span>
        </HeaderText>
      </HeaderWrapper>

      {selectedItem ? (
        <DetailView item={selectedItem} onClose={() => setSelectedItem(null)} />
      ) : (
        <ItemsGrid>
          {mockItems.map((item) => (
            <ItemCard key={item.id} onClick={() => setSelectedItem(item)}>
              <ImageWrapper>
                <StyledImage
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 240px"
                />
              </ImageWrapper>
              <ItemName>{item.name}</ItemName>
              <ItemBrand>{item.brand}</ItemBrand>
              <ItemPrice>{item.price}</ItemPrice>
            </ItemCard>
          ))}
        </ItemsGrid>
      )}
    </PageContainer>
  );
}

/** Vista de Detalle */
interface DetailViewProps {
  item: Item;
  onClose: () => void;
}

const DetailView: React.FC<DetailViewProps> = ({ item, onClose }) => {
  return (
    <DetailContainer>
      <DetailCard>
        <TopImageContainer>
          {item.viewerUrl ? (
            <CappasityViewer src={item.viewerUrl} />
          ) : (
            <DetailImage src={item.image} alt={item.name} />
          )}
        </TopImageContainer>

        <Row>
          <Price>{item.price}</Price>
          <ProductTitle>{item.name}</ProductTitle>
          <StockInfo>Stock <BlueNumber>{item.stock}</BlueNumber></StockInfo>
        </Row>

        <SecondaryText>{item.description}</SecondaryText>

        <InfoRow>
          <InfoColumn>
            <InfoLabel>SKU</InfoLabel>
            <InfoValue>{item.sku}</InfoValue>
          </InfoColumn>
          <InfoColumn>
            <InfoLabel>Marca</InfoLabel>
            <InfoValue>{item.brand}</InfoValue>
          </InfoColumn>
        </InfoRow>

        <BottomRow>
          <BarcodeSection>
            <BarcodeImage
              src={`https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(
                item.barcode
              )}&code=Code128&translate-esc=off`}
              alt="Barcode"
            />
            <BarcodeValue><BlueNumber>{item.barcode}</BlueNumber></BarcodeValue>
          </BarcodeSection>

          <LocationsSection>
            <LocationsTitle>Ubicaciones actuales</LocationsTitle>
            <LocationsTable>
              <thead>
                <tr>
                  <th>Almacén</th>
                  <th>Cantidad</th>
                  <th>Última Actualización</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {item.otherStock.map((loc, index) => (
                  <tr key={index}>
                    <td>{loc.location}</td>
                    <td><BlueNumber>{loc.quantity}</BlueNumber></td>
                    <td>{loc.lastUpdate}</td>
                    <td>
                      <StatusBadge status={loc.status}>
                        {loc.status}
                      </StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </LocationsTable>
          </LocationsSection>
        </BottomRow>

        <CloseButton onClick={onClose}>Volver</CloseButton>
      </DetailCard>
    </DetailContainer>
  );
};

///////////////////////////////////////////////////////////////////////////////
// Estilos con styled-components
///////////////////////////////////////////////////////////////////////////////

const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #f7f7f7;
  padding: 2rem;
  box-sizing: border-box;
`;

/** Encabezado */
const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const GreenCircle = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #a1f3c3, #4bbf73);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IconImage = styled.img`
  width: 28px;
  height: 28px;
`;

const HeaderText = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: #333;
  span {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1976d2; /* Números en azul */
    margin-left: 0.5rem;
  }
`;

////////////////////////////////////////////////////////////////////////////////
// Grid de Items
////////////////////////////////////////////////////////////////////////////////

const ItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
`;

const ItemCard = styled.div`
  background: #fff;
  border-radius: 1rem;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
  border-radius: 0.5rem;
  background: #f8f8f8;
`;

const StyledImage = styled(Image)`
  object-fit: contain;
`;

const ItemName = styled.h3`
  margin: 0.5rem 0 0.2rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
`;

const ItemBrand = styled.div`
  font-size: 0.95rem;
  color: #666;
`;

const ItemPrice = styled.div`
  font-size: 1.1rem;
  color: #e53935;
  margin-top: 0.3rem;
  font-weight: 600;
`;

////////////////////////////////////////////////////////////////////////////////
// Vista de Detalle
////////////////////////////////////////////////////////////////////////////////

const DetailContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const DetailCard = styled.div`
  position: relative;
  background: #fff;
  width: 100%;
  max-width: 900px;
  border-radius: 1rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TopImageContainer = styled.div`
  width: 100%;
  height: 350px;
  background: #fafafa;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const DetailImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Price = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
`;

const ProductTitle = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
  color: #333;
`;

const StockInfo = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: #1976d2; /* Números en azul */
`;

const SecondaryText = styled.div`
  font-size: 1rem;
  color: #555;
  line-height: 1.4;
`;

const InfoRow = styled.div`
  display: flex;
  gap: 1rem;
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const InfoColumn = styled.div`
  flex: 1;
`;

const InfoLabel = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 0.2rem;
`;

const InfoValue = styled.div`
  color: #555;
`;

////////////////////////////////////////////////////////////////////////////////
// Sección inferior: Barcode + Ubicaciones (tabla)
////////////////////////////////////////////////////////////////////////////////

const BottomRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const BarcodeSection = styled.div`
  flex: 1;
  background: #f9f9f9;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

const BarcodeImage = styled.img`
  width: 150px;
  height: auto;
  margin-bottom: 0.5rem;
`;

const BarcodeValue = styled.div`
  font-size: 0.9rem;
  color: #1976d2; /* Números en azul */
  letter-spacing: 0.1rem;
`;

const LocationsSection = styled.div`
  flex: 2;
  background: #f9f9f9;
  border-radius: 0.5rem;
  padding: 1rem;
`;

const LocationsTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.5rem;
`;

const LocationsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
  thead {
    background: #f0f0f0;
    tr {
      th {
        text-align: left;
        padding: 0.5rem;
        color: #555;
        font-weight: 600;
      }
    }
  }
  tbody {
    tr {
      border-bottom: 1px solid #ddd;
      &:last-child {
        border-bottom: none;
      }
      td {
        padding: 0.5rem;
        color: #555;
      }
    }
  }
`;

////////////////////////////////////////////////////////////////////////////////
// StatusBadge
////////////////////////////////////////////////////////////////////////////////

interface StatusBadgeProps {
  status: "OK" | "LOW" | "OUT";
}
const StatusBadge = styled.span<StatusBadgeProps>`
  padding: 0.3rem 0.5rem;
  border-radius: 0.3rem;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  background-color: ${(props) =>
    props.status === "OK"
      ? "#C8E6C9"
      : props.status === "LOW"
      ? "#FFE082"
      : "#FFCDD2"};
  color: ${(props) =>
    props.status === "OK"
      ? "#2E7D32"
      : props.status === "LOW"
      ? "#795548"
      : "#C62828"};
`;

////////////////////////////////////////////////////////////////////////////////
// Botón Cerrar
////////////////////////////////////////////////////////////////////////////////

const CloseButton = styled.button`
  align-self: flex-end;
  background: #e53935;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.7rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-top: 1rem;
  &:hover {
    background: #d32f2f;
  }
`;

/** Componente para envolver números y darles color azul */
const BlueNumber = styled.span`
  color: #1976d2;
`;
