import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserProfileAPI } from '../api/userApi';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'sonner';

export const useUpdateProfile = ({ onSuccess }) => {
    const queryClient = useQueryClient();
    const { setUser } = useAppContext();

    const { mutate, isPending } = useMutation({
        mutationFn: updateUserProfileAPI,
        onSuccess: (data) => {
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
            queryClient.invalidateQueries(['user']);
            if (onSuccess) onSuccess();
            toast.success('Profile updated successfully!');
        },
        onError: (error) => {
            console.error('Profile update failed', error);
            toast.error('Failed to update profile. Please try again.');
        },
    });

    return { updateProfile: mutate, isUpdating: isPending };
};