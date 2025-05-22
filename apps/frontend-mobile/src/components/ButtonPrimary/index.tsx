// src/components/ButtonPrimary/index.tsx
import React from 'react';
import { Button, ButtonProps } from '@ui-kitten/components';

export const ButtonPrimary = (props: React.JSX.IntrinsicAttributes & React.JSX.IntrinsicClassAttributes<Button> & Readonly<ButtonProps>) => (
  <Button {...props} status="primary" />
);
