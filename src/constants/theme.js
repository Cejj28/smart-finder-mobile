/**
 * SmartFinder Design System
 * Mirrors the web admin panel's CSS custom properties
 */

export const COLORS = {
    // Primary
    primary: '#0EA5A4',
    primaryDark: '#0F766E',
    primaryLight: 'rgba(14, 165, 164, 0.12)',

    // Backgrounds
    bgColor: '#F5F9FC',
    cardBg: '#FFFFFF',
    sidebarBg: '#1E293B',

    // Text
    textDark: '#1E293B',
    textMedium: '#64748B',
    textLight: '#94A3B8',

    // Status
    success: '#10B981',
    successBg: 'rgba(16, 185, 129, 0.1)',
    warning: '#F59E0B',
    warningBg: 'rgba(245, 158, 11, 0.1)',
    error: '#EF4444',
    errorBg: 'rgba(239, 68, 68, 0.1)',

    // Misc
    indigo: '#6366F1',
    indigoBg: 'rgba(99, 102, 241, 0.1)',
    border: '#E2E8F0',
    inputBorder: '#CBD5E0',
    white: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.5)',
};

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
};

export const RADIUS = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
};

export const FONT_SIZES = {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    title: 28,
};

export const FONT_WEIGHTS = {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
};

export const SHADOWS = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 8,
    },
};
