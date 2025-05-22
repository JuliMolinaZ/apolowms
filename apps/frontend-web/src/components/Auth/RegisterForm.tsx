// src/components/Auth/RegisterForm.tsx
import React, { useState } from "react";
import { fakeRegister } from "../../lib/auth";
import { 
  Form, 
  InputGroup, 
  IconHolder, 
  Input, 
  ErrorMessage,
  PrimaryButton,
  SecondaryBtn,
  ButtonsRow
} from "./AuthStyles";

interface RegisterFormProps {
  onSwitch: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitch }) => {
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regError, setRegError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    if (regPassword !== regConfirm) {
      setRegError("Las contraseñas no coinciden");
      return;
    }
    try {
      await fakeRegister(regUsername, regEmail, regPassword);
      onSwitch(); // Vuelve al formulario de login
    } catch (err: any) {
      setRegError(err.message || "Error al registrarse");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup>
        <IconHolder>
          <svg width="16" height="16" fill="#999" viewBox="0 0 16 16">
            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Z" />
          </svg>
        </IconHolder>
        <Input
          type="text"
          placeholder="Username"
          value={regUsername}
          onChange={(e) => setRegUsername(e.target.value)}
          required
        />
      </InputGroup>
      <InputGroup>
        <IconHolder>
          <svg width="16" height="16" fill="#999" viewBox="0 0 16 16">
            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-.5a.5.5 0 0 0-.5.5v.217l6 3.6 6-3.6V4a.5.5 0 0 0-.5-.5H2zm12 2.383-5.28 3.168a.5.5 0 0 1-.44 0L3 5.883V12a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V5.883z" />
          </svg>
        </IconHolder>
        <Input
          type="email"
          placeholder="Email"
          value={regEmail}
          onChange={(e) => setRegEmail(e.target.value)}
          required
        />
      </InputGroup>
      <InputGroup>
        <IconHolder>
          <svg width="16" height="16" fill="#999" viewBox="0 0 16 16">
            <path d="M8 4a3 3 0 0 0-3 3v1H4a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2h-1V7a3 3 0 0 0-3-3z" />
          </svg>
        </IconHolder>
        <Input
          type="password"
          placeholder="Password"
          value={regPassword}
          onChange={(e) => setRegPassword(e.target.value)}
          required
        />
      </InputGroup>
      <InputGroup>
        <IconHolder>
          <svg width="16" height="16" fill="#999" viewBox="0 0 16 16">
            <path d="M8 4a3 3 0 0 0-3 3v1H4a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2h-1V7a3 3 0 0 0-3-3z" />
          </svg>
        </IconHolder>
        <Input
          type="password"
          placeholder="Confirm Password"
          value={regConfirm}
          onChange={(e) => setRegConfirm(e.target.value)}
          required
        />
      </InputGroup>
      {regError && <ErrorMessage>{regError}</ErrorMessage>}
      <ButtonsRow>
        <PrimaryButton type="submit">Sign Up</PrimaryButton>
        <SecondaryBtn type="button" onClick={onSwitch}>
          Login
        </SecondaryBtn>
      </ButtonsRow>
    </Form>
  );
};

export default RegisterForm;
