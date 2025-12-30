import React from "react";

const SkeletonAuctionCard = () => {
    return (
        <div className="flex-grow basis-full sm:basis-56 lg:basis-60 2xl:basis-80">
            <div className="block bg-white rounded-2xl overflow-hidden shadow-sm border border-zinc-100 h-full flex flex-col animate-pulse">
                {/* Image Skeleton */}
                <div className="aspect-[4/3] bg-zinc-200 relative">
                    <div className="absolute top-3 right-3 h-6 w-20 bg-zinc-300 rounded-full"></div>
                </div>

                {/* Content Skeleton */}
                <div className="p-5 flex flex-col flex-grow space-y-4">
                    {/* Title Line */}
                    <div className="h-6 bg-zinc-200 rounded w-3/4"></div>

                    {/* Bottom Row */}
                    <div className="mt-auto pt-4 border-t border-zinc-100 flex items-center justify-between">
                        <div className="space-y-2 w-1/2">
                            <div className="h-3 bg-zinc-200 rounded w-1/2"></div>
                            <div className="h-5 bg-zinc-300 rounded w-3/4"></div>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-zinc-200"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonAuctionCard;
