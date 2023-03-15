import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
export default function Blog() {
    const router = useRouter()

    return (
        <>
            <style jsx>
                {`
                button{
                   background-color: red;
                   color: white;
                   padding: 1rem 2rem;
                   margin:1rem;
                }

                `}
            </style>
            <Link href={"/"} replace>Home</Link>
            <div>{router.asPath}</div>
            <button onClick={() => {
                // router.back()
                router.push("/blogs")
                router.replace("/")
            }}>Test Router</button>
        </>
    )
}
