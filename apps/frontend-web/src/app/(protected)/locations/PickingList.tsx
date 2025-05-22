"use client";

import React from "react";
import styled from "styled-components";
import { LocationData } from "./LocationModel";

function PickingList({ items }: { items: LocationData[] }) {
  return (
    <PickingListContainer>
      <h3>Picking List</h3>
      {items.length === 0 ? (
        <p>No hay ítems en la lista.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.slotId}>
              <strong>{item.slotId}</strong> - {item.productSku} ({item.stock} unidades)
            </li>
          ))}
        </ul>
      )}
    </PickingListContainer>
  );
}

export default PickingList;

const PickingListContainer = styled.div`
  background: #f0f8ff;
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 0.4rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`;
