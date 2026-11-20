import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  Bell,
  X,
  Smartphone,
  Mail,
  CheckCircle2,
  Settings,
} from 'lucide-react';

export const AlertsDrawer: React.FC = () => {
  const {
    isAlertsOpen,
    setIsAlertsOpen,
    alertNotifications,
    alertSettings,
    updateAlertSettings,
    sendAlert,
    t,
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'all' | 'sms' | 'email' | 'settings'>('all');
  const [phoneNumberInput, setPhoneNumberInput] = useState(alertSettings.phoneNumber);
  const [emailInput, setEmailInput] = useState(alertSettings.emailAddress);
  const [settingsSaved, setSettingsSaved] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsAlertsOpen(false);
      }
    };
    if (isAlertsOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAlertsOpen, setIsAlertsOpen]);

  if (!isAlertsOpen) return null;

  const filteredAlerts = alertNotifications.filter((a) => {
    if (activeTab === 'sms') return a.channel === 'sms';
    if (activeTab === 'email') return a.channel === 'email';
    return true;
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateAlertSettings({
      phoneNumber: phoneNumberInput,
      emailAddress: emailInput,
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  const handleTestSms = () => {
    sendAlert(
      'sms',
      'Agoza Test SMS Alert',
      `[EthioTelecom/Safaricom] Test notification sent to ${alertSettings.phoneNumber}. Safe inspection alert active.`
    );
  };

  const handleTestEmail = () => {
    sendAlert(
      'email',
      'Agoza Test Email Dispatch',
      `Test email delivered to ${alertSettings.emailAddress}. Your collectible trade alerts and inspection receipts are properly configured.`
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-xs flex justify-end"
      onClick={() => setIsAlertsOpen(false)}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-[#1a1009] border-l border-slate-200 dark:border-[#473020] h-full flex flex-col shadow-2xl transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-[#473020] bg-slate-50 dark:bg-[#1a1009] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#1b5e20] dark:text-[#c5a059]" />
            <h3 className="font-cinzel text-base font-bold text-slate-900 dark:text-[#f5f6f8]">
              {t.alertCenter}
            </h3>
          </div>
          <button
            onClick={() => setIsAlertsOpen(false)}
            className="p-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-[#251810] text-slate-600 dark:text-[#a8907f] hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-[#5a3a24] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center justify-between px-3 py-2 bg-slate-100 dark:bg-[#1a1009] border-b border-slate-200 dark:border-[#473020] text-xs">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-lg cursor-pointer transition-colors ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-[#2d1c12] text-slate-900 dark:text-white font-semibold shadow-xs'
                  : 'text-slate-500 dark:text-[#a8907f] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All ({alertNotifications.length})
            </button>
            <button
              onClick={() => setActiveTab('sms')}
              className={`px-3 py-1 rounded-lg cursor-pointer transition-colors flex items-center gap-1 ${
                activeTab === 'sms'
                  ? 'bg-white dark:bg-[#2d1c12] text-slate-900 dark:text-white font-semibold shadow-xs'
                  : 'text-slate-500 dark:text-[#a8907f] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Smartphone className="w-3 h-3 text-emerald-600 dark:text-[#48bb78]" />
              <span>SMS</span>
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`px-3 py-1 rounded-lg cursor-pointer transition-colors flex items-center gap-1 ${
                activeTab === 'email'
                  ? 'bg-white dark:bg-[#2d1c12] text-slate-900 dark:text-white font-semibold shadow-xs'
                  : 'text-slate-500 dark:text-[#a8907f] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Mail className="w-3 h-3 text-blue-500 dark:text-[#63b3ed]" />
              <span>Email</span>
            </button>
          </div>

          <button
            onClick={() => setActiveTab('settings')}
            className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
              activeTab === 'settings'
                ? 'bg-[#1b5e20] dark:bg-[#c5a059] text-white dark:text-[#1e130c]'
                : 'text-slate-500 dark:text-[#a8907f] hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Configure Alert Settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Body */}
        {activeTab !== 'settings' ? (
          <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50 dark:bg-transparent">
            {/* Quick Test dispatch trigger strip */}
            <div className="p-2.5 bg-slate-100 dark:bg-[#2d1c12] border-b border-slate-200 dark:border-[#473020] flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500 dark:text-[#a8907f]">Instant Verification:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTestSms}
                  className="px-2 py-1 bg-white dark:bg-[#473020] hover:bg-emerald-50 dark:hover:bg-[#473020] text-[11px] text-emerald-700 dark:text-[#48bb78] rounded-lg border border-emerald-300 dark:border-emerald-900/60 cursor-pointer flex items-center gap-1 transition-colors font-medium shadow-xs"
                >
                  <Smartphone className="w-3 h-3" /> Test SMS
                </button>
                <button
                  onClick={handleTestEmail}
                  className="px-2 py-1 bg-white dark:bg-[#473020] hover:bg-blue-50 dark:hover:bg-[#473020] text-[11px] text-blue-700 dark:text-[#63b3ed] rounded-lg border border-blue-300 dark:border-blue-900/60 cursor-pointer flex items-center gap-1 transition-colors font-medium shadow-xs"
                >
                  <Mail className="w-3 h-3" /> Test Email
                </button>
              </div>
            </div>

            {/* Notification logs list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredAlerts.length === 0 ? (
                <div className="py-12 text-center text-slate-400 dark:text-[#a8907f]">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-xs">No alerts recorded yet.</p>
                </div>
              ) : (
                filteredAlerts.map((item) => {
                  const isSms = item.channel === 'sms';
                  return (
                    <div
                      key={item.id}
                      className="bg-white dark:bg-[#251810] border border-slate-200 dark:border-[#473020] rounded-2xl p-3.5 space-y-1.5 shadow-xs"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          {isSms ? (
                            <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-[#48bb78] font-bold">
                              <Smartphone className="w-3 h-3" /> SMS
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[11px] font-mono text-blue-600 dark:text-[#63b3ed] font-bold">
                              <Mail className="w-3 h-3" /> Email
                            </span>
                          )}
                          <span className="text-slate-400 dark:text-[#8a7565] text-[10px]">· {item.recipient}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-[#a8907f] font-mono">{item.timestamp}</span>
                      </div>

                      <h4 className="text-xs font-semibold text-slate-900 dark:text-[#f1f2f6]">
                        {item.title}
                      </h4>

                      <p className="text-xs text-slate-600 dark:text-[#c4b19f] leading-relaxed">
                        {item.body}
                      </p>

                      <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 dark:border-[#382214] text-[10px] text-slate-500 dark:text-[#8a7565]">
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Delivered Successfully
                        </span>
                        {item.metadata?.code && (
                          <span className="font-mono text-[#1b5e20] dark:text-[#c5a059] font-bold">
                            Token: {item.metadata.code}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ) : (
          /* Settings View */
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-transparent">
            <div>
              <h4 className="font-cinzel text-sm font-bold text-slate-900 dark:text-[#f5f6f8] mb-1">
                Alert Preferences & Contact Info
              </h4>
              <p className="text-xs text-slate-500 dark:text-[#a8907f]">
                Configure where Agoza dispatches your real-time transaction updates, inspection codes, and barter offers.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#a8907f] uppercase tracking-wider mb-1.5">
                  Mobile Number for SMS Alerts
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="tel"
                    value={phoneNumberInput}
                    onChange={(e) => setPhoneNumberInput(e.target.value)}
                    className="w-full bg-white dark:bg-[#2d1c12] border border-slate-200 dark:border-[#473020] rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 dark:text-[#f2f3f6] font-mono focus:outline-none focus:border-[#1b5e20] dark:focus:border-[#c5a059]"
                    required
                  />
                </div>
                <span className="text-[10px] text-slate-400 dark:text-[#a8907f] mt-1 block">Supports Ethio Telecom & Safaricom networks</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#a8907f] uppercase tracking-wider mb-1.5">
                  Email Address for Transaction Receipts
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-white dark:bg-[#2d1c12] border border-slate-200 dark:border-[#473020] rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 dark:text-[#f2f3f6] focus:outline-none focus:border-[#1b5e20] dark:focus:border-[#c5a059]"
                    required
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#251810] border border-slate-200 dark:border-[#473020]">
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-[#f1f2f6] block">Enable SMS Alerts</span>
                    <span className="text-[10px] text-slate-500 dark:text-[#a8907f]">Instant SMS when counter-offer or inspection code is generated</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={alertSettings.enableSms}
                    onChange={(e) => updateAlertSettings({ enableSms: e.target.checked })}
                    className="w-4 h-4 accent-[#1b5e20] dark:accent-[#c5a059] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#251810] border border-slate-200 dark:border-[#473020]">
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-[#f1f2f6] block">Enable Email Receipts</span>
                    <span className="text-[10px] text-slate-500 dark:text-[#a8907f]">Official buyer safeguard contracts & provenance receipts</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={alertSettings.enableEmail}
                    onChange={(e) => updateAlertSettings({ enableEmail: e.target.checked })}
                    className="w-4 h-4 accent-[#1b5e20] dark:accent-[#c5a059] cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-[#1b5e20] hover:bg-[#25732b] dark:bg-[#c5a059] dark:hover:bg-[#d6b068] text-white dark:text-[#1e130c] font-bold text-xs rounded-xl shadow transition-colors cursor-pointer"
                >
                  {settingsSaved ? '✓ Settings Updated' : 'Save Notification Preferences'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
