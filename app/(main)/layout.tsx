import { ReactNode } from 'react';
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";

interface MainLayoutProps {
  children: ReactNode; 
}

/**
 * The MainLayout component.
 * It provides a layout structure for the main content area of the application.
 * - At the top, it renders the `NavigationSidebar` component.
 * - Below that, it renders any child components passed into it.
 * 
 * @param {MainLayoutProps} { children } - Child components passed to the layout.
 */
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => (
  <div className="h-full">
    <div className="w-full z-30 fixed inset-x-0">
      <NavigationSidebar />
    </div>
    <main className="pt-[72px] h-full">
      {children} 
    </main>
  </div>
);

export default MainLayout;