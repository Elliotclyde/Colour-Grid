//This function takes the x coordinate of a click and calculates a hue based on the length along the page

export default function xToColour(x){
    if (x ===0){
      x=x+1;
    }
    const fractionAlong = x/window.innerWidth;
    if(fractionAlong>1 ||fractionAlong<0){
      return `rgb(255,0,0)`;
    }
    // 0 (255 0 0) to 1.66666 (255 255 0)
    if (fractionAlong<0.1666){
      return `rgb(255, ${Math.floor(fractionAlong / 0.1666 * 255)}, 0)`;
    }
    // 1.66666 (255 255 0) to 0.3333 (0 255 0)
    if (fractionAlong<0.3333){
      return `rgb( ${255 - Math.floor((fractionAlong-0.1666)/(0.3333-0.1666) * 255)}, 255, 0)`;
    }
    // 0.3333 (0 255 0) to 0.5(0 255 255)
    if (fractionAlong<0.5){
      return `rgb(0, 255, ${Math.floor((fractionAlong-0.3333)/(0.5-0.3333) * 255)})`;
    }
      // 0.5 (0 255 255) to  0.66666(0 0 255)
    if (fractionAlong<0.6666666){
      return `rgb(0, ${255 - Math.floor((fractionAlong-0.5)/(0.66666-0.5) * 255)}, 255)`;
    }
    // 0.66666(0 0 255) to  0.83333(255 0 255)
    if (fractionAlong<0.83333){
      return `rgb(${Math.floor((fractionAlong-0.6666)/(0.833333-0.66666) * 255)}, 0, 255)`;
    }
    // 0.83333 (255 0 255) to  1(255 0 0)
    return `rgb(255, 0, ${255 - Math.floor((fractionAlong-0.833333)/(1-0.833333) * 255)})`;
  }