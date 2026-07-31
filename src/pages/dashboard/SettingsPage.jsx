import React, { useState, useEffect } from 'react';
import { useUserSession } from '../../context/UserSessionContext';
import { updateUserDocument } from '../../services/firestoreService';
import { updateUserPassword, getArabicAuthErrorMessage } from '../../services/authService';
import {
  User, Mail, Phone, Lock, Bell, Palette, Globe, ShieldCheck,
  Save, Check, Laptop, Smartphone, KeyRound, CheckCircle2,
  Sliders, Eye, EyeOff, Sparkles, Moon, Sun, Monitor, Loader2
} from 'lucide-react';
import './SettingsPage.css';

const GRADE_LABELS = {
  'grade-1': 'الصف الأول الثانوي',
  'grade-2': 'الصف الثاني الثانوي',
  'grade-3': 'الصف الثالث الثانوي',
};

const PATH_LABELS = {
  medicine: 'مسار الطب والعلوم الصحية',
  engineering: 'مسار الهندسة والتكنولوجيا',
  arts: 'مسار الإنسانيات والفنون',
  business: 'مسار إدارة الأعمال والاقتصاد',
};

export default function SettingsPage() {
  const { currentUser, userProfile, selectedGrade, selectedPath } = useUserSession();

  // Resolve from Firestore
  const resolvedName  = userProfile?.fullName || currentUser?.displayName || '';
  const resolvedEmail = userProfile?.email    || currentUser?.email       || '';
  const resolvedGrade = userProfile?.grade    || selectedGrade;
  const resolvedPath  = userProfile?.path     || selectedPath;

  // Active tab state
  const [activeTab, setActiveTab] = useState('account');

  // Form States — seeded from Firestore profile
  const [accountInfo, setAccountInfo] = useState({
    name:  resolvedName,
    email: resolvedEmail,
    phone: '',
    bio:   '',
  });

  // Sync accountInfo when Firestore profile loads asynchronously
  useEffect(() => {
    if (userProfile) {
      setAccountInfo({
        name:  userProfile.fullName || currentUser?.displayName || '',
        email: userProfile.email    || currentUser?.email       || '',
        phone: userProfile.phone    || '',
        bio:   userProfile.bio      || '',
      });
    }
  }, [userProfile, currentUser]);

  const [interfaceSettings, setInterfaceSettings] = useState({
    accentColor: 'emerald',
    themeMode: 'ultra-dark',
    fontSize: 'medium',
    animations: true,
  });

  const [notificationToggles, setNotificationToggles] = useState({
    emailAlerts: true,
    pushAlerts: true,
    examReminders: true,
    weeklyDigest: false,
  });

  const [languageSettings, setLanguageSettings] = useState({
    lang: 'ar',
    calendar: 'hijri',
    timezone: 'GMT+3 (مكة المكرمة)',
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: false,
    privateLeaderboard: false,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPass, setShowPass]       = useState(false);
  const [showToast, setShowToast]     = useState(false);
  const [toastMsg, setToastMsg]       = useState('');
  const [toastType, setToastType]     = useState('success'); // 'success' | 'error'
  const [saving, setSaving]           = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const triggerToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const handleGlobalSave = async () => {
    if (!currentUser?.uid) return;
    setSaving(true);
    try {
      await updateUserDocument(currentUser.uid, {
        fullName: accountInfo.name.trim(),
        phone: accountInfo.phone.trim(),
        bio: accountInfo.bio.trim(),
      });
      triggerToast('تم حفظ التغييرات بنجاح في Firestore! ✨');
    } catch (err) {
      console.error('Error saving settings:', err);
      triggerToast('حدث خطأ أثناء الحفظ. يرجى المحاولة مجدداً.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Password strength
  const getPasswordStrength = (pass) => {
    if (!pass) return '';
    if (pass.length < 6) return 'weak';
    if (pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) return 'strong';
    return 'medium';
  };

  const passStrength = getPasswordStrength(passwordForm.newPassword);

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!passwordForm.currentPassword) {
      setPasswordError('يرجى إدخال كلمة المرور الحالية.');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('يجب أن تكون كلمة المرور الجديدة 6 أحرف على الأقل.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('كلمة المرور الجديدة غير متطابقة مع تأكيدها.');
      return;
    }

    setSavingPassword(true);
    try {
      await updateUserPassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      triggerToast('تم تحديث كلمة المرور بنجاح! 🔑');
    } catch (err) {
      const arabicMsg = getArabicAuthErrorMessage(err.code);
      setPasswordError(arabicMsg);
    } finally {
      setSavingPassword(false);
    }
  };

  // Grade + Path display
  const gradeDisplay = GRADE_LABELS[resolvedGrade] || '—';
  const pathDisplay  = PATH_LABELS[resolvedPath]   || '—';

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
          onClick={handleGlobalSave}
          disabled={saving}
        >
          {saving ? <Loader2 size={18} className="spin-icon" /> : <Save size={18} />}
          <span>{saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
        </button>
      </div>

      {/* ── Main Layout: Nav Tabs + Content Area ── */}
      <div className="settings-layout-grid">
        {/* Sidebar Nav */}
        <aside className="settings-nav-card">
          {[
            { key: 'account',       label: 'معلومات الحساب',          Icon: User },
            { key: 'interface',     label: 'إعدادات الواجهة',          Icon: Palette },
            { key: 'notifications', label: 'التنبيهات والإشعارات',    Icon: Bell },
            { key: 'language',      label: 'اللغة والمنطقة',           Icon: Globe },
            { key: 'security',      label: 'الأمان والخصوصية',         Icon: ShieldCheck },
            { key: 'password',      label: 'تغيير كلمة المرور',        Icon: KeyRound },
          ].map(({ key, label, Icon }) => (
            <button
              key={key}
              type="button"
              className={`settings-tab-btn ${activeTab === key ? 'active' : ''}`}
              onClick={() => setActiveTab(key)}
            >
              <Icon size={18} className="settings-tab-icon" />
              <span>{label}</span>
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <main className="settings-content-card">

          {/* ══════════ TAB 1: ACCOUNT INFORMATION ══════════ */}
          {activeTab === 'account' && (
            <>
              <div className="settings-panel-header">
                <h2 className="settings-panel-title">
                  <User size={22} />
                  معلومات الحساب والبيانات الشخصية
                </h2>
                <p className="settings-panel-desc">تعديل الاسم ورقم الهاتف المسجل — يُحفظ مباشرةً في Firestore</p>
              </div>

              <form className="settings-form-grid" onSubmit={(e) => e.preventDefault()}>
                <div className="settings-form-group">
                  <label className="settings-label">الاسم الكامل</label>
                  <input
                    type="text"
                    className="settings-input"
                    value={accountInfo.name}
                    onChange={(e) => setAccountInfo({ ...accountInfo, name: e.target.value })}
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                <div className="settings-form-group">
                  <label className="settings-label">البريد الإلكتروني</label>
                  <input
                    type="email"
                    className="settings-input"
                    value={accountInfo.email}
                    disabled
                    style={{ opacity: 0.6 }}
                    title="لا يمكن تغيير البريد الإلكتروني من هنا"
                  />
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginTop: '0.3rem', display: 'block' }}>
                    البريد الإلكتروني ثابت ولا يمكن تعديله.
                  </span>
                </div>

                <div className="settings-form-group">
                  <label className="settings-label">رقم الهاتف</label>
                  <input
                    type="text"
                    className="settings-input"
                    value={accountInfo.phone}
                    onChange={(e) => setAccountInfo({ ...accountInfo, phone: e.target.value })}
                    placeholder="مثال: 0501234567"
                  />
                </div>

                <div className="settings-form-group">
                  <label className="settings-label">الصف الدراسي والمسار</label>
                  <input
                    type="text"
                    className="settings-input"
                    disabled
                    value={`${gradeDisplay} — ${pathDisplay}`}
                    style={{ opacity: 0.6 }}
                    title="يمكن تغيير المسار والصف من خلال الملف الشخصي"
                  />
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginTop: '0.3rem', display: 'block' }}>
                    لتغيير الصف أو المسار، انتقل إلى الملف الشخصي.
                  </span>
                </div>

                <div className="settings-form-group full-width">
                  <label className="settings-label">نبذة شخصية (Bio)</label>
                  <textarea
                    className="settings-textarea"
                    rows={3}
                    value={accountInfo.bio}
                    onChange={(e) => setAccountInfo({ ...accountInfo, bio: e.target.value })}
                    placeholder="اكتب نبذة قصيرة عن نفسك..."
                  />
                </div>
              </form>
            </>
          )}

          {/* ══════════ TAB 2: INTERFACE SETTINGS ══════════ */}
          {activeTab === 'interface' && (
            <>
              <div className="settings-panel-header">
                <h2 className="settings-panel-title">
                  <Palette size={22} />
                  إعدادات الواجهة والتجربة البصرية
                </h2>
                <p className="settings-panel-desc">تخصيص ألوان الإضاءة النيونية، نمط الخلفية وحجم الخطوط</p>
              </div>

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
                      className={`color-option-card ${interfaceSettings.accentColor === item.id ? 'selected' : ''}`}
                      onClick={() => setInterfaceSettings({ ...interfaceSettings, accentColor: item.id })}
                    >
                      <div className="color-swatch-circle" style={{ color: item.color, backgroundColor: item.color }} />
                      <span className="color-swatch-name">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="settings-form-group full-width">
                <label className="settings-label">نمط المظهر الداكن</label>
                <div className="theme-colors-grid">
                  {[
                    { id: 'ultra-dark', label: 'الداكن الخارق (Vision)', Icon: Moon, color: 'var(--green-neon)' },
                    { id: 'soft-slate', label: 'الداكن المعتدل', Icon: Monitor, color: '#38bdf8' },
                    { id: 'system', label: 'تلقائي حسب النظام', Icon: Sun, color: '#fbbf24' },
                  ].map(({ id, label, Icon, color }) => (
                    <div
                      key={id}
                      className={`color-option-card ${interfaceSettings.themeMode === id ? 'selected' : ''}`}
                      onClick={() => setInterfaceSettings({ ...interfaceSettings, themeMode: id })}
                    >
                      <Icon size={24} style={{ color }} />
                      <span className="color-swatch-name">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="settings-form-grid">
                <div className="settings-form-group">
                  <label className="settings-label">حجم خط الواجهة</label>
                  <select
                    className="settings-select"
                    value={interfaceSettings.fontSize}
                    onChange={(e) => setInterfaceSettings({ ...interfaceSettings, fontSize: e.target.value })}
                  >
                    <option value="normal">عادي (15px)</option>
                    <option value="medium">متوسط (16px) — الموصى به</option>
                    <option value="large">كبير (18px)</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* ══════════ TAB 3: NOTIFICATIONS ══════════ */}
          {activeTab === 'notifications' && (
            <>
              <div className="settings-panel-header">
                <h2 className="settings-panel-title">
                  <Bell size={22} />
                  إعدادات التنبيهات والإشعارات
                </h2>
                <p className="settings-panel-desc">تحكم في الرسائل والإشعارات التي تصلك</p>
              </div>

              <div className="settings-toggle-list">
                {[
                  { key: 'emailAlerts',    title: 'تنبيهات البريد الإلكتروني',      desc: 'إرسال ملخصات الدروس والاختبارات الجديدة إلى بريدك' },
                  { key: 'pushAlerts',     title: 'إشعارات المتصفح الفورية',         desc: 'تنبيهات فورية عند إضافة محتوى معتمد جديد' },
                  { key: 'examReminders',  title: 'تذكير الاختبارات التقييمية',     desc: 'تنبيه تلقائي قبل موعد الاختبار بـ 24 ساعة' },
                  { key: 'weeklyDigest',   title: 'تقرير الإنجاز الأسبوعي',         desc: 'تقرير تحليلي بنسبة تقدمك كل يوم جمعة' },
                ].map(({ key, title, desc }) => (
                  <div className="settings-toggle-item" key={key}>
                    <div className="toggle-info">
                      <span className="toggle-title">{title}</span>
                      <span className="toggle-desc">{desc}</span>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={notificationToggles[key]}
                        onChange={(e) => setNotificationToggles({ ...notificationToggles, [key]: e.target.checked })}
                      />
                      <span className="slider" />
                    </label>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ══════════ TAB 4: LANGUAGE & REGION ══════════ */}
          {activeTab === 'language' && (
            <>
              <div className="settings-panel-header">
                <h2 className="settings-panel-title">
                  <Globe size={22} />
                  إعدادات اللغة والمنطقة
                </h2>
                <p className="settings-panel-desc">اختر لغة المنصة المفضلة ونمط التقويم</p>
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
                      <span className="lang-sub">العربية (الافتراضية — RTL)</span>
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
                    <option value="hijri">التقويم الهجري</option>
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
                    style={{ opacity: 0.6 }}
                  />
                </div>
              </div>
            </>
          )}

          {/* ══════════ TAB 5: SECURITY & PRIVACY ══════════ */}
          {activeTab === 'security' && (
            <>
              <div className="settings-panel-header">
                <h2 className="settings-panel-title">
                  <ShieldCheck size={22} />
                  الأمان والخصوصية والجلسات النشطة
                </h2>
                <p className="settings-panel-desc">إدارة حماية الحساب والمصادقة الثنائية</p>
              </div>

              <div className="settings-toggle-list">
                <div className="settings-toggle-item">
                  <div className="toggle-info">
                    <span className="toggle-title">المصادقة الثنائية (2FA) 🛡️</span>
                    <span className="toggle-desc">طبقة حماية إضافية عند تسجيل الدخول من أجهزة جديدة</span>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={securitySettings.twoFactor}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, twoFactor: e.target.checked })}
                    />
                    <span className="slider" />
                  </label>
                </div>
              </div>

              <div className="settings-form-group full-width" style={{ marginTop: '1rem' }}>
                <label className="settings-label">الجلسات والأجهزة النشطة حالياً</label>
                <div className="devices-list">
                  <div className="device-item-card">
                    <div className="device-left">
                      <div className="device-icon-box">
                        <Laptop size={20} />
                      </div>
                      <div>
                        <span className="device-title">متصفح الويب (هذا الجهاز)</span>
                        <span className="device-sub">متصل الآن · {currentUser?.email}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--green-neon)', fontWeight: 'bold' }}>نشط حالياً</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ══════════ TAB 6: CHANGE PASSWORD ══════════ */}
          {activeTab === 'password' && (
            <>
              <div className="settings-panel-header">
                <h2 className="settings-panel-title">
                  <KeyRound size={22} />
                  تغيير كلمة المرور
                </h2>
                <p className="settings-panel-desc">تحديث كلمة السر — يتطلب إعادة المصادقة بكلمة المرور الحالية</p>
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
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer' }}
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
                    placeholder="8 أحرف وأرقام على الأقل"
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
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    required
                  />
                </div>

                {passwordError && (
                  <div className="settings-form-group full-width">
                    <p style={{ color: '#ef4444', fontSize: '0.88rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '0.6rem 1rem' }}>
                      ❌ {passwordError}
                    </p>
                  </div>
                )}

                <div className="settings-form-group full-width" style={{ marginTop: '0.8rem' }}>
                  <button
                    type="submit"
                    className="btn-save-settings"
                    style={{ alignSelf: 'flex-start' }}
                    disabled={savingPassword}
                  >
                    {savingPassword ? <Loader2 size={18} className="spin-icon" /> : <KeyRound size={18} />}
                    <span>{savingPassword ? 'جاري التحديث...' : 'تحديث كلمة المرور'}</span>
                  </button>
                </div>
              </form>
            </>
          )}

        </main>
      </div>

      {/* ── Toast Confirmation ── */}
      {showToast && (
        <div className={`settings-saved-toast ${toastType === 'error' ? 'error' : ''}`}>
          <CheckCircle2 size={22} style={{ color: toastType === 'error' ? '#ef4444' : 'var(--green-neon)' }} />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
