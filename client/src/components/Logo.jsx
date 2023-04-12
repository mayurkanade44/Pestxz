import logo from "../images/logo.png";

const Logo = () => {
  return (
    <img
      src={logo}
      alt="logo"
      className="logo"
      style={{ width: 90 }}
    />
  );
};
export default Logo;
