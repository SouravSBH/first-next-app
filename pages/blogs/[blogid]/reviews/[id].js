import { useRouter } from 'next/router'
import React from 'react'

export default function Review() {
    const router = useRouter()
    const { blogid, id } = router.query;
    console.dir(router)

    return (
        <div>Review

            <p>{blogid}, {id}</p>
        </div>

    )
}
