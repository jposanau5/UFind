// Polyfill - Add support for trim() not available in IE8
// http://www.w3schools.com/jsref/jsref_trim_string.asp
// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/trim
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    "use strict";
    return this.replace(/^\s+|\s+$/gm, '');
  };
}

// treeTable sample data
var tt = [["C&M", "Construction and Maintenance", "(none)", 0, "", ""],
["AACU0001", "Buildings & Facilities", "C&M", 1, "", ""],
["72100000", "Building and facility maintenance and repair services", "AACU0001", 2, "Excludes PCs, PC accessories, or MFD (Printer) Service.   Related:", ""],
["72101500", "Building maintenance and repair ervices", "72100000", 3, "", [["000020-001", "Asbestos Removal RPQ", "Caylamax Demolitions Pty Ltd"], ["000020-004", "Asbestos Removal RPQ", "Hawley Constructions Pty Ltd"], ["000020-005", "Asbestos Removal RPQ", "Northside Demolitions Pty Ltd"]]],
["72101501", "Handyman services", "72101500", 4, "", ""],
["72101504", "Disaster proofing or contingency services", "72101500", 4, "use this for...", ""],
["72101505", "Locksmith services", "72101500", 4, "", ""],
["72103100", "Conveyance systems installation and repair", "72100000", 3, "", ""],
["72120000", "Non-residential building construction services", "AACU0001", 2, "", ""],
["72121000", "New industrial building and warehouse construction services", "72120000", 3, "industrial", ""],
["C&S", "Commodities and Services", "(none)", 0, "does this comment appear?", ""],
["AACU0009", "Professional Services", "C&S", 1, "professional", ""],
["80100000", "Management advisory services", "AACU0009", 2, "", ""],
["80101500", "Business and corporate management consultation services", "80100000", 3, "", ""],
["80101504", "Strategic planning consultation services", "80101500", 4, "", ""]];

// tableRow global variable
var tr;

// *********************************************************************************
// highlight all matches within orginal string
// *********************************************************************************
function highlightString(found, origStr) {
  "use strict";
  var strHL = "", // string reformatted to include <span> tags to highlight the match
    start = 0, // position (in a string) to begin next search
    pos = 0, // position (in a string) where the match occurred
    i = 0; // counter to move through array of found substrings
  
  if (found === null) {
    return origStr;

  } else { // highlight all matches within string
    for (i = 0; i < found.length; i += 1) {
      pos = origStr.indexOf(found[i], start);
      strHL = strHL + origStr.slice(start, pos) + "<span class='highlight'>" + found[i] + "</span>";
      start = pos + found[i].length;
    }
    return (strHL + origStr.slice(start, origStr.length));
  }
}

var userSearch = "service";

// *********************************************************************************
// recursive function to append next code hierarchy node into HTML DOM
// *********************************************************************************
function iter(pn) { // parentNode, tableRow
  "use strict";
    
  var level = tt[tr][3], // BCC hierarchy level 0 to 4.  Analogous to UNSPSC levels 1 to 4.
    cdNode = pn.appendChild(document.createElement("div")), // code and description node
    commNode = null, // comment node
    expCollNode = null, // expand-collapse toggle indicator
    contlistNode = null, // contracts list table node
    contlistRow = null, // contracts list table row

    // code, description, comment strings
    code = null,
    descrip = null,
    comment = null,

    // search results
    foundInCode = null,
    foundInDescrip = null,
    foundInComment = null,
    foundInContractsList = null,
    ci = 0, // counter to move through contracts list
    childMatchesUserSearch = false;

  cdNode.className = "l" + level;
  
  switch (level) {
  case 0:
       
    // scan description, and comment
    foundInDescrip = tt[tr][1].match(new RegExp(userSearch, "gi")); //returns array of matches
    foundInComment = tt[tr][4].match(new RegExp(userSearch, "gi")); //returns array of matches

    // if nothing found
    if (foundInDescrip === null && foundInComment === null) {

      // HTML for descrip without highlighting
      cdNode.appendChild(document.createTextNode(tt[tr][1]));

      // HTML for comment (if comment exists) without highlighting
      if (tt[tr][4].trim()) {
        commNode = cdNode.appendChild(document.createElement("div"));
        commNode.className = "l0comment";
        commNode.innerHTML = tt[tr][4];
      }
      
    // else something found
    } else {
      
      // HTML for descrip with highlighting
      cdNode.innerHTML = highlightString(foundInDescrip, tt[tr][1]);
      
      // HTML for comment (if comment exists) with highlighting
      if (tt[tr][4].trim()) {
        commNode = cdNode.appendChild(document.createElement("div"));
        commNode.className = "l0comment";
        commNode.innerHTML = highlightString(foundInComment, tt[tr][4]);
      }
    }
    break;
      
  case 1:

    // scan description, and comment
    foundInDescrip = tt[tr][1].match(new RegExp(userSearch, "gi")); //returns array of matches
    foundInComment = tt[tr][4].match(new RegExp(userSearch, "gi")); //returns array of matches

    // if nothing found
    if (foundInDescrip === null && foundInComment === null) {

      // HTML for descrip without highlighting
      cdNode.appendChild(document.createTextNode(tt[tr][1]));

      // HTML for comment (if comment exists) without highlighting
      if (tt[tr][4].trim()) {
        commNode = cdNode.appendChild(document.createElement("div"));
        commNode.className = "l1comment";
        commNode.innerHTML = tt[tr][4];
      }
      
    // else something found
    } else {
      
      // HTML for descrip with highlighting
      cdNode.innerHTML = highlightString(foundInDescrip, tt[tr][1]);
      
      // HTML for comment (if comment exists) with highlighting
      if (tt[tr][4].trim()) {
        commNode = cdNode.appendChild(document.createElement("div"));
        commNode.className = "l1comment";
        commNode.innerHTML = highlightString(foundInComment, tt[tr][4]);
      }
    }
    break;
      
  case 2:

    // scan description, and comment
    foundInDescrip = tt[tr][1].match(new RegExp(userSearch, "gi")); //returns array of matches
    foundInComment = tt[tr][4].match(new RegExp(userSearch, "gi")); //returns array of matches

    // if nothing found
    if (foundInDescrip === null && foundInComment === null) {

      // HTML for descrip without highlighting
      cdNode.appendChild(document.createTextNode(tt[tr][1]));

      // HTML for comment (if comment exists) without highlighting
      if (tt[tr][4].trim()) {
        commNode = cdNode.appendChild(document.createElement("div"));
        commNode.className = "l2comment";
        commNode.innerHTML = tt[tr][4];
      }
      
    // else something found
    } else {
      
      // HTML for descrip with highlighting
      cdNode.innerHTML = highlightString(foundInDescrip, tt[tr][1]);
      
      // HTML for comment (if comment exists) with highlighting
      if (tt[tr][4].trim()) {
        commNode = cdNode.appendChild(document.createElement("div"));
        commNode.className = "l2comment";
        commNode.innerHTML = highlightString(foundInComment, tt[tr][4]);
      }
    }
    break;
      
  case 3:

    // scan code, description, and comment
    foundInCode = tt[tr][0].match(new RegExp(userSearch, "gi")); //returns array of matches
    foundInDescrip = tt[tr][1].match(new RegExp(userSearch, "gi")); //returns array of matches
    foundInComment = tt[tr][4].match(new RegExp(userSearch, "gi")); //returns array of matches
    // for (ci = 0; ci <= tt[tr][5].length-1; ci++) {
    //   tempArray = tt[tr][5][ci].match(new RegExp(userSearch, "gi"));
    //   if (tempArray !== null) {
    //     foundInContractsList.push(tempArray);
    //   }

    // if nothing found
    if (foundInCode === null && foundInDescrip === null && foundInComment === null && foundInContractsList === null) {

      // HTML for code and descrip without highlighting
      cdNode.appendChild(document.createTextNode(tt[tr][0] + "\u00A0\u00A0\u00A0\u00A0" + tt[tr][1]));

      // HTML for comment (if comment exists) without highlighting
      if (tt[tr][4].trim()) {
        commNode = cdNode.appendChild(document.createElement("div"));
        commNode.className = "l3or4comment";
        commNode.innerHTML = tt[tr][4];
      }
      
      // HTML for contracts list (if contracts list exists) without highlighting
      if (tt[tr][5]) {
        contlistNode = cdNode.appendChild(document.createElement("table"));
        contlistNode.className = "contListTable";
        for (ci = 0; ci <= tt[tr][5].length - 1; ci += 1) {
          contlistRow = contlistNode.insertRow(0);
          contlistRow.insertCell(0).innerHTML = tt[tr][5][ci][0];
          contlistRow.insertCell(1).innerHTML = tt[tr][5][ci][1];
          contlistRow.insertCell(2).innerHTML = tt[tr][5][ci][2];
        }
      }
      
    // else something found
    } else {
      
      // HTML for code and descrip with highlighting
      cdNode.innerHTML = highlightString(foundInCode, tt[tr][0]) + 
        "\u00A0\u00A0\u00A0\u00A0" + highlightString(foundInDescrip, tt[tr][1]);
      
      // HTML for comment (if comment exists) with highlighting
      if (tt[tr][4].trim()) {
        commNode = cdNode.appendChild(document.createElement("div"));
        commNode.className = "l3or4comment";
        commNode.innerHTML = highlightString(foundInComment, tt[tr][4]);
      }
    }
    break;
      
  case 4:
      
    // scan code, description, and comment
    foundInCode = tt[tr][0].match(new RegExp(userSearch, "gi")); //returns array of matches
    foundInDescrip = tt[tr][1].match(new RegExp(userSearch, "gi")); //returns array of matches
    foundInComment = tt[tr][4].match(new RegExp(userSearch, "gi")); //returns array of matches

    // if nothing found
    if (foundInCode === null && foundInDescrip === null && foundInComment === null) {

      // HTML for code and descrip without highlighting
      cdNode.appendChild(document.createTextNode(tt[tr][0] + "\u00A0\u00A0" + tt[tr][1]));

      // HTML for comment (if comment exists) without highlighting
      if (tt[tr][4].trim()) {
        commNode = cdNode.appendChild(document.createElement("div"));
        commNode.className = "l3or4comment";
        commNode.innerHTML = tt[tr][4];
      }
      
    // else something found
    } else {
      
      // HTML for code and descrip with highlighting
      cdNode.innerHTML = highlightString(foundInCode, tt[tr][0]) + 
        "\u00A0\u00A0" + highlightString(foundInDescrip, tt[tr][1]);
      
      // HTML for comment (if comment exists) with highlighting
      if (tt[tr][4].trim()) {
        commNode = cdNode.appendChild(document.createElement("div"));
        commNode.className = "l3or4comment";
        commNode.innerHTML = highlightString(foundInComment, tt[tr][4]);
      }
    }
    break;
      
  default:
    cdNode.appendChild(document.createTextNode(tt[tr][1])); // FIX THIS CODE
    break;
  }    
    
  // HTML for expand/collapse indicator control
  if (tr < tt.length - 1 && level < tt[tr + 1][3]) {
    expCollNode = cdNode.appendChild(document.createElement("div"));
    expCollNode.className = "expColl";
    $(expCollNode).click(function () {
      if ($(this).css("border-right-color") === "rgb(0, 0, 255)") {
        $(this).css("border-right-color", "grey");
        $(this).css("border-top-color", "grey");
        $(this).parent().children("div.l" + (level + 1)).slideDown();
      } else {
        $(this).css("border-right-color", "blue");
        $(this).css("border-top-color", "blue");
        $(this).parent().children("div.l" + (level + 1)).hide();
      }
    });
  }
  
  // loop through children unless this is the last row of table
  while (tr < tt.length - 1 && level < tt[tr + 1][3]) {
    tr += 1;
    //alert("ABOUT TO CALL ITER:: tr:" + tr + ", level:" + level);
    if (iter(cdNode)) {
      childMatchesUserSearch = true;
    }
  }
  
  if (foundInCode !== null || foundInDescrip !== null || foundInComment !== null || childMatchesUserSearch) {
    //$(cdNode).css("background-color", "blue");
    return true;
  } else {
    $(cdNode).hide();
    return false;
  }  
}

$(document).ready(function () {
  "use strict";
  
  // start the table row index at one row prior to the first row of the table
  tr = -1;

  // outermostNode
  var outer = document.body.appendChild(document.createElement("div"));
  outer.setAttribute("id", "outermost");
  $(outer).hide(); // hide the code tree while under construction
  
  //alert(tt.length);
  while (tr < tt.length - 1) {
    tr += 1;
    iter(outer);
  }
  //alert("finished")
  $(outer).show();
});
