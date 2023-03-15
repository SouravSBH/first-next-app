import { useRouter } from 'next/router'
import React from 'react'



export default function Character(props) {
    const router = useRouter()

    console.log(props)

    return (
        <div>Character:{router.query.id}

        </div>
    )
}
