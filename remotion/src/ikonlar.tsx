import React from "react";
import {interpolate, useCurrentFrame} from "remotion";

type Name = "Tooth"|"Root"|"Filling"|"Crown"|"Gum"|"Braces"|"Kid"|"Scalpel"|"Xray"|"Implant"|"CheckIcon";
const tooth = "M7 3.5c-2.2 0-3.5 1.8-3.5 4.2 0 2.6 1.3 4 1.8 6.6.5 2.8.9 6.2 2.3 6.2 1.6 0 1.4-4.6 4.4-4.6s2.8 4.6 4.4 4.6c1.4 0 1.8-3.4 2.3-6.2.5-2.6 1.8-4 1.8-6.6 0-2.4-1.3-4.2-3.5-4.2-1.9 0-3 1.2-5 1.2s-3.1-1.2-5-1.2Z";
const shapes:Record<Name,string[]> = {
 Tooth:[tooth], Root:[tooth,"M9.5 9v8M14.5 9v8"], Filling:[tooth,"M9 7.5h6l-1 3h-4Z"],
 Crown:["M4 9l3.5 2.5L12 5l4.5 6.5L20 9l-1.5 9h-13Z","M6 21h12"],
 Gum:["M3 9c3 2 6 2 9 0s6-2 9 0","M6 10.5v6c0 2 1 3.5 2 3.5s1.5-2 1.5-4M14.5 16c0 2 .5 4 1.5 4s2-1.5 2-3.5v-6"],
 Braces:["M2 12h20","M3 7h5v10H3zM9.5 7h5v10h-5zM16 7h5v10h-5z"],
 Kid:["M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 1 0 0-17","M9 10h.01M15 10h.01M8.5 14.5c1 1.3 2.2 2 3.5 2s2.5-.7 3.5-2"],
 Scalpel:["M14 4l6 6-9.5 9.5c-1.5 1.5-4 1.5-5 .5s-1-3.5.5-5Z","M11 7l6 6"],
 Xray:["M3 4h18v16H3z","M9 8c-1.2 0-2 1-2 2.3 0 1.4.8 2.2 1 3.6.3 1.5.5 2.6 1.2 2.6.8 0 .8-2 2.8-2s2 2 2.8 2c.7 0 .9-1.1 1.2-2.6.2-1.4 1-2.2 1-3.6C17 9 16.2 8 15 8c-1 0-1.6.6-3 .6S10 8 9 8Z"],
 Implant:["M8 3h8v3H8z","M9 6h6l-.6 14.5-2.4 1.5-2.4-1.5Z","M8.6 9.5l6.8-1M8.8 13l6.4-1M9 16.5l6-1"],
 CheckIcon:["M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18","M8 12.5l2.6 2.5L16 9.5"]
};
export const iconForBranch = (branch:string):Name => {
 const b=branch.toLocaleLowerCase("tr-TR");
 if(b.includes("endo"))return "Root";
 if(b.includes("restoratif"))return "Filling";
 if(b.includes("protetik"))return "Crown";
 if(b.includes("periodont"))return "Gum";
 if(b.includes("ortodont"))return "Braces";
 if(b.includes("pedodont"))return "Kid";
 if(b.includes("cerrahi"))return "Scalpel";
 if(b.includes("radyoloji"))return "Xray";
 if(b.includes("implant"))return "Implant";
 return "Tooth";
};
export const DentalIcon:React.FC<{name:Name;size?:number;color?:string;animate?:boolean}> = ({name,size=80,color="currentColor",animate=false}) => {
 const frame=useCurrentFrame();
 const draw=animate?interpolate(frame,[0,34],[130,0],{extrapolateRight:"clamp"}):0;
 const breathe=animate?1+.015*(1+Math.sin(frame/18)):1;
 return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" style={{transform:`scale(${breathe})`}}>
 {shapes[name].map((d,i)=><path key={i} d={d} strokeDasharray={animate?"130":undefined} strokeDashoffset={animate?draw:undefined}/>)}
 </svg>;
};
