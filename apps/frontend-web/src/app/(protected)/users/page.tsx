// src/app/(protected)/users/page.tsx
"use client";

import React, { useEffect, useState, ChangeEvent } from "react";
import styled, { keyframes } from "styled-components";
import { API_URL } from "../../../lib/config";

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  role: string;
  image?: string;
}

const pageSizes = { cards: 9, table: 10 };

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/users`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setUsers(
            data.map((u: any) => ({
              id: String(u.id),
              name: u.name || u.username,
              username: u.username,
              email: u.email,
              phone: u.phone,
              role: u.role,
              image: u.profileImage
                ? `${API_URL}/uploads/${u.profileImage}`
                : undefined,
            }))
          );
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // Filtrado combinado
  const filtered = users.filter((u) => {
    const matchText =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchText && matchRole;
  });

  // Paginación
  const pageSize = pageSizes[viewMode];
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const roles = Array.from(new Set(users.map((u) => u.role)));

  return (
    <Container>
      {/* Header */}
      <Header>
        <HeaderLogo>
          <img src="/logos/user.svg" alt="Users" />
        </HeaderLogo>
        <HeaderTitle>
          Users <span>{users.length}</span>
        </HeaderTitle>
      </Header>

      {/* Controls */}
      <Controls>
        <SearchInput
          placeholder="Search by name, username or email..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <Select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="all">All Roles</option>
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </Select>
        <ViewToggle>
          <ToggleButton
            active={viewMode === "cards"}
            onClick={() => setViewMode("cards")}
          >
            Cards
          </ToggleButton>
          <ToggleButton
            active={viewMode === "table"}
            onClick={() => setViewMode("table")}
          >
            Table
          </ToggleButton>
        </ViewToggle>
      </Controls>

      {/* Main Content */}
      {viewMode === "cards" ? (
        <CardsGrid>
          {paged.map((user) => (
            <Card key={user.id}>
              <Avatar>
                <img
                  src={user.image || "/logos/default-avatar.png"}
                  alt={user.username}
                />
              </Avatar>
              <Info>
                <Name>{user.name}</Name>
                <Username>@{user.username}</Username>
                <Email>{user.email}</Email>
                <Role>{user.role}</Role>
              </Info>
              <Actions>
                <Edit onClick={() => setEditingUser(user)}>Edit</Edit>
                <Delete
                  onClick={async () => {
                    if (!confirm("Delete this user?")) return;
                    await fetch(`${API_URL}/users/${user.id}`, {
                      method: "DELETE",
                    });
                    setUsers((prev) =>
                      prev.filter((u) => u.id !== user.id)
                    );
                  }}
                >
                  Delete
                </Delete>
              </Actions>
            </Card>
          ))}
        </CardsGrid>
      ) : (
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((u) => (
                <tr key={u.id}>
                  <td>
                    <SmallAvatar
                      src={u.image || "/logos/default-avatar.png"}
                    />
                  </td>
                  <td>{u.name}</td>
                  <td>@{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.phone || "-"}</td>
                  <td>{u.role}</td>
                  <td>
                    <SmallAction onClick={() => setEditingUser(u)}>
                      Edit
                    </SmallAction>
                    <SmallAction
                      danger
                      onClick={async () => {
                        if (!confirm("Delete this user?")) return;
                        await fetch(`${API_URL}/users/${u.id}`, {
                          method: "DELETE",
                        });
                        setUsers((p) => p.filter((x) => x.id !== u.id));
                      }}
                    >
                      Delete
                    </SmallAction>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <Pagination>
          <PageBtn
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            ←
          </PageBtn>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <PageBtn
              key={p}
              active={p === currentPage}
              onClick={() => setCurrentPage(p)}
            >
              {p}
            </PageBtn>
          ))}
          <PageBtn
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            →
          </PageBtn>
        </Pagination>
      )}

      {/* Modal de edición */}
      {editingUser && (
        <ModalOverlay onClick={() => setEditingUser(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h2>Edit User</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await fetch(`${API_URL}/users/${editingUser.id}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(editingUser),
                });
                setUsers((prev) =>
                  prev.map((u) =>
                    u.id === editingUser.id ? editingUser : u
                  )
                );
                setEditingUser(null);
              }}
            >
              <Label>Name</Label>
              <Input
                value={editingUser.name}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, name: e.target.value })
                }
              />
              <Label>Username</Label>
              <Input
                value={editingUser.username}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    username: e.target.value,
                  })
                }
              />
              <Label>Email</Label>
              <Input
                type="email"
                value={editingUser.email}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, email: e.target.value })
                }
              />
              <Label>Phone</Label>
              <Input
                value={editingUser.phone || ""}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, phone: e.target.value })
                }
              />
              <Label>Role</Label>
              <Input
                value={editingUser.role}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, role: e.target.value })
                }
              />
              <ButtonRow>
                <SaveButton type="submit">Save</SaveButton>
                <CancelButton onClick={() => setEditingUser(null)}>
                  Cancel
                </CancelButton>
              </ButtonRow>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}

/* ===========================
   Styled Components
   =========================== */
const fadeIn = keyframes`
  from { opacity: 0 }
  to   { opacity: 1 }
`;
const Container = styled.div`
  padding: 2rem;
  background: #f4f7fa;
  min-height: 100vh;
  animation: ${fadeIn} 0.5s;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;
const HeaderLogo = styled.div`
  width: 48px;
  height: 48px;
  img {
    width: 100%;
    height: 100%;
  }
`;
const HeaderTitle = styled.h1`
  font-size: 2rem;
  color: #333;
  span {
    color: #4bbf73;
    font-weight: bold;
    margin-left: 0.5rem;
  }
`;
const Controls = styled.div`
  margin: 1.5rem 0;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;
const SearchInput = styled.input`
  flex: 1 1 200px;
  padding: 0.6rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
`;
const Select = styled.select`
  padding: 0.6rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
`;
const ViewToggle = styled.div`
  display: flex;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  overflow: hidden;
`;
const ToggleButton = styled.button<{ active: boolean }>`
  padding: 0.6rem 1.2rem;
  background: ${({ active }) => (active ? "#4bbf73" : "transparent")};
  color: ${({ active }) => (active ? "#fff" : "#333")};
  border: none;
  cursor: pointer;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(240px,1fr));
  gap: 1.2rem;
`;
const Card = styled.div`
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.3s;
`;
const Avatar = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 1rem;
  img {
    width: 100%; height: 100%; object-fit: cover;
  }
`;
const Info = styled.div`
  text-align: center;
  flex: 1;
`;
const Name = styled.h3`margin:0; font-size:1.2rem; color:#333;`;
const Username = styled.p`margin:0.2rem 0; color:#777;`;
const Email = styled.p`margin:0.2rem 0; color:#777; font-size:0.9rem;`;
const Role = styled.span`
  display:inline-block;
  margin-top:0.6rem;
  padding:0.2rem 0.6rem;
  background:#e0f7e9;
  color:#2e7d32;
  border-radius:0.4rem;
  font-size:0.8rem;
  text-transform:uppercase;
`;
const Actions = styled.div`
  display:flex;
  justify-content: space-around;
  margin-top:1rem;
`;
const Btn = styled.button`
  padding:0.5rem 1.2rem;
  border:none; border-radius:0.6rem;
  font-size:0.9rem; cursor:pointer;
`;
const Edit = styled(Btn)`background:#1976d2;color:#fff;`;
const Delete = styled(Btn)`background:#e53935;color:#fff;`;

const TableWrapper = styled.div`
  overflow-x:auto; animation:${fadeIn} 0.3s;
`;
const Table = styled.table`
  width:100%;
  border-collapse:collapse;
  th,td { padding:0.8rem 1rem; text-align:left; border-bottom:1px solid #eee; }
  th { background:#fafafa; }
`;
const SmallAvatar = styled.img`
  width:32px;
  height:32px;
  border-radius:50%;
`;

const SmallAction = styled.button<{ danger?: boolean }>`
  background: ${({ danger }) => (danger ? "#e53935" : "#1976d2")};
  color:#fff;
  border:none; border-radius:0.4rem;
  padding:0.3rem 0.6rem;
  font-size:0.8rem; cursor:pointer;
  margin-right:0.4rem;
`;

const Pagination = styled.div`
  margin:2rem 0;
  display:flex;
  justify-content:center;
  gap:0.5rem;
`;
const PageBtn = styled.button<{ active?: boolean }>`
  padding:0.5rem 0.8rem;
  background: ${({ active }) => (active ? "#4bbf73" : "transparent")};
  color: ${({ active }) => (active ? "#fff" : "#333")};
  border:1px solid #ccc;
  border-radius:0.4rem;
  cursor:pointer;
  &:disabled { opacity:0.4; cursor:not-allowed; }
`;

/* Modal */
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display:flex;
  align-items:center;
  justify-content:center;
  z-index: 1000;
`;
const ModalContent = styled.div`
  background: #fff;
  border-radius: 1rem;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  animation: ${fadeIn} 0.2s;
`;
const Label = styled.label`
  display:block;
  margin:1rem 0 0.3rem;
  font-size:.9rem; color:#333;
`;
const Input = styled.input`
  width: 100%;
  padding:0.6rem;
  border:1px solid #ccc;
  border-radius:0.4rem;
`;
const ButtonRow = styled.div`
  margin-top:1.5rem;
  text-align:right;
`;
const SaveButton = styled(Btn)`background:#4bbf73;color:#fff;margin-right:1rem;`;
const CancelButton = styled(Btn)`background:#ccc;color:#333;`;

