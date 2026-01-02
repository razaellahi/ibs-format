function ibsFormat(value, arr, linky, escaping) {
  const originalArr = JSON.parse(JSON.stringify(arr));
  let output = null;
  escaping = escaping && escaping.allowXssEscaping == false ? false : true;
  if (value) {
    if (escaping) {
      value = value.replace(/</g, "&lt;");
      value = value.replace(/>/g, "&gt;");
    }
    value = value.replace(/\n/g, " <br> ");
  }
  if (value != "" && value != null && value != undefined && arr && arr.length > 0) {
    // Preprocess to handle empty formatting markers
    if (arr[0].constructor === Array) {
      arr.forEach(function (formatConfig) {
        let marker = formatConfig[1];
        // Create regex to match empty formatting markers (marker followed by optional whitespace then same marker)
        let escapedMarker = marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        let emptyMarkerRegex = new RegExp(escapedMarker + '\\s*' + escapedMarker, 'g');
        
        // Find all empty marker pairs and track their positions
        let matches = [];
        let match;
        while ((match = emptyMarkerRegex.exec(value)) !== null) {
          matches.push({
            start: match.index,
            end: match.index + match[0].length,
            content: match[0]
          });
          // Reset lastIndex to avoid infinite loop with zero-length matches
          if (match.index === emptyMarkerRegex.lastIndex) {
            emptyMarkerRegex.lastIndex++;
          }
        }
        
        // Process matches from end to start to avoid index shifting
        for (let i = matches.length - 1; i >= 0; i--) {
          let matchObj = matches[i];
          let beforeMatch = value.substring(0, matchObj.start);
          let afterMatch = value.substring(matchObj.end);
          // Replace with just the markers (no formatting)
          value = beforeMatch + marker + marker + afterMatch;
        }
      });
    } else {
      let marker = arr[1];
      let escapedMarker = marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      let emptyMarkerRegex = new RegExp(escapedMarker + '\\s*' + escapedMarker, 'g');
      
      let matches = [];
      let match;
      while ((match = emptyMarkerRegex.exec(value)) !== null) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          content: match[0]
        });
        if (match.index === emptyMarkerRegex.lastIndex) {
          emptyMarkerRegex.lastIndex++;
        }
      }
      
      for (let i = matches.length - 1; i >= 0; i--) {
        let matchObj = matches[i];
        let beforeMatch = value.substring(0, matchObj.start);
        let afterMatch = value.substring(matchObj.end);
        value = beforeMatch + marker + marker + afterMatch;
      }
    }
    
    if (arr[0].constructor === Array) {
      arr.map(function (e) {
        e[2] = (e[0].length + 1).toString();
        if (e[1] == "*") {
          value = astericHandler(value, e[0], e[1], parseInt(e[2]), " ");
        } else if (e[1] == '**') {
          value = doubleAstericHandler(value, e[0], e[1], parseInt(e[2]), " ");
        } else {
          value = getFormat(value, e[0], e[1], parseInt(e[2]), " ");
        }
      });
    } else {
      arr[2] = (arr[0].length + 1).toString();
      if (arr[1] == "*") {
        value = astericHandler(value, arr[0], arr[1], parseInt(arr[2]), " ");
      } else if (arr[1] == '**') {
        value = doubleAstericHandler(value, arr[0], arr[1], parseInt(arr[2]), " ");
      } else {
        value = getFormat(value, arr[0], arr[1], parseInt(arr[2]), " ");
      }
    }
    output = value;
  } else {
    output = null;
  }
  if (value != "" && value != null && value != undefined && linky && linky.detectLinks == true) {
    let targ;
    if (linky.target != null && linky.target != "") {
      targ = linky.target;
    } else {
      targ = "_self";
    }
    output = linkfy(value, targ);
  }
  if (output) {
    output = output.replace(/ <br> /g, "<br>");
  }
  output = transformContentInsideEm(output, originalArr);
  return output ? output.trim() : "";
}

function transformContentInsideEm(inputString, originalArr) {
  // Define the tag-to-replacement mapping as an array with 3 elements: [tag, symbol, priority]
 
  // Match the <em> tag and its content
  return inputString.replace(/<em>(.*?)<\/em>/gs, function(match, content) {
      // Perform tag-to-symbol replacement inside the <em> content
      originalArr.forEach(([tag, replacement]) => {
          // Replace opening and closing tags of each mapped tag with the symbol
          const openTag = new RegExp(`<${tag}>`, 'g');
          const closeTag = new RegExp(`</${tag}>`, 'g');
          content = content.replace(openTag, replacement).replace(closeTag, replacement);
      });
      
      // Return the modified <em> tag with converted content
      return `<em>${content}</em>`;
  });
}

function doubleAstericHandler(text, tag, iden, trim, space) {
  let box = [];
  let arr = [];
  let finalText = "";
  let a = text.split(" ");
  let singleStericCounter = 0;
  a.forEach(function (e) {
    if (
      e.length > 1 &&
      e.includes(iden) &&
      (e.match(/\*\*/g) || []).length == 1
    ) {
      ++singleStericCounter;
    }
  });
  singleStericCounter = singleStericCounter - 1;
  let flag = "1";
  let loopCounter = 0;
  a.forEach(function (e) {
    if (
      e.length > 1 &&
      e.includes(iden) &&
      (e.match(/\*\*/g) || []).length == 1
    ) {
      if (loopCounter == singleStericCounter && loopCounter % 2 == 0) {
      } else {
        if (flag == "1") {
          e = e.replace(/\*\*/g, "<" + tag + ">");
          flag = "2";
        } else {
          e = e.replace(/\*\*/g, "</" + tag + ">");
          flag = "1";
        }
        ++loopCounter;
      }
    }
    if (e.length > 1 && (e.match(/\*\*/g) || []).length > 1) {
      const n = (e.match(/\*\*/g) || []).length;

      for (let i = 0; i < n; i++) {
        if (i == 0) {
          box.push(e.indexOf(iden, i));
        } else {
          let len = box.length - 1;
          let v = box[len];
          v = v + 1;
          box.push(e.indexOf(iden, v));
        }
      }
      
      // Check if there's content between the ** markers
      let firstIndex = box[0];
      let lastIndex = box[box.length - 1];
      let contentBetween = e.substring(firstIndex + 2, lastIndex);
      
      if (contentBetween.trim().length > 0) {
        e = e.replace('**', "<" + tag + ">");
        e = e.replace('**', "</" + tag + ">");
      }
      box = [];
    }
    
    arr.push(e);
  });
  arr.forEach(function (e) {
    if (e == "") {
      finalText = finalText + space;
    } else {
      finalText = finalText + e + space;
    }
  });

  return finalText;
}


function astericHandler(text, tag, iden, trim, space) {
  let box = [];
  let arr = [];
  let finalText = "";
  let a = text.split(" ");
  let singleStericCounter = 0;
  a.forEach(function (e) {
    if (
      e.length > 1 &&
      e.includes(iden) &&
      (e.match(/\x2a/g) || []).length == 1
    ) {
      ++singleStericCounter;
    }
  });
  singleStericCounter = singleStericCounter - 1;
  let flag = "1";
  let loopCounter = 0;
  a.forEach(function (e) {
    if (
      e.length > 1 &&
      e.includes(iden) &&
      (e.match(/\x2a/g) || []).length == 1
    ) {
      if (loopCounter == singleStericCounter && loopCounter % 2 == 0) {
      } else {
        // Check if there's actual content between paired asterisks across words
        if (flag == "1") {
          e = e.replace(/\x2a/g, "<" + tag + ">");
          flag = "2";
        } else {
          e = e.replace(/\x2a/g, "</" + tag + ">");
          flag = "1";
        }
        ++loopCounter;
      }
    }

    if (e.length > 1 && (e.match(/\x2a/g) || []).length > 1) {
      const n = (e.match(/\x2a/g) || []).length;

      for (let i = 0; i < n; i++) {
        if (i == 0) {
          box.push(e.indexOf(iden, i));
        } else {
          let len = box.length - 1;
          let v = box[len];
          v = v + 1;
          box.push(e.indexOf(iden, v));
        }
      }
      let firstIndex = box[0];
      let lastIndex = box[box.length - 1];
      
      // Check if there's content between the * markers
      let contentBetween = e.substring(firstIndex + 1, lastIndex);
      
      if (contentBetween.trim().length > 0) {
        e = replaceChar(e, "<" + tag + ">", firstIndex);
        e = replaceChar(e, "</" + tag + ">", lastIndex + trim);
      }
      box = [];
    }

    arr.push(e);
  });
  arr.forEach(function (e) {
    if (e == "") {
      finalText = finalText + space;
    } else {
      finalText = finalText + e + space;
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


function getFormat(text, tag, iden, trim, space) {
  let box = [];
  let arr = [];
  let finalText = "";
  let a = text.split(" ");
  let singleStericCounter = 0;
  a.forEach(function (e) {
    if (
      e.length > 1 &&
      e.includes(iden) &&
      (e.match(new RegExp(iden, "g")) || []).length == 1
    ) {
      ++singleStericCounter;
    }
  });
  singleStericCounter = singleStericCounter - 1;
  let flag = "1";
  let loopCounter = 0;
  a.forEach(function (e) {
    if (
      e.length > 1 &&
      e.includes(iden) &&
      (e.match(new RegExp(iden, "g")) || []).length == 1
    ) {
      if (loopCounter == singleStericCounter && loopCounter % 2 == 0) {
      } else {
        if (flag == "1") {
          e = e.replace(new RegExp(iden, "g"), "<" + tag + ">");
          flag = "2";
        } else {
          e = e.replace(new RegExp(iden, "g"), "</" + tag + ">");
          flag = "1";
        }
        ++loopCounter;
      }
    }
    if (e.length > 1 && (e.match(new RegExp(iden, "g")) || []).length > 1) {
      const n = (e.match(new RegExp(iden, "g")) || []).length;

      for (let i = 0; i < n; i++) {
        if (i == 0) {
          box.push(e.indexOf(iden, i));
        } else {
          let len = box.length - 1;
          let v = box[len];
          v = v + 1;
          box.push(e.indexOf(iden, v));
        }
      }
      let firstIndex = box[0];
      let lastIndex = box[box.length - 1];

      // Check if there's content between the formatting markers
      let contentBetween = e.substring(firstIndex + iden.length, lastIndex);
      
      if (contentBetween.trim().length > 0) {
        e = replaceChar(e, "<" + tag + ">", firstIndex);
        e = replaceChar(e, "</" + tag + ">", lastIndex + trim);
      }

      box = [];
    }
    arr.push(e);
  });

  arr.forEach(function (e) {
    if (e == "") {
      finalText = finalText + space;
    } else {
      finalText = finalText + e + space;
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

function linkfy(text, target) {
  let strictUrlExpression =/^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.(?![\p{Extended_Pictographic}])\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.(?![\p{Extended_Pictographic}])\d{1,3}){2})(?!172\.(?![\p{Extended_Pictographic}])(?:1[6-9]|2\d|3[0-1])(?:\.(?![\p{Extended_Pictographic}])\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?![\p{Extended_Pictographic}])(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?![\p{Extended_Pictographic}])(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?![\p{Extended_Pictographic}])(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?![\p{Extended_Pictographic}])(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/giu;
  let looseUrlExpression = /^https?\:\/\/[^\/\s]+(\/.*)?$/;
  let ip4Expression = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]):[0-9]+\b(\/[-a-zA-Z0-9@:%_\+.~#?&\/=]*)?/g;
  let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  let httpVerify = /^((http|https|ftp):\/\/)/;
  let strictUrlRegex = new RegExp(strictUrlExpression);
  let looseUrlRegex = new RegExp(looseUrlExpression);
  let ip4Regex = new RegExp(ip4Expression);
  let emailRegexx = new RegExp(emailRegex);
  let a = text.split(" ");
  let finalText = "";
  a.map(function (part, index) {
    if (part != " " && part != "" && part != undefined && part != "<br>") {
      if (part.match(emailRegexx)) {
        let ref = part;
        ref = ref.replace(/<[^>]*>?/gm, "");
        a[index] = "<a href='mailto:" + ref + "' target='" + target + "'>" + part + "</a>";
      } else if (part.match(looseUrlRegex)) {
        let ref = part;
        ref = ref.replace(/<[^>]*>?/gm, "");
        a[index] = "<a href='" + ref + "' target='" + target + "'>" + part + "</a>";
      } else if (part.match(strictUrlRegex)) {
        let ref = part;
        ref = ref.replace(/<[^>]*>?/gm, "");
        if (ref.match(httpVerify)) {
          a[index] = "<a href='" + ref + "' target='" + target + "'>" + part + "</a>";
        } else {
          a[index] = "<a href='http://" + ref + "' target='" + target + "'>" + part + "</a>";
        }
      } else if (part.match(ip4Regex)) {
        let ref = part;
        ref = ref.replace(/<[^>]*>?/gm, "");
        a[index] = "<a href='http://" + ref + "' target='" + target + "'>" + part + "</a>";
      }
    }
  });
  a.forEach(function (e) {
    if (e == "") {
      finalText = finalText + " ";
    } else {
      finalText = finalText + e + " ";
    }
  });
  return finalText;
}

module.exports.ibsFormat = ibsFormat;
