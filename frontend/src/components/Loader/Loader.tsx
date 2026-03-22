import { MessageSquare } from "lucide-react";

export const Loader = () => {
  return (
    <div className="fixed inset-0 bg-primary flex flex-col items-center justify-center z-50 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="relative flex flex-col items-center animate-fade-in">
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full border-4 border-white/5 border-t-secondary animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <MessageSquare className="text-secondary animate-pulse" size={32} />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-xl font-bold tracking-widest text-white uppercase opacity-80">
            Minimalist Chat
          </h2>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
