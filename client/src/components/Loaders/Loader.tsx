const Loader = ({color="white"}) => {
  return (
    <svg className="loader" viewBox="20 19 60 70">
      <circle className="spin" stroke={color}  r="20" cy="50" cx="50"></circle>
    </svg>
  );
};

export default Loader;
