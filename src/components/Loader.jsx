import { useLoading } from "../context/Loading.jsx";
const Loader = () => {
  const { loading } = useLoading();

  if (!loading) return null; // Don't render if not loading

  return (
    <div className="loader-overlay">
      <div className="loader"></div>
    </div>
  );
};

export default Loader;
