import { ReactFlowProvider } from "reactflow";
import Home from "./component/Home";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <ReactFlowProvider>
      <Home />
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        closeOnClick
        draggable
        pauseOnHover
        transition={Slide}
      />
    </ReactFlowProvider>
  );
}

export default App;
