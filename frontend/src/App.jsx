import { Routes, Route } from "react-router-dom";
import Awareness from "./Awareness";
import Layout from "./Layout";
import Home from "./Home";
import Recovery from "./Recovery";
import Earthquake from "./Earthquake";
import Landslide from "./Landslide";
import Forestfiring from "./Forestfiring";
import Flood from "./Flood";
import Response from "./Response";
import Mainquiz from "./Mainquiz";
import Earthquakemcq from "./Earthquakemcq";
import Earthquakescenario from "./Earthquakescenario";
import Earthquaketrue from "./Earthquaketrue";
import FloodMCQ from "./Floodmcq";
import FloodScenario from "./Floodscenario"
import FloodTrue from "./Floodtrue";
import LandslideMCQ from "./Landslidemcq";
import LandslideScenario from "./Landslidescenario";
import LandslideTrue from "./Landslidetrue";
import ForestFireMCQ from "./Forestfiremcq";
import ForestFireScenario from "./Forestfirescenario";
import ForestFireTrue from "./Forestfiretrue";
import Preparedness from "./Preparedness";
import WeatherApp from "./Weather";
import { LoginSignup, VerifyEmail } from "./Login";
import DisasterMap from "./DisasterMap";
import Score from "./Score";
import Studentidcard from "./Studentidcard";
import Game1 from "./Game1";
import Dashboard from "./Dashboard";
import GameSelection from "./Games";
import Game2 from "./Game2";
import Report from "./Report";
import TeacherDashboard from "./TeacherDashboard";
import AddQuiz from "./AddQuiz";
import Leaderboard from "./Leaderboard";

function App() {
  return (
    <main>
      <Routes>
  <Route path="/" element={<Home />} />
  <Route path="loginSignup" element={<LoginSignup />} />
  <Route path="verify/:token" element={<VerifyEmail />} />
  
  <Route element={<Layout />}>
    <Route path="awareness" element={<Awareness />} />
    <Route path="earthquake" element={<Earthquake />} />
    <Route path="landslide" element={<Landslide />} />
    <Route path="forestfiring" element={<Forestfiring />} />
    <Route path="flood" element={<Flood />} />
    <Route path="response" element={<Response />} />
    <Route path="recovery" element={<Recovery />} />
    <Route path="quiz" element={<Mainquiz />} />
     <Route path="studentidcard" element={<Studentidcard />}/>
     <Route path="dashboard" element={<Dashboard/>}/>
     <Route path="addquiz" element={<AddQuiz/>}/>
      <Route path="leaderboard" element ={<Leaderboard/>}/>

    {/* Earthquake */}
    <Route path="earthquake-mcq" element={<Earthquakemcq />} />
    <Route path="earthquake-true" element={<Earthquaketrue />} />
    <Route path="earthquake-scenario" element={<Earthquakescenario />} />

    {/* Landslide */}
    <Route path="landslide-mcq" element={<LandslideMCQ />} />
    <Route path="landslide-true" element={<LandslideTrue />} />
    <Route path="landslide-scenario" element={<LandslideScenario />} />

    {/* Forest Fire */}
    <Route path="forestfire-mcq" element={<ForestFireMCQ />} />
    <Route path="forestfire-true" element={<ForestFireTrue />} />
    <Route path="forestfire-scenario" element={<ForestFireScenario />} />

    {/* Flood */}
    <Route path="flood-mcq" element={<FloodMCQ />} />
    <Route path="flood-true" element={<FloodTrue />} />
    <Route path="flood-scenario" element={<FloodScenario />} />

    <Route path="prepardness" element={<Preparedness />} />
    <Route path="safetymap" element={<DisasterMap />} />
    <Route path="score" element={<Score />} />
    <Route path="games" element={<GameSelection/>} />
    <Route path="game1" element={<Game1/>} />
    <Route path="game2" element={<Game2/>} />
    <Route path="report" element={<Report/>} />
    <Route path="teacherdashboard" element={<TeacherDashboard/>}/>
  </Route>
</Routes>

    </main>

  
  );
}

export default App;
