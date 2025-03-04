/* eslint-disable react/prop-types */
import Watermark from "./Watermark";

const Layout = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-white">
      {children} <Watermark />
    </div>
  );
};

export default Layout;
