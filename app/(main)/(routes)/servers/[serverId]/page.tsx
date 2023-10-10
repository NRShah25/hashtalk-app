import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import SendSharpIcon from '@mui/icons-material/SendSharp';

const ServerIdPage = () => {
    return (
        <div className="fixed bottom-0 left-0 right-0">
            {/* Rectangle at the bottom */}
            <div
                className="primary dark:bg-[#1E1F22] bg-[#E3E5E8] w-full p-1"
                style={{ width: "100%" }}
            >
                {/* Content within the rectangle */}
                <div className="flex items-center space-x-2 w-full">
                    <Textarea
                        placeholder="Type your message here."
                        style={{
                            width: '50%',
                            height: '1.5rem',
                            padding: '0rem',
                            textAlign: 'left',
                        }}
                    />
                    <Button className="h-8"><SendSharpIcon/></Button>
                </div>
            </div>
        </div>
    );
};



    export default ServerIdPage;
