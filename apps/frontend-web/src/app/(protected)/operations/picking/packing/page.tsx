"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import styled from "styled-components";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Legend,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  Cell,
} from "recharts";
import { FaBoxes, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";

// Interfaz para Packing
interface Packing {
  id: number;
  packingId: string;
  product: string;
  quantity: number;
  packingDate: string;
  status: string;
}

// Datos demo iniciales
const initialPackings: Packing[] = [
  {
    id: 1,
    packingId: "PKG-001",
    product: "Producto A",
    quantity: 100,
    packingDate: "2025-04-14T08:30:00",
    status: "Completed",
  },
  {
    id: 2,
    packingId: "PKG-002",
    product: "Producto B",
    quantity: 50,
    packingDate: "2025-04-15T09:00:00",
    status: "Pending",
  },
  {
    id: 3,
    packingId: "PKG-003",
    product: "Producto C",
    quantity: 75,
    packingDate: "2025-04-15T10:15:00",
    status: "In Progress",
  },
  {
    id: 4,
    packingId: "PKG-004",
    product: "Producto D",
    quantity: 200,
    packingDate: "2025-04-16T11:45:00",
    status: "Completed",
  },
  {
    id: 5,
    packingId: "PKG-005",
    product: "Producto E",
    quantity: 120,
    packingDate: "2025-04-16T14:30:00",
    status: "Pending",
  },
  {
    id: 6,
    packingId: "PKG-006",
    product: "Producto F",
    quantity: 30,
    packingDate: "2025-04-17T09:20:00",
    status: "In Progress",
  },
  {
    id: 7,
    packingId: "PKG-007",
    product: "Producto G",
    quantity: 60,
    packingDate: "2025-04-17T15:00:00",
    status: "Completed",
  },
  {
    id: 8,
    packingId: "PKG-008",
    product: "Producto H",
    quantity: 90,
    packingDate: "2025-04-18T10:00:00",
    status: "Pending",
  },
];

// Colores para el gráfico de pastel
const pieColors = ["#4BBF73", "#F9A826", "#FF5757"];

// Preparamos la data para el gráfico de pastel (distribución de estados)
const getStatusData = (packings: Packing[]) => [
  { name: "Completed", value: packings.filter((p) => p.status === "Completed").length },
  { name: "Pending", value: packings.filter((p) => p.status === "Pending").length },
  { name: "In Progress", value: packings.filter((p) => p.status === "In Progress").length },
];

export default function PackingPage() {
  // Estado que mantiene todos los packings (simulando data del backend)
  const [packings, setPackings] = useState<Packing[]>(initialPackings);

  // Estado para el formulario de adición de un nuevo packing
  const [newPacking, setNewPacking] = useState<Omit<Packing, "id">>({
    packingId: "",
    product: "",
    quantity: 0,
    packingDate: "",
    status: "",
  });

  // Estado para controlar la edición: almacena el ID del packing en edición y sus datos temporales
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editPacking, setEditPacking] = useState<Omit<Packing, "id">>({
    packingId: "",
    product: "",
    quantity: 0,
    packingDate: "",
    status: "",
  });

  // Maneja cambios en el formulario de nuevo packing
  const handleNewInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPacking({
      ...newPacking,
      // Para quantity, convertimos a número
      [name]: name === "quantity" ? Number(value) : value,
    });
  };

  // Agrega un nuevo packing
  const handleAddPacking = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newId = packings.length > 0 ? Math.max(...packings.map((p) => p.id)) + 1 : 1;
    const packingToAdd = { id: newId, ...newPacking };
    setPackings([...packings, packingToAdd]);
    setNewPacking({ packingId: "", product: "", quantity: 0, packingDate: "", status: "" });
  };

  // Inicia la edición de un packing
  const handleEditClick = (packing: Packing) => {
    setEditingId(packing.id);
    setEditPacking({
      packingId: packing.packingId,
      product: packing.product,
      quantity: packing.quantity,
      packingDate: packing.packingDate,
      status: packing.status,
    });
  };

  // Maneja cambios en el formulario de edición
  const handleEditInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditPacking({
      ...editPacking,
      [name]: name === "quantity" ? Number(value) : value,
    });
  };

  // Guarda los cambios de edición
  const handleSaveEdit = (id: number) => {
    const updatedPackings = packings.map((p) =>
      p.id === id ? { id, ...editPacking } : p
    );
    setPackings(updatedPackings);
    setEditingId(null);
  };

  // Cancela la edición
  const handleCancelEdit = () => {
    setEditingId(null);
  };

  // Borra un packing por ID
  const handleDelete = (id: number) => {
    const updatedPackings = packings.filter((p) => p.id !== id);
    setPackings(updatedPackings);
  };

  return (
    <Container>
      {/* Header */}
      <Header>
        <FaBoxes size={40} color="#4BBF73" />
        <Title>Módulo Packing</Title>
      </Header>
      <Subtitle>Coordinación y seguimiento de packing</Subtitle>

      {/* Formulario para agregar nuevo packing */}
      <FormContainer onSubmit={handleAddPacking}>
        <Input
          name="packingId"
          placeholder="Packing ID"
          value={newPacking.packingId}
          onChange={handleNewInputChange}
          required
        />
        <Input
          name="product"
          placeholder="Producto"
          value={newPacking.product}
          onChange={handleNewInputChange}
          required
        />
        <Input
          type="number"
          name="quantity"
          placeholder="Cantidad"
          value={newPacking.quantity === 0 ? "" : newPacking.quantity}
          onChange={handleNewInputChange}
          required
        />
        <Input
          type="datetime-local"
          name="packingDate"
          value={newPacking.packingDate}
          onChange={handleNewInputChange}
          required
        />
        <Input
          name="status"
          placeholder="Estado"
          value={newPacking.status}
          onChange={handleNewInputChange}
          required
        />
        <SubmitButton type="submit">Agregar Packing</SubmitButton>
      </FormContainer>

      {/* Tarjetas resumen */}
      <CardContainer>
        <Card>
          <CardTitle>Total Packings</CardTitle>
          <CardValue>{packings.length}</CardValue>
        </Card>
        <Card>
          <CardTitle>Completed</CardTitle>
          <CardValue>{packings.filter((p) => p.status === "Completed").length}</CardValue>
        </Card>
        <Card>
          <CardTitle>Pending</CardTitle>
          <CardValue>{packings.filter((p) => p.status === "Pending").length}</CardValue>
        </Card>
        <Card>
          <CardTitle>In Progress</CardTitle>
          <CardValue>{packings.filter((p) => p.status === "In Progress").length}</CardValue>
        </Card>
      </CardContainer>

      {/* Tabla con opciones para editar y borrar */}
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Packing ID</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Fecha de Packing</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {packings.map((packing) => (
              <tr key={packing.id}>
                <td>{packing.id}</td>
                <td>
                  {editingId === packing.id ? (
                    <InputSmall
                      name="packingId"
                      value={editPacking.packingId}
                      onChange={handleEditInputChange}
                      required
                    />
                  ) : (
                    packing.packingId
                  )}
                </td>
                <td>
                  {editingId === packing.id ? (
                    <InputSmall
                      name="product"
                      value={editPacking.product}
                      onChange={handleEditInputChange}
                      required
                    />
                  ) : (
                    packing.product
                  )}
                </td>
                <td>
                  {editingId === packing.id ? (
                    <InputSmall
                      type="number"
                      name="quantity"
                      value={editPacking.quantity === 0 ? "" : editPacking.quantity}
                      onChange={handleEditInputChange}
                      required
                    />
                  ) : (
                    packing.quantity
                  )}
                </td>
                <td>
                  {editingId === packing.id ? (
                    <InputSmall
                      type="datetime-local"
                      name="packingDate"
                      value={editPacking.packingDate}
                      onChange={handleEditInputChange}
                      required
                    />
                  ) : (
                    new Date(packing.packingDate).toLocaleString()
                  )}
                </td>
                <td>
                  {editingId === packing.id ? (
                    <InputSmall
                      name="status"
                      value={editPacking.status}
                      onChange={handleEditInputChange}
                      required
                    />
                  ) : (
                    packing.status
                  )}
                </td>
                <td>
                  {editingId === packing.id ? (
                    <>
                      <ActionButton onClick={() => handleSaveEdit(packing.id)} color="#4BBF73">
                        <FaSave />
                      </ActionButton>
                      <ActionButton onClick={handleCancelEdit} color="#FF5757">
                        <FaTimes />
                      </ActionButton>
                    </>
                  ) : (
                    <>
                      <ActionButton onClick={() => handleEditClick(packing)} color="#F9A826">
                        <FaEdit />
                      </ActionButton>
                      <ActionButton onClick={() => handleDelete(packing.id)} color="#FF5757">
                        <FaTrash />
                      </ActionButton>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>

      {/* Gráficos con colores vibrantes */}
      <ChartsContainer>
        {/* Pie Chart: Distribución de estados */}
        <ChartWrapper>
          <ChartTitle>Distribución por Estado</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie dataKey="value" data={getStatusData(packings)} cx="50%" cy="50%" outerRadius={80} label>
                {getStatusData(packings).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartWrapper>
        {/* Bar Chart: Cantidad por Producto */}
        <ChartWrapper>
          <ChartTitle>Cantidad por Producto</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={packings}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="product" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantity" fill="#82ca9d" name="Cantidad" />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </ChartsContainer>
    </Container>
  );
}

/* ============================
   Estilos con styled-components
   ============================ */
const Container = styled.div`
  padding: 2rem;
  background-color: #f4f7fa;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  color: #333;
  font-size: 2rem;
  font-weight: bold;
`;

const Subtitle = styled.p`
  color: #555;
  font-size: 1.2rem;
  margin-bottom: 2rem;
`;

const FormContainer = styled.form`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
  flex: 1 1 150px;
`;

const InputSmall = styled(Input)`
  width: 100%;
  flex: unset;
  margin-bottom: 0.5rem;
`;

const SubmitButton = styled.button`
  background-color: #4BBF73;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
`;

const CardContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
`;

const Card = styled.div`
  background-color: #fff;
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  flex: 1 1 180px;
  text-align: center;
`;

const CardTitle = styled.p`
  margin: 0;
  font-size: 1rem;
  color: #777;
`;

const CardValue = styled.p`
  margin: 0.5rem 0 0;
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  margin-bottom: 2rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;

  th, td {
    border: 1px solid #ddd;
    padding: 0.75rem;
    text-align: left;
  }

  th {
    background-color: #f0f0f0;
  }
`;

const ActionButton = styled.button<{ color: string }>`
  background-color: transparent;
  border: none;
  color: ${(props) => props.color};
  cursor: pointer;
  margin-right: 0.5rem;
  font-size: 1rem;
`;

const ChartsContainer = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
`;

const ChartWrapper = styled.div`
  background-color: #fff;
  flex: 1 1 400px;
  padding: 1rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const ChartTitle = styled.h2`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 1rem;
`;
