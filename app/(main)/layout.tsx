import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";

const MainLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="h-full">
      <div className="w-full z-30 fixed inset-x-0">
        <NavigationSidebar />
      </div>
      <main className="pt-[72px] h-full">
        {children}
      </main>
    </div>
  );
}

export default MainLayout;
