import { useState, useEffect } from "react"
import axios from "axios";

const Planetdetails = () => {
  const [allPlanets, setAllPlanets] = useState([]);
  const [planetDetails, setPlanetDetails] = useState({});
  const [planetReviews, setPlanetReviews] = useState([]);
  const [showPlanet, setShowPlanet] = useState(false);

  useEffect(()=> {
    try{
      const getAllPlanets = async ()=> {
        // this might need to be deconstructed
        const response = await axios.get('/api/planets');
        setAllPlanets(response);
      }
      getAllPlanets();
    } catch (error){
      console.log(error);
    }
  }, [])

  return (
    <main>
      {
        showPlanet? <>
          {singlePlanet.map((planet) => {
            return (<>
                <button onClick={()=>setShowPlanet(false)}> See other Planets </button>
                <h2>{planet.name}</h2> <br />
                <p> {[planet.description]}</p>
                  <p> {planetReviews.map(review => {
                    <>
                    <h4> Reviews </h4>
                    <p key={review.id}> {review.review}</p>
                    </>
                })}</p>
                <p> This Planet is owned by: {planet.ownedby} </p>
                {/* image goes here */}
                <button >Add this Planet to Cart</button>
                <button onClick={()=>setShowPlanet(false)}>Go Back to Exploring all Planets</button>
              </>
            );
          })};
          </>
        :
        allPlanets.map(singlePlanet => {
          return (<a> {/* probably not actually an anchor tag, when this element is click singlePlanet State changed to true*/}
            <h3 key={singlePlanet.id}> {singlePlanet.name} </h3> <br /> 
            {/* image goes here */}
            </a>)
        })
      }
    </main>
  )
}

export default Planets