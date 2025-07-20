import { MD3LightTheme, configureFonts } from 'react-native-paper';

// Font configuration
const fontConfig = {
    displayLarge: {
        fontFamily: 'Poppins-Bold',
        fontSize: 57,
        fontWeight: '700',
        letterSpacing: 0,
        lineHeight: 64,
    },
    displayMedium: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 45,
        fontWeight: '600',
        letterSpacing: 0,
        lineHeight: 52,
    },
    displaySmall: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 36,
        fontWeight: '600',
        letterSpacing: 0,
        lineHeight: 44,
    },
    headlineLarge: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 32,
        fontWeight: '600',
        letterSpacing: 0,
        lineHeight: 40,
    },
    headlineMedium: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 28,
        fontWeight: '600',
        letterSpacing: 0,
        lineHeight: 36,
    },
    headlineSmall: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 24,
        fontWeight: '600',
        letterSpacing: 0,
        lineHeight: 32,
    },
    titleLarge: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 22,
        fontWeight: '600',
        letterSpacing: 0,
        lineHeight: 28,
    },
    titleMedium: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        fontWeight: '500',
        letterSpacing: 0.15,
        lineHeight: 24,
    },
    titleSmall: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        fontWeight: '500',
        letterSpacing: 0.1,
        lineHeight: 20,
    },
    bodyLarge: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        fontWeight: '400',
        letterSpacing: 0.15,
        lineHeight: 24,
    },
    bodyMedium: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        fontWeight: '400',
        letterSpacing: 0.25,
        lineHeight: 20,
    },
    bodySmall: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        fontWeight: '400',
        letterSpacing: 0.4,
        lineHeight: 16,
    },
    labelLarge: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        fontWeight: '500',
        letterSpacing: 0.1,
        lineHeight: 20,
    },
    labelMedium: {
        fontFamily: 'Poppins-Medium',
        fontSize: 12,
        fontWeight: '500',
        letterSpacing: 0.5,
        lineHeight: 16,
    },
    labelSmall: {
        fontFamily: 'Poppins-Medium',
        fontSize: 11,
        fontWeight: '500',
        letterSpacing: 0.5,
        lineHeight: 16,
    },
};

// Color palette matching frontend CSS variables
const colors = {
    // Primary colors
    primary: '#1e293b', // --secondary-color
    secondary: '#f59e0b', // --tertiary-color
    tertiary: '#ffffff',

    // Background colors
    background: '#ffffff',
    surface: '#f8fafc',
    surfaceVariant: '#f1f5f9',

    // Text colors
    onPrimary: '#ffffff',
    onSecondary: '#1e293b',
    onSurface: '#1e293b',
    onSurfaceVariant: '#64748b',

    // Status colors
    error: '#ef4444',
    warning: '#f59e0b',
    success: '#10b981',
    info: '#3b82f6',

    // Additional colors
    outline: '#e2e8f0',
    outlineVariant: '#cbd5e1',
    shadow: '#000000',

    // Gradient colors
    gradientStart: '#1e293b',
    gradientEnd: '#334155',

    // Card colors
    card: '#ffffff',
    cardVariant: '#f8fafc',

    // Border colors
    border: '#e2e8f0',
    borderVariant: '#cbd5e1',
};

// Spacing scale
const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
};

// Border radius
const borderRadius = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
};

// Shadows
const shadows = {
    sm: {
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    md: {
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    lg: {
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
    },
    xl: {
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 12,
    },
};

// Create the theme
export const theme = {
    ...MD3LightTheme,
    fonts: configureFonts({ config: fontConfig }),
    colors: {
        ...MD3LightTheme.colors,
        ...colors,
    },
    spacing,
    borderRadius,
    shadows,
    roundness: 12,
};

// Export individual theme parts for use in components
export { colors, spacing, borderRadius, shadows }; 