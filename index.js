function ibsFormat(value, arr, linky, escaping) {
  let output = null;
  escaping = escaping && escaping.allowXssEscaping == false ? false : true;
  if (value != "" && value != null && value != undefined && arr && arr.length > 0) {
    if (escaping) {
      value = value.replace(/</g, "&lt;");
      value = value.replace(/>/g, "&gt;");
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
  return output ? output.trim() : "";
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
      e = e.replace('**', "<" + tag + ">");
      e = e.replace('**', "</" + tag + ">");
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
      e = replaceChar(e, "<" + tag + ">", firstIndex);
      e = replaceChar(e, "</" + tag + ">", lastIndex + trim);
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

      e = replaceChar(e, "<" + tag + ">", firstIndex);
      e = replaceChar(e, "</" + tag + ">", lastIndex + trim);

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
  let strictUrlExpression = /[-a-zA-Z0-9@:%_\+.~#?&\/=]{1,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&\/=]*)?/gi;
  let looseUrlExpression = /^https?\:\/\/[^\/\s]+(\/.*)?$/;
  let ip4Expression = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]):[0-9]+\b(\/[-a-zA-Z0-9@:%_\+.~#?&\/=]*)?/g;
  let emailRegex = /(\S+@\S+\.\S+)/gim;
  let httpVerify = /^((http|https|ftp):\/\/)/;
  let strictUrlRegex = new RegExp(strictUrlExpression);
  let looseUrlRegex = new RegExp(looseUrlExpression);
  let ip4Regex = new RegExp(ip4Expression);
  text = text.replace(/\n/g, " <br> ");
  let a = text.split(" ");
  let finalText = "";
  a.map(function (part, index) {
    if (part != " " && part != "" && part != undefined && part != "<br>") {
      if (part.match(looseUrlRegex)) {
        let ref = part;
        ref = ref.replace(/<[^>]*>?/gm, "");
        a[index] = `<a href='${ref}' target='${target}'>${part}</a>`;
      } else if (part.match(strictUrlRegex)) {
        let ref = part;
        ref = ref.replace(/<[^>]*>?/gm, "");
        if (ref.match(httpVerify)) {
          a[index] = `<a href='${ref}' target='${target}'>${part}</a>`;
        } else if (ref.match(emailRegex)) {
          a[index] = `<a href='mailto:${ref}' target='${target}'>${part}</a>`;
        } else {
          a[index] = `<a href='http://${ref}' target='${target}'>${part}</a>`;
        }
      } else if (part.match(ip4Regex)) {
        let ref = part;
        ref = ref.replace(/<[^>]*>?/gm, "");
        a[index] = `<a href='http://${ref}' target='${target}'>${part}</a>`;
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
  finalText = finalText.replace(/ <br> /g, "<br>");
  return finalText;
}

module.exports.ibsFormat = ibsFormat;