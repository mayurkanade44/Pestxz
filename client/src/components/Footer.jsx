const Footer = () => {
  return (
    <div className="fixed-bottom bg-secondary">
      <h6 className="text-center my-1 text-dark">
        @ {new Date().getFullYear()} All Rights Reserved by{" "}
        <a
          href="https://sat9.in/"
          style={{ color: "green", fontWeight: 600, paddingLeft: 2 }}
          target="_blank"
          rel="noreferrer"
        >
          SAT9
        </a>
      </h6>
    </div>
  );
};
export default Footer;
