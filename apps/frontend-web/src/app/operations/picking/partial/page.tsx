"use client";
import React, { useEffect, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";

// ===== Colores de ejemplo =====
const backgroundColor = "#EAF5FA";   // Fondo general
const cardBgColor = "#FFFFFF";       // Fondo de tarjetas y tabla
const menuBgColor = "#FFFFFF";       // Fondo del submenú
const hoverBgColor = "#f4f9fc";      // Hover en submenú y tabla
const borderColor = "#d3e0e9";       // Bordes suaves
const textColor = "#333";            // Color de texto principal
const accentColor = "#5ce1e6";       // Botones y acentos

// ===== Estilos globales =====
const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${backgroundColor};
    color: ${textColor};
    margin: 0;
    padding: 0;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  }
`;

// ===== Contenedor principal del módulo =====
const ModuleContainer = styled.div`
  display: flex;
  flex-direction: column;
  /* Reducimos el padding top para acercar el contenido al header */
  padding: 0rem 1rem 1rem 1rem;
  gap: 1rem;
`;

// ===== Submenú horizontal (más cerca del top) =====
const ModuleNavBar = styled.nav`
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: ${menuBgColor};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid ${borderColor};
  /* Minimiza margen top y bottom para acercarlo aún más */
  margin-top: 0;
  margin-bottom: 0.5rem;
`;

const ModuleNavItem = styled.div<{ $active?: boolean }>`
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  border-radius: 6px;
  font-weight: ${({ $active }) => ($active ? "bold" : "normal")};
  background-color: ${({ $active }) => ($active ? hoverBgColor : "transparent")};

  &:hover {
    background-color: ${hoverBgColor};
  }
`;

// ===== Contenedor de tarjetas (2x2) =====
const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
`;

const DataCard = styled.div`
  background-color: ${cardBgColor};
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  color: ${textColor};
`;

const CardNumber = styled.div`
  margin: 0.5rem 0;
  font-size: 2rem;
  font-weight: bold;
  color: ${textColor};
`;

const CardInfo = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

// ===== Botón de acción =====
const ActionButton = styled.button`
  background-color: ${accentColor};
  color: #fff;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 0 0.25rem;

  &:hover {
    background-color: #54c6d6;
  }
`;

// ===== Tabla de pickings =====
const TableContainer = styled.div`
  background-color: ${cardBgColor};
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const TableTitle = styled.h3`
  margin-top: 0;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.5rem;

  th,
  td {
    border: 1px solid ${borderColor};
    padding: 0.75rem;
    text-align: left;
  }

  th {
    background-color: ${hoverBgColor};
  }

  tbody tr:hover {
    background-color: ${hoverBgColor};
  }
`;

// ===== Formulario para crear un nuevo picking =====
const CreateForm = styled.form`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;

  input {
    padding: 0.5rem;
    border: 1px solid ${borderColor};
    border-radius: 6px;
  }
`;

// ===== Interfaz para un Picking (puedes ajustarla a tus campos reales) =====
interface Picking {
  id: number;
  orderNumber: string;
  quantity: number;
}

export default function PickingPage() {
  // ============= Lógica para las tarjetas (demo) ============
  const pendingOrders = 54;
  const pendingTime = "152 minutes per order";

  const onHold = 10;
  const onHoldTime = "58 minutes per order";

  const inProcess = 123;
  const inProcessTime = "120 minutes per order";

  const onPallet = 12;
  const onPalletTime = "23 minutes per order";

  // ============= Lógica para la tabla de pickings ============
  const [pickings, setPickings] = useState<Picking[]>([]);

  // Estados para crear un nuevo picking
  const [newOrderNumber, setNewOrderNumber] = useState("");
  const [newQuantity, setNewQuantity] = useState<number>(0);

  // Obtiene los pickings del backend
  const fetchPickings = async () => {
    try {
      const res = await fetch("http://localhost:3000/picking");
      const data = await res.json();
      if (Array.isArray(data)) {
        setPickings(data);
      } else {
        console.error("La respuesta no es un array:", data);
        setPickings([]);
      }
    } catch (error) {
      console.error("Error al obtener pickings:", error);
    }
  };

  // Carga inicial de datos
  useEffect(() => {
    fetchPickings();
  }, []);

  // Crear un nuevo picking
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/picking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: newOrderNumber,
          quantity: newQuantity,
        }),
      });
      if (!res.ok) {
        console.error("Error al crear picking:", await res.text());
      }
      setNewOrderNumber("");
      setNewQuantity(0);
      fetchPickings(); // refresca la tabla
    } catch (error) {
      console.error("Error al crear picking:", error);
    }
  };

  // Editar un picking (demo: aquí solo mostramos un log)
  const handleEdit = (id: number) => {
    console.log("Editar picking con id:", id);
    // Podrías abrir un modal para editar o navegar a otra ruta
  };

  // Eliminar un picking
  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:3000/picking/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        console.error("Error al eliminar picking:", await res.text());
      }
      fetchPickings(); // refresca la tabla
    } catch (error) {
      console.error("Error al eliminar picking:", error);
    }
  };

  return (
    <>
      <GlobalStyle />

      <ModuleContainer>
        {/* Submenú horizontal al tope */}
        <ModuleNavBar>
          <ModuleNavItem $active>My Operators</ModuleNavItem>
          <ModuleNavItem>Incidents</ModuleNavItem>
          <ModuleNavItem>Returns</ModuleNavItem>
          <ModuleNavItem>Reports & Updates</ModuleNavItem>
          <ModuleNavItem>Handheld Devices</ModuleNavItem>
        </ModuleNavBar>

        {/* Grid de tarjetas (2x2) con métricas */}
        <CardsGrid>
          <DataCard>
            <CardTitle>To Be Picked / Pending Fulfillment</CardTitle>
            <CardNumber>{pendingOrders}</CardNumber>
            <CardInfo>Average Order Processing Time</CardInfo>
            <CardInfo>{pendingTime}</CardInfo>
          </DataCard>

          <DataCard>
            <CardTitle>On Hold</CardTitle>
            <CardNumber>{onHold}</CardNumber>
            <CardInfo>Average Order Processing Time</CardInfo>
            <CardInfo>{onHoldTime}</CardInfo>
          </DataCard>

          <DataCard>
            <CardTitle>In Process / Processing</CardTitle>
            <CardNumber>{inProcess}</CardNumber>
            <CardInfo>Average Order Processing Time</CardInfo>
            <CardInfo>{inProcessTime}</CardInfo>
          </DataCard>

          <DataCard>
            <CardTitle>On Pallet / Palletized</CardTitle>
            <CardNumber>{onPallet}</CardNumber>
            <CardInfo>Average Order Processing Time</CardInfo>
            <CardInfo>{onPalletTime}</CardInfo>
          </DataCard>
        </CardsGrid>

        {/* Botón de acción */}
        <ActionButton style={{ alignSelf: "flex-start" }}>
          View warehouses
        </ActionButton>

        {/* Tabla con los pickings */}
        <TableContainer>
          <TableTitle>Pickings List</TableTitle>

          {/* Formulario para crear un nuevo picking */}
          <CreateForm onSubmit={handleCreate}>
            <input
              type="text"
              placeholder="Order Number"
              value={newOrderNumber}
              onChange={(e) => setNewOrderNumber(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Quantity"
              value={newQuantity}
              onChange={(e) => setNewQuantity(Number(e.target.value))}
              required
            />
            <ActionButton type="submit">Add</ActionButton>
          </CreateForm>

          <StyledTable>
            <thead>
              <tr>
                <th>ID</th>
                <th>Order Number</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pickings.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.orderNumber}</td>
                  <td>{p.quantity}</td>
                  <td>
                    <ActionButton onClick={() => handleEdit(p.id)}>Edit</ActionButton>
                    <ActionButton onClick={() => handleDelete(p.id)}>Delete</ActionButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableContainer>
      </ModuleContainer>
    </>
  );
}
