"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import CappasityViewer from "../../../components/Items/CappasityViewer";
import { API_URL } from "../../../lib/config";

const resolveImage = (img?: string) => {
  if (!img) return "/logos/cube.svg";
  if (img.startsWith("http") || img.startsWith("/")) return img;
  return `${API_URL}/uploads/${img}`;
};

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
  brand?: string;
  price?: string | number;
  stock: number;
  sku: string;
  description?: string;
  image?: string;
  viewerUrl?: string;
  barcode?: string;
  otherStock?: LocationInfo[];
}



export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // Obtiene los ítems del backend
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(`${API_URL}/items`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setItems(data);
        }
      } catch (error) {
        console.error('Error al obtener items:', error);
      }
    };
    fetchItems();
  }, []);


  return (
    <PageContainer>
      <HeaderWrapper>
        <GreenCircle>
          <IconImage src="/logos/cube.svg" alt="Cube Icon" />
        </GreenCircle>
        <HeaderText>
          Items <span>{items.length}</span>
        </HeaderText>
      </HeaderWrapper>

      {selectedItem ? (
        <DetailView item={selectedItem} onClose={() => setSelectedItem(null)} />
      ) : (
        <ItemsGrid>
          {items.map((item) => (
            <ItemCard key={item.id} onClick={() => setSelectedItem(item)}>
              <ImageWrapper>
                <StyledImage
                  src={resolveImage(item.image)}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 240px"
                />
              </ImageWrapper>
              <ItemName>{item.name}</ItemName>
              {item.brand && <ItemBrand>{item.brand}</ItemBrand>}
              {item.price && <ItemPrice>{item.price}</ItemPrice>}
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
            <DetailImage src={resolveImage(item.image)} alt={item.name} />
          )}
        </TopImageContainer>

        <Row>
          {item.price && <Price>{item.price}</Price>}
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
          {item.barcode && (
            <BarcodeSection>
              <BarcodeImage
                src={`https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(
                  item.barcode
                )}&code=Code128&translate-esc=off`}
                alt="Barcode"
              />
              <BarcodeValue>
                <BlueNumber>{item.barcode}</BlueNumber>
              </BarcodeValue>
            </BarcodeSection>
          )}

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
                {item.otherStock?.map((loc, index) => (
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
