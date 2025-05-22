// src/components/Auth/LoginForm.tsx
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { fakeLogin } from "../../lib/auth";
import { 
  Form, 
  InputGroup, 
  IconHolder, 
  Input, 
  CheckRow, 
  ErrorMessage, 
  PrimaryButton, 
  SecondaryText,
  SocialRow,
  SocialButton 
} from "./AuthStyles";

interface LoginFormProps {
  onSwitch: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitch }) => {
  const router = useRouter();
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      await fakeLogin(loginUsername, loginPassword);
      router.push("/dashboard");
    } catch (err: any) {
      setLoginError(err.message || "Error al iniciar sesión");
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
          value={loginUsername} 
          onChange={(e) => setLoginUsername(e.target.value)}
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
          value={loginPassword} 
          onChange={(e) => setLoginPassword(e.target.value)}
          required 
        />
      </InputGroup>
      <CheckRow>
        <label>
          <input 
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          <span>Remember me</span>
        </label>
        <span>Forgot password?</span>
      </CheckRow>
      {loginError && <ErrorMessage>{loginError}</ErrorMessage>}
      <PrimaryButton type="submit">Login</PrimaryButton>
      <SecondaryText>
        Don’t have an account? <span onClick={onSwitch}>Sign Up</span>
      </SecondaryText>
      <div>Or with</div>
      <SocialRow>
        <SocialButton>option1</SocialButton>
        <SocialButton>option2</SocialButton>
      </SocialRow>
    </Form>
  );
};

export default LoginForm;
