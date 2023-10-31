/**
 * @module layout.tsx
 * @description This module provides a main layout component for the application, including a navigation sidebar.
 * @requires @/components/navigation/navigation-sidebar
 */

import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";

/**
 * Props type for the MainLayout component.
 * @typedef {Object} MainLayoutProps
 * @property {React.ReactNode} children - Child components to be rendered in the main content area.
 */
interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * MainLayout is a component that provides the main structure of the application.
 * 
 * The layout consists of a navigation sidebar on the left and a main content area on the right.
 * The navigation sidebar is hidden on smaller screens.
 * 
 * @param {MainLayoutProps} props - The props for the MainLayout component.
 * @returns {JSX.Element} A React component that represents the main application layout.
 */
const MainLayout = async ({
  children
}: MainLayoutProps): Promise<JSX.Element> => {
  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
        <NavigationSidebar />
      </div>
      <main className="md:pl-[72px] h-full">
        {children}
      </main>
    </div>
  );
}

export default MainLayout;