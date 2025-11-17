import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

const handleApiError = (error, customMessage = "An unexpected error occurred.") => {
    if (error.response) {
        toast.error(error.response.data.message || customMessage);
    } else {
        toast.error("A network error occurred. Please check your connection.");
    }
};

const getApiClient = () => {
    const token = localStorage.getItem("token");
    return axios.create({
        baseURL: API_URL,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
};

export const fetchPendingRequests = async () => {
    const apiClient = getApiClient();
    const { data } = await apiClient.get("/api/connection-requests");
    return data || [];
};

export const fetchSentRequests = async ({ pageParam = 1 }) => {
    const apiClient = getApiClient();
    const { data } = await apiClient.get(`/api/connection-requests/sent`);
    return data.requests || [];
};

export const acceptConnectionRequest = async (requestId) => {
    const apiClient = getApiClient();
    const { data } = await apiClient.post(`/api/connection-requests/accept`);
    return data;
};

export const resendConnectionEmail = async (email) => {
    const apiClient = getApiClient();
    const { data } = await apiClient.post(`/api/connection-requests/resend`, { email });
    return data;
};

export const useConnectionRequests = () => {
    const queryClient = useQueryClient();

    const { data: pendingRequests = [], isLoading: isLoadingPending } = useQuery({
        queryKey: ["pendingRequests"],
        queryFn: fetchPendingRequests,
        placeholderData: (previousData) => previousData,
        onError: (error) => handleApiError(error, "Failed to fetch pending requests."),
    });

    const { data: sentRequests = [], isLoading: isLoadingSent } = useQuery({
        queryKey: ["sentRequests"],
        queryFn: fetchSentRequests,
        placeholderData: (previousData) => previousData,
        onError: (error) => handleApiError(error, "Failed to fetch sent requests."),
    })

    const { mutate: acceptRequest, isPending: isAccepting } = useMutation({
        mutationFn: acceptConnectionRequest,
        onSuccess: () => {
            toast.success("Connection successful!");
            queryClient.invalidateQueries({ queryKey: ["pendingRequests"] });
            queryClient.invalidateQueries({ queryKey: ["sentRequests"] });
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error) => handleApiError(error, "Failed to accept request."),
    });

    return {
        pendingRequests,
        sentRequests,
        isLoading: isLoadingPending || isLoadingSent,
        acceptRequest,
        isAccepting,
    };
};