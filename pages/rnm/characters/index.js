import React, { useEffect, useState } from 'react'
import Link from 'next/link';

import Image from 'next/image';
export async function getStaticProps(context) {
    // console.log(context)
    let data = {}
    try {
        const response = await fetch("https://rickandmortyapi.com/api/character");
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

    // let tmpdata = data;
    // while (tmpdata.info.next) {

    //     const res = await fetch(tmpdata.info.next);
    //     tmpdata = await res.json();
    //     data.results = [ ...data.results, ...tmpdata.results ]
    //     console.log(data.result)
    // }





    return {
        props: {

            data: data

        }
    }

}

function Card(props) {
    // Destructure the props object
    const { name, status, species, type, gender, image, id } = props.result;
    const { index, length } = props;

    const delay = ((index - length) * 200) < 0 ? 0 : ((index - length) * 200);
    // Return JSX to render the card component
    return (
        <Link href={`/rnm/characters/${id}`}>
            <div className="card">
                <img src={image} alt={name}
                // onerror="this.onerror=null; this.src='https://images.pexels.com/photos/159868/lost-cat-tree-sign-fun-159868.jpeg'"
                />
                {name != null && name != "" && <h2>{name}</h2>}
                <hr />
                {status != null && status != "" && <p>Status: {status}</p>}
                {species != null && species != "" && <p>Species: {species}</p>}
                {type != null && type != "" && <p>Type: {type}</p>}
                {gender != null && gender != "" && <p>Gender: {gender}</p>}
                {/* <h2>{name}</h2>
                <hr />
                <p>Status: {status}</p>
                <p>Species: {species}</p>
                {type && <p>Type: {type}</p>}
                <p>Gender: {gender}</p> */}
                {/* Add styled jsx styles */}
                <style jsx>{`
            
            
            hr{
                width: 100%;
                /* color: #ffffff24; */
                height: 1px;
                background-color: #ffffff3d;
                border: none;
                margin-block:.5rem ;
            }
              .card {
                text-align: center;
                color: white;
                display: flex;
                flex-direction: column;
            
                background-color: white;
                border-radius: 16px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                padding: 20px;
                {/* max-width: 300px; */}
               min-width:12%;
                background: linear-gradient(180deg, #00ff95a4 0%, #000066a2 100%);
                backdrop-filter: blur(23px);
                border: 1px solid white;
                transition: transform 200ms ease;
                animation:show 200ms ease forwards;
                opacity:0;
                {/* transform:scale(0); */}
                animation-delay: ${delay}ms;
              }
              @keyframes show{
                0%{
            
                    opacity:0;
                }
                100%{
                     opacity:1;
                }
              }
            
              .card:hover{
                transform: scale(1.1) !important;
                z-index: 100;
              }
              img {
                width: 250px;
                height: auto;
                border-radius: 50%;
                margin: auto;
              }
              h2 {
                margin-top: 10px;
              }
              p {
                margin-bottom: 5px;
                text-align: left;
              }
              @media  (max-width: 520px) {
            .card{
                width: 100%;
            }
            }
            `}</style>
            </div>
        </Link>
    );
}





export default function Characters(props) {
    // console.log(props)

    const [ results, setResults ] = useState(props.data.results)
    const [ next, setNext ] = useState(props.data.info.next);
    const [ loading, setLoading ] = useState("Load More....")
    const [ prevLength, setPrevLength ] = useState(0)

    // const handleScroll = (e) => {
    //     const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    //     if (bottom) {
    //         console.log("bottom")
    //     }
    // }

    // useEffect(() => {

    //     window.body = event => {
    //         console.log(event)
    //     }


    //     return () => {

    //     }
    // }, [])


    return (

        <>
            <h1>All rick and morty characters</h1>


            <div className='wrapper'
            // onScroll={handleScroll}
            >
                {results.map((result, index) => {
                    return <Card key={index} index={index} length={prevLength} result={result} />;
                })}
            </div>

            <button className='loadmore'
                onClick={async () => {
                    setLoading("Loading......")
                    if (next) {

                        try {
                            const res = await fetch(next);
                            const newData = await res.json();
                            setNext(newData.info.next);
                            setPrevLength(results.length)
                            setResults(state => [ ...state, ...newData.results ])

                            setLoading("Load More")
                        }
                        catch (e) {
                            console.log(e)
                            setLoading("Error Occured. Try again")
                        }

                    }
                    else {
                        setLoading("There are no more characters")
                    }
                }}
            >
                <h1>{loading}</h1>
            </button>

            <style jsx>{`
                    .loadmore{
                        color: white;
                        background-image: linear-gradient(to top, #000,#00000000);

                        margin: auto;
                      
                        padding-block: 1rem;
                    
                        width: 100%;
                            background-color: transparent;
                            border:none;
                    }
                    .loadmore>h1{
                        background-image: none;
                    }
                    .wrapper{
                        display: flex;
                        flex-wrap: wrap;
                        row-gap: 1rem;
                        column-gap: .5rem;
                    
                        align-content: flex-start;
                        transition: all 200ms ease;
                        margin: 2rem 1rem;
                       
                        
                    }
                    h1{
                        background-image: linear-gradient(to bottom, #000,#00000000);
                        {/* background-color: rgba(0, 0, 0, 0.466); */}
                        
                        padding-block: 2rem;
                        margin-bottom:25vh;

                        text-align:center;
                        {/* backdrop-filter: blur(2px); */}

                    
                    
                    }
                    `}
            </style>
        </>
    )
}
