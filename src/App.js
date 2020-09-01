import React, { useState, useEffect, useRef } from 'react';
import xToColour from './xToColour';
import processGridColour from './GridUtils';

function keepInScreen(x) {
  if (x < 0) {
    return 0;
  }
  if (x > window.innerWidth) {
    return window.innerWidth;
  }
  return x;
}

function ColourTab({ x, colour, onMouseDown,onKeyDown,onKeyUp }) {
  const styles = {
    transform: `translate(calc(${x}px - 50%), 0px)`,
    backgroundColor: colour
  };
  return <button style={styles} onKeyDown={onKeyDown} onKeyUp={onKeyUp} onMouseDown={onMouseDown} id="colour-tab"className="colour-tab"></button>;
}

function ColourBox({ setColour, colour }) {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [x, setX] = useState(0);
  const xRef = useRef();
  const stopBudgeInterval = useRef(() => { });
  const keyDown = useRef();
  const [currentWidth, setCurrentWidth] = useState(window.innerWidth);

  useEffect(() => {
    xRef.current=x;
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
    
    if(direction==="ArrowLeft"){
      setX(keepInScreen(xRef.current-1));
    }
    if(direction==="ArrowRight"){
      setX(keepInScreen(xRef.current+1));
    }
    setColour(xToColour(xRef.current));
    xRef.current = keepInScreen(x);
  }
  function onKeyUp(e) {
    const key = e.key;
    if (key === keyDown.current) {
      stopBudgeInterval.current();
      keyDown.current = null;
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
      <a href="#grid"  className="hue-button" style={{ backgroundColor: colour }} onClick={onGenerateHueGrid}>Generate hue grid</a>
      <div className="grid-spacer"></div>
      <div id="grid" className="grid">
        {
          grid.map((row, rowIndex) => {
            const newRow = row.map((item, columnIndex) => {
              return <button key={`grid-item-row${rowIndex}-column-${columnIndex}`} className="grid-item"
                style={{ backgroundColor: processGridColour(item, columnIndex, rowIndex) }}></button>
            });
            return newRow;
          })
        }
      </div>
    </div>
  );
}

function App() {
  const [colour, setColour] = useState("rgb(255,0,0)");
  const [gridColour, setGridColour] = useState("rgb(255,0,0)");

  function onGenerateHueGrid() {

    setGridColour(colour);
  }

  return (
    <div className="app-container">
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