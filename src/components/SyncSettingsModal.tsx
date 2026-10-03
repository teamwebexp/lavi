import React, { useState, useEffect } from 'react';
import { X, Check, Copy, ExternalLink, RefreshCw, Sparkles, FolderSync, Calendar, Key, AlertCircle } from 'lucide-react';
import { 
  ALBUM_API_URL, 
  SPECIAL_DATE, 
  getEffectiveApiUrl, 
  setCustomApiUrl, 
  getEffectiveSpecialDate, 
  setCustomSpecialDate 
} from '../config/albumConfig';

interface SyncSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshAlbum: () => void;
  onShowToast: (message: string) => void;
}

export const SyncSettingsModal: React.FC<SyncSettingsModalProps> = ({
  isOpen,
  onClose,
  onRefreshAlbum,
  onShowToast,
}) => {
  const [apiUrl, setApiUrl] = useState('');
  const [specialDate, setSpecialDate] = useState('');
  const [showScriptCode, setShowScriptCode] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setApiUrl(getEffectiveApiUrl() === ALBUM_API_URL ? '' : getEffectiveApiUrl());
      setSpecialDate(getEffectiveSpecialDate());
      setTestStatus('idle');
      setTestMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    setCustomApiUrl(apiUrl.trim());
    setCustomSpecialDate(specialDate.trim());
    onShowToast('Settings saved. Refreshing album...');
    onRefreshAlbum();
    onClose();
  };

  const handleResetToDefaults = () => {
    setCustomApiUrl('');
    setCustomSpecialDate(SPECIAL_DATE);
    setApiUrl('');
    setSpecialDate(SPECIAL_DATE);
    onShowToast('Reset to default album config.');
    onRefreshAlbum();
  };

  const handleTestConnection = async () => {
    const targetUrl = apiUrl.trim();
    if (!targetUrl) {
      setTestStatus('error');
      setTestMessage('Please enter an API URL before testing.');
      return;
    }

    setTestStatus('testing');
    setTestMessage('Connecting to Google Drive API...');

    try {
      const sep = targetUrl.includes('?') ? '&' : '?';
      const testReq = await fetch(`${targetUrl}${sep}_test=${Date.now()}`);
      if (!testReq.ok) {
        throw new Error(`HTTP error ${testReq.status}`);
      }
      const data = await testReq.json();
      const count = Array.isArray(data) ? data.length : (Array.isArray(data.items) ? data.items.length : (Array.isArray(data.files) ? data.files.length : 0));
      
      setTestStatus('success');
      setTestMessage(`Connected successfully! Found ${count} media items in response.`);
    } catch (err: any) {
      setTestStatus('error');
      setTestMessage(err.message || 'Connection failed. Check permissions & CORS on web app.');
    }
  };

  const sampleAppsScript = `// Google Apps Script (Deploy as Web App -> Execute as: Me -> Access: Anyone)
function doGet(e) {
  var FOLDER_ID = "YOUR_GOOGLE_DRIVE_FOLDER_ID_HERE";
  var folder = DriveApp.getFolderById(FOLDER_ID);
  var files = folder.getFiles();
  var items = [];
  
  while (files.hasNext()) {
    var file = files.next();
    var mime = file.getMimeType();
    var isVideo = mime.indexOf("video") !== -1;
    var isImage = mime.indexOf("image") !== -1;
    
    if (isImage || isVideo) {
      var id = file.getId();
      items.push({
        id: id,
        name: file.getName(),
        type: isVideo ? "video" : "image",
        // Direct media links
        url: isVideo 
          ? "https://drive.google.com/uc?export=download&id=" + id
          : "https://drive.google.com/thumbnail?id=" + id + "&sz=w1600",
        thumbnail: "https://drive.google.com/thumbnail?id=" + id + "&sz=w600",
        createdTime: file.getDateCreated().toISOString(),
        modifiedTime: file.getLastUpdated().toISOString(),
        caption: file.getDescription() || file.getName().replace(/\\.[^/.]+$/, "")
      });
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({ items: items }))
    .setMimeType(ContentService.MimeType.JSON);
}`;

  const copyScriptCode = () => {
    navigator.clipboard.writeText(sampleAppsScript);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    onShowToast('Apps Script code copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200/90 space-y-6 my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100/60 text-amber-800">
              <FolderSync className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-display text-xl font-bold text-stone-900">
                Google Drive Auto-Sync
              </h3>
              <p className="text-xs text-stone-500">
                Connect your personal Google Drive album and configure milestones
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input: Google Drive API URL */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Google Apps Script / API URL
            </label>
            <span className="text-[11px] text-stone-400">Returns JSON {"{ items: [...] }"}</span>
          </div>

          <input
            type="url"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="https://script.google.com/macros/s/.../exec"
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-mono text-stone-800"
          />

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handleTestConnection}
              disabled={testStatus === 'testing'}
              className="text-xs font-medium text-amber-800 hover:text-amber-900 hover:underline inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${testStatus === 'testing' ? 'animate-spin' : ''}`} />
              <span>Test Endpoint</span>
            </button>

            <button
              onClick={() => setShowScriptCode(!showScriptCode)}
              className="text-xs font-medium text-stone-600 hover:text-stone-900 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>{showScriptCode ? 'Hide Guide' : 'View Google Apps Script Code'}</span>
            </button>
          </div>

          {/* Test Status feedback */}
          {testMessage && (
            <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
              testStatus === 'success' 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {testStatus === 'success' ? <Check className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
              <span>{testMessage}</span>
            </div>
          )}
        </div>

        {/* Collapsible Google Apps Script Helper Snippet */}
        {showScriptCode && (
          <div className="rounded-2xl bg-stone-900 text-stone-200 p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-amber-300">Ready-to-use Google Apps Script:</span>
              <button
                onClick={copyScriptCode}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-white cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              Create a new Google Apps Script at script.google.com, paste this code with your Folder ID, click <strong>Deploy &gt; New deployment &gt; Web app (Anyone)</strong>, and paste the generated URL above!
            </p>
            <pre className="p-3 bg-stone-950 rounded-xl overflow-x-auto text-[11px] font-mono text-stone-300 max-h-48">
              {sampleAppsScript}
            </pre>
          </div>
        )}

        {/* Input: Special Milestone Date */}
        <div className="space-y-2 pt-2 border-t border-stone-100">
          <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block">
            Special Milestone / Life Counter Date
          </label>
          <input
            type="text"
            value={specialDate}
            onChange={(e) => setSpecialDate(e.target.value)}
            placeholder="2026-09-28T21:19:00"
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-mono text-stone-800"
          />
          <p className="text-[11px] text-stone-400">
            Format: YYYY-MM-DDTHH:mm:ss. The live ticker tracks time elapsed or countdown to this instant.
          </p>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-stone-100">
          <button
            onClick={handleResetToDefaults}
            className="w-full sm:w-auto text-xs text-stone-500 hover:text-stone-800 py-2 cursor-pointer font-medium"
          >
            Reset to Seed Memories
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Save &amp; Sync Now
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
