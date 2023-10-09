/**
 * AuthLayout Component
 * 
 * A layout component designed for authentication related pages. 
 * It centers its child components both vertically and horizontally within a full-height div.
 * 
 * @param children - The content or components to be rendered inside the layout.
 */

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return ( 
    <div className="h-full flex items-center justify-center">
      {children}
    </div>
   );
}

export default AuthLayout; 