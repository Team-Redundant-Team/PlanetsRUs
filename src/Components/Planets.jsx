import { useState, useEffect } from "react"
import axios from "axios";

const Planetdetails = () => {
  const [allPlanets, setAllPlanets] = useState([]);

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
        allPlanets.map((singlePlanet) =>{
          return (<a> {/* probably not actually an anchor tag*/}
            <h3 key={singlePlanet.id}> {singlePlanet.name} </h3> <br /> 
            {/* image goes here */}
            </a>)
        }
        )
      }
    </main>
  )
}

export default Planets