import React,{useState,useEffect} from 'react';
import xToColour from './xToColour';


function CurrentColour({x,colour}){
  const styles = { 
    transform: `translate(calc(${x}px - 50%), 0px)`,
    backgroundColor:colour 
}; 
  return <div style={styles} className="current-colour"></div>;
}

function ColourBox({setColour,colour}){
  const [isDown,setIsDown] = useState(false);
  const [x,setX]= useState(0);
 
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

function GridBuilder({colour}){
  const [grid,setGrid] = useState(createGreyGrid());
    
  return(
    <div className="grid-builder"><button style={{backgroundColor:colour}}>Generate hue grid</button>
    <div className="grid">
      {grid.map(row=>{
        const newRow = row.map(item=>{
          return <div className="grid-item" style={{backgroundColor:item}}></div>
        });
        return newRow;
      })}
    </div>
    </div>
  );
}

function App() {
  const [colour,setColour]= useState("rgb(255,0,0)");
  return <div className="app-container"><ColourBox setColour={setColour} colour={colour}/><GridBuilder colour={colour}/></div>;
}

export default App;

function createGreyGrid(){
  const empty =new Array(10);
  empty.fill(new Array(10));
  const result = empty.map(
    (row)=>{
      return(row.fill("rgb(220,220,220)"))
    }
  );
  return result;
  }