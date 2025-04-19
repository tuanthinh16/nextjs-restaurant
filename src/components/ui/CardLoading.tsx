import React from 'react'

const CardLoading = () => {
    return (
        <div className="flex gap-4 p-4 flex-wrap">
            {[...Array(3)].map((_, index) => (
                <div
                    key={index}
                    className="animate-pulse bg-white rounded-lg shadow p-4 space-y-4 w-full max-w-sm w-[350px]"
                >
                    <div className="h-40 bg-gray-300 rounded"></div>
                    <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                </div>
            ))}
        </div>
    )
}

export default CardLoading
