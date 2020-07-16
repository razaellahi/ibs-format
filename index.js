 function ibsFormat(value) {

    if (value != "" && value != null && value != undefined) {
      value = intoBold(value);
      value = intoTalic(value);
      value = intoStrike(value);
      return value;
    } else {
      return null;
    }
  
  }
  
  function intoBold(text) {
    let box = [];
    let arr = [];
    let finalText = "";
  
    let a = text.split(" ");
  
    let singleStericCounter = 0;
  
    a.forEach(e => {
      if (
        e.length > 1 &&
        e.includes("*") &&
        (e.match(/\x2a/g) || []).length == 1
      ) {
        ++singleStericCounter;
      }
    });
    singleStericCounter = singleStericCounter - 1;
  
    let flag = "1";
    let loopCounter = 0;
    a.forEach(e => {
      if (
        e.length > 1 &&
        e.includes("*") &&
        (e.match(/\x2a/g) || []).length == 1
      ) {
        if (loopCounter == singleStericCounter && loopCounter % 2 == 0) {
        } else {
          if (flag == "1") {
            e = e.replace(/\x2a/g, "<b>");
            flag = "2";
          } else {
            e = e.replace(/\x2a/g, "</b>");
            flag = "1";
          }
          ++loopCounter;
        }
      }
  
      if (e.length > 1 && (e.match(/\x2a/g) || []).length > 1) {
        const n = (e.match(/\x2a/g) || []).length;
  
        for (let i = 0; i < n; i++) {
          if (i == 0) {
            box.push(e.indexOf("*", i));
          } else {
            let len = box.length - 1;
            let v = box[len];
            v = v + 1;
            box.push(e.indexOf("*", v));
          }
        }
        let firstIndex = box[0];
        let lastIndex = box[box.length - 1];
  
        e = replaceChar(e, "<b>", firstIndex);
        e = replaceChar(e, "</b>", lastIndex + 2);
  
        box = [];
      }
  
      arr.push(e);
    });
  
    arr.forEach(e => {
      if (e == "") {
        finalText = finalText + " &nbsp";
      } else {
        finalText = finalText + e + " &nbsp";
      }
    });
  
    function replaceChar(origString, replaceChar, index) {
      let firstPart = origString.substr(0, index);
      let lastPart = origString.substr(index + 1);
  
      let newString = firstPart + replaceChar + lastPart;
      return newString;
    }
  
    return finalText;
  }
  
  function intoTalic(text) {
    let box = [];
    let arr = [];
    let finalText = "";
  
    let a = text.split(" ");
  
    let singleStericCounter = 0;
  
    a.forEach(e => {
      if (
        e.length > 1 &&
        e.includes("_") &&
        (e.match(/_/g) || []).length == 1
      ) {
        ++singleStericCounter;
      }
    });
    singleStericCounter = singleStericCounter - 1;
  
    let flag = "1";
    let loopCounter = 0;
    a.forEach(e => {
      if (
        e.length > 1 &&
        e.includes("_") &&
        (e.match(/_/g) || []).length == 1
      ) {
        if (loopCounter == singleStericCounter && loopCounter % 2 == 0) {
        } else {
          if (flag == "1") {
            e = e.replace(/_/g, "<i>");
            flag = "2";
          } else {
            e = e.replace(/_/g, "</i>");
            flag = "1";
          }
          ++loopCounter;
        }
      }
  
      if (e.length > 1 && (e.match(/_/g) || []).length > 1) {
        const n = (e.match(/_/g) || []).length;
  
        for (let i = 0; i < n; i++) {
          if (i == 0) {
            box.push(e.indexOf("_", i));
          } else {
            let len = box.length - 1;
            let v = box[len];
            v = v + 1;
            box.push(e.indexOf("_", v));
          }
        }
        let firstIndex = box[0];
        let lastIndex = box[box.length - 1];
  
        e = replaceChar(e, "<i>", firstIndex);
        e = replaceChar(e, "</i>", lastIndex + 2);
  
        box = [];
      }
  
      arr.push(e);
    });
  
    arr.forEach(e => {
      if (e == "") {
        finalText = finalText + "";
      } else {
        finalText = finalText + e + "";
      }
    });
  
    function replaceChar(origString, replaceChar, index) {
      let firstPart = origString.substr(0, index);
      let lastPart = origString.substr(index + 1);
  
      let newString = firstPart + replaceChar + lastPart;
      return newString;
    }
  
    return finalText;
  }
  
  function intoStrike(text) {
    let box = [];
    let arr = [];
    let finalText = "";
  
    let a = text.split(" ");
  
    let singleStericCounter = 0;
  
    a.forEach(e => {
      if (
        e.length > 1 &&
        e.includes("~") &&
        (e.match(/~/g) || []).length == 1
      ) {
        ++singleStericCounter;
      }
    });
    singleStericCounter = singleStericCounter - 1;
  
    let flag = "1";
    let loopCounter = 0;
    a.forEach(e => {
      if (
        e.length > 1 &&
        e.includes("~") &&
        (e.match(/~/g) || []).length == 1
      ) {
        if (loopCounter == singleStericCounter && loopCounter % 2 == 0) {
        } else {
          if (flag == "1") {
            e = e.replace(/~/g, "<strike>");
            flag = "2";
          } else {
            e = e.replace(/~/g, "</strike>");
            flag = "1";
          }
          ++loopCounter;
        }
      }
  
      if (e.length > 1 && (e.match(/~/g) || []).length > 1) {
        const n = (e.match(/~/g) || []).length;
  
        for (let i = 0; i < n; i++) {
          if (i == 0) {
            box.push(e.indexOf("~", i));
          } else {
            let len = box.length - 1;
            let v = box[len];
            v = v + 1;
            box.push(e.indexOf("~", v));
          }
        }
        let firstIndex = box[0];
        let lastIndex = box[box.length - 1];
  
        e = replaceChar(e, "<strike>", firstIndex);
        e = replaceChar(e, "</strike>", lastIndex + 7);
  
        box = [];
      }
  
      arr.push(e);
    });
  
    arr.forEach(e => {
      if (e == "") {
        finalText = finalText + "";
      } else {
        finalText = finalText + e + "";
      }
    });
  
    function replaceChar(origString, replaceChar, index) {
      let firstPart = origString.substr(0, index);
      let lastPart = origString.substr(index + 1);
  
      let newString = firstPart + replaceChar + lastPart;
      return newString;
    }
  
    return finalText;
  }

  module.exports.ibsFormat = ibsFormat;