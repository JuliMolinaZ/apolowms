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
import { FaBoxOpen, FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";

// Definición de la interfaz para Putaway
interface Putaway {
  id: number;
  putawayId: string;
  product: string;
  quantity: number;
  location: string;
  putawayDate: string;
  status: string; // Por ejemplo: "Completed", "In Progress", "Pending"
}

// Datos demo iniciales
const initialPutaways: Putaway[] = [
  {
    id: 1,
    putawayId: "PTW-001",
    product: "Producto X",
    quantity: 150,
    location: "Almacén A",
    putawayDate: "2025-04-14T09:00:00",
    status: "Completed",
  },
  {
    id: 2,
    putawayId: "PTW-002",
    product: "Producto Y",
    quantity: 80,
    location: "Almacén B",
    putawayDate: "2025-04-15T10:30:00",
    status: "In Progress",
  },
  {
    id: 3,
    putawayId: "PTW-003",
    product: "Producto Z",
    quantity: 120,
    location: "Almacén A",
    putawayDate: "2025-04-16T08:45:00",
    status: "Pending",
  },
  {
    id: 4,
    putawayId: "PTW-004",
    product: "Producto X",
    quantity: 200,
    location: "Almacén C",
    putawayDate: "2025-04-16T11:20:00",
    status: "Completed",
  },
  {
    id: 5,
    putawayId: "PTW-005",
    product: "Producto Y",
    quantity: 90,
    location: "Almacén B",
    putawayDate: "2025-04-17T14:00:00",
    status: "In Progress",
  },
];

// Colores para el PieChart
const pieColors = ["#4BBF73", "#F9A826", "#FF5757"];

// Función que prepara la data para el gráfico de pastel según el estado
const getStatusData = (putaways: Putaway[]) => [
  { name: "Completed", value: putaways.filter((p) => p.status === "Completed").length },
  { name: "In Progress", value: putaways.filter((p) => p.status === "In Progress").length },
  { name: "Pending", value: putaways.filter((p) => p.status === "Pending").length },
];

// Función que agrupa los putaways por ubicación para el gráfico de barras
const getLocationData = (putaways: Putaway[]) => {
  const locations: { [key: string]: number } = {};
  putaways.forEach((p) => {
    locations[p.location] = (locations[p.location] || 0) + 1;
  });
  return Object.entries(locations).map(([location, count]) => ({ location, count }));
};

export default function PutawayPage() {
  // Estado que mantiene los putaways (simulación de backend)
  const [putaways, setPutaways] = useState<Putaway[]>(initialPutaways);

  // Estado para el formulario de nuevo putaway
  const [newPutaway, setNewPutaway] = useState<Omit<Putaway, "id">>({
    putawayId: "",
    product: "",
    quantity: 0,
    location: "",
    putawayDate: "",
    status: "",
  });

  // Estado para la edición: guarda el id a editar y sus datos temporales
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editPutaway, setEditPutaway] = useState<Omit<Putaway, "id">>({
    putawayId: "",
    product: "",
    quantity: 0,
    location: "",
    putawayDate: "",
    status: "",
  });

  // Manejo de cambios en el formulario de nuevo putaway
  const handleNewInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPutaway({
      ...newPutaway,
      [name]: name === "quantity" ? Number(value) : value,
    });
  };

  // Agrega un nuevo putaway
  const handleAddPutaway = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newId = putaways.length > 0 ? Math.max(...putaways.map((p) => p.id)) + 1 : 1;
    const putawayToAdd: Putaway = { id: newId, ...newPutaway };
    setPutaways([...putaways, putawayToAdd]);
    setNewPutaway({ putawayId: "", product: "", quantity: 0, location: "", putawayDate: "", status: "" });
  };

  // Inicia la edición de un putaway
  const handleEditClick = (putaway: Putaway) => {
    setEditingId(putaway.id);
    setEditPutaway({
      putawayId: putaway.putawayId,
      product: putaway.product,
      quantity: putaway.quantity,
      location: putaway.location,
      putawayDate: putaway.putawayDate,
      status: putaway.status,
    });
  };

  // Maneja cambios en el formulario de edición
  const handleEditInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditPutaway({
      ...editPutaway,
      [name]: name === "quantity" ? Number(value) : value,
    });
  };

  // Guarda los cambios de edición
  const handleSaveEdit = (id: number) => {
    const updatedPutaways = putaways.map((p) =>
      p.id === id ? { id, ...editPutaway } : p
    );
    setPutaways(updatedPutaways);
    setEditingId(null);
  };

  // Cancela la edición
  const handleCancelEdit = () => {
    setEditingId(null);
  };

  // Borra un putaway
  const handleDelete = (id: number) => {
    const updatedPutaways = putaways.filter((p) => p.id !== id);
    setPutaways(updatedPutaways);
  };

  return (
    <Container>
      {/* Header del módulo */}
      <Header>
        <FaBoxOpen size={40} color="#4BBF73" />
        <Title>Módulo Putaway</Title>
      </Header>
      <Subtitle>Organización y seguimiento de putaway</Subtitle>

      {/* Formulario para agregar nuevo putaway */}
      <FormContainer onSubmit={handleAddPutaway}>
        <Input
          name="putawayId"
          placeholder="Putaway ID"
          value={newPutaway.putawayId}
          onChange={handleNewInputChange}
          required
        />
        <Input
          name="product"
          placeholder="Producto"
          value={newPutaway.product}
          onChange={handleNewInputChange}
          required
        />
        <Input
          type="number"
          name="quantity"
          placeholder="Cantidad"
          value={newPutaway.quantity === 0 ? "" : newPutaway.quantity}
          onChange={handleNewInputChange}
          required
        />
        <Input
          name="location"
          placeholder="Ubicación"
          value={newPutaway.location}
          onChange={handleNewInputChange}
          required
        />
        <Input
          type="datetime-local"
          name="putawayDate"
          value={newPutaway.putawayDate}
          onChange={handleNewInputChange}
          required
        />
        <Input
          name="status"
          placeholder="Estado (Completed, In Progress, Pending)"
          value={newPutaway.status}
          onChange={handleNewInputChange}
          required
        />
        <SubmitButton type="submit">
          <FaPlus /> Agregar Putaway
        </SubmitButton>
      </FormContainer>

      {/* Tarjetas resumen */}
      <CardContainer>
        <Card>
          <CardTitle>Total Putaways</CardTitle>
          <CardValue>{putaways.length}</CardValue>
        </Card>
        <Card>
          <CardTitle>Completed</CardTitle>
          <CardValue>{putaways.filter((p) => p.status === "Completed").length}</CardValue>
        </Card>
        <Card>
          <CardTitle>In Progress</CardTitle>
          <CardValue>{putaways.filter((p) => p.status === "In Progress").length}</CardValue>
        </Card>
        <Card>
          <CardTitle>Pending</CardTitle>
          <CardValue>{putaways.filter((p) => p.status === "Pending").length}</CardValue>
        </Card>
      </CardContainer>

      {/* Tabla con opciones para editar y borrar */}
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Putaway ID</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Ubicación</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {putaways.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>
                  {editingId === p.id ? (
                    <InputSmall
                      name="putawayId"
                      value={editPutaway.putawayId}
                      onChange={handleEditInputChange}
                      required
                    />
                  ) : (
                    p.putawayId
                  )}
                </td>
                <td>
                  {editingId === p.id ? (
                    <InputSmall
                      name="product"
                      value={editPutaway.product}
                      onChange={handleEditInputChange}
                      required
                    />
                  ) : (
                    p.product
                  )}
                </td>
                <td>
                  {editingId === p.id ? (
                    <InputSmall
                      type="number"
                      name="quantity"
                      value={editPutaway.quantity === 0 ? "" : editPutaway.quantity}
                      onChange={handleEditInputChange}
                      required
                    />
                  ) : (
                    p.quantity
                  )}
                </td>
                <td>
                  {editingId === p.id ? (
                    <InputSmall
                      name="location"
                      value={editPutaway.location}
                      onChange={handleEditInputChange}
                      required
                    />
                  ) : (
                    p.location
                  )}
                </td>
                <td>
                  {editingId === p.id ? (
                    <InputSmall
                      type="datetime-local"
                      name="putawayDate"
                      value={editPutaway.putawayDate}
                      onChange={handleEditInputChange}
                      required
                    />
                  ) : (
                    new Date(p.putawayDate).toLocaleString()
                  )}
                </td>
                <td>
                  {editingId === p.id ? (
                    <InputSmall
                      name="status"
                      value={editPutaway.status}
                      onChange={handleEditInputChange}
                      required
                    />
                  ) : (
                    p.status
                  )}
                </td>
                <td>
                  {editingId === p.id ? (
                    <>
                      <ActionButton onClick={() => handleSaveEdit(p.id)} color="#4BBF73">
                        <FaSave />
                      </ActionButton>
                      <ActionButton onClick={handleCancelEdit} color="#FF5757">
                        <FaTimes />
                      </ActionButton>
                    </>
                  ) : (
                    <>
                      <ActionButton onClick={() => handleEditClick(p)} color="#F9A826">
                        <FaEdit />
                      </ActionButton>
                      <ActionButton onClick={() => handleDelete(p.id)} color="#FF5757">
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

      {/* Gráficos en tiempo real */}
      <ChartsContainer>
        {/* Pie Chart: Distribución por Estado */}
        <ChartWrapper>
          <ChartTitle>Distribución por Estado</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie dataKey="value" data={getStatusData(putaways)} cx="50%" cy="50%" outerRadius={80} label>
                {getStatusData(putaways).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartWrapper>
        {/* Bar Chart: Putaways por Ubicación */}
        <ChartWrapper>
          <ChartTitle>Putaways por Ubicación</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getLocationData(putaways)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="location" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" name="Cantidad" />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </ChartsContainer>
    </Container>
  );
}

/* ===============================
   Estilos con styled-components
   =============================== */
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
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const Input = styled.input`
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
  flex: 1 1 200px;
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
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #3ea15e;
  }
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

  th,
  td {
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
