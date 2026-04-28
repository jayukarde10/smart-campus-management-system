import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Moon, Shield, Globe, Palette, Save, CheckCircle, ToggleLeft, ToggleRight } from 'lucide-react';

const Settings = () => {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    emailNotif: true,
    pushNotif: false,
    darkMode: false,
    language: 'English',
    twoFactor: false,
    showProfile: true,
  });

  const toggle = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  const ToggleSwitch = ({ value, onToggle }) => (
    <button className="btn border-0 p-0" onClick={onToggle}>
      {value ? <ToggleRight size={28} className="text-primary"/> : <ToggleLeft size={28} className="text-muted"/>}
    </button>
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h2 className="fw-bold m-0">Settings</h2>
        <p className="text-muted m-0">Manage your preferences and account settings.</p>
      </div>

      {saved && (
        <div className="alert alert-success py-2 px-4 rounded-3 mb-4 fw-bold d-flex align-items-center gap-2">
          <CheckCircle size={18}/> Settings saved!
        </div>
      )}

      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <div className="premium-card p-4">
            <h5 className="fw-bold mb-4"><Bell size={20} className="text-primary me-2"/>Notifications</h5>
            <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
              <div><p className="fw-bold m-0">Email Notifications</p><small className="text-muted">Receive updates via email</small></div>
              <ToggleSwitch value={settings.emailNotif} onToggle={() => toggle('emailNotif')}/>
            </div>
            <div className="d-flex justify-content-between align-items-center py-3">
              <div><p className="fw-bold m-0">Push Notifications</p><small className="text-muted">Browser push alerts</small></div>
              <ToggleSwitch value={settings.pushNotif} onToggle={() => toggle('pushNotif')}/>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="premium-card p-4">
            <h5 className="fw-bold mb-4"><Palette size={20} className="text-accent me-2"/>Appearance</h5>
            <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
              <div><p className="fw-bold m-0">Dark Mode</p><small className="text-muted">Switch to dark theme</small></div>
              <ToggleSwitch value={settings.darkMode} onToggle={() => toggle('darkMode')}/>
            </div>
            <div className="d-flex justify-content-between align-items-center py-3">
              <div><p className="fw-bold m-0">Language</p><small className="text-muted">Interface language</small></div>
              <select className="form-select w-auto border shadow-sm" value={settings.language} onChange={e => setSettings({...settings, language: e.target.value})}>
                <option>English</option><option>Hindi</option><option>Marathi</option>
              </select>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="premium-card p-4">
            <h5 className="fw-bold mb-4"><Shield size={20} className="text-danger me-2"/>Security</h5>
            <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
              <div><p className="fw-bold m-0">Two-Factor Auth</p><small className="text-muted">Extra login security</small></div>
              <ToggleSwitch value={settings.twoFactor} onToggle={() => toggle('twoFactor')}/>
            </div>
            <div className="py-3">
              <button className="btn btn-outline-danger fw-bold">Change Password</button>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="premium-card p-4">
            <h5 className="fw-bold mb-4"><Globe size={20} className="text-secondary me-2"/>Privacy</h5>
            <div className="d-flex justify-content-between align-items-center py-3">
              <div><p className="fw-bold m-0">Show Profile Publicly</p><small className="text-muted">Others can view your profile</small></div>
              <ToggleSwitch value={settings.showProfile} onToggle={() => toggle('showProfile')}/>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <button className="btn-dynamic py-3 px-5" onClick={handleSave}><Save size={18}/> Save All Settings</button>
      </div>
    </div>
  );
};

export default Settings;
