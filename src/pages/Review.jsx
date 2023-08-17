import React from 'react';
import {BsStarFill} from "react-icons/bs";

export default function Review({ review }) {
    return (
        <div key={review.id}>
            <div className="review">
                {[...Array(review.rating)].map((_, i) => (
                    <BsStarFill className="review-star inline" key={i} />
                ))}
                <div className="info">
                    <p className="name">{review.name}</p>
                    <p className="date">{review.date}</p>
                </div>
                <p>{review.text}</p>
            </div>
            <hr />
        </div>
    )
}