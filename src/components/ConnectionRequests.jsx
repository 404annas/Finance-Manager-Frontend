import { useConnectionRequests } from "../hooks/connections";
import { Check, UserRoundPlus } from "lucide-react";

const ConnectionRequests = () => {
    const { pendingRequests, isLoading, acceptRequest, isAccepting } = useConnectionRequests();

    if (isLoading) {
        return (
            <div className="animate-pulse bg-purple-50 p-4 rounded-lg">
                <div className="h-4 bg-purple-200 rounded w-1/3 mb-3"></div>
                <div className="h-12 bg-purple-200 rounded"></div>
            </div>
        );
    }

    if (pendingRequests.length === 0) {
        return null;
    }

    return (
        <div className="mb-8 p-4 bg-purple-50 border border-purple-200 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <UserRoundPlus size={22} className="text-purple-600" />
                <h3 className="text-lg p-semibold text-purple-800">Connection Requests</h3>
                <span className="flex items-center justify-center w-6 h-6 bg-purple-600 text-white text-xs font-bold rounded-full">
                    {pendingRequests.length}
                </span>
            </div>

            <div className="space-y-3">
                {pendingRequests.map((req) => (
                    <div
                        key={req._id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-[#F6F9FC] rounded-lg shadow-sm"
                    >
                        <div className="flex items-center gap-3">
                            <img
                                src={req.requester.profileImage || "https://images.unsplash.com/photo-1615109398623-88346a601842?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500"}
                                alt={req.requester.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                                <p className="p-medium text-gray-800">{req.requester.name}</p>
                                <p className="text-xs text-gray-500">{req.requester.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => acceptRequest(req._id)}
                            disabled={isAccepting}
                            className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 p-medium disabled:bg-green-300 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <Check size={16} />
                            {isAccepting ? "Accepting..." : "Accept"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ConnectionRequests;