"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
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
import { FaTruckLoading, FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";

// Definición de la interfaz para Arrival
interface Arrival {
  id: number;
  shipmentId: string;
  carrier: string;
  arrivalDate: string;
  status: string;
}

// Datos demo iniciales
const initialArrivals: Arrival[] = [
  {
    id: 1,
    shipmentId: "SHIP-101",
    carrier: "FedEx",
    arrivalDate: "2025-04-15T05:00:00",
    status: "Arrived",
  },
  {
    id: 2,
    shipmentId: "SHIP-102",
    carrier: "DHL",
    arrivalDate: "2025-04-16T09:30:00",
    status: "In Transit",
  },
  {
    id: 3,
    shipmentId: "SHIP-103",
    carrier: "UPS",
    arrivalDate: "2025-04-17T11:45:00",
    status: "Delayed",
  },
];

// Colores para el PieChart (distribución por estado)
const pieColors = ["#4BBF73", "#F9A826", "#FF5757"];

// Función que prepara la data para el gráfico de pastel, según estado.
const getStatusData = (arrivals: Arrival[]) => [
  { name: "Arrived", value: arrivals.filter((a) => a.status === "Arrived").length },
  { name: "In Transit", value: arrivals.filter((a) => a.status === "In Transit").length },
  { name: "Delayed", value: arrivals.filter((a) => a.status === "Delayed").length },
];

// Función que agrupa los arrivals por transportista para generar un gráfico de barras.
const getCarrierData = (arrivals: Arrival[]) => {
  const carriers: { [key: string]: number } = {};
  arrivals.forEach((a) => {
    carriers[a.carrier] = (carriers[a.carrier] || 0) + 1;
  });
  return Object.entries(carriers).map(([carrier, count]) => ({ carrier, count }));
};

export default function ArrivalsPage() {
  // Estado que mantiene los arrivals (simulación en local)
  const [arrivals, setArrivals] = useState<Arrival[]>(initialArrivals);

  // Estados para el formulario de nuevo arrival
  const [newArrival, setNewArrival] = useState<Omit<Arrival, "id">>({
    shipmentId: "",
    carrier: "",
    arrivalDate: "",
    status: "",
  });

  // Estados para la edición: almacena el ID a editar y sus datos temporales
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editArrival, setEditArrival] = useState<Omit<Arrival, "id">>({
    shipmentId: "",
    carrier: "",
    arrivalDate: "",
    status: "",
  });

  // (Simulación de fetch) – En un escenario real podrías obtener datos vía axios.
  useEffect(() => {
    // Ejemplo: axios.get('/api/arrivals')...
    // Si falla, se mantendrían los datos demo.
  }, []);

  // Manejo de cambios en el formulario de nuevo arrival
  const handleNewInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewArrival({
      ...newArrival,
      [e.target.name]: e.target.value,
    });
  };

  // Agrega un nuevo arrival y actualiza la vista
  const handleAddArrival = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newId = arrivals.length > 0 ? Math.max(...arrivals.map((a) => a.id)) + 1 : 1;
    const arrivalToAdd: Arrival = { id: newId, ...newArrival };
    setArrivals([...arrivals, arrivalToAdd]);
    setNewArrival({ shipmentId: "", carrier: "", arrivalDate: "", status: "" });
  };

  // Inicia la edición de un arrival
  const handleEditClick = (arrival: Arrival) => {
    setEditingId(arrival.id);
    setEditArrival({
      shipmentId: arrival.shipmentId,
      carrier: arrival.carrier,
      arrivalDate: arrival.arrivalDate,
      status: arrival.status,
    });
  };

  // Maneja cambios en el formulario de edición
  const handleEditInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditArrival({
      ...editArrival,
      [e.target.name]: e.target.value,
    });
  };

  // Guarda la edición
  const handleSaveEdit = (id: number) => {
    const updatedArrivals = arrivals.map((a) =>
      a.id === id ? { id, ...editArrival } : a
    );
    setArrivals(updatedArrivals);
    setEditingId(null);
  };

  // Cancela la edición
  const handleCancelEdit = () => {
    setEditingId(null);
  };

  // Borra un arrival
  const handleDelete = (id: number) => {
    const updatedArrivals = arrivals.filter((a) => a.id !== id);
    setArrivals(updatedArrivals);
  };

  return (
    <Container>
      {/* Header del módulo */}
      <Header>
        <FaTruckLoading size={40} color="#4BBF73" />
        <Title>Módulo Arrivals</Title>
      </Header>
      
      {/* Formulario para agregar nuevo arrival */}
      <FormContainer onSubmit={handleAddArrival}>
        <Input
          name="shipmentId"
          placeholder="Shipment ID"
          value={newArrival.shipmentId}
          onChange={handleNewInputChange}
          required
        />
        <Input
          name="carrier"
          placeholder="Carrier"
          value={newArrival.carrier}
          onChange={handleNewInputChange}
          required
        />
        <Input
          type="datetime-local"
          name="arrivalDate"
          value={newArrival.arrivalDate}
          onChange={handleNewInputChange}
          required
        />
        <Input
          name="status"
          placeholder="Estado"
          value={newArrival.status}
          onChange={handleNewInputChange}
          required
        />
        <SubmitButton type="submit">
          <FaPlus /> Agregar Arrival
        </SubmitButton>
      </FormContainer>
      
      {/* Tabla con los arrivals y opciones de editar/borrar */}
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Shipment ID</th>
              <th>Carrier</th>
              <th>Fecha de Llegada</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {arrivals.map((arrival) => (
              <tr key={arrival.id}>
                <td>{arrival.id}</td>
                <td>
                  {editingId === arrival.id ? (
                    <InputSmall
                      name="shipmentId"
                      value={editArrival.shipmentId}
                      onChange={handleEditInputChange}
                      required
                    />
                  ) : (
                    arrival.shipmentId
                  )}
                </td>
                <td>
                  {editingId === arrival.id ? (
                    <InputSmall
                      name="carrier"
                      value={editArrival.carrier}
                      onChange={handleEditInputChange}
                      required
                    />
                  ) : (
                    arrival.carrier
                  )}
                </td>
                <td>
                  {editingId === arrival.id ? (
                    <InputSmall
                      type="datetime-local"
                      name="arrivalDate"
                      value={editArrival.arrivalDate}
                      onChange={handleEditInputChange}
                      required
                    />
                  ) : (
                    new Date(arrival.arrivalDate).toLocaleString()
                  )}
                </td>
                <td>
                  {editingId === arrival.id ? (
                    <InputSmall
                      name="status"
                      value={editArrival.status}
                      onChange={handleEditInputChange}
                      required
                    />
                  ) : (
                    arrival.status
                  )}
                </td>
                <td>
                  {editingId === arrival.id ? (
                    <>
                      <ActionButton onClick={() => handleSaveEdit(arrival.id)} color="#4BBF73">
                        <FaSave />
                      </ActionButton>
                      <ActionButton onClick={handleCancelEdit} color="#FF5757">
                        <FaTimes />
                      </ActionButton>
                    </>
                  ) : (
                    <>
                      <ActionButton onClick={() => handleEditClick(arrival)} color="#F9A826">
                        <FaEdit />
                      </ActionButton>
                      <ActionButton onClick={() => handleDelete(arrival.id)} color="#FF5757">
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
              <Pie dataKey="value" data={getStatusData(arrivals)} cx="50%" cy="50%" outerRadius={80} label>
                {getStatusData(arrivals).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartWrapper>
        {/* Bar Chart: Arrivals por Carrier */}
        <ChartWrapper>
          <ChartTitle>Arrivals por Carrier</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getCarrierData(arrivals)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="carrier" />
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
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #333;
  font-size: 2rem;
  font-weight: bold;
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
