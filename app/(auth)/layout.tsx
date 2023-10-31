/**
 * @module layout.tsx
 * @description This module provides an authentication layout for wrapping auth-related components.
 * @requires react
 */

import React from 'react';

/**
 * AuthLayout is a component that centers its children both vertically and horizontally.
 * It is used to wrap authentication-related components such as SignIn and SignUp.
 * 
 * @param {object} props - The props for the AuthLayout component.
 * @param {React.ReactNode} props.children - The child components to be rendered inside the layout.
 * @returns {JSX.Element} A React component that provides a centered layout for its children.
 */
const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="h-full flex items-center justify-center">
      {children}
    </div>
  );
}

export default AuthLayout;
