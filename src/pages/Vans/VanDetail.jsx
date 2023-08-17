import React from "react"
import {Link, useParams, useLocation, useLoaderData, Form, redirect, useActionData} from "react-router-dom"
import {getVan, createReview} from "../../../api";
import StarRatings from "react-star-ratings";

// TODO: Add button which leads to Add review form

export function loader({params}) {
    return getVan(params.id)
}

export const action = AuthContext => async ({ request, params }) => {
    const { currentUser } = AuthContext;
    if (!currentUser) {
        return 'You must login first to make a review'
    }
    const {id: vanId } = params;

    const formData = await request.formData();
    const rating = +formData.get('rating'),
    review = formData.get('review');
    console.log(rating, review);
    try {
        await createReview(currentUser.uid, vanId, rating, review);
        return redirect('/vans');
    } catch (err) {
        return err.message;
    }
}

export default function VanDetail() {
    const location = useLocation();
    const van = useLoaderData();
    const error = useActionData();

    const search = location.state?.search || "";
    const type = location.state?.type || "all";

    const [rating, setRating] = React.useState(0);

    function handleRatingChange(newRating) {
        setRating(newRating);
        document.getElementById('rating').value = newRating;
    }

    return (
        <div className="van-detail-container">
            <Link
                to={`..${search}`}
                relative="path"
                className="back-button"
            >&larr; <span>Back to {type} vans</span></Link>

            <div className="van-detail">
                <img src={van.imageUrl}/>
                <i className={`van-type ${van.type} selected`}>
                    {van.type}
                </i>
                <h2>{van.name}</h2>
                <p className="van-price"><span>${van.price}</span>/day</p>
                <p>{van.description}</p>
                <div className="flex justify-between w-full gap-4">
                    <button className="link-button  grow">Rent this van</button>
                    <button className="link-button grow bg-blue-400">
                        <Link to="add_comment">Add review of this van</Link>
                    </button>
                </div>

                <h2 className="text-center my-4 underline">Add review of this van</h2>
                <Form className="w-full flex justify-around" method="POST">
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

                        <button className="link-button mt-4">
                            Send review
                        </button>

                        { error &&
                            <h2 className="w-full bg-red-300 py-1 my-2 text-center rounded">{error}</h2>
                        }
                    </div>

                    <input type="number" min="0" max="5" required
                           id="rating" name="rating" className="hidden"/>

                    <div className="">
                        <h3 className="font-bold text-center mb-4">Write some words about this van</h3>

                        <textarea name="review" id="review" cols="40" rows="10"
                                  placeholder="Your review" className="rounded-md p-2" ></textarea>

                    </div>


                </Form>

            </div>

        </div>
    )
}