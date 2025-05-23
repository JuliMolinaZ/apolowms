"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import styled from "styled-components";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
  Legend,
} from "recharts";
import { FaBoxOpen, FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import { API_URL } from "../../../../lib/config";

interface User {
  id: number;
  username: string;
  isOnline: boolean;
  profileImage?: string;
}

interface Putaway {
  id: number;
  receiptId: string;
  location: string;
  quantity: number;
  createdAt: string;
}

const getLocationData = (putaways: Putaway[]) => {
  const locations: { [key: string]: number } = {};
  putaways.forEach((p) => {
    locations[p.location] = (locations[p.location] || 0) + 1;
  });
  return Object.entries(locations).map(([location, count]) => ({ location, count }));
};

export default function PutawayPage() {
  const [putaways, setPutaways] = useState<Putaway[]>([]);

  const [newPutaway, setNewPutaway] = useState<Omit<Putaway, "id" | "createdAt">>({
    receiptId: "",
    location: "",
    quantity: 0,
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editPutaway, setEditPutaway] = useState<Omit<Putaway, "id" | "createdAt">>({
    receiptId: "",
    location: "",
    quantity: 0,
  });

  const fetchPutaways = async () => {
    try {
      const res = await fetch(`${API_URL}/putaway`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setPutaways(data);
      }
    } catch (error) {
      console.error("Error fetching putaways:", error);
    }
  };

  useEffect(() => {
    fetchPutaways();
  }, []);

  const handleNewInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPutaway({
      ...newPutaway,
      [name]: name === "quantity" ? Number(value) : value,
    });
  };

  const handleAddPutaway = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/putaway`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPutaway),
      });
      setNewPutaway({ receiptId: "", location: "", quantity: 0 });
      fetchPutaways();
    } catch (error) {
      console.error("Error creating putaway:", error);
    }
  };

  const handleEditClick = (putaway: Putaway) => {
    setEditingId(putaway.id);
    setEditPutaway({
      receiptId: putaway.receiptId,
      location: putaway.location,
      quantity: putaway.quantity,
    });
  };

  const handleEditInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditPutaway({
      ...editPutaway,
      [name]: name === "quantity" ? Number(value) : value,
    });
  };

  const handleSaveEdit = async (id: number) => {
    try {
      await fetch(`${API_URL}/putaway/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editPutaway),
      });
      setEditingId(null);
      fetchPutaways();
    } catch (error) {
      console.error("Error updating putaway:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${API_URL}/putaway/${id}`, {
        method: "DELETE",
      });
      fetchPutaways();
    } catch (error) {
      console.error("Error deleting putaway:", error);
    }
  };

  return (
    <Container>
      <Header>
        <FaBoxOpen size={40} color="#4BBF73" />
        <Title>Módulo Putaway</Title>
      </Header>
      <Subtitle>Organización y seguimiento de putaway</Subtitle>

      <FormContainer onSubmit={handleAddPutaway}>
        <Input
          name="receiptId"
          placeholder="Receipt ID"
          value={newPutaway.receiptId}
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
        <SubmitButton type="submit">
          <FaPlus /> Agregar Putaway
        </SubmitButton>
      </FormContainer>

      <CardContainer>
        <Card>
          <CardTitle>Total Putaways</CardTitle>
          <CardValue>{putaways.length}</CardValue>
        </Card>
      </CardContainer>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Receipt ID</th>
              <th>Cantidad</th>
              <th>Ubicación</th>
              <th>Fecha</th>
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
                      name="receiptId"
                      value={editPutaway.receiptId}
                      onChange={handleEditInputChange}
                      required
                    />
                  ) : (
                    p.receiptId
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
                <td>{new Date(p.createdAt).toLocaleString()}</td>
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

      <ChartsContainer>
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
  background-color: #4bbf73;
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
