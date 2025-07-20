import { useSelector } from 'react-redux';
import { selectSchoolProfile } from '../features/school/schoolSelector';

export const useSchoolAuth = () => {
    const profile = useSelector(selectSchoolProfile);

    const isAuthenticated = !!profile;
    const isVerified = profile?.verification_status === 'verified';
    const isPending = profile?.verification_status === 'pending';
    const isRejected = profile?.verification_status === 'rejected';

    const canCreateEvents = isAuthenticated && (isVerified || isPending);
    const canPublishEvents = isAuthenticated && isVerified;
    const canManageVerifications = isAuthenticated && isVerified;

    return {
        profile,
        isAuthenticated,
        isVerified,
        isPending,
        isRejected,
        canCreateEvents,
        canPublishEvents,
        canManageVerifications,
    };
}; 