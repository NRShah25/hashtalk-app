import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const ServerIdPage = () => {
    return (
        <div className="flex flex-col items-center justify-end h-full">
            <div className="w-full">
                <Textarea placeholder="Type your message here." />
                <div className="flex justify-end">
                    <Button>Send message</Button>
                </div>
            </div>
        </div>
    );
};

export default ServerIdPage;

