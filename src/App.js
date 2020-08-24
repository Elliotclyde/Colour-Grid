import React,{useState,useEffect} from 'react';

// 0 (255 0 0) 0.1666 (255 255 0) 0.33 (0 255 0) 0.5 (0 255 255) 0.66 (0 0 255) 0.83333 (255 0 255) 1 (255 0 0));
function xToColour(x){
  if (x ===0){
    x=x+1;
  }
  const fractionAlong = window.innerWidth/x;
  if (fractionAlong>0.1666){
    return;
  }
  if (fractionAlong>0.3333){
    return;
  }
  if (fractionAlong>0.5){
    return;
  }
  if (fractionAlong>0.8333){
    return;
  }
    return;
  
}

function CurrentColour({x}){
  const styles = { 
    transform: `translate(calc(${x}px - 50%), 0px)` 
}; 
console.log(styles);
  return <div style={styles} className="current-colour"></div>;
}

function ColourBox(){
  const [isDown,setIsDown] = useState(false);
  const [x,setX]= useState(0);

  useEffect(()=>{
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    return function cleanup() {
      window.removeEventListener('mouseup',onMouseUp);
      window.removeEventListener('mousemove',onMouseMove);
    }
    
  });

  function onMouseDown(e){
    setIsDown(true);
  }

  function onMouseMove(e){
    if(isDown){
      setX(e.pageX);
    }
  }

  function onMouseUp(e){
    if(isDown){
    setIsDown(false);
  
  }
  }
  if(isDown){
  return <div className="colour-box-cont"><button onMouseDown={onMouseDown}  className="colour-box"></button><CurrentColour x={x}/></div>;
  }
  return <div className="colour-box-cont"><button onMouseDown={onMouseDown}  className="colour-box"></button></div>;
}

function App() {
  
  return <ColourBox/>;
}

export default App;
