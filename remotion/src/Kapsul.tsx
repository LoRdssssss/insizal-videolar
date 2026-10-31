import React from "react";
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";

type Bar = {etiket: string; deger: number; birim?: string; renk?: "mint" | "red" | "warn"; sonuc?: string};
type Scene = {
  tur: "soru" | "metin" | "cubuk" | "liste" | "not";
  sure: number; ust?: string; satirlar?: string[]; alt?: string;
  vurgu?: boolean | string; aciklama?: string; cipler?: string[];
  baslik?: string; cubuklar?: Bar[]; maddeler?: string[]; kaynak?: string;
};
export type Scenario = {baslik: string; brans: string; durum: string; kaynaklar: string[]; sahneler: Scene[]};

const C = {bg:"#0d1f1b",ink:"#f0f5f2",mint:"#7ed6b4",mute:"#96aaa3",warn:"#ffc46b",red:"#f27864",card:"#18322c",line:"#284a42"};
const titleFont = '"Bricolage Grotesque", "Arial", sans-serif';
const bodyFont = '"Instrument Sans", "Arial", sans-serif';
const text = (size:number,color=C.ink,weight=600):React.CSSProperties => ({
  fontFamily:bodyFont,fontSize:size,color,fontWeight,lineHeight:1.18,overflowWrap:"anywhere"
});
const heading = (size:number,color=C.ink):React.CSSProperties => ({...text(size,color,700),fontFamily:titleFont,letterSpacing:-1.5});
const clamp = (v:number) => Math.max(0,Math.min(1,v));
const appear = (frame:number,fps:number,delay=0):React.CSSProperties => {
  const f=Math.max(0,frame-delay*fps);
  const value=spring({frame:f,fps,config:{damping:200,stiffness:110}});
  return {opacity:clamp(value),transform:`translateY(${(1-value)*36}px)`};
};
const enter = (frame:number, duration:number, index:number, last:number) => {
  const cross=6;
  const fadeIn=index===0?1:clamp(frame/cross);
  const fadeOut=index===last?1:clamp((duration-frame)/cross);
  return fadeIn*fadeOut;
};
const wrap:React.CSSProperties = {maxWidth:920,whiteSpace:"normal"};

const SceneView:React.FC<{scene:Scene;frame:number;fps:number}> = ({scene:s,frame,fps}) => {
  const title=(lines:string[],size=94,highlight=false)=>lines.map((line,i)=>
    <div key={i} style={{...heading(size,highlight&&i===lines.length-1?C.warn:C.ink),...appear(frame,fps,0.25+i*0.17),...wrap}}>{line}</div>);
  if(s.tur==="soru")return <div style={{paddingTop:310}}>
    {s.ust&&<div style={{...heading(140,C.mint),...appear(frame,fps)}}>{s.ust}</div>}
    <div style={{marginTop:36}}>{title(s.satirlar??[],98)}</div>
    {s.alt&&<div style={{...text(48,C.mute),marginTop:70,...appear(frame,fps,1)}}>{s.alt}</div>}
  </div>;
  if(s.tur==="metin")return <div style={{paddingTop:285}}>
    {s.ust&&<div style={{...text(52,C.mute),marginBottom:36,...appear(frame,fps)}}>{s.ust}</div>}
    {title(s.satirlar??[],92,Boolean(s.vurgu))}
    {s.aciklama&&<div style={{...text(45,C.mute),marginTop:64,...appear(frame,fps,1),...wrap}}>{s.aciklama}</div>}
    <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:64}}>
      {(s.cipler??[]).map((chip,i)=><div key={i} style={{...text(33,C.mint),background:C.card,borderRadius:20,padding:"22px 26px",...appear(frame,fps,1.4+i*.15)}}>{chip}</div>)}
    </div>
  </div>;
  if(s.tur==="cubuk"){
    const bars=s.cubuklar??[];
    const max=Math.max(1,...bars.map(b=>Number(b.deger)||0));
    return <div style={{paddingTop:260}}>
      {s.ust&&<div style={{...text(36,C.mute),textTransform:"uppercase",...appear(frame,fps)}}>{s.ust}</div>}
      <div style={{...heading(60),marginTop:32,marginBottom:74,...appear(frame,fps,.2)}}>{s.baslik}</div>
      {bars.map((bar,i)=>{
        const color=bar.renk==="red"?C.red:bar.renk==="warn"?C.warn:C.mint;
        const progress=clamp(interpolate(frame,[fps*(.6+i*.35),fps*(1.6+i*.35)],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"}));
        return <div key={i} style={{marginBottom:64,...appear(frame,fps,.4+i*.3)}}>
          <div style={{display:"flex",alignItems:"center",gap:24}}>
            <div style={{...heading(49),width:215,flexShrink:0}}>{bar.etiket}</div>
            <div style={{background:C.card,height:58,borderRadius:30,width:455,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${clamp((Number(bar.deger)||0)/max)*progress*100}%`,background:color,borderRadius:30}}/>
            </div>
            <div style={{...text(30,C.mute),flex:1}}>{bar.birim}</div>
          </div>
          {bar.sonuc&&<div style={{...text(35,color),marginLeft:240,marginTop:15}}>{bar.sonuc}</div>}
        </div>;
      })}
      {typeof s.vurgu==="string"&&<div style={{...heading(49,C.warn),marginTop:45,...appear(frame,fps,2.5),...wrap}}>{s.vurgu}</div>}
    </div>;
  }
  if(s.tur==="liste")return <div style={{paddingTop:280}}>
    <div style={{...heading(99),marginBottom:95,...appear(frame,fps)}}>{s.baslik}</div>
    {(s.maddeler??[]).map((item,i)=>{
      const warning=item.startsWith("!");
      return <div key={i} style={{display:"flex",alignItems:"flex-start",gap:35,marginBottom:75,...appear(frame,fps,.45+i*.38)}}>
        <div style={{...heading(38,C.bg),borderRadius:"50%",width:72,height:72,flexShrink:0,display:"grid",placeItems:"center",background:warning?C.warn:C.mint}}>{warning?"!":i+1}</div>
        <div style={{...text(50),paddingTop:7,...wrap}}>{warning?item.slice(1).trim():item}</div>
      </div>;
    })}
  </div>;
  return <div style={{height:"100%",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",textAlign:"center",paddingBottom:110}}>
    {s.ust&&<div style={{...text(48,C.mute),marginBottom:48,...appear(frame,fps)}}>{s.ust}</div>}
    {title(s.satirlar??[],72,true)}
    <div style={{...heading(96,C.mint),marginTop:165,...appear(frame,fps,1.1)}}>insizal</div>
    <div style={{...text(34,C.mute),marginTop:22,...appear(frame,fps,1.3)}}>diş hekimleri için kısa ve seçilmiş</div>
  </div>;
};

export const Kapsul:React.FC<Scenario> = (spec) => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const scenes=spec.sahneler??[];
  const total=scenes.reduce((a,s)=>a+Number(s.sure||0),0);
  let start=0;
  return <AbsoluteFill style={{background:C.bg,color:C.ink,padding:"0 80px"}}>
    {scenes.map((scene,i)=>{
      const startFrame=Math.round(start*fps);
      start+=Number(scene.sure||0);
      const endFrame=Math.round(start*fps);
      const duration=endFrame-startFrame;
      const local=frame-startFrame;
      if(local<0||local>=duration)return null;
      return <AbsoluteFill key={i} style={{padding:"0 80px",opacity:enter(local,duration,i,scenes.length-1)}}>
        <div style={{display:"flex",gap:8,position:"absolute",top:70,left:80,right:80}}>
          {scenes.map((_,j)=><div key={j} style={{flex:1,height:9,borderRadius:5,background:C.line,overflow:"hidden"}}>
            <div style={{width:`${j<i?100:j>i?0:clamp(local/Math.max(1,duration))*100}%`,height:"100%",background:C.mint}}/>
          </div>)}
        </div>
        <div style={{position:"absolute",top:112,...text(30,C.mute)}}>{(spec.brans||"").toLocaleUpperCase("tr-TR")} · {Math.round(total)} SN</div>
        <SceneView scene={scene} frame={local} fps={fps}/>
        {scene.kaynak&&<div style={{position:"absolute",left:80,right:80,bottom:130,...text(30,C.mute,500),...appear(local,fps,1)}}>{scene.kaynak}</div>}
      </AbsoluteFill>;
    })}
  </AbsoluteFill>;
};
