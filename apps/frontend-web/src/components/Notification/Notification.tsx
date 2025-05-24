'use client';

import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { useNotifications } from '@/hooks/useNotifications';

const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const NotificationItem = styled.div<{ type: string }>`
  padding: 10px 20px;
  border-radius: 4px;
  background-color: ${({ type }) => {
    switch (type) {
      case 'error':
        return 'rgba(255, 0, 0, 0.8)';
      case 'warning':
        return 'rgba(255, 165, 0, 0.8)';
      case 'success':
        return 'rgba(0, 128, 0, 0.8)';
      default:
        return 'rgba(0, 0, 255, 0.8)';
    }
  }};
  color: #fff;
`;

interface NotificationType {
  message: string;
  type: string;
  timestamp: number;
}

const Notification: React.FC = () => {
  const notifications = useNotifications();

  if (typeof window === 'undefined') return null;

  return ReactDOM.createPortal(
    <NotificationContainer>
      {notifications.map((notif, index) => (
        <NotificationItem key={index} type={notif.type}>
          {notif.message}
        </NotificationItem>
      ))}
    </NotificationContainer>,
    document.body
  );
};

export default Notification;
