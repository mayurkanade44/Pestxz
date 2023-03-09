import { Link } from "react-router-dom";
import main from "../images/pest.png";
import logo from "../images/logo.png";

const Landing = () => {
  return (
    <div className="landing">
      
      <div className="container page">
        {/* info */}
        <div className="info">
          <h1>
            Pest <span>Tracking</span> Portal
          </h1>
          <p>
            Crucifix narwhal street art asymmetrical, humblebrag tote bag pop-up
            fixie raclette taxidermy craft beer. Brunch bitters synth, VHS
            crucifix heirloom meggings bicycle rights.
          </p>
          <Link to="/" className="btn btn-hero">
            Login
          </Link>
        </div>
        <img src={main} alt="job hunt" className="img main-img" />
      </div>
    </div>
  );
};
export default Landing;
