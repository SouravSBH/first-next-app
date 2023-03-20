import { useRouter } from 'next/router'
import React from 'react'



export async function getStaticProps(context) {
    console.log(context)


    let data = {}
    try {
        const response = await fetch("https://rickandmortyapi.com/api/character/" + context.params.id);
        // Use await to wait for the json promise to resolve
        data = await response.json();
        // console.log(data)
    }
    catch (e) {
        // console.log(e)
        return {
            notFound: true,
        }
    }



    return {
        props: {
            id: context.params.id,
            data: data
        }
    }
}

export async function getStaticPaths() {

    return {
        paths: [
            { params: { id: "1" } },
            { params: { id: "2" } },
            { params: { id: "3" } },

        ],
        fallback: "blocking"
    }
}

export default function Character(props) {
    const router = useRouter()

    console.log(props)

    return (
        <div>{
            JSON.stringify(props.data)
        }

        </div>
    )
}
