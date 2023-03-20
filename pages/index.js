import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link';

import Image from 'next/image';
export async function getStaticProps(context) {
  // console.log(context)
  let data = {}
  try {
    const response = await fetch("https://rickandmortyapi.com/api/character");
    // Use await to wait for the json promise to resolve
    data = await response.json();
    let episodes;
    for (let i = 0; i < data.results.length; i++) {
      // console.log("start");
      const res = await fetch(data.results[ i ].episode[ 0 ])
      episodes = await res.json();
      data.results[ i ].episodeStr = episodes.episode;
      // console.log("end")

    }


    // console.log(data)
  }
  catch (e) {
    console.log(e)
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

function useOnScreen(ref, rootMargin = "0px") {
  // State and setter for storing whether element is visible
  const [ isIntersecting, setIntersecting ] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([ entry ]) => {
        // Update our state when observer callback fires
        setIntersecting(entry.isIntersecting);
      },
      {
        rootMargin,
      }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      observer.unobserve(ref.current);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount
  return isIntersecting;
}

function Card(props) {
  // Destructure the props object
  const { name, status, species, type, gender, image, id, episodeStr } = props.result;
  const { index, length } = props;

  const delay = ((index - length) * 200) < 0 ? 0 : ((index - length) * 200);
  // Return JSX to render the card component
  return (
    <div className="card">
      <Link href={`/rnm/characters/${id}`}>
        <img src={image} alt={name}
        // onerror="this.onerror=null; this.src='https://images.pexels.com/photos/159868/lost-cat-tree-sign-fun-159868.jpeg'"
        />
        {name != null && name != "" && <h2>{name}</h2>}
        <hr />
        {status != null && status != "" && <p>Status: {status}</p>}
        {species != null && species != "" && <p>Species: {species}</p>}
        {type != null && type != "" && <p>Type: {type}</p>}
        {gender != null && gender != "" && <p>Gender: {gender}</p>}
        {episodeStr != null && gender != "" && <p>Episode:{episodeStr}</p>}
        {/* <h2>{name}</h2>
                <hr />
                <p>Status: {status}</p>
                <p>Species: {species}</p>
                {type && <p>Type: {type}</p>}
                <p>Gender: {gender}</p> */}
        {/* Add styled jsx styles */}
      </Link>
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
               height:100%;
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
          @media  (max-width: 630px) {
            .card{
                width: 100%;
            }
            img {
                width: 100%;
                height: auto;
                border-radius: 5%;
                margin: auto;
              }
     
            }
            `}</style>
    </div>
  );
}





export default function Characters(props) {
  // console.log(props)

  const [ results, setResults ] = useState(props.data.results)
  const [ next, setNext ] = useState(props.data.info.next);
  const [ loading, setLoading ] = useState("Load More....")
  const [ prevLength, setPrevLength ] = useState(0)
  const ref = useRef(null);



  const onScreen = useOnScreen(ref)

  useEffect(() => {
    if (onScreen) {
      async function load() {
        setLoading("Loading")
        if (next) {

          try {
            const res = await fetch(next);
            const newData = await res.json();
            let episodes;
            for (let i = 0; i < newData.results.length; i++) {
              // console.log("start");
              const res = await fetch(newData.results[ i ].episode[ 0 ])
              episodes = await res.json();
              newData.results[ i ].episodeStr = episodes.episode;
              // console.log("end")

            }
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
      }
      load()
    }

    return () => {

    }
  }, [ onScreen ])




  return (

    <>
      <h1>All rick and morty characters</h1>


      <div className='wrapper'>
        {results.map((result, index) => {
          return <Card key={index} index={index} length={prevLength} result={result} />;
        })}
      </div>

      <button ref={ref} className='loadmore'
        onClick={async () => {
          setLoading("Loading")
          if (next) {

            try {
              const res = await fetch(next);
              const newData = await res.json();
              let episodes;
              for (let i = 0; i < newData.results.length; i++) {
                // console.log("start");
                const res = await fetch(newData.results[ i ].episode[ 0 ])
                episodes = await res.json();
                newData.results[ i ].episodeStr = episodes.episode;
                // console.log("end")

              }
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
        {loading == "Loading" && <span className="loader"></span>}
        {loading !== "Loading" && <h1>{loading}</h1>}
      </button>

      <style jsx>{`
        .loader{
      display: block;
      position: relative;
      height: 12px;
      width: 80%;
      border: 1px solid #fff;
      border-radius: 10px;
      overflow: hidden;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      {/* padding-block: 2rem; */}
      margin-bottom:25vh;
    }
    .loader::after {
      content: '';
      width: 40%;
      height: 100%;
      background: #FF3D00;
      position: absolute;
      top: 0;
      left: 0;
      box-sizing: border-box;
      animation: animloader 2s linear infinite;
    }
    
    @keyframes animloader {
      0% {
        left: 0;
        transform: translateX(-100%);
      }
      100% {
        left: 100%;
        transform: translateX(0%);
      }
    }
    
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
                        {/* justify-content: space-around; */}
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



// import Head from 'next/head'
// import Image from 'next/image'
// import { Inter } from 'next/font/google'
// import styles from '@/styles/Home.module.css'
// import Link from 'next/link'
// import Characters from './rnm/characters'

// const inter = Inter({ subsets: [ 'latin' ] })

// export default function Home() {
//   return (
//     <>
//       <Head>
//         <title>Create Next App</title>
//         <meta name="description" content="Generated by create next app" />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>
//       <nav>
//         <Link href={"/blogs"}>
//           Blog
//         </Link>
//         <Link href={"/rnm/characters"}>Rick And Morty</Link>
//       </nav>
//       {/* <Characters></Characters> */}

//     </>
//   )
// }




















{/* <main className={styles.main}>
        <div className={styles.description}>
          <p>
            Get started by editing&nbsp;
            <code className={styles.code}>pages/index.js</code>
          </p>
          <div>
            <a
              href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              By{' '}
              <Image
                src="/vercel.svg"
                alt="Vercel Logo"
                className={styles.vercelLogo}
                width={100}
                height={24}
                priority
              />
            </a>
          </div>
        </div>

        <div className={styles.center}>
          <Image
            className={styles.logo}
            src="/next.svg"
            alt="Next.js Logo"
            width={180}
            height={37}
            priority
          />
          <div className={styles.thirteen}>
            <Image
              src="/thirteen.svg"
              alt="13"
              width={40}
              height={31}
              priority
            />
          </div>
        </div>

        <div className={styles.grid}>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Docs <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Find in-depth information about Next.js features and&nbsp;API.
            </p>
          </a>

          <a
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Learn <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Learn about Next.js in an interactive course with&nbsp;quizzes!
            </p>
          </a>

          <a
            href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Templates <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Discover and deploy boilerplate example Next.js&nbsp;projects.
            </p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Deploy <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Instantly deploy your Next.js site to a shareable URL
              with&nbsp;Vercel.
            </p>
          </a>
        </div>
      </main> */}