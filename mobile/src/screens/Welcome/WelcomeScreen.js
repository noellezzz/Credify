import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../../theme/theme';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
    const features = [
        {
            icon: 'shield-checkmark',
            title: 'Certificate Verification',
            description: 'Verify certificates from trusted organizations with ease',
        },
        {
            icon: 'business',
            title: 'Organization Management',
            description: 'Manage events and verify certificates as an organization',
        },
        {
            icon: 'calendar',
            title: 'Event Management',
            description: 'Create and manage events with verification capabilities',
        },
        {
            icon: 'people',
            title: 'User-Friendly',
            description: 'Simple and intuitive interface for all users',
        },
    ];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Hero Section */}
            <LinearGradient
                colors={[colors.gradientStart, colors.gradientEnd]}
                style={styles.heroSection}
            >
                <View style={styles.heroContent}>
                    <View style={styles.logoContainer}>
                        <View style={styles.logoPlaceholder}>
                            <Ionicons name="shield-checkmark" size={48} color={colors.secondary} />
                        </View>
                    </View>

                    <Text style={styles.heroTitle}>Credify</Text>
                    <Text style={styles.heroSubtitle}>
                        Trusted Certificate Verification Platform
                    </Text>
                    <Text style={styles.heroDescription}>
                        Connect with verified organizations, manage events, and verify certificates with confidence.
                    </Text>
                </View>
            </LinearGradient>

            {/* Features Section */}
            <View style={styles.featuresSection}>
                <Text style={styles.sectionTitle}>Why Choose Credify?</Text>
                <Text style={styles.sectionSubtitle}>
                    Everything you need for certificate verification and event management
                </Text>

                <View style={styles.featuresGrid}>
                    {features.map((feature, index) => (
                        <View key={index} style={styles.featureCard}>
                            <View style={styles.featureIcon}>
                                <Ionicons name={feature.icon} size={24} color={colors.secondary} />
                            </View>
                            <Text style={styles.featureTitle}>{feature.title}</Text>
                            <Text style={styles.featureDescription}>{feature.description}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* CTA Section */}
            <View style={styles.ctaSection}>
                <Text style={styles.ctaTitle}>Ready to Get Started?</Text>
                <Text style={styles.ctaSubtitle}>
                    Join thousands of users and organizations already using Credify
                </Text>

                <View style={styles.ctaButtons}>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.primaryButtonText}>Sign In</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => navigation.navigate('Register')}
                    >
                        <Text style={styles.secondaryButtonText}>Create Account</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.organizationButton}
                        onPress={() => navigation.navigate('OrganizationRegister')}
                    >
                        <Ionicons name="business" size={20} color={colors.onSecondary} />
                        <Text style={styles.organizationButtonText}>
                            Register as Organization
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    © 2024 Credify. All rights reserved.
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    heroSection: {
        paddingTop: height * 0.1,
        paddingBottom: spacing.xxl,
        paddingHorizontal: spacing.lg,
        alignItems: 'center',
    },
    heroContent: {
        alignItems: 'center',
        maxWidth: 400,
    },
    logoContainer: {
        marginBottom: spacing.lg,
    },
    logoPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.secondary + '20',
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.lg,
    },
    heroTitle: {
        fontSize: 36,
        fontWeight: '700',
        color: colors.onPrimary,
        fontFamily: 'Poppins-Bold',
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    heroSubtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.onPrimary,
        fontFamily: 'Poppins-SemiBold',
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    heroDescription: {
        fontSize: 16,
        color: colors.onPrimary + 'CC',
        fontFamily: 'Poppins-Regular',
        textAlign: 'center',
        lineHeight: 24,
    },
    featuresSection: {
        padding: spacing.lg,
        backgroundColor: colors.surface,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: colors.onSurface,
        fontFamily: 'Poppins-SemiBold',
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    sectionSubtitle: {
        fontSize: 16,
        color: colors.onSurfaceVariant,
        fontFamily: 'Poppins-Regular',
        textAlign: 'center',
        marginBottom: spacing.xl,
        lineHeight: 24,
    },
    featuresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    featureCard: {
        width: (width - spacing.lg * 3) / 2,
        backgroundColor: colors.card,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.md,
        alignItems: 'center',
        ...shadows.sm,
    },
    featureIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.secondary + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    featureTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.onSurface,
        fontFamily: 'Poppins-SemiBold',
        textAlign: 'center',
        marginBottom: spacing.xs,
    },
    featureDescription: {
        fontSize: 12,
        color: colors.onSurfaceVariant,
        fontFamily: 'Poppins-Regular',
        textAlign: 'center',
        lineHeight: 16,
    },
    ctaSection: {
        padding: spacing.lg,
        backgroundColor: colors.background,
    },
    ctaTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: colors.onSurface,
        fontFamily: 'Poppins-SemiBold',
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    ctaSubtitle: {
        fontSize: 16,
        color: colors.onSurfaceVariant,
        fontFamily: 'Poppins-Regular',
        textAlign: 'center',
        marginBottom: spacing.xl,
        lineHeight: 24,
    },
    ctaButtons: {
        gap: spacing.md,
    },
    primaryButton: {
        backgroundColor: colors.secondary,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        ...shadows.md,
    },
    primaryButtonText: {
        color: colors.onSecondary,
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
    },
    secondaryButton: {
        backgroundColor: colors.background,
        borderWidth: 2,
        borderColor: colors.secondary,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.md,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: colors.secondary,
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
    },
    organizationButton: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.sm,
        ...shadows.md,
    },
    organizationButtonText: {
        color: colors.onPrimary,
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
    },
    footer: {
        padding: spacing.lg,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    footerText: {
        fontSize: 14,
        color: colors.onSurfaceVariant,
        fontFamily: 'Poppins-Regular',
    },
});

export default WelcomeScreen; 