import React from 'react'
import { ClipLoader } from 'react-spinners'

function Loader() {
    return (
        <div className="flex justify-center items-center w-full h-[450px]">
            <div className="flex flex-col items-center gap-1">
                <ClipLoader
                    color="#ef4444"
                    loading={true}
                    size={65}
                    aria-label="Loading Spinner"
                />
            </div>
        </div>
    )
}

export default Loader