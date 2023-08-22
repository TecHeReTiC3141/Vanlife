import React, {Suspense} from "react"
import {
    Link, useParams, useLocation, useLoaderData,
    Form, redirect, useActionData, defer, Await
} from "react-router-dom"
import {getVan, createReview, getVanReviews, tryCatchDecorator} from "../../../api";
import StarRatings from "react-star-ratings";
import Loading from '../../components/Loading'
import Review from "../Review";
import {useAuth} from "../../contexts/AuthContext";

// TODO: Add button which leads to Add review form

export async function loader({params}) {
    const vanPromise = tryCatchDecorator(getVan)(params.id),
        reviewsPromise = tryCatchDecorator(getVanReviews)(params.id);

    return defer({vanPromise, reviewsPromise});
}

export const action = AuthContext => async ({request, params}) => {
    const {currentUser} = AuthContext;
    if (!currentUser) {
        return 'You must login first to make a review'
    }
    const hostOwnerId = document.querySelector('.van-detail-container').dataset.owner;
    if (hostOwnerId === currentUser.uid) {
        return "You can't make review of your own van!";
    }
    const {id: vanId} = params;

    const formData = await request.formData();
    const rating = +formData.get('rating'),
        review = formData.get('review');
    console.log(rating, review);
    try {
        await createReview(currentUser.uid, vanId, rating, review);
        const addReview = document.querySelector('.add-review');
        addReview.classList.toggle('h-0');
        addReview.classList.toggle('h-auto');
        return redirect('');
    } catch (err) {
        return err.message;
    }
}

export default function VanDetail() {
    const location = useLocation();
    const {vanPromise, reviewsPromise} = useLoaderData();
    const error = useActionData();

    const search = location.state?.search || "";
    const type = location.state?.type || "all";

    const [rating, setRating] = React.useState(0);

    const { currentUser } = useAuth();

    function handleRatingChange(newRating) {
        setRating(newRating);
        document.getElementById('rating').value = newRating;
    }

    function handleAddReviewToggle() {
        const loginMessage = document.querySelector('.login-message');
        loginMessage.classList.add('hidden');
        if (!currentUser) {
            loginMessage.classList.remove('hidden');
            return;
        }
        const addReview = document.querySelector('.add-review');
        addReview.classList.toggle('h-0');
        addReview.classList.toggle('h-auto');
    }

    function renderVanInfo(vansData) {
        if (vansData.success) {
            const {data: van} = vansData;
            return (
                <>
                    <div className="van-detail-container" data-owner={van.hostId}>
                        <div className="van-detail">
                            <img src={van.imageUrl}/>
                            <i className={`van-type ${van.type} selected`}>
                                {van.type}
                            </i>
                            <h2>{van.name}</h2>
                            <p className="van-price"><span>${van.price}</span>/day</p>
                            <p>{van.description}</p>
                            <div className="flex justify-between w-full gap-4">
                                <button className="link-button grow">Rent this van</button>
                                <button className="link-button grow bg-blue-400 relative"
                                        onClick={handleAddReviewToggle}>
                                    Add review of this van
                                    <Link to="/login" className="login-message absolute bottom-[100%] left-[50%]
                                    -translate-x-[50%] text-red-600 text-sm underline hidden">Log in first to add review</Link>
                                </button>
                            </div>
                        </div>
                        <div
                            className="add-review transition-all duration-500 overflow-y-hidden h-0">
                            <Form className="w-full flex justify-around my-4 border border-orange-400 rounded-md p-2 shadow"
                                  method="POST">
                                <div className="">
                                    <h3 className="font-bold">How would you rate quality of this van? (Required)</h3>
                                    <StarRatings
                                        rating={rating}
                                        starRatedColor="orange"
                                        changeRating={handleRatingChange}
                                        numberOfStars={5}
                                        name='rating'
                                        className="block"
                                    />

                                    <button className="link-button bg-orange-400 rounded-md
                                    text-gray-100 mt-4">
                                        Send review
                                    </button>

                                    {error &&
                                        <h2 className="w-full bg-red-300 py-1 my-2 text-center rounded">{error}</h2>
                                    }
                                </div>

                                <input type="number" min="0" max="5" required
                                       id="rating" name="rating" className="hidden"/>

                                <div className="">
                                    <h3 className="font-bold text-center mb-4">Write some words about this van</h3>

                                    <textarea name="review" id="review" cols="40" rows="10"
                                              placeholder="Your review" className="rounded-md p-2"></textarea>

                                </div>
                            </Form>
                        </div>
                    </div>
                </>
            );
        }
        const { message } = vansData;
        return (
            <h2>Error while loading van: {message}</h2>
        )
    }

    function renderReviews(reviewsData) {
        if (reviewsData.success) {
            const {data: reviews } = reviewsData;
            console.log(reviews);
            if (!reviews.length) {
                return <h3 className="text-2xl mt-4 ml-4">No reviews here. Write the first!</h3>
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
        <>
            <Link
                to={`..${search}`}
                relative="path"
                className="back-button"
            >&larr; <span>Back to {type} vans</span></Link>

            <Suspense fallback={<Loading text="this van" />}>
                <Await resolve={vanPromise}>
                    {renderVanInfo}
                </Await>
            </Suspense>

            <Suspense fallback={<Loading text="reviews" />}>
                <Await resolve={reviewsPromise}>
                    {renderReviews}
                </Await>
            </Suspense>
        </>
    )
}