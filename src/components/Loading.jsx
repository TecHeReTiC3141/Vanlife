import React from 'react';

function Loading(props) {
    return (
        <div className="w-full flex flex-col items-center">
            <h2 className="text-2xl font-bold">Loading {props.text}...</h2>
            <i className="fa-solid fa-hurricane fa-spin text-6xl"></i>
        </div>
    );
}

export default Loading;