export const ConversationsLoader = () => {
  return [...Array(5)].map((_, i) => (
    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 animate-pulse">
      <div className="w-14 h-14 rounded-2xl bg-white/10" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-4 bg-white/10 rounded-full w-2/3" />
        <div className="h-3 bg-white/10 rounded-full w-1/3" />
      </div>
    </div>
  ));
};
