// src/components/Auth/AuthStyles.ts
import styled from "styled-components";

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const InputGroup = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const IconHolder = styled.span`
  position: absolute;
  left: 10px;
  font-size: 14px;
  color: #999;
  display: flex;
  align-items: center;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.6rem 0.6rem 0.6rem 2rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
  outline: none;
  color: #333;
  &::placeholder {
    color: #999;
  }
`;

export const CheckRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #333;
  margin: 0.5rem 0;
  span { cursor: pointer; }
`;

export const ErrorMessage = styled.div`
  font-size: 13px;
  color: red;
  margin-top: -4px;
`;

export const PrimaryButton = styled.button`
  padding: 0.6rem;
  border: none;
  border-radius: 20px;
  background: #5ed7e8;
  color: #fff;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  transition: 0.3s;
  &:hover { opacity: 0.9; }
`;

export const SecondaryText = styled.div`
  margin: 0.5rem 0;
  font-size: 14px;
  text-align: center;
  color: #333;
  span {
    color: #666;
    text-decoration: underline;
    cursor: pointer;
    margin-left: 5px;
  }
`;

export const ButtonsRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

export const SecondaryBtn = styled.button`
  flex: 1;
  padding: 0.6rem;
  border: 2px solid #5ed7e8;
  border-radius: 20px;
  background: transparent;
  color: #5ed7e8;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  transition: 0.3s;
  &:hover { background: #e2fbfd; }
`;

export const SocialRow = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const SocialButton = styled.button`
  flex: 1;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 20px;
  background: #fff;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  &:hover { background: #f2f2f2; }
`;
