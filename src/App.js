import React,{useState,useEffect} from 'react';
import xToColour from './xToColour';


function CurrentColour({x,colour}){
  const styles = { 
    transform: `translate(calc(${x}px - 50%), 0px)`,
    backgroundColor:colour 
}; 
  return <div style={styles} className="current-colour"></div>;
}

function ColourBox(){
  const [isDown,setIsDown] = useState(false);
  const [x,setX]= useState(0);
  const [colour,setColour]= useState("rgb(255,0,0)");
  const [currentWidth,setCurrentWidth]= useState(window.innerWidth);

  useEffect(()=>{
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);
    return function cleanup() {
      window.removeEventListener('mouseup',onMouseUp);
      window.removeEventListener('mousemove',onMouseMove);
      window.removeEventListener('resize',onResize);
    }
    
  });

  function onResize(e) {
    const newWidth = e.currentTarget.innerWidth;
    const ratio = newWidth/currentWidth;
    setX(x * ratio);
    setCurrentWidth(newWidth);
  }

  function onMouseDown(e){
    setX(e.pageX);
    setColour(xToColour(e.pageX));
    setIsDown(true);    
  }

  function onMouseMove(e){
    if(isDown){
      setX(e.pageX);
      setColour(xToColour(e.pageX));
    }
  }

  function onMouseUp(e){
    if(isDown){
    setIsDown(false);
    }
  }
  return <div className="colour-box-cont"><button onMouseDown={onMouseDown}  className="colour-box"></button><CurrentColour x={x} colour={colour}/></div>;
}

function App() {
  
  return <ColourBox/>;
}

export default App;
