/**
 * @module page.tsx
 * @description This module provides a page component for user sign-up.
 * @requires @clerk/nextjs
 */

import { SignUp } from "@clerk/nextjs";

/**
 * The Page component renders the SignUp component for user registration.
 * 
 * @returns {JSX.Element} A React component that represents the sign-up page.
 */
const Page = () => {
  return <SignUp />;
}

export default Page;
