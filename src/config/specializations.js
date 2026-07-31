import { FlaskConical, Calculator, Code2, Atom, Brain, Languages, Receipt, Briefcase } from 'lucide-react';

/**
 * Specialization configuration.
 * Keyed by the path ID used in UserSessionContext (selectedPath).
 */
export const SPECIALIZATIONS_CONFIG = {
  medicine: {
    pathLabel: 'الطب وعلوم الحياة',
    specializations: [
      {
        id: 'math',
        icon: Calculator,
        emoji: '📐',
        label: 'الرياضيات',
        description: 'أساسيات التفاضل والتكامل والجبر الخطي اللازمة لدراسة الطب.',
        color: '#00e676',
        glow: 'rgba(0, 230, 118, 0.3)',
        accent: 'rgba(0, 230, 118, 0.1)',
      },
      {
        id: 'physics',
        icon: FlaskConical,
        emoji: '⚡',
        label: 'الفيزياء',
        description: 'فيزياء الجسم الحي وتطبيقاتها الطبية في التشخيص والعلاج.',
        color: '#00e676',
        glow: 'rgba(0, 230, 118, 0.3)',
        accent: 'rgba(0, 230, 118, 0.1)',
      },
    ],
  },

  engineering: {
    pathLabel: 'الهندسة وعلوم الحاسب',
    specializations: [
      {
        id: 'programming',
        icon: Code2,
        emoji: '💻',
        label: 'البرمجة',
        description: 'أساسيات الخوارزميات وهياكل البيانات والبرمجة الكائنية.',
        color: '#38bdf8',
        glow: 'rgba(56, 189, 248, 0.3)',
        accent: 'rgba(56, 189, 248, 0.1)',
      },
      {
        id: 'chemistry',
        icon: Atom,
        emoji: '⚗️',
        label: 'الكيمياء',
        description: 'كيمياء المواد والهندسة الكيميائية والعمليات الصناعية.',
        color: '#38bdf8',
        glow: 'rgba(56, 189, 248, 0.3)',
        accent: 'rgba(56, 189, 248, 0.1)',
      },
    ],
  },

  arts: {
    pathLabel: 'الآداب والفنون',
    specializations: [
      {
        id: 'psychology',
        icon: Brain,
        emoji: '🧠',
        label: 'علم النفس',
        description: 'السلوك البشري ونظريات الشخصية والصحة النفسية.',
        color: '#c084fc',
        glow: 'rgba(192, 132, 252, 0.3)',
        accent: 'rgba(192, 132, 252, 0.1)',
      },
      {
        id: 'second-language',
        icon: Languages,
        emoji: '🌐',
        label: 'اللغة الأجنبية الثانية',
        description: 'إتقان لغة ثانية كالفرنسية أو الألمانية أو الإسبانية.',
        color: '#c084fc',
        glow: 'rgba(192, 132, 252, 0.3)',
        accent: 'rgba(192, 132, 252, 0.1)',
      },
    ],
  },

  business: {
    pathLabel: 'إدارة الأعمال',
    specializations: [
      {
        id: 'accounting',
        icon: Receipt,
        emoji: '📊',
        label: 'المحاسبة',
        description: 'مبادئ المحاسبة المالية والتكاليف وتحليل القوائم المالية.',
        color: '#fbbf24',
        glow: 'rgba(251, 191, 36, 0.3)',
        accent: 'rgba(251, 191, 36, 0.1)',
      },
      {
        id: 'business-admin',
        icon: Briefcase,
        emoji: '💼',
        label: 'إدارة الأعمال',
        description: 'ريادة الأعمال والتسويق والإدارة الاستراتيجية للمؤسسات.',
        color: '#fbbf24',
        glow: 'rgba(251, 191, 36, 0.3)',
        accent: 'rgba(251, 191, 36, 0.1)',
      },
    ],
  },
};
