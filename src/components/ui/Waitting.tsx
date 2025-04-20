import React from 'react'

const Waitting = () => {
    return (
        <>
            <div className="fixed inset-0 z-50 bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
            </div>
        </>
    )
}

export default Waitting