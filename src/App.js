import React,{useState,useEffect} from 'react';
import xToColour from './xToColour';
import processGridColour from './GridUtils';

function keepInScreen(x){
  if(x<0){
    return 0;
  }
  if(x>window.innerWidth){
    return window.innerWidth;
  }
  return x;
}

function CurrentColour({x,colour,onMouseDown}){
  const styles = { 
    transform: `translate(calc(${x}px - 50%), 0px)`,
    backgroundColor:colour 
}; 
  return <div style={styles} onMouseDown={onMouseDown} className="current-colour"></div>;
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
    console.log(e);
    setX(x * ratio);
    setCurrentWidth(newWidth);
  }

  function onMouseDown(e){
    setX(keepInScreen(e.pageX));
    setColour(xToColour(e.pageX));
    setIsDown(true);    
  }

  function onMouseMove(e){
    if(isDown){
      setX(keepInScreen(e.pageX));
      setColour(xToColour(e.pageX));
    }
  }

  function onMouseUp(e){
    if(isDown){
    setIsDown(false);
    }
  }
  return <div className="colour-box-cont"><button onMouseDown={onMouseDown}  className="colour-box"></button><CurrentColour onMouseDown={onMouseDown} x={x} colour={colour}/></div>;
}

function GridBuilder({colour,gridColour,onGenerateHueGrid}){
  const grid = createGrid(gridColour);
  console.log(gridColour);
  return(
    <div className="grid-builder">
    <button style={{backgroundColor:colour}} onClick={onGenerateHueGrid}>Generate hue grid</button>
    <div className="grid-spacer"></div> 
    <div className="grid">
      {
      grid.map((row, rowIndex)=>{
        const newRow = row.map((item, columnIndex)=>{
          return <div key={`grid-item-row${rowIndex}-column-${columnIndex}`} className="grid-item" 
          style={{backgroundColor:processGridColour(item,columnIndex,rowIndex)}}></div>
        });
        return newRow;
      })
      }
    </div>
    </div>
  );
}

function App() {
  const [colour,setColour]= useState("rgb(255,0,0)");
  const [gridColour,setGridColour]= useState("rgb(255,0,0)");

  function onGenerateHueGrid(){

    setGridColour(colour);
  }

  return (
    <div className="app-container">
      <ColourBox setColour={setColour} colour={colour}/>
      <GridBuilder colour={colour} gridColour={gridColour} onGenerateHueGrid={onGenerateHueGrid}/>
    </div>);
}

export default App;

function createGrid(colour){
  const empty =new Array(10);
  empty.fill(new Array(10));
  const result = empty.map(
    (row)=>{
      return(row.fill(colour))
    }
  );
  return result;
  }