import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme/theme';
import { logout } from '../../store/slices/authSlice';

const CustomDrawerContent = (props) => {
    const dispatch = useDispatch();
    const { userType } = useSelector((state) => state.auth);
    const user = useSelector((state) => state.user.user);
    const organization = useSelector((state) => state.organization.organization);

    const handleLogout = () => {
        dispatch(logout());
    };

    const getUserInfo = () => {
        if (userType === 'organization') {
            return {
                name: organization?.name || 'Organization',
                email: organization?.email || '',
                avatar: organization?.logo_url || null,
            };
        }
        return {
            name: user?.name || 'User',
            email: user?.email || '',
            avatar: user?.avatar || null,
        };
    };

    const userInfo = getUserInfo();

    return (
        <View style={styles.container}>
            <DrawerContentScrollView {...props}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        {userInfo.avatar ? (
                            <Image source={{ uri: userInfo.avatar }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Ionicons name="person" size={32} color={colors.onSecondary} />
                            </View>
                        )}
                    </View>
                    <Text style={styles.name}>{userInfo.name}</Text>
                    <Text style={styles.email}>{userInfo.email}</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                            {userType === 'organization' ? 'Organization' :
                                userType === 'admin' ? 'Administrator' : 'User'}
                        </Text>
                    </View>
                </View>

                {/* Drawer Items */}
                <View style={styles.drawerItems}>
                    {props.state.routes.map((route, index) => {
                        const isFocused = props.state.index === index;
                        const { options } = props.descriptors[route.key];

                        return (
                            <DrawerItem
                                key={route.key}
                                label={route.name}
                                focused={isFocused}
                                onPress={() => props.navigation.navigate(route.name)}
                                icon={options.drawerIcon}
                                labelStyle={[
                                    styles.drawerLabel,
                                    isFocused && styles.drawerLabelFocused,
                                ]}
                                style={[
                                    styles.drawerItem,
                                    isFocused && styles.drawerItemFocused,
                                ]}
                            />
                        );
                    })}
                </View>
            </DrawerContentScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <DrawerItem
                    label="Logout"
                    onPress={handleLogout}
                    icon={({ color, size }) => (
                        <Ionicons name="log-out-outline" size={size} color={color} />
                    )}
                    labelStyle={styles.logoutLabel}
                    style={styles.logoutItem}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        padding: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        alignItems: 'center',
    },
    avatarContainer: {
        marginBottom: spacing.md,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    avatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.onSurface,
        fontFamily: 'Poppins-SemiBold',
        marginBottom: spacing.xs,
    },
    email: {
        fontSize: 14,
        color: colors.onSurfaceVariant,
        fontFamily: 'Poppins-Regular',
        marginBottom: spacing.sm,
    },
    badge: {
        backgroundColor: colors.secondary,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: 12,
    },
    badgeText: {
        color: colors.onSecondary,
        fontSize: 12,
        fontWeight: '500',
        fontFamily: 'Poppins-Medium',
    },
    drawerItems: {
        paddingTop: spacing.md,
    },
    drawerItem: {
        marginHorizontal: spacing.sm,
        marginVertical: spacing.xs,
        borderRadius: 8,
    },
    drawerItemFocused: {
        backgroundColor: colors.secondary + '20',
    },
    drawerLabel: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
    },
    drawerLabelFocused: {
        color: colors.secondary,
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: spacing.sm,
    },
    logoutItem: {
        marginHorizontal: spacing.sm,
        marginVertical: spacing.xs,
        borderRadius: 8,
    },
    logoutLabel: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        color: colors.error,
    },
});

export default CustomDrawerContent; 