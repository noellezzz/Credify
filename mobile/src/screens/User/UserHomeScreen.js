import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../../theme/theme';

const { width } = Dimensions.get('window');

const UserHomeScreen = ({ navigation }) => {
    const quickActions = [
        {
            icon: 'search',
            title: 'Verify Certificate',
            description: 'Verify your certificates',
            onPress: () => navigation.navigate('Verification'),
        },
        {
            icon: 'calendar',
            title: 'Browse Events',
            description: 'Find events and courses',
            onPress: () => navigation.navigate('Events'),
        },
        {
            icon: 'business',
            title: 'Organizations',
            description: 'Explore verified organizations',
            onPress: () => navigation.navigate('Organizations'),
        },
        {
            icon: 'document-text',
            title: 'My Certificates',
            description: 'View your certificates',
            onPress: () => navigation.navigate('UserCertificates'),
        },
    ];

    const recentActivities = [
        {
            id: 1,
            type: 'verification',
            title: 'Certificate Verified',
            description: 'Your certificate from ABC University has been verified',
            time: '2 hours ago',
            status: 'success',
        },
        {
            id: 2,
            type: 'event',
            title: 'Event Registration',
            description: 'You registered for "Advanced Web Development" course',
            time: '1 day ago',
            status: 'pending',
        },
    ];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.greeting}>Good morning!</Text>
                    <Text style={styles.userName}>John Doe</Text>
                </View>
                <TouchableOpacity style={styles.notificationButton}>
                    <Ionicons name="notifications-outline" size={24} color={colors.onSurface} />
                </TouchableOpacity>
            </View>

            {/* Stats Cards */}
            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <View style={styles.statIcon}>
                        <Ionicons name="document-text" size={24} color={colors.secondary} />
                    </View>
                    <Text style={styles.statNumber}>5</Text>
                    <Text style={styles.statLabel}>Certificates</Text>
                </View>

                <View style={styles.statCard}>
                    <View style={styles.statIcon}>
                        <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                    </View>
                    <Text style={styles.statNumber}>3</Text>
                    <Text style={styles.statLabel}>Verified</Text>
                </View>

                <View style={styles.statCard}>
                    <View style={styles.statIcon}>
                        <Ionicons name="calendar" size={24} color={colors.info} />
                    </View>
                    <Text style={styles.statNumber}>2</Text>
                    <Text style={styles.statLabel}>Events</Text>
                </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.quickActionsGrid}>
                    {quickActions.map((action, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.quickActionCard}
                            onPress={action.onPress}
                        >
                            <View style={styles.quickActionIcon}>
                                <Ionicons name={action.icon} size={24} color={colors.secondary} />
                            </View>
                            <Text style={styles.quickActionTitle}>{action.title}</Text>
                            <Text style={styles.quickActionDescription}>{action.description}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Recent Activities */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Activities</Text>
                <View style={styles.activitiesList}>
                    {recentActivities.map((activity) => (
                        <View key={activity.id} style={styles.activityCard}>
                            <View style={styles.activityIcon}>
                                <Ionicons
                                    name={activity.type === 'verification' ? 'checkmark-circle' : 'calendar'}
                                    size={20}
                                    color={activity.status === 'success' ? colors.success : colors.warning}
                                />
                            </View>
                            <View style={styles.activityContent}>
                                <Text style={styles.activityTitle}>{activity.title}</Text>
                                <Text style={styles.activityDescription}>{activity.description}</Text>
                                <Text style={styles.activityTime}>{activity.time}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            {/* Featured Events */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Featured Events</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Events')}>
                        <Text style={styles.seeAllText}>See All</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity style={styles.featuredEventCard}>
                        <View style={styles.eventImagePlaceholder}>
                            <Ionicons name="calendar" size={32} color={colors.secondary} />
                        </View>
                        <View style={styles.eventContent}>
                            <Text style={styles.eventTitle}>Web Development Bootcamp</Text>
                            <Text style={styles.eventOrganization}>Tech Academy</Text>
                            <Text style={styles.eventDate}>Dec 15, 2024</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.featuredEventCard}>
                        <View style={styles.eventImagePlaceholder}>
                            <Ionicons name="calendar" size={32} color={colors.secondary} />
                        </View>
                        <View style={styles.eventContent}>
                            <Text style={styles.eventTitle}>Data Science Workshop</Text>
                            <Text style={styles.eventOrganization}>Data Institute</Text>
                            <Text style={styles.eventDate}>Dec 20, 2024</Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.lg,
        paddingTop: spacing.xl,
    },
    headerContent: {
        flex: 1,
    },
    greeting: {
        fontSize: 16,
        color: colors.onSurfaceVariant,
        fontFamily: 'Poppins-Regular',
    },
    userName: {
        fontSize: 24,
        fontWeight: '600',
        color: colors.onSurface,
        fontFamily: 'Poppins-SemiBold',
    },
    notificationButton: {
        padding: spacing.sm,
    },
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.xl,
    },
    statCard: {
        flex: 1,
        backgroundColor: colors.card,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        marginHorizontal: spacing.xs,
        ...shadows.sm,
    },
    statIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.secondary + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.onSurface,
        fontFamily: 'Poppins-Bold',
    },
    statLabel: {
        fontSize: 12,
        color: colors.onSurfaceVariant,
        fontFamily: 'Poppins-Regular',
    },
    section: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.onSurface,
        fontFamily: 'Poppins-SemiBold',
    },
    seeAllText: {
        fontSize: 14,
        color: colors.secondary,
        fontFamily: 'Poppins-Medium',
    },
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    quickActionCard: {
        width: (width - spacing.lg * 3) / 2,
        backgroundColor: colors.card,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.md,
        alignItems: 'center',
        ...shadows.sm,
    },
    quickActionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.secondary + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    quickActionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.onSurface,
        fontFamily: 'Poppins-SemiBold',
        textAlign: 'center',
        marginBottom: spacing.xs,
    },
    quickActionDescription: {
        fontSize: 12,
        color: colors.onSurfaceVariant,
        fontFamily: 'Poppins-Regular',
        textAlign: 'center',
    },
    activitiesList: {
        gap: spacing.md,
    },
    activityCard: {
        flexDirection: 'row',
        backgroundColor: colors.card,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        ...shadows.sm,
    },
    activityIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.success + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    activityContent: {
        flex: 1,
    },
    activityTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.onSurface,
        fontFamily: 'Poppins-SemiBold',
        marginBottom: spacing.xs,
    },
    activityDescription: {
        fontSize: 12,
        color: colors.onSurfaceVariant,
        fontFamily: 'Poppins-Regular',
        marginBottom: spacing.xs,
    },
    activityTime: {
        fontSize: 11,
        color: colors.onSurfaceVariant,
        fontFamily: 'Poppins-Regular',
    },
    featuredEventCard: {
        width: 200,
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        marginRight: spacing.md,
        overflow: 'hidden',
        ...shadows.sm,
    },
    eventImagePlaceholder: {
        height: 120,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    eventContent: {
        padding: spacing.md,
    },
    eventTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.onSurface,
        fontFamily: 'Poppins-SemiBold',
        marginBottom: spacing.xs,
    },
    eventOrganization: {
        fontSize: 12,
        color: colors.secondary,
        fontFamily: 'Poppins-Medium',
        marginBottom: spacing.xs,
    },
    eventDate: {
        fontSize: 11,
        color: colors.onSurfaceVariant,
        fontFamily: 'Poppins-Regular',
    },
});

export default UserHomeScreen; 