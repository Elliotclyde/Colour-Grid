import React,{useState,useEffect} from 'react';
import xToColour from './xToColour';

function keepInScreen(x){
  if(x<0){
    return 0;
  }
  if(x>window.innerWidth){
    return window.innerWidth;
  }
  return x;
}

function lightenRgbBy(rgb,amount){

    const rgbArray = rgb.replace(/ /g,'').slice(4, -1).split(',');    
    const primary = rgbArray.findIndex(e=>(parseInt(e)===255));
    const zeroColour = rgbArray.findIndex(e=>(parseInt(e)===0));
    const thirdColour = rgbArray.findIndex((e,i)=>(i!==primary&&i!==zeroColour));
    const returnArray = [...rgbArray];
    returnArray[zeroColour] = parseInt(rgbArray[zeroColour])+(51*amount);
    returnArray[thirdColour] = Math.round(parseInt(rgbArray[thirdColour]) + ((255 - rgbArray[thirdColour])/5)*amount);
    console.log();
    return(`rgb(${returnArray.join()})`);
}

function darkenRgbBy(rgb,amount){

  const rgbArray = rgb.replace(/ /g,'').slice(4, -1).split(',');    
  const primary = rgbArray.findIndex(e=>(parseInt(e)===255));
  const zeroColour = rgbArray.findIndex(e=>(parseInt(e)===0));
  const thirdColour = rgbArray.findIndex((e,i)=>(i!==primary&&i!==zeroColour));
  const returnArray = [...rgbArray];

  returnArray[primary]= Math.round(parseInt(rgbArray[primary])-(63.75*amount));
  returnArray[thirdColour] = Math.round( parseInt(rgbArray[thirdColour]) - (rgbArray[thirdColour]/4)*amount);

  return(`rgb(${returnArray.join()})`);
}

function processLightness(colour, index){

    if(index<4){
      return(darkenRgbBy(colour,(4-index)));
    }
    if(index>4){
      return(lightenRgbBy(colour,(index-4)));
    }
    return colour;
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
  return(
    <div className="grid-builder">
    <button style={{backgroundColor:colour}} onClick={onGenerateHueGrid}>Generate hue grid</button>
    <div className="grid-spacer"></div> 
    <div className="grid">
      {
      grid.map((row, rowIndex)=>{
        const newRow = row.map((item, columnIndex)=>{
          return <div key={`grid-item-row${rowIndex}-column-${columnIndex}`} className="grid-item" 
          style={{backgroundColor:processLightness(item,columnIndex)}}></div>
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
  const [gridColour,setGridColour]= useState("rgb(150,150,150)");

  function onGenerateHueGrid(){

    setGridColour(colour);
    lightenRgbBy(colour,1);
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