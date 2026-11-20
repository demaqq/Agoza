import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  X,
  Send,
  MessageSquare,
  ShieldCheck,
  ChevronLeft,
  Search,
  ExternalLink,
  Tag,
} from 'lucide-react';
import { CounterOfferSlider } from './CounterOfferSlider';
import { CoffeeBeansIcon } from './EthiopianIcons';

export const ChatNegotiationDrawer: React.FC = () => {
  const {
    isChatOpen,
    setIsChatOpen,
    chatThreads,
    activeChatThreadId,
    setActiveChatThreadId,
    sendMessage,
    formatPrice,
    setSelectedCollectible,
    collectibles,
  } = useMarketplace();

  const [inputMessage, setInputMessage] = useState('');
  const [inboxSearch, setInboxSearch] = useState('');
  const [showPhoneModal, setShowPhoneModal] = useState<string | null>(null);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [chatCounterPrice, setChatCounterPrice] = useState<number>(0);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsChatOpen(false);
      }
    };
    if (isChatOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isChatOpen, setIsChatOpen]);

  // Active thread lookup (if activeChatThreadId is null, user is in the "All Chats / Inbox" view)
  const activeThread = activeChatThreadId
    ? chatThreads.find((t) => t.id === activeChatThreadId) || chatThreads[0]
    : null;

  const currentItem = activeThread
    ? collectibles.find((c) => c.id === activeThread.collectibleId)
    : null;

  const filteredThreads = chatThreads.filter((t) => {
    if (!inboxSearch.trim()) return true;
    const q = inboxSearch.toLowerCase();
    return (
      t.sellerName.toLowerCase().includes(q) ||
      t.collectibleTitle.toLowerCase().includes(q) ||
      t.lastMessage.toLowerCase().includes(q)
    );
  });

  React.useEffect(() => {
    if (currentItem) {
      setChatCounterPrice(Math.round(currentItem.priceETB * 0.9));
    }
  }, [currentItem?.id]);

  if (!isChatOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeThread) return;
    sendMessage(activeThread.id, inputMessage.trim());
    setInputMessage('');
  };

  const handleQuickChip = (text: string) => {
    if (!activeThread) return;
    sendMessage(activeThread.id, text);
  };

  const handleSendCounterFromSlider = () => {
    if (!activeThread || !currentItem) return;
    const pct = Math.round((chatCounterPrice / currentItem.priceETB) * 100);
    const text = `🤝 Bargain Counter-Offer: ${formatPrice(chatCounterPrice)} (${pct}% of original asking price). I am ready to conclude this deal with verified Safe Hub handoff!`;
    sendMessage(activeThread.id, text, {
      type: 'cash',
      amountETB: chatCounterPrice,
    });
    setIsSliderOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-xs flex justify-end"
      onClick={() => setIsChatOpen(false)}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-[#1a1009] border-l border-slate-200 dark:border-[#473020] h-full flex flex-col shadow-2xl transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-[#473020] bg-slate-50 dark:bg-[#1a1009] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {activeThread ? (
              <button
                onClick={() => setActiveChatThreadId(null)}
                className="p-1 -ml-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-[#a8907f] dark:hover:text-white cursor-pointer flex items-center gap-1 text-xs font-semibold"
                title="Back to all conversations"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>All Chats</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#1b5e20]/10 dark:bg-[#c5a059]/15 flex items-center justify-center text-[#1b5e20] dark:text-[#c5a059]">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-cinzel text-sm font-bold text-slate-900 dark:text-[#f5f6f8] leading-tight">
                    Trader Messages
                  </h3>
                  <span className="text-[11px] text-slate-500 dark:text-[#a8907f]">
                    {chatThreads.length} active conversations
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {activeThread && (
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                P2P Chat
              </span>
            )}
            <button
              onClick={() => setIsChatOpen(false)}
              className="p-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-[#251810] text-slate-600 dark:text-[#a8907f] hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-[#5a3a24] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* VIEW 1: INBOX / CONVERSATIONS LIST (When no thread is selected) */}
        {!activeThread ? (
          <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50 dark:bg-[#1a1009]/50">
            {/* Search Inbox */}
            <div className="p-3 border-b border-slate-200 dark:border-[#473020] bg-white dark:bg-[#251810]">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search chats by seller or item..."
                  value={inboxSearch}
                  onChange={(e) => setInboxSearch(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-[#2d1c12] text-slate-900 dark:text-white text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-[#473020] focus:outline-none focus:border-[#1b5e20] dark:focus:border-[#c5a059]"
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-[#382214]">
              {filteredThreads.length > 0 ? (
                filteredThreads.map((thread) => (
                  <button
                    key={thread.id}
                    onClick={() => setActiveChatThreadId(thread.id)}
                    className="w-full p-3.5 flex items-start gap-3 hover:bg-slate-100 dark:hover:bg-[#251810] transition-colors cursor-pointer text-left group"
                  >
                    {/* Seller Avatar */}
                    <div className="relative shrink-0">
                      <img
                        src={thread.sellerAvatar}
                        alt={thread.sellerName}
                        className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-[#5a3a24]"
                      />
                      <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[#1a1009] absolute -bottom-0.5 -right-0.5" />
                    </div>

                    {/* Middle Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-[#fbf5ef] truncate group-hover:text-[#1b5e20] dark:group-hover:text-[#c5a059]">
                          {thread.sellerName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-1">
                          {thread.lastTimestamp}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#1b5e20] dark:text-[#c5a059] mb-1">
                        <span className="truncate">{thread.collectibleTitle}</span>
                        <span aria-hidden="true">·</span>
                        <span className="shrink-0 font-mono">{formatPrice(thread.collectiblePriceETB)}</span>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-[#a8907f] truncate">
                        {thread.lastMessage}
                      </p>
                    </div>

                    {/* Unread Pill */}
                    {thread.unreadCount > 0 && (
                      <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center font-mono shadow-xs">
                        {thread.unreadCount}
                      </span>
                    )}
                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-slate-500">
                  No conversations match "{inboxSearch}"
                </div>
              )}
            </div>
          </div>
        ) : (
          /* VIEW 2: ACTIVE CONVERSATION THREAD */
          <div className="flex-1 flex flex-col min-h-0">
            {/* Header Mini Switcher for other chats */}
            <div className="px-3 py-2 bg-slate-100 dark:bg-[#251810] border-b border-slate-200 dark:border-[#473020] flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                Chatting with <strong className="text-slate-800 dark:text-slate-200">{activeThread.sellerName}</strong>
              </span>

              {/* View Other Chats Quick Link */}
              <button
                onClick={() => setActiveChatThreadId(null)}
                className="text-xs text-[#1b5e20] dark:text-[#c5a059] hover:underline cursor-pointer font-semibold flex items-center gap-1"
              >
                <span>View Other Chats ({chatThreads.length})</span>
                <span>→</span>
              </button>
            </div>

            {/* Item Context Banner */}
            <div
              onClick={() => {
                if (currentItem) setSelectedCollectible(currentItem);
              }}
              className="p-3 bg-white dark:bg-[#251810] border-b border-slate-200 dark:border-[#473020] flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-[#382214] transition-colors shadow-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={activeThread.collectibleImage}
                  alt={activeThread.collectibleTitle}
                  className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-[#5a3a24]"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-[#f5f6f8] truncate">
                    {activeThread.collectibleTitle}
                  </h4>
                  <span className="text-[11px] font-mono text-[#1b5e20] dark:text-[#c5a059] font-bold">
                    {formatPrice(activeThread.collectiblePriceETB)}
                  </span>
                </div>
              </div>

              <div className="text-right text-[11px] font-semibold text-[#1b5e20] dark:text-[#c5a059] flex items-center gap-1 shrink-0 ml-2">
                <span>View Item</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-[#140c07]">
              {/* Trust Badge */}
              <div className="p-2.5 rounded-xl bg-white dark:bg-[#251810] border border-slate-200 dark:border-[#382214] text-center text-xs text-slate-600 dark:text-[#c4b19f] mb-2 shadow-xs">
                <div className="flex items-center justify-center gap-1.5 font-bold text-[#1b5e20] dark:text-[#c5a059] mb-0.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Buyer Safeguard</span>
                </div>
                <span>Never pay outside of Agoza's verified buyer protection before inspecting the item in person.</span>
              </div>

              {activeThread.messages.map((msg) => {
                const isMe = msg.senderId === 'buyer-me' || msg.senderName === 'You';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[10px] text-slate-400 mb-1 px-1">
                      {msg.senderName} · {msg.timestamp}
                    </span>

                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                        isMe
                          ? 'bg-[#1b5e20] text-white dark:bg-[#c5a059] dark:text-[#1e130c] rounded-br-xs font-medium shadow-sm'
                          : 'bg-white dark:bg-[#2d1c12] text-slate-900 dark:text-[#edeef2] border border-slate-200 dark:border-[#473020] rounded-bl-xs shadow-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Collapsible Interactive Bargain Slider */}
            {isSliderOpen && currentItem && (
              <div className="p-3 bg-amber-50/70 dark:bg-[#251810] border-t border-amber-200 dark:border-[#422919] space-y-3 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-[#fbf5ef]">
                    <Tag className="w-3.5 h-3.5 text-amber-700 dark:text-[#d4a373]" />
                    <span>Customer Bargain Slider</span>
                  </div>
                  <button
                    onClick={() => setIsSliderOpen(false)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:text-[#a8907f] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <CounterOfferSlider
                  originalPriceETB={currentItem.priceETB}
                  currentOfferETB={chatCounterPrice || Math.round(currentItem.priceETB * 0.9)}
                  onChange={setChatCounterPrice}
                  formatPrice={formatPrice}
                />

                <button
                  type="button"
                  onClick={handleSendCounterFromSlider}
                  className="w-full py-2.5 px-3 bg-[#1b5e20] hover:bg-[#25732b] dark:bg-[#d4a373] dark:hover:bg-[#e0b487] text-white dark:text-[#1e130c] font-bold text-xs rounded-xl shadow transition-colors cursor-pointer flex items-center justify-center gap-1.5 min-h-[40px]"
                >
                  <CoffeeBeansIcon className="w-4 h-4" />
                  <span>Send Bargain Offer ({formatPrice(chatCounterPrice || Math.round(currentItem.priceETB * 0.9))})</span>
                </button>
              </div>
            )}

            {/* Quick Negotiation Chips */}
            <div className="p-2 bg-white dark:bg-[#1a110a] border-t border-slate-200 dark:border-[#382316] flex gap-1.5 overflow-x-auto scrollbar-none text-xs">
              {currentItem && (
                <button
                  type="button"
                  onClick={() => setIsSliderOpen(!isSliderOpen)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1 min-h-[32px] ${
                    isSliderOpen
                      ? 'bg-[#1b5e20] text-white dark:bg-[#d4a373] dark:text-[#1e130c]'
                      : 'bg-amber-100 dark:bg-[#342318] text-amber-900 dark:text-[#d4a373] border border-amber-300 dark:border-[#4d3221]'
                  }`}
                >
                  <Tag className="w-3 h-3" />
                  <span>Bargain Slider (የዋጋ ድርድር)</span>
                </button>
              )}

              <button
                onClick={() => handleQuickChip('Is this still available in stock?')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#251810] text-slate-700 dark:text-[#d7beaa] hover:bg-slate-200 dark:hover:text-white border border-slate-200 dark:border-[#382316] whitespace-nowrap cursor-pointer transition-colors min-h-[32px]"
              >
                Is this still available?
              </button>
              <button
                onClick={() => handleQuickChip('Can we meet at CBE Financial Hub or Bole Medhanialem?')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#251810] text-slate-700 dark:text-[#d7beaa] hover:bg-slate-200 dark:hover:text-white border border-slate-200 dark:border-[#382316] whitespace-nowrap cursor-pointer transition-colors min-h-[32px]"
              >
                Meet at Safe Hub?
              </button>
              <button
                onClick={() => handleQuickChip('What is your best cash price for quick buyout?')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#251810] text-slate-700 dark:text-[#d7beaa] hover:bg-slate-200 dark:hover:text-white border border-slate-200 dark:border-[#382316] whitespace-nowrap cursor-pointer transition-colors min-h-[32px]"
              >
                Best cash price?
              </button>
              <button
                onClick={() => handleQuickChip('Are you open to swap or barter with cash balance?')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#251810] text-slate-700 dark:text-[#d7beaa] hover:bg-slate-200 dark:hover:text-white border border-slate-200 dark:border-[#382316] whitespace-nowrap cursor-pointer transition-colors min-h-[32px]"
              >
                Open to swap?
              </button>
            </div>

            {/* Input Send Form */}
            <form
              onSubmit={handleSend}
              className="p-3 bg-white dark:bg-[#1e130c] border-t border-slate-200 dark:border-[#382316] flex items-center gap-2"
            >
              <input
                type="text"
                placeholder={`Message ${activeThread.sellerName}...`}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 bg-slate-100 dark:bg-[#251810] text-slate-900 dark:text-[#fbf5ef] text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#422919] focus:outline-none focus:border-[#1b5e20] dark:focus:border-[#d4a373]"
              />

              <button
                type="submit"
                className="p-2.5 bg-[#1b5e20] hover:bg-[#25732b] dark:bg-[#d4a373] dark:hover:bg-[#e0b487] text-white dark:text-[#1e130c] rounded-xl transition-colors cursor-pointer shrink-0 shadow-xs min-w-[40px] min-h-[40px] flex items-center justify-center"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
