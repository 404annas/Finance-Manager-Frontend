import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) return {};
    return {
        Authorization: `Bearer ${token}`,
    };
};

// Combined fetch function
const fetchAllRecipients = async ({ pageParam = 1 }) => {
    const limit = 10;
    const usersPromise = axios.get(`${API_URL}/api/users?page=${pageParam}&limit=${limit}`, { headers: getAuthHeaders() });
    const sentPromise = axios.get(`${API_URL}/api/connection-requests/sent?page=${pageParam}&limit=${limit}`, { headers: getAuthHeaders() });
    const invitesPromise = axios.get(`${API_URL}/api/invites/pending?page=${pageParam}&limit=${limit}`, { headers: getAuthHeaders() });

    const [usersRes, sentRes, invitesRes] = await Promise.all([usersPromise, sentRes, invitesRes]);

    // Combine data
    const userMap = new Map();

    // Connected users
    usersRes.data.users.invitedUsers.forEach(user => {
        userMap.set(user._id, { ...user, connectionStatus: 'Connected' });
    });
    if (usersRes.data.users.invitedBy) {
        const inviter = usersRes.data.users.invitedBy;
        userMap.set(inviter._id, { ...inviter, connectionStatus: 'Connected' });
    }

    // Pending connections
    sentRes.data.requests.forEach(req => {
        if (req.recipient && !userMap.has(req.recipient._id)) {
            userMap.set(req.recipient._id, { ...req.recipient, connectionStatus: 'Pending' });
        }
    });

    // Pending invites
    invitesRes.data.invites.forEach(invite => {
        if (!userMap.has(invite.email)) {
            userMap.set(invite.email, invite);
        }
    });

    // Determine the next page
    const hasMoreUsers = usersRes.data.pagination.currentPage < usersRes.data.pagination.totalPages;
    const hasMoreSent = sentRes.data.pagination.currentPage < sentRes.data.pagination.totalPages;
    const hasMoreInvites = invitesRes.data.pagination.currentPage < invitesRes.data.pagination.totalPages;

    return {
        recipients: Array.from(userMap.values()),
        nextPage: (hasMoreUsers || hasMoreSent || hasMoreInvites) ? pageParam + 1 : undefined,
    };
};

export const useRecipients = () => {
    return useInfiniteQuery({
        queryKey: ['recipients'],
        queryFn: fetchAllRecipients,
        getNextPageParam: (lastPage) => lastPage.nextPage,
    });
};