/**
 * @module page.tsx
 * @description This module provides a page component for user sign-in.
 * @requires @clerk/nextjs
 */

import { SignIn } from "@clerk/nextjs";

/**
 * The Page component renders the SignIn component for user authentication.
 * 
 * @returns {JSX.Element} A React component that represents the sign-in page.
 */
const Page = () => {
  return <SignIn />;
}

export default Page;
