import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserWonItems } from "@/store/slices/bidSlice";
import Card from "@/custom-components/Card";
import Spinner from "@/custom-components/Spinner";
import { useNavigate } from "react-router-dom";

const PurchasedItems = () => {
    const { wonItems, loading } = useSelector((state) => state.bid);
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigateTo = useNavigate();

    useEffect(() => {
        if (!isAuthenticated || user.role !== "Bidder") {
            navigateTo("/");
        }
        dispatch(getUserWonItems());
    }, [dispatch, isAuthenticated, user.role, navigateTo]);

    return (
        <section className="w-full ml-0 m-0 min-h-screen px-5 pt-20 lg:pl-[320px] flex flex-col gap-10">
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold mb-10">Purchased Items</h1>
                {loading ? (
                    <Spinner />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {wonItems && wonItems.length > 0 ? (
                            wonItems.map((element) => (
                                <Card
                                    key={element._id}
                                    title={element.title}
                                    imgSrc={element.image?.url}
                                    startingBid={element.startingBid}
                                    startTime={element.startTime}
                                    endTime={element.endTime}
                                    id={element._id}
                                />
                            ))
                        ) : (
                            <h3 className="text-zinc-500 font-medium">You haven't purchased any items yet.</h3>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default PurchasedItems;
