import React from 'react';
import {BsStarFill} from "react-icons/bs";

import {getCurrentUser} from "../../api";
import { Link } from 'react-router-dom';

export default function Review({ review }) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    console.log(review);
    const date = new Date(review.publishTime.seconds * 1000);
    const dateString = `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    return (
        <>
            <div key={review.id} className="my-4 mx-2 bg-gray-100 p-2 rounded-md">
                <div className="">
                    <div className="flex gap-2 items-center">
                        {[...Array(review.stars)].map((_, i) => (
                            <BsStarFill className="text-[#ff8c38]" key={i} />
                        ))}
                        {[...Array(5 - review.stars)].map((_, i) => (
                            <BsStarFill className="text-gray-300" key={i} />
                        ))}
                        {review.vanName && <h4 class="underline">about <Link to={`../vans/${review.vanId}`}>{review.vanName}</Link></h4>}
                    </div>

                    <div className="flex gap-2 my-2">
                        <p className="font-bold">{review.userName},</p>
                        <p className="date">{dateString}</p>
                    </div>
                    <p>{review.text}</p>
                </div>

            </div>
            <hr className="bg-orange-500 h-1 w-full rounded"/>
        </>

    )
}