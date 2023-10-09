import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import SendSharpIcon from '@mui/icons-material/SendSharp';

const ServerIdPage = () => {
    return (
        <div className="relative flex flex-col justify-end items-end h-full">
            {/* Rectangle at the bottom */}
            <div
                className="primary dark:bg-[#1E1F22] bg-[#E3E5E8] w-full p-1" // Use the background color from NavigationSidebar
                style={{ position: 'fixed', bottom: 0 }}
            >
                {/* Content within the rectangle */}
                <div className="flex items-center space-x-2">
                    <Textarea
                        placeholder="Type your message here."
                        style={{ width: '75%', height: '1.5rem', padding: '0.25rem', textAlign: 'left' }}
                    />
                    <Button className="h-8"><SendSharpIcon /></Button>
                </div>
            </div>
        </div>
    );
};

export default ServerIdPage;

