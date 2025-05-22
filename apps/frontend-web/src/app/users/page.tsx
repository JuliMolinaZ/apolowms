"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  role: string;
  image?: string; // Propiedad para la imagen
}

// Datos de ejemplo. En tu caso, vendrán del fetch a tu API
const mockUsers: User[] = [
  {
    id: "1",
    name: "User001",
    username: "User001",
    email: "test@test.com",
    phone: "3184553490",
    role: "OPERATOR",
    image: "/images/user1.jpg", // Ruta a la imagen en public/images
  },
  {
    id: "2",
    name: "User002",
    username: "User002",
    email: "user2@test.com",
    phone: "3201234567",
    role: "ADMIN",
    image: "/images/user2.jpg", // Ruta a la imagen en public/images
  },
];

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    // Simulación de fetch. En tu caso, haz la llamada real:
    setUsers(mockUsers);
  }, []);

  const totalUsers = users.length;

  const handleEdit = (user: User) => {
    setEditingUser(user);
  };

  const handleDelete = (user: User) => {
    console.log("Eliminar usuario:", user.id);
    // Aquí tu lógica para eliminar
  };

  const handleCloseEdit = () => {
    setEditingUser(null);
  };

  return (
    <PageContainer>
      {/* Encabezado: Logo (círculo) + "Users {n}" */}
      <HeaderWrapper>
        <LogoCircle>
          <img src="/logos/user.svg" alt="Users Logo" />
        </LogoCircle>
        <HeaderText>
          Users <span>{totalUsers}</span>
        </HeaderText>
      </HeaderWrapper>

      {/* Burbujas decorativas (opcionales) */}
      <BubblesContainer>
        <Bubble size={150} top="10%" right="5%" />
        <Bubble size={100} top="35%" right="10%" />
        <Bubble size={200} top="60%" right="2%" />
        <Bubble size={60} top="80%" right="8%" />
      </BubblesContainer>

      {/* Ícono con badge en esquina inferior derecha (opcional) */}
      <BoxIconContainer>
        <BoxPlaceholder>Box</BoxPlaceholder>
        <NotificationBadge>2</NotificationBadge>
      </BoxIconContainer>

      {/* Vista de edición o tarjetas de usuarios */}
      {editingUser ? (
        <EditUserView user={editingUser} onClose={handleCloseEdit} />
      ) : (
        <CardsContainer>
          {users.map((user) => (
            <UserCard key={user.id}>
              {/* Sección izquierda: Avatar + info (Nombre, @username, email) */}
              <LeftSection>
                <AvatarCircle>
                  <img
                    src={user.image || "/logos/default-avatar.png"}
                    alt={user.username}
                  />
                </AvatarCircle>
                <UserText>
                  <UserName>{user.name}</UserName>
                  <UserUsername>@{user.username}</UserUsername>
                  <UserEmail>{user.email}</UserEmail>
                </UserText>
              </LeftSection>

              {/* Sección derecha: Rol, Teléfono y botones */}
              <RightSection>
                <RolePhone>
                  <UserRole>{user.role}</UserRole>
                  {user.phone && <UserPhone>{user.phone}</UserPhone>}
                </RolePhone>
                <ButtonsContainer>
                  <EditButton onClick={() => handleEdit(user)}>
                    Editar
                  </EditButton>
                  <DeleteButton onClick={() => handleDelete(user)}>
                    Eliminar
                  </DeleteButton>
                </ButtonsContainer>
              </RightSection>
            </UserCard>
          ))}
        </CardsContainer>
      )}
    </PageContainer>
  );
};

export default UsersPage;

/* ========================= Vista de Edición ========================= */
interface EditUserViewProps {
  user: User;
  onClose: () => void;
}

const EditUserView: React.FC<EditUserViewProps> = ({ user, onClose }) => {
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [phone, setPhone] = useState(user.phone || "");
  const [role, setRole] = useState(user.role);

  const handleSave = () => {
    console.log("Guardando cambios...", { name, username, phone, role });
    // Lógica para actualizar
    onClose();
  };

  return (
    <EditContainer>
      {/* Formulario (columna izquierda) */}
      <EditForm>
        <FormTitle>Editar perfil</FormTitle>
        <UserHandle>@{username}</UserHandle>

        <FieldLabel>Name</FieldLabel>
        <FieldInput
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <FieldLabel>Username</FieldLabel>
        <FieldInput
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <FieldLabel>Teléfono</FieldLabel>
        <FieldInput
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <FieldLabel>Rol</FieldLabel>
        <FieldInput
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />

        <SaveButton onClick={handleSave}>Guardar</SaveButton>
      </EditForm>

      {/* Tarjeta de vista previa (columna derecha) */}
      <PreviewCard>
        <PreviewImage>
          <img
            src={user.image || "/logos/default-avatar.png"}
            alt={user.username}
          />
        </PreviewImage>

        <PreviewData>
          <PreviewLabel>Name</PreviewLabel>
          <PreviewValue>{name}</PreviewValue>

          <PreviewLabel>Username</PreviewLabel>
          <PreviewValue>{username}</PreviewValue>

          <PreviewLabel>Teléfono</PreviewLabel>
          <PreviewValue>{phone}</PreviewValue>

          <PreviewLabel>Rol</PreviewLabel>
          <PreviewValue>{role}</PreviewValue>
        </PreviewData>
      </PreviewCard>
    </EditContainer>
  );
};

/* ======================== Estilos Generales ======================== */
const PageContainer = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
  z-index: 1;
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 2rem;
`;

/* Nuevo componente para el logo en el encabezado */
const LogoCircle = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const HeaderText = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin: 0;

  span {
    font-size: 1.5rem;
    font-weight: 600;
    color: #666;
    margin-left: 0.5rem;
  }
`;

/* Burbujas decorativas */
const BubblesContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 50%;
  pointer-events: none;
  overflow: hidden;
  z-index: -1;
`;

interface BubbleProps {
  size: number;
  top: string;
  right: string;
}

const Bubble = styled.div<BubbleProps>`
  position: absolute;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: 50%;
  background: #b2daf0;
  opacity: 0.8;
  top: ${(props) => props.top};
  right: ${(props) => props.right};
`;

/* Ícono con badge en esquina inferior derecha */
const BoxIconContainer = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  z-index: 100;
`;

const BoxPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background-color: #cccccc;
  border-radius: 0.5rem;
  color: #333;
  font-size: 0.9rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: -6px;
  right: -6px;
  background-color: #f00;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/* ===================== Tarjetas de Usuarios ===================== */
const CardsContainer = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const UserCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-radius: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1.5rem 2rem;
  gap: 1rem;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AvatarCircle = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const UserName = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
`;

const UserUsername = styled.div`
  font-size: 0.9rem;
  color: #555;
`;

const UserEmail = styled.div`
  font-size: 0.9rem;
  color: #555;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const RolePhone = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const UserRole = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  text-transform: uppercase;
`;

const UserPhone = styled.div`
  font-size: 0.9rem;
  color: #333;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const EditButton = styled.button`
  background-color: #2e67f8;
  color: #fff;
  border: none;
  border-radius: 1rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;

  &:hover {
    background-color: #1f4cbc;
  }
`;

const DeleteButton = styled.button`
  background-color: #e85b5b;
  color: #fff;
  border: none;
  border-radius: 1rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;

  &:hover {
    background-color: #d14242;
  }
`;

/* ===================== Vista de Edición ===================== */
const EditContainer = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: 4rem auto 3rem auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 3rem;
`;

const EditForm = styled.div`
  flex: 1;
  max-width: 450px;
  display: flex;
  flex-direction: column;
`;

const FormTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.2rem;
`;

const UserHandle = styled.span`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 2rem;
  display: inline-block;
`;

const FieldLabel = styled.label`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.3rem;
`;

const FieldInput = styled.input`
  border: none;
  border-bottom: 1px solid #ccc;
  padding: 0.4rem 0;
  margin-bottom: 1.2rem;
  font-size: 1rem;
  color: #333;

  &:focus {
    outline: none;
    border-bottom: 2px solid #333;
  }
`;

const SaveButton = styled.button`
  width: fit-content;
  background-color: #2e67f8;
  color: #fff;
  border: none;
  border-radius: 1rem;
  padding: 0.6rem 1.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;

  &:hover {
    background-color: #1f4cbc;
  }
`;

const PreviewCard = styled.div`
  flex: 1;
  max-width: 450px;
  background-color: #fff;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  align-self: flex-start;
`;

/* Actualizamos PreviewImage para mostrar la foto del usuario */
const PreviewImage = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 1rem auto;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PreviewData = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PreviewLabel = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
`;

const PreviewValue = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: #333;
`;
