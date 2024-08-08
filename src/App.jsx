
import Snowfall from "react-snowfall";
import "./App.css";
import Music from "./Music";

const App = () => {
  return (
    <div className="App">
      <Snowfall snowflakeCount={200} />
      <Music />
    </div>
  );
};

export default App;

