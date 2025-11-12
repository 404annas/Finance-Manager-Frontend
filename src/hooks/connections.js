import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

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

export const acceptConnectionRequest = async (requestId) => {
    const apiClient = getApiClient();
    const { data } = await apiClient.post(`/api/connection-requests/${requestId}/accept`);
    return data;
};

export const useConnectionRequests = () => {
    const queryClient = useQueryClient();

    const { data: pendingRequests = [], isLoading } = useQuery({
        queryKey: ["pendingRequests"],
        queryFn: fetchPendingRequests,
    });

    const { mutate: acceptRequest, isPending: isAccepting } = useMutation({
        mutationFn: acceptConnectionRequest,
        onSuccess: () => {
            toast.success("Connection successful!");
            queryClient.invalidateQueries({ queryKey: ["pendingRequests"] });
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to accept request.");
        },
    });

    return {
        pendingRequests,
        isLoading,
        acceptRequest,
        isAccepting,
    };
};