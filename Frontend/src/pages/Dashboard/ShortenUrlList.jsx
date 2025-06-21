import React from 'react'
import ShortenItem from './ShortenItem'

const ShortenUrlList = ({ data }) => {
    return (
        <div className='space-y-6'>
            <div className="grid gap-6">
                {data.map((item, index) => (
                    <ShortenItem
                        key={item.id}
                        {...item}
                        index={index}
                    />
                ))}
            </div>
        </div>
    )
}

export default ShortenUrlList