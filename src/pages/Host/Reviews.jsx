import React, { Suspense } from "react"
import { BsStarFill } from "react-icons/bs"
import Review from '../Review';
import { getHostReviews, tryCatchDecorator } from "../../../api";
import { defer, useLoaderData, Await } from "react-router-dom";
import Loading from "../../components/Loading";
import { requireAuth } from "../../../utils";


export const loader = authContext => async ({ request }) => {
    const user = await requireAuth(authContext, request);
    return defer({ reviewsPromise: tryCatchDecorator(getHostReviews)(user.uid) });
} 
// TODO implement getting statistics about reviews (mean rating)

export default function Reviews() {

    const { reviewsPromise } = useLoaderData();

    function renderReviews(reviewsData) {
        console.log(reviewsData);
        if (reviewsData.success) {
            const {data: reviews } = reviewsData;
            console.log(reviews);
            if (!reviews.length) {
                return <h3 className="text-2xl mt-4 ml-4">No latest reviews yet</h3>
            }
            return (
                <div className="reviews">
                    <h3 className="text-2xl mt-4 ml-2">Reviews: </h3>
                    {
                        reviews.map(rev => (
                            <Review review={rev}/>
                        ))
                    }
                </div>
            )
        }

        const { message } = reviewsData;
        return (
            <h2>Error while loading reviews: {message}</h2>
        )

    }

    return (
        <section className="host-reviews">
            <div className="top-text">
                <h2>Your reviews</h2>
                <p>
                    Last <span>30 days</span>
                </p>
            </div>
            <img
                className="graph"
                src="/src/assets/images/reviews-graph.png"
                alt="Review graph"
            />

            <Suspense fallback={<Loading text="your reviews" />}>
                <Await resolve={reviewsPromise}>
                    {renderReviews}
                </Await>

            </Suspense>
        </section>
    )
}
