const TableSkeleton = () => {
    const rows = Array.from({ length: 8 });

    return (
        <div className="w-full overflow-hidden">
            <div className="animate-pulse">
                {/* Table Header Skeleton */}
                <div className="grid grid-cols-4 gap-3 py-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-10 bg-gray-300"></div>
                    ))}
                </div>

                {/* Table Rows Skeleton */}
                {rows.map((_, idx) => (
                    <div
                        key={idx}
                        className="grid grid-cols-4 my-2 shadow-b-sm border-b border-gray-100"
                    >
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-8 bg-gray-200"
                            ></div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TableSkeleton;
