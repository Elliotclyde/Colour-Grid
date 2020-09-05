import React, { useState, useEffect, useRef } from 'react';
import xToColour from './xToColour';
import { processGridColour, rgbToHex, copyToClipBoard } from './GridUtils';

function keepInScreen(x) {
  if (x < 0) {
    return 0;
  }
  if (x > window.innerWidth) {
    return window.innerWidth;
  }
  return x;
}

function keepInSpeedLimit(count){
  var returnCount =Math.ceil(count/4)
  return (returnCount>10)?10:returnCount;
}

function ColourTab({ x, colour, onMouseDown, onKeyDown, onKeyUp }) {
  const styles = {
    transform: `translate(calc(${x}px - 50%), 0px)`,
    backgroundColor: colour
  };
  return <button style={styles} onKeyDown={onKeyDown} onKeyUp={onKeyUp} onMouseDown={onMouseDown} id="colour-tab" className="colour-tab"></button>;
}

function ColourBox({ setColour, colour }) {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [x, setX] = useState(0);
  const xRef = useRef();
  const stopBudgeInterval = useRef(() => { });
  const keyDown = useRef();
  const keyHeldCount =useRef(0);
  const [currentWidth, setCurrentWidth] = useState(window.innerWidth);
  

  useEffect(() => {
    xRef.current = x;
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);
    return function cleanup() {
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
    }

  });

  function budge(direction) {

    if (direction === "ArrowLeft") {
      setX(keepInScreen(xRef.current - keepInSpeedLimit(keyHeldCount.current)));
    }
    if (direction === "ArrowRight") {
      setX(keepInScreen(xRef.current + keepInSpeedLimit(keyHeldCount.current)));
    }
    setColour(xToColour(xRef.current));
    xRef.current = keepInScreen(x);
    keyHeldCount.current=keyHeldCount.current+1;
  }
  function onKeyUp(e) {
    const key = e.key;
    if (key === keyDown.current) {
      stopBudgeInterval.current();
      keyDown.current = null;
      keyHeldCount.current=0;
    }
  }
  function onKeyDown(e) {
    const key = e.key;
    if ((keyDown.current !== key) && (key === "ArrowLeft" || key === "ArrowRight")) {
      budge(key);
      const intervalId = setInterval(() => { budge(key) }, 20);
      stopBudgeInterval.current = () => { clearInterval(intervalId) };
      keyDown.current = key;

    }
  }
  function onResize(e) {
    const newWidth = e.currentTarget.innerWidth;
    const ratio = newWidth / currentWidth;
    setX(x * ratio);
    setCurrentWidth(newWidth);
  }

  function onMouseDown(e) {
    setX(keepInScreen(e.pageX));
    setColour(xToColour(e.pageX));
    setIsMouseDown(true);
  }

  function onMouseMove(e) {
    if (isMouseDown) {
      setX(keepInScreen(e.pageX));
      setColour(xToColour(e.pageX));
    }
  }

  function onMouseUp(e) {
    if (isMouseDown) {
      setIsMouseDown(false);
    }
  }
  return <div className="colour-box-cont">
    <button onMouseDown={onMouseDown} onKeyDown={onKeyDown} onKeyUp={onKeyUp} id="colour-box" className="colour-box"> </button>
    <ColourTab onKeyDown={onKeyDown} onKeyUp={onKeyUp} onMouseDown={onMouseDown} x={x} colour={colour} />
  </div>;
}

function GridBuilder({ colour, gridColour, onGenerateHueGrid }) {
  const grid = createGrid(gridColour);
  return (
    <div className="grid-builder">
      <a href="#grid" className="hue-button" id="hue-button" style={{ backgroundColor: colour }} onClick={onGenerateHueGrid}>Generate hue grid</a>
      <div className="grid-spacer"></div>
      <div id="grid" className="grid">
        {
          grid.map((row, rowIndex) => {
            const newRow = row.map(
              (item, columnIndex) => {
                return <GridItem
                  key={`grid-item-row${rowIndex}-column-${columnIndex}`}
                  rowIndex={rowIndex} columnIndex={columnIndex}
                  colour={processGridColour(item, columnIndex, rowIndex)} />
              }
            )
            return newRow;
          })
        }
      </div>
      <CssVariablesText colourGrid={grid} />
    </div>

  );
}

function GridItem({ colour }) {

  function onClick(e) {
    copyToClipBoard(rgbToHex(colour));
  }

  return (<button
    className="grid-item"
    style={{ backgroundColor: colour }}
    onClick={onClick}></button>);
}

function CssVariablesText({ colourGrid }) {

  const [propPrefix, setPrefix ] = useState('');
  
  const text = colourGrid.map((row,rowIndex) => {
    const newRow = row.map((item,columnIndex) => {
      const always = `-l${columnIndex}-s${9-(rowIndex)}:${rgbToHex(processGridColour(item, columnIndex, rowIndex))};\r\n`;
      if(propPrefix===""){
        return "-"+always;
      }
      else
      return `--${propPrefix}`+always;
    })
    return newRow.join("");
  }).join("");
  

  return (
    <React.Fragment>
  <h2>CSS Custom properties</h2>
  <div id="css-variables-title" className="prefix-cont">
  <label className="prefix-label" htmlFor="prefix">Add prefix?</label>
  <input id="prefix" type="text" placeholder="enter prefix" value={propPrefix} onChange={e=>setPrefix(e.target.value)} />
  </div>
  <textarea id="css-variables" readOnly rows="100" className="css-variables-text" value={text}></textarea>
  </React.Fragment>);
}

function App() {
  const [colour, setColour] = useState("rgb(255,0,0)");
  const [gridColour, setGridColour] = useState("rgb(255,0,0)");

  function onGenerateHueGrid() {
    setGridColour(colour);
  }

  return (
    <div className="app-container">
      <h1>Colour Grid</h1> 
      <ol>
        <li><a href="#colour-box">Select a hue.</a></li> 
        <li><a href="#hue-button">Generate a grid.</a></li>
        <li><a href="#grid">Click a square to copy the hashcode.</a></li> 
        <li><a href="#css-variables-title">Or copy the grid as CSS custom properties (with an optional prefix).</a></li> 
        </ol>
      <ColourBox setColour={setColour} colour={colour} />
      <GridBuilder colour={colour} gridColour={gridColour} onGenerateHueGrid={onGenerateHueGrid} />
    </div>);
}

export default App;

function createGrid(colour) {
  const empty = new Array(10);
  empty.fill(new Array(10));
  const result = empty.map(
    (row) => {
      return (row.fill(colour))
    }
  );
  return result;
}