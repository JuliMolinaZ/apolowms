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
import { FaThList, FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";

// Definición de la interfaz para Slot
interface Slot {
  id: number;
  slotId: string;
  location: string;
  capacity: number;
  usedCapacity: number;
  status: string; // "Available", "Partial", "Full"
}

// Datos demo iniciales
const initialSlots: Slot[] = [
  {
    id: 1,
    slotId: "SLT-001",
    location: "Almacén A",
    capacity: 100,
    usedCapacity: 40,
    status: "Available",
  },
  {
    id: 2,
    slotId: "SLT-002",
    location: "Almacén B",
    capacity: 80,
    usedCapacity: 80,
    status: "Full",
  },
  {
    id: 3,
    slotId: "SLT-003",
    location: "Almacén A",
    capacity: 120,
    usedCapacity: 60,
    status: "Partial",
  },
  {
    id: 4,
    slotId: "SLT-004",
    location: "Almacén C",
    capacity: 150,
    usedCapacity: 150,
    status: "Full",
  },
  {
    id: 5,
    slotId: "SLT-005",
    location: "Almacén B",
    capacity: 90,
    usedCapacity: 30,
    status: "Available",
  },
];

// Colores para el PieChart
const pieColors = ["#4BBF73", "#F9A826", "#FF5757"];

// Función para generar datos del gráfico de pastel según el estado
const getStatusData = (slots: Slot[]) => [
  { name: "Available", value: slots.filter((s) => s.status === "Available").length },
  { name: "Partial", value: slots.filter((s) => s.status === "Partial").length },
  { name: "Full", value: slots.filter((s) => s.status === "Full").length },
];

// Función para agrupar los slots por ubicación y obtener su cantidad
const getLocationData = (slots: Slot[]) => {
  const locations: { [key: string]: number } = {};
  slots.forEach((s) => {
    locations[s.location] = (locations[s.location] || 0) + 1;
  });
  return Object.entries(locations).map(([location, count]) => ({ location, count }));
};

export default function SlottingPage() {
  // Estado que mantiene los slots (simulando data del backend)
  const [slots, setSlots] = useState<Slot[]>(initialSlots);

  // Estados para el formulario de nuevo slot
  const [newSlot, setNewSlot] = useState<Omit<Slot, "id">>({
    slotId: "",
    location: "",
    capacity: 0,
    usedCapacity: 0,
    status: "",
  });

  // Estados para la edición: guarda el id a editar y sus datos temporales
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editSlot, setEditSlot] = useState<Omit<Slot, "id">>({
    slotId: "",
    location: "",
    capacity: 0,
    usedCapacity: 0,
    status: "",
  });

  // Maneja los cambios en el formulario de nuevo slot
  const handleNewInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSlot({
      ...newSlot,
      [name]:
        name === "capacity" || name === "usedCapacity" ? Number(value) : value,
    });
  };

  // Agrega un nuevo slot
  const handleAddSlot = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newId = slots.length > 0 ? Math.max(...slots.map((s) => s.id)) + 1 : 1;
    const slotToAdd: Slot = { id: newId, ...newSlot };
    setSlots([...slots, slotToAdd]);
    setNewSlot({ slotId: "", location: "", capacity: 0, usedCapacity: 0, status: "" });
  };

  // Inicia la edición de un slot
  const handleEditClick = (slot: Slot) => {
    setEditingId(slot.id);
    setEditSlot({
      slotId: slot.slotId,
      location: slot.location,
      capacity: slot.capacity,
      usedCapacity: slot.usedCapacity,
      status: slot.status,
    });
  };

  // Maneja cambios en el formulario de edición
  const handleEditInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditSlot({
      ...editSlot,
      [name]:
        name === "capacity" || name === "usedCapacity" ? Number(value) : value,
    });
  };

  // Guarda los cambios de edición
  const handleSaveEdit = (id: number) => {
    const updatedSlots = slots.map((s) =>
      s.id === id ? { id, ...editSlot } : s
    );
    setSlots(updatedSlots);
    setEditingId(null);
  };

  // Cancela la edición
  const handleCancelEdit = () => {
    setEditingId(null);
  };

  // Borra un slot
  const handleDelete = (id: number) => {
    const updatedSlots = slots.filter((s) => s.id !== id);
    setSlots(updatedSlots);
  };

  return (
    <Container>
      {/* Header del módulo */}
      <Header>
        <FaThList size={40} color="#4BBF73" />
        <Title>Módulo Slotting</Title>
      </Header>
      <Subtitle>Organización y seguimiento de slots</Subtitle>

      {/* Formulario para agregar nuevo slot */}
      <FormContainer onSubmit={handleAddSlot}>
        <Input
          name="slotId"
          placeholder="Slot ID"
          value={newSlot.slotId}
          onChange={handleNewInputChange}
          required
        />
        <Input
          name="location"
          placeholder="Ubicación"
          value={newSlot.location}
          onChange={handleNewInputChange}
          required
        />
        <Input
          type="number"
          name="capacity"
          placeholder="Capacidad"
          value={newSlot.capacity === 0 ? "" : newSlot.capacity}
          onChange={handleNewInputChange}
          required
        />
        <Input
          type="number"
          name="usedCapacity"
          placeholder="Capacidad Usada"
          value={newSlot.usedCapacity === 0 ? "" : newSlot.usedCapacity}
          onChange={handleNewInputChange}
          required
        />
        <Input
          name="status"
          placeholder="Estado (Available, Partial, Full)"
          value={newSlot.status}
          onChange={handleNewInputChange}
          required
        />
        <SubmitButton type="submit">
          <FaPlus /> Agregar Slot
        </SubmitButton>
      </FormContainer>

      {/* Tarjetas resumen */}
      <CardContainer>
        <Card>
          <CardTitle>Total Slots</CardTitle>
          <CardValue>{slots.length}</CardValue>
        </Card>
        <Card>
          <CardTitle>Available</CardTitle>
          <CardValue>{slots.filter((s) => s.status === "Available").length}</CardValue>
        </Card>
        <Card>
          <CardTitle>Partial</CardTitle>
          <CardValue>{slots.filter((s) => s.status === "Partial").length}</CardValue>
        </Card>
        <Card>
          <CardTitle>Full</CardTitle>
          <CardValue>{slots.filter((s) => s.status === "Full").length}</CardValue>
        </Card>
      </CardContainer>

      {/* Tabla con opciones para editar y borrar */}
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Slot ID</th>
              <th>Ubicación</th>
              <th>Capacidad</th>
              <th>Usada</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => (
              <tr key={slot.id}>
                <td>{slot.id}</td>
                <td>
                  {editingId === slot.id ? (
                    <InputSmall
                      name="slotId"
                      value={editSlot.slotId}
                      onChange={handleEditInputChange}
                      required
                    />
                  ) : (
                    slot.slotId
                  )}
                </td>
                <td>
                  {editingId === slot.id ? (
                    <InputSmall
                      name="location"
                      value={editSlot.location}
                      onChange={handleEditInputChange}
                      required
                    />
                  ) : (
                    slot.location
                  )}
                </td>
                <td>
                  {editingId === slot.id ? (
                    <InputSmall
                      type="number"
                      name="capacity"
                      value={editSlot.capacity === 0 ? "" : editSlot.capacity}
                      onChange={handleEditInputChange}
                      required
                    />
                  ) : (
                    slot.capacity
                  )}
                </td>
                <td>
                  {editingId === slot.id ? (
                    <InputSmall
                      type="number"
                      name="usedCapacity"
                      value={editSlot.usedCapacity === 0 ? "" : editSlot.usedCapacity}
                      onChange={handleEditInputChange}
                      required
                    />
                  ) : (
                    slot.usedCapacity
                  )}
                </td>
                <td>
                  {editingId === slot.id ? (
                    <InputSmall
                      name="status"
                      value={editSlot.status}
                      onChange={handleEditInputChange}
                      required
                    />
                  ) : (
                    slot.status
                  )}
                </td>
                <td>
                  {editingId === slot.id ? (
                    <>
                      <ActionButton onClick={() => handleSaveEdit(slot.id)} color="#4BBF73">
                        <FaSave />
                      </ActionButton>
                      <ActionButton onClick={handleCancelEdit} color="#FF5757">
                        <FaTimes />
                      </ActionButton>
                    </>
                  ) : (
                    <>
                      <ActionButton onClick={() => handleEditClick(slot)} color="#F9A826">
                        <FaEdit />
                      </ActionButton>
                      <ActionButton onClick={() => handleDelete(slot.id)} color="#FF5757">
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
              <Pie dataKey="value" data={getStatusData(slots)} cx="50%" cy="50%" outerRadius={80} label>
                {getStatusData(slots).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartWrapper>
        {/* Bar Chart: Slots por Ubicación */}
        <ChartWrapper>
          <ChartTitle>Slots por Ubicación</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getLocationData(slots)}>
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
