import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { colors, spacing, borderRadius, shadows } from '../../theme/theme';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import LoadingScreen from '../../components/common/LoadingScreen';

const LoginScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { isLoading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleLogin = async () => {
        if (!formData.email || !formData.password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        dispatch(loginStart());

        try {
            // TODO: Implement actual API call
            // For now, simulate login
            setTimeout(() => {
                dispatch(loginSuccess({
                    token: 'mock-token',
                    refreshToken: 'mock-refresh-token',
                    userType: 'user', // or 'organization' or 'admin'
                }));
            }, 2000);
        } catch (error) {
            dispatch(loginFailure(error.message));
        }
    };

    if (isLoading) {
        return <LoadingScreen message="Signing in..." />;
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <LinearGradient
                    colors={[colors.gradientStart, colors.gradientEnd]}
                    style={styles.header}
                >
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color={colors.onPrimary} />
                    </TouchableOpacity>

                    <View style={styles.logoContainer}>
                        <View style={styles.logoPlaceholder}>
                            <Ionicons name="shield-checkmark" size={32} color={colors.secondary} />
                        </View>
                    </View>

                    <Text style={styles.headerTitle}>Welcome Back</Text>
                    <Text style={styles.headerSubtitle}>Sign in to your account</Text>
                </LinearGradient>

                {/* Form */}
                <View style={styles.formContainer}>
                    {error && (
                        <View style={styles.errorContainer}>
                            <Ionicons name="alert-circle" size={20} color={colors.error} />
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Email Address</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="mail-outline" size={20} color={colors.onSurfaceVariant} />
                            <TextInput
                                style={styles.textInput}
                                placeholder="Enter your email"
                                placeholderTextColor={colors.onSurfaceVariant}
                                value={formData.email}
                                onChangeText={(value) => handleInputChange('email', value)}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Password</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="lock-closed-outline" size={20} color={colors.onSurfaceVariant} />
                            <TextInput
                                style={styles.textInput}
                                placeholder="Enter your password"
                                placeholderTextColor={colors.onSurfaceVariant}
                                value={formData.password}
                                onChangeText={(value) => handleInputChange('password', value)}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeButton}
                            >
                                <Ionicons
                                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                    size={20}
                                    color={colors.onSurfaceVariant}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.forgotPassword}>
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        <Text style={styles.loginButtonText}>Sign In</Text>
                    </TouchableOpacity>

                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>or</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <TouchableOpacity
                        style={styles.registerButton}
                        onPress={() => navigation.navigate('Register')}
                    >
                        <Text style={styles.registerButtonText}>Create New Account</Text>
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
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        paddingTop: 60,
        paddingBottom: spacing.xl,
        paddingHorizontal: spacing.lg,
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: spacing.lg,
        zIndex: 1,
    },
    logoContainer: {
        marginBottom: spacing.lg,
    },
    logoPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.secondary + '20',
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.lg,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.onPrimary,
        fontFamily: 'Poppins-Bold',
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: 16,
        color: colors.onPrimary + 'CC',
        fontFamily: 'Poppins-Regular',
        textAlign: 'center',
    },
    formContainer: {
        padding: spacing.lg,
        flex: 1,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.error + '10',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: spacing.lg,
    },
    errorText: {
        color: colors.error,
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        marginLeft: spacing.sm,
        flex: 1,
    },
    inputContainer: {
        marginBottom: spacing.lg,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.onSurface,
        fontFamily: 'Poppins-SemiBold',
        marginBottom: spacing.sm,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: colors.onSurface,
        fontFamily: 'Poppins-Regular',
        marginLeft: spacing.sm,
    },
    eyeButton: {
        padding: spacing.xs,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: spacing.xl,
    },
    forgotPasswordText: {
        color: colors.secondary,
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
    },
    loginButton: {
        backgroundColor: colors.secondary,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        marginBottom: spacing.lg,
        ...shadows.md,
    },
    loginButtonText: {
        color: colors.onSecondary,
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: spacing.lg,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: colors.border,
    },
    dividerText: {
        color: colors.onSurfaceVariant,
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        marginHorizontal: spacing.md,
    },
    registerButton: {
        backgroundColor: colors.background,
        borderWidth: 2,
        borderColor: colors.secondary,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    registerButtonText: {
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
});

export default LoginScreen; 