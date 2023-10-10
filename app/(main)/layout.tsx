import { ReactNode } from 'react';
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
import FriendList from "@/components/Friends/FriendList";
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
    <div className="flex h-full">
        <div className="w-4/5 flex-shrink-0">
            <div className="w-full z-30 fixed inset-x-0">
                <NavigationSidebar />
            </div>
            <main className="pt-16 h-full overflow-auto">
                {children}
            </main>
        </div>
        <div className="h-full pt-20 w-1/5 fixed right-0 top-0 dark:bg-[#35383c] bg-[#F2F3F5] p-4 overflow-auto">
            <FriendList />
            {/* You can add more components or content to the right column if needed */}
        </div>
    </div>
);



export default MainLayout;
