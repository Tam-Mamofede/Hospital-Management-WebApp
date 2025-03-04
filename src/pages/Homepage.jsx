import { NavLink } from "react-router-dom";

function Homepage() {
  return (
    <div>
      <h1>Homepage</h1>

      <NavLink to="/login">Log in</NavLink>
    </div>
  );
}

export default Homepage;
