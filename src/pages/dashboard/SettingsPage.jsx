import React, { useState } from 'react';
import { useUserSession } from '../../context/UserSessionContext';
import {
  User, Mail, Phone, Lock, Bell, Palette, Globe, ShieldCheck,
  Save, Check, Laptop, Smartphone, KeyRound, CheckCircle2,
  Sliders, Eye, EyeOff, AlertCircle, Sparkles, Moon, Sun, Monitor
} from 'lucide-react';
import './SettingsPage.css';

export default function SettingsPage() {
  const { currentUser, userProfile, selectedGrade, selectedPath, selectedSpecialization } = useUserSession();

  // Resolve from Firestore or Auth
  const resolvedName  = userProfile?.fullName || currentUser?.displayName || '';
  const resolvedEmail = userProfile?.email    || currentUser?.email       || '';

  // Active tab state: 'account' | 'interface' | 'notifications' | 'language' | 'security' | 'password'
  const [activeTab, setActiveTab] = useState('account');

  // Form States — seeded from Firestore on mount
  const [accountInfo, setAccountInfo] = useState({
    name:  resolvedName,
    email: resolvedEmail,
    phone: '',
    bio:   '',
  });

  const [interfaceSettings, setInterfaceSettings] = useState({
    accentColor: 'emerald', // 'emerald' | 'cyan' | 'amber' | 'purple'
    themeMode: 'ultra-dark', // 'ultra-dark' | 'soft-slate' | 'system'
    fontSize: 'medium', // 'normal' | 'medium' | 'large'
    animations: true,
  });

  const [notificationToggles, setNotificationToggles] = useState({
    emailAlerts: true,
    pushAlerts: true,
    examReminders: true,
    weeklyDigest: false,
  });

  const [languageSettings, setLanguageSettings] = useState({
    lang: 'ar', // 'ar' | 'en'
    calendar: 'hijri', // 'hijri' | 'gregorian'
    timezone: 'GMT+3 (مكة المكرمة)',
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: true,
    privateLeaderboard: false,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPass, setShowPass] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('تم حفظ التغييرات بنجاح! ✨');

  const triggerSaveToast = (msg = 'تم حفظ التغييرات بنجاح! ✨') => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return '';
    if (pass.length < 6) return 'weak';
    if (pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) return 'strong';
    return 'medium';
  };

  const passStrength = getPasswordStrength(passwordForm.newPassword);

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('كلمة المرور الجديدة غير متطابقة مع التأكيد');
      return;
    }
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    triggerSaveToast('تم تحديث كلمة المرور بنجاح! 🔑');
  };

  return (
    <div className="settings-page-container">
      {/* ── Settings Header ── */}
      <div className="settings-header-card">
        <div className="settings-title-group">
          <h1>الإعدادات والتفضيلات</h1>
          <p>إدارة بيانات حسابك، تفضيلات الرؤية البصرية، الأمان والإشعارات</p>
        </div>

        <button
          type="button"
          className="btn-save-settings"
          onClick={() => triggerSaveToast()}
        >
          <Save size={18} />
          <span>حفظ التغييرات</span>
        </button>
      </div>

      {/* ── Main Layout: Nav Tabs + Content Area ── */}
      <div className="settings-layout-grid">
        {/* Sidebar Nav */}
        <aside className="settings-nav-card">
          <button
            type="button"
            className={`settings-tab-btn ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            <User size={18} className="settings-tab-icon" />
            <span>معلومات الحساب</span>
          </button>

          <button
            type="button"
            className={`settings-tab-btn ${activeTab === 'interface' ? 'active' : ''}`}
            onClick={() => setActiveTab('interface')}
          >
            <Palette size={18} className="settings-tab-icon" />
            <span>إعدادات الواجهة</span>
          </button>

          <button
            type="button"
            className={`settings-tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={18} className="settings-tab-icon" />
            <span>التنبيهات والإشعارات</span>
          </button>

          <button
            type="button"
            className={`settings-tab-btn ${activeTab === 'language' ? 'active' : ''}`}
            onClick={() => setActiveTab('language')}
          >
            <Globe size={18} className="settings-tab-icon" />
            <span>اللغة والمنطقة</span>
          </button>

          <button
            type="button"
            className={`settings-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <ShieldCheck size={18} className="settings-tab-icon" />
            <span>الأمان والخصوصية</span>
          </button>

          <button
            type="button"
            className={`settings-tab-btn ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            <KeyRound size={18} className="settings-tab-icon" />
            <span>تغيير كلمة المرور</span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="settings-content-card">
          {/* ════════════════════════════════════════════════════════════════
             TAB 1: ACCOUNT INFORMATION (معلومات الحساب)
          ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'account' && (
            <>
              <div className="settings-panel-header">
                <h2 className="settings-panel-title">
                  <User size={22} />
                  معلومات الحساب والبيانات الشخصية
                </h2>
                <p className="settings-panel-desc">تعديل الاسم والبريد الإلكتروني ورقم الهاتف المسجل بلمسة واحدة</p>
              </div>

              <form className="settings-form-grid" onSubmit={(e) => e.preventDefault()}>
                <div className="settings-form-group">
                  <label className="settings-label">الاسم الكامل</label>
                  <input
                    type="text"
                    className="settings-input"
                    value={accountInfo.name}
                    onChange={(e) => setAccountInfo({ ...accountInfo, name: e.target.value })}
                  />
                </div>

                <div className="settings-form-group">
                  <label className="settings-label">البريد الإلكتروني</label>
                  <input
                    type="email"
                    className="settings-input"
                    value={accountInfo.email}
                    onChange={(e) => setAccountInfo({ ...accountInfo, email: e.target.value })}
                  />
                </div>

                <div className="settings-form-group">
                  <label className="settings-label">رقم الهاتف</label>
                  <input
                    type="text"
                    className="settings-input"
                    value={accountInfo.phone}
                    onChange={(e) => setAccountInfo({ ...accountInfo, phone: e.target.value })}
                  />
                </div>

                <div className="settings-form-group">
                  <label className="settings-label">الصف الدراسي والمسار</label>
                  <input
                    type="text"
                    className="settings-input"
                    disabled
                    value={`${selectedGrade === 'grade-1' ? 'الصف الأول الثانوي' : 'الصف الثاني الثانوي'} - مسار الطب`}
                  />
                </div>

                <div className="settings-form-group full-width">
                  <label className="settings-label">نبذة شخصية (Bio)</label>
                  <textarea
                    className="settings-textarea"
                    rows={3}
                    value={accountInfo.bio}
                    onChange={(e) => setAccountInfo({ ...accountInfo, bio: e.target.value })}
                  />
                </div>
              </form>
            </>
          )}

          {/* ════════════════════════════════════════════════════════════════
             TAB 2: INTERFACE SETTINGS (إعدادات الواجهة والأنماط)
          ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'interface' && (
            <>
              <div className="settings-panel-header">
                <h2 className="settings-panel-title">
                  <Palette size={22} />
                  إعدادات الواجهة والتجربة البصرية
                </h2>
                <p className="settings-panel-desc">تخصيص ألوان الإضاءة النيونية، نمط الخلفية وحجم الخطوط</p>
              </div>

              {/* Color Accent Picker */}
              <div className="settings-form-group full-width">
                <label className="settings-label">لون الإضاءة الرئيسي (Neon Accent)</label>
                <div className="theme-colors-grid">
                  {[
                    { id: 'emerald', name: 'الزمردي النيون (افتراضي)', color: '#00e676' },
                    { id: 'cyan', name: 'السماوي الرقمي', color: '#38bdf8' },
                    { id: 'amber', name: 'الذهبي الوهّاج', color: '#fbbf24' },
                    { id: 'purple', name: 'البنفسجي الإمبريالي', color: '#c084fc' },
                  ].map((item) => (
                    <div
                      key={item.id}
                      className={`color-option-card ${
                        interfaceSettings.accentColor === item.id ? 'selected' : ''
                      }`}
                      onClick={() => setInterfaceSettings({ ...interfaceSettings, accentColor: item.id })}
                    >
                      <div className="color-swatch-circle" style={{ color: item.color, backgroundColor: item.color }} />
                      <span className="color-swatch-name">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Theme Mode */}
              <div className="settings-form-group full-width">
                <label className="settings-label">نمط المظهر الداكن</label>
                <div className="theme-colors-grid">
                  <div
                    className={`color-option-card ${
                      interfaceSettings.themeMode === 'ultra-dark' ? 'selected' : ''
                    }`}
                    onClick={() => setInterfaceSettings({ ...interfaceSettings, themeMode: 'ultra-dark' })}
                  >
                    <Moon size={24} style={{ color: 'var(--green-neon)' }} />
                    <span className="color-swatch-name">الداكن الخارق (Vision)</span>
                  </div>

                  <div
                    className={`color-option-card ${
                      interfaceSettings.themeMode === 'soft-slate' ? 'selected' : ''
                    }`}
                    onClick={() => setInterfaceSettings({ ...interfaceSettings, themeMode: 'soft-slate' })}
                  >
                    <Monitor size={24} style={{ color: '#38bdf8' }} />
                    <span className="color-swatch-name">الداكن المعتدل</span>
                  </div>

                  <div
                    className={`color-option-card ${
                      interfaceSettings.themeMode === 'system' ? 'selected' : ''
                    }`}
                    onClick={() => setInterfaceSettings({ ...interfaceSettings, themeMode: 'system' })}
                  >
                    <Sun size={24} style={{ color: '#fbbf24' }} />
                    <span className="color-swatch-name">تلقائي حسب النظام</span>
                  </div>
                </div>
              </div>

              {/* Font Size & Motion */}
              <div className="settings-form-grid">
                <div className="settings-form-group">
                  <label className="settings-label">حجم خط الواجهة</label>
                  <select
                    className="settings-select"
                    value={interfaceSettings.fontSize}
                    onChange={(e) => setInterfaceSettings({ ...interfaceSettings, fontSize: e.target.value })}
                  >
                    <option value="normal">عادي (15px)</option>
                    <option value="medium">متوسط (16px) - الموصى به</option>
                    <option value="large">كبير (18px)</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* ════════════════════════════════════════════════════════════════
             TAB 3: NOTIFICATIONS (الإشعارات والتنبيهات)
          ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'notifications' && (
            <>
              <div className="settings-panel-header">
                <h2 className="settings-panel-title">
                  <Bell size={22} />
                  إعدادات التنبيهات والإشعارات
                </h2>
                <p className="settings-panel-desc">تحكم في الرسائل والإشعارات الفورية التي تصلك عبر البريد والمتصفح</p>
              </div>

              <div className="settings-toggle-list">
                <div className="settings-toggle-item">
                  <div className="toggle-info">
                    <span className="toggle-title">تنبيهات البريد الإلكتروني</span>
                    <span className="toggle-desc">إرسال ملخصات الدروس والاختبارات الجديدة مباشرة إلى بريدك</span>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={notificationToggles.emailAlerts}
                      onChange={(e) =>
                        setNotificationToggles({ ...notificationToggles, emailAlerts: e.target.checked })
                      }
                    />
                    <span className="slider" />
                  </label>
                </div>

                <div className="settings-toggle-item">
                  <div className="toggle-info">
                    <span className="toggle-title">إشعارات المتصفح الفورية</span>
                    <span className="toggle-desc">عرض تنبيهات فورية عند إضافة موعد اختبار جديد أو محتوى معتمد</span>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={notificationToggles.pushAlerts}
                      onChange={(e) =>
                        setNotificationToggles({ ...notificationToggles, pushAlerts: e.target.checked })
                      }
                    />
                    <span className="slider" />
                  </label>
                </div>

                <div className="settings-toggle-item">
                  <div className="toggle-info">
                    <span className="toggle-title">تذكير الاختبارات التقييمية</span>
                    <span className="toggle-desc">تنبيه تلقائي قبل موعد تسليم الواجب أو بداية الاختبار بـ 24 ساعة</span>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={notificationToggles.examReminders}
                      onChange={(e) =>
                        setNotificationToggles({ ...notificationToggles, examReminders: e.target.checked })
                      }
                    />
                    <span className="slider" />
                  </label>
                </div>

                <div className="settings-toggle-item">
                  <div className="toggle-info">
                    <span className="toggle-title">تقرير الإنجاز الأسبوعي</span>
                    <span className="toggle-desc">إرسال تقرير تحليلي بنسبة تقدمك وسلسلة تعلمك كل يوم جمعة</span>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={notificationToggles.weeklyDigest}
                      onChange={(e) =>
                        setNotificationToggles({ ...notificationToggles, weeklyDigest: e.target.checked })
                      }
                    />
                    <span className="slider" />
                  </label>
                </div>
              </div>
            </>
          )}

          {/* ════════════════════════════════════════════════════════════════
             TAB 4: LANGUAGE & REGION (اللغة والمنطقة)
          ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'language' && (
            <>
              <div className="settings-panel-header">
                <h2 className="settings-panel-title">
                  <Globe size={22} />
                  إعدادات اللغة والمنطقة
                </h2>
                <p className="settings-panel-desc">اختر لغة المنصة المفضلة، نمط التقويم ونطاق التوقيت المحلي</p>
              </div>

              <div className="settings-form-group full-width">
                <label className="settings-label">لغة الواجهة الرئيسية</label>
                <div className="lang-cards-grid">
                  <div
                    className={`lang-card ${languageSettings.lang === 'ar' ? 'selected' : ''}`}
                    onClick={() => setLanguageSettings({ ...languageSettings, lang: 'ar' })}
                  >
                    <span className="lang-flag">🇸🇦</span>
                    <div>
                      <span className="lang-name">اللغة العربية</span>
                      <span className="lang-sub">العربية (الافتراضية - RTL)</span>
                    </div>
                  </div>

                  <div
                    className={`lang-card ${languageSettings.lang === 'en' ? 'selected' : ''}`}
                    onClick={() => setLanguageSettings({ ...languageSettings, lang: 'en' })}
                  >
                    <span className="lang-flag">🇬🇧</span>
                    <div>
                      <span className="lang-name">English</span>
                      <span className="lang-sub">English (LTR)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="settings-form-grid">
                <div className="settings-form-group">
                  <label className="settings-label">نوع التقويم</label>
                  <select
                    className="settings-select"
                    value={languageSettings.calendar}
                    onChange={(e) => setLanguageSettings({ ...languageSettings, calendar: e.target.value })}
                  >
                    <option value="hijri">التقويم الهجري الشمسي/المصري</option>
                    <option value="gregorian">التقويم الميلادي</option>
                  </select>
                </div>

                <div className="settings-form-group">
                  <label className="settings-label">النطاق الزمني</label>
                  <input
                    type="text"
                    className="settings-input"
                    disabled
                    value={languageSettings.timezone}
                  />
                </div>
              </div>
            </>
          )}

          {/* ════════════════════════════════════════════════════════════════
             TAB 5: SECURITY & PRIVACY (الأمان والخصوصية)
          ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'security' && (
            <>
              <div className="settings-panel-header">
                <h2 className="settings-panel-title">
                  <ShieldCheck size={22} />
                  الأمان والخصوصية والجلسات النشطة
                </h2>
                <p className="settings-panel-desc">إدارة حماية الحساب، المصادقة الثنائية، والأجهزة المتصلة بحسابك</p>
              </div>

              <div className="settings-toggle-list">
                <div className="settings-toggle-item">
                  <div className="toggle-info">
                    <span className="toggle-title">المصادقة الثنائية (2FA) 🛡️</span>
                    <span className="toggle-desc">إرسال رمز تحقق إضافي عبر هاتفك عند تسجيل الدخول من أجهزة جديدة</span>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={securitySettings.twoFactor}
                      onChange={(e) =>
                        setSecuritySettings({ ...securitySettings, twoFactor: e.target.checked })
                      }
                    />
                    <span className="slider" />
                  </label>
                </div>
              </div>

              {/* Active Sessions */}
              <div className="settings-form-group full-width" style={{ marginTop: '1rem' }}>
                <label className="settings-label">الجلسات والأجهزة النشطة حالياً</label>
                <div className="devices-list">
                  <div className="device-item-card">
                    <div className="device-left">
                      <div className="device-icon-box">
                        <Laptop size={20} />
                      </div>
                      <div>
                        <span className="device-title">متصفح الويندوز (هذا الجهاز)</span>
                        <span className="device-sub">القاهرة، مصر · متصل الآن</span>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--green-neon)', fontWeight: 'bold' }}>نشط حالياً</span>
                  </div>

                  <div className="device-item-card">
                    <div className="device-left">
                      <div className="device-icon-box" style={{ background: 'rgba(56, 189, 248, 0.12)', borderColor: 'rgba(56, 189, 248, 0.3)', color: '#38bdf8' }}>
                        <Smartphone size={20} />
                      </div>
                      <div>
                        <span className="device-title">تطبيق آيفون (iOS)</span>
                        <span className="device-sub">تطبيق رؤية الذكي · منذ 3 ساعات</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-revoke-device"
                      onClick={() => alert('تم تسجيل الخروج من الجهاز بنجاح')}
                    >
                      تسجيل خروج
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ════════════════════════════════════════════════════════════════
             TAB 6: CHANGE PASSWORD (تغيير كلمة المرور)
          ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'password' && (
            <>
              <div className="settings-panel-header">
                <h2 className="settings-panel-title">
                  <KeyRound size={22} />
                  تغيير كلمة المرور
                </h2>
                <p className="settings-panel-desc">تحديث كلمة السر بانتظام لحماية حسابك وبياناتك الأكاديمية</p>
              </div>

              <form className="settings-form-grid" onSubmit={handlePasswordSave}>
                <div className="settings-form-group full-width">
                  <label className="settings-label">كلمة المرور الحالية</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPass ? 'text' : 'password'}
                      className="settings-input"
                      placeholder="أدخل كلمة المرور الحالية"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                      }
                      required
                    />
                    <button
                      type="button"
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-subtle)',
                        cursor: 'pointer',
                      }}
                      onClick={() => setShowPass(!showPass)}
                    >
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="settings-form-group">
                  <label className="settings-label">كلمة المرور الجديدة</label>
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="settings-input"
                    placeholder="8 أرقام وحروف على الأقل"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                  />
                  {passStrength && (
                    <div className="password-meter-wrap">
                      <div className="password-meter-bar">
                        <div className={`password-meter-fill ${passStrength}`} />
                      </div>
                      <span style={{ fontSize: '0.78rem', color: passStrength === 'strong' ? 'var(--green-neon)' : passStrength === 'medium' ? '#fbbf24' : '#ef4444' }}>
                        قوة كلمة المرور: {passStrength === 'strong' ? 'قوية جداً 🔒' : passStrength === 'medium' ? 'متوسطة ⚠️' : 'ضعيفة ❌'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="settings-form-group">
                  <label className="settings-label">تأكيد كلمة المرور الجديدة</label>
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="settings-input"
                    placeholder="أعد إدخال كلمة المرور الجديدة"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="settings-form-group full-width" style={{ marginTop: '0.8rem' }}>
                  <button type="submit" className="btn-save-settings" style={{ alignSelf: 'flex-start' }}>
                    <KeyRound size={18} />
                    <span>تحديث كلمة المرور</span>
                  </button>
                </div>
              </form>
            </>
          )}
        </main>
      </div>

      {/* ── Toast Confirmation ── */}
      {showToast && (
        <div className="settings-saved-toast">
          <CheckCircle2 size={22} style={{ color: 'var(--green-neon)' }} />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
