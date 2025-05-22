"use client";

import React, { useRef, useState } from "react";
import styled from "styled-components";
import EditIcon from "@mui/icons-material/Edit";

/* Ajusta la interfaz 'User' a tu modelo real */
interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  role: string;
  profileImage?: string; // nombre del archivo de la imagen
}

interface EditProfileModalProps {
  user: User;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || "");
  const [role, setRole] = useState(user.role);
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("role", role);
    if (password) formData.append("password", password);
    if (profileImage) formData.append("profileImage", profileImage);

    try {
      const res = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: "PATCH",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        // Actualiza localStorage si el backend devuelve el user
        localStorage.setItem("user", JSON.stringify(data));
        onClose();
        window.location.reload();
      } else {
        console.error("Error actualizando perfil:", res.status, data);
      }
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <ModalOverlay>
      <ModalContainer>
        <HeaderSection>
          <AvatarContainer onClick={handleAvatarClick}>
            <ProfileLogo
              src={
                user.profileImage
                  ? `http://localhost:3000/uploads/${user.profileImage}`
                  : "/logos/default-avatar.png"
              }
              alt={user.username}
            />
            <EditIconContainer>
              <EditIcon style={{ fontSize: "1.2rem", color: "#fff" }} />
            </EditIconContainer>
            <HiddenFileInput
              ref={fileInputRef}
              type="file"
              onChange={handleImageChange}
              accept="image/png, image/jpeg, image/jpg"
            />
          </AvatarContainer>
        </HeaderSection>

        {/* Puedes mostrar el nombre debajo de la imagen, si quieres que se parezca más al frame */}
        {/* <NameText>{username}</NameText> */}

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <label>Nombre</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </InputGroup>
          <InputGroup>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </InputGroup>
          <InputGroup>
            <label>Teléfono</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </InputGroup>
          <InputGroup>
            <label>Rol</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </InputGroup>
          <InputGroup>
            <label>Nueva contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </InputGroup>

          <ButtonGroup>
            <SubmitButton type="submit">Guardar</SubmitButton>
            <CancelButton type="button" onClick={onClose}>
              Cancelar
            </CancelButton>
          </ButtonGroup>
        </Form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default EditProfileModal;

// ======================= Styled Components =======================

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5); 
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
`;

const ModalContainer = styled.div`
  background: #fff;          /* Fondo blanco para simular tarjeta */
  padding: 2rem;
  border-radius: 1rem;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  color: #000;              /* Texto en negro */
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
`;

const AvatarContainer = styled.div`
  position: relative;
  cursor: pointer;
`;

const ProfileLogo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
`;

const EditIconContainer = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  padding: 3px;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

/* Si deseas mostrar el nombre debajo de la imagen, usa algo así:
const NameText = styled.h2`
  margin-top: 0.8rem;
  font-size: 1.2rem;
  font-weight: 600;
`;
*/

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
`;

const InputGroup = styled.div`
  margin-bottom: 1rem;
  
  label {
    display: block;
    font-weight: 500;
    font-size: 0.9rem;
    margin-bottom: 0.3rem;
    color: #333;
  }

  input {
    width: 100%;
    border: none;
    border-bottom: 1px solid #ccc;
    padding: 0.4rem 0;
    font-size: 1rem;
    color: #000;

    &:focus {
      outline: none;
      border-bottom: 1px solid #000;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const SubmitButton = styled.button`
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 0.5rem;
  background-color: #2e67f8; 
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1f4cbc;
  }
`;

const CancelButton = styled.button`
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 0.5rem;
  background-color: #d1d5db;
  color: #000;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #9ca3af;
  }
`;
