import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserProfileAPI } from '../api/userApi';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'sonner';

const handleApiError = (error, customMessage = "An unexpected error occurred.") => {
    if (error.response) {
        toast.error(error.response.data.message || customMessage);
    } else {
        toast.error("A network error occurred. Please check your connection.");
    }
};

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
            handleApiError(error, 'Failed to update profile. Please try again.');
        },
    });

    return { updateProfile: mutate, isUpdating: isPending };
};