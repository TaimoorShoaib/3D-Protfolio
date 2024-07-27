import { Suspense, useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import Loader from "../components/Loader";
import Island from "../models/Island";
import Sky from "../models/Sky.jsx";
import Birds from "../models/Birds.jsx";
import Plane from "../models/Plane.jsx";
import HomeInfo from "../components/HomeInfo.jsx";
import sakura from "../assets/assets/sakura.mp3";
import { soundoff, soundon } from "../assets/assets/icons/index.js";
const Home = () => {
  const [isRotating, setIsRotating] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);
  const audioRef = useRef(new Audio(sakura));
  audioRef.current.volume = 0.4;
  audioRef.current.loop = true;
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  useEffect(() => {
    if (isPlayingMusic) {
      audioRef.current.play();
    }
    return () => {
      audioRef.current.pause();
    };
  }, [isPlayingMusic]);
  const adjustIslandForScreenSize = () => {
    let screenScale = null;
    let screenPostion = [0, -6.5, -43];
    let rotation = [0.1, 4.7, 0];
    if (window.innerWidth < 768) {
      screenScale = [0.9, 0.9, 0.9];
    } else {
      screenScale = [1, 1, 1];
    }
    return [screenScale, screenPostion, rotation];
  };

  const adjustPlaneForScreenSize = () => {
    let screenScale;
    let screenPostion;
    if (window.innerWidth < 768) {
      screenScale = [1.5, 1.5, 1.5];
      screenPostion = [0, -1.5, 0];
    } else {
      screenScale = [3, 3, 3];
      screenPostion = [0, -4, -4];
    }
    return [screenScale, screenPostion];
  };
  const [islandScale, islandPosition, islandRotation] =
    adjustIslandForScreenSize();

  const [PlaneScale, PlanePosition] = adjustPlaneForScreenSize();
  return (
    <section className="w-full h-screen relative">
      <div className="absolute top-10 left-0 right-0 z-10 flex items-center justify-center">
        {currentStage && <HomeInfo currentStage={currentStage} />}
      </div>
      <Canvas
        className={`w-full h-screen bg-transparent ${
          isRotating ? " cursor-grabbing" : "cursor-grab"
        }`}
        camera={{ near: 0.1, far: 1000 }}
      >
        <Suspense fallback={<Loader />}>
          <directionalLight position={[10, 1, 1]} intensity={2} />
          <ambientLight intensity={0.5} />
          <hemisphereLight
            skyColor="#b1e1ff"
            groundColor="#000000"
            intensity={1}
          />
          <Birds />
          <Sky isRotating={isRotating} />
          <Island
            position={islandPosition}
            scale={islandScale}
            rotation={islandRotation}
            isRotating={isRotating}
            setIsRotating={setIsRotating}
            setCurrentStage={setCurrentStage}
          />
          <Plane
            scale={PlaneScale}
            position={PlanePosition}
            isRotating={isRotating}
            rotation={[0, 20, 0]}
          />
        </Suspense>
      </Canvas>
      <div className=" absolute bottom-2 left-2">
        <img
          src={!isPlayingMusic ? soundoff : soundon}
          alt="sound"
          className="w-10 h-10 cursor-pointer object-contain"
          onClick={() => setIsPlayingMusic(!isPlayingMusic)}
        />
      </div>
    </section>
  );
};

export default Home;
