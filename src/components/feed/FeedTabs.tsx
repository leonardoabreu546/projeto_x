interface FeedTabsProps {
  activeTab: "all" | "following";
  theme: string;
  onTabChange: (tab: "all" | "following") => void;
}

export function FeedTabs({ activeTab, theme, onTabChange }: FeedTabsProps) {
  return (
    <ul className="nav nav-tabs mb-4 border-bottom d-flex">
      <li className="nav-item flex-grow-1 text-center">
        <button 
          className={`nav-link w-100 fw-bold border-0 bg-transparent py-3 ${activeTab === "all" ? (theme === 'dark' ? 'text-white' : 'text-black') : "text-secondary"}`}
          style={activeTab === "all" ? { borderBottom: "4px solid #1d9bf0", borderRadius: 0 } : { borderBottom: "4px solid transparent", borderRadius: 0 }}
          onClick={() => onTabChange("all")}
        >
          Todos os Tweets
        </button>
      </li>
      <li className="nav-item flex-grow-1 text-center">
        <button 
          className={`nav-link w-100 fw-bold border-0 bg-transparent py-3 ${activeTab === "following" ? (theme === 'dark' ? 'text-white' : 'text-black') : "text-secondary"}`}
          style={activeTab === "following" ? { borderBottom: "4px solid #1d9bf0", borderRadius: 0 } : { borderBottom: "4px solid transparent", borderRadius: 0 }}
          onClick={() => onTabChange("following")}
        >
          A Seguir
        </button>
      </li>
    </ul>
  );
}