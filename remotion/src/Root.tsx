import React from "react";
import {Composition} from "remotion";
import {Kapsul, type Scenario} from "./Kapsul";

const sample: Scenario = {
  baslik: "Kapsül", brans: "Endodonti", durum: "TASLAK", kaynaklar: [],
  sahneler: [{tur: "soru", sure: 4, ust: "Kapsül", satirlar: ["Kısa bilgi"]}, {tur: "not", sure: 4, satirlar: ["Klinik not"]}],
};

export const Root: React.FC = () => (
  <Composition
    id="Kapsul"
    component={Kapsul}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={240}
    defaultProps={sample}
    calculateMetadata={({props}) => ({
      durationInFrames: Math.max(1, Math.round(props.sahneler.reduce((total, scene) => total + Number(scene.sure || 0), 0) * 30)),
    })}
  />
);
