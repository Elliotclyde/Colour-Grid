



export function processGridColour(colour, columnIndex, rowIndex) {

  function getColoursFromRgbArray(rgbArray) {
    const primary = rgbArray.findIndex(e => e === 255);
    const zeroColour = rgbArray.findIndex(e => e === 0);
    const thirdColour = rgbArray.findIndex((e, i) => (i !== primary && i !== zeroColour));
    return {
      primary: primary,
      zeroColour: zeroColour,
      thirdColour: thirdColour
    };
  }

  function greyRgbBy(rgb, amount) {
    const numberOfGreys = 9;
    const rgbArray = rgbToIntArray(rgb);
  
    const highest = rgbArray.indexOf(Math.max(...rgbArray));
    const lowest = rgbArray.indexOf(Math.min(...rgbArray));
    const endGrey = (rgbArray[highest] + rgbArray[lowest]) / 2;
  
    const diffsToGrey = rgbArray.map(e => (e - endGrey) / numberOfGreys);
    const returnArray = rgbArray.map((e, i) => e - Math.round((diffsToGrey[i] * amount)));
    return (`rgb(${returnArray.join()})`);
  }

  function lightenRgbBy(rgb, amount) {
    const numberOfLightens = 6;
    const rgbArray = rgbToIntArray(rgb);
    const { zeroColour, thirdColour } = getColoursFromRgbArray(rgbArray);

    const returnArray = [...rgbArray];
    returnArray[zeroColour] = rgbArray[zeroColour] + ((255 / numberOfLightens) * amount);
    returnArray[thirdColour] = Math.round(rgbArray[thirdColour] + ((255 - rgbArray[thirdColour]) / numberOfLightens) * amount);
    console.log();
    return (`rgb(${returnArray.join()})`);
  }



  function darkenRgbBy(rgb, amount) {
    const numberOfDarkens = 5;
    const rgbArray = rgbToIntArray(rgb);
    const { primary, thirdColour } = getColoursFromRgbArray(rgbArray);
    const returnArray = [...rgbArray];

    returnArray[primary] = Math.round(rgbArray[primary] - ((255 / numberOfDarkens) * amount));
    returnArray[thirdColour] = Math.round(rgbArray[thirdColour] - (rgbArray[thirdColour] / numberOfDarkens) * amount);
    return (`rgb(${returnArray.join()})`);
  }


  if (columnIndex < 4) {
    return greyRgbBy(darkenRgbBy(colour, (4 - columnIndex)), rowIndex);
  }
  if (columnIndex > 4) {
    return greyRgbBy(lightenRgbBy(colour, (columnIndex - 4)), rowIndex);
  }
  return greyRgbBy(colour, rowIndex);
}

export function rgbToHex(rgb) {
  const [red, green, blue] = rgbToIntArray(rgb)
  return '#' + toHex(red) + toHex(green) + toHex(blue);
}

function toHex(n) {
  n = parseInt(n, 10);
  if (isNaN(n)) return "00";
  n = Math.max(0, Math.min(n, 255));
  return "0123456789ABCDEF".charAt((n - n % 16) / 16)
    + "0123456789ABCDEF".charAt(n % 16);
}

function rgbToIntArray(rgb) {
  return rgb.replace(/ /g, '').slice(4, -1).split(',').map(e => parseInt(e));
}


export function copyToClipBoard(str) {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}