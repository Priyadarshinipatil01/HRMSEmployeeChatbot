import { useSelector } from "react-redux"
import Timer from "./Timer"
import "../components/Homepage.css"

function Circular(){
    const{
        circular      
    }=useSelector((state)=>state.chat)
    return(
        <>
          {circular === 'visible' && (
        <div className="loader-bg">
          <div className="loader-box">
            <div className="loader"></div>
            <img src="../img/company.png" alt="logo" />
            <div className="loader-txt">Loading</div>
            <div className="timer-txt">
              {' '}
              <Timer resetTimer={circular} />{' '}
            </div>
          </div>
        </div>
      )}
        </>
    )
}
export default Circular