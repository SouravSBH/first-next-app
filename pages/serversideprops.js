import React from 'react'

export default function Serversideprops(props) {
    console.log(props);
    // console.log(props.req);
    return (
        <div>Serversideprops</div>
    )
}


export async function getServerSideProps(context) {

    const { params, req, res } = context;
    console.log(req)
    console.log(res)


    return {
        props: {
            data: "hola",
            req: "req",
            res: "res",
        }
    }

}
