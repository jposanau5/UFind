// Polyfill - Add support for trim() not available in IE8
// http://www.w3schools.com/jsref/jsref_trim_string.asp
// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/trim
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    "use strict";
    return this.replace(/^\s+|\s+$/gm, '');
  };
}



// tableRow global variable
var tr = null,
    vendorOptionInput = null;

// *********************************************************************************
// replace target text node with HTML containing spans around text to be highlighted
// *********************************************************************************
function highlightNode(found, target, parent) {
  "use strict";
  var strHL = "", // string reformatted to include <span> tags to highlight the match
    start = 0, // position (in a string) to begin next search
    pos = 0, // position (in a string) where the match occurred
    i = 0, // counter to move through array of found substrings
    newNode = null; // new inserted node (passed back to calling function to replace deleted)
    
  
  for (i = 0; i < found.length; i += 1) {

    pos = target.data.indexOf(found[i], start);

    if (pos > start) {
      parent.insertBefore(document.createTextNode(target.data.slice(start, pos)), target);
    }
    
    newNode = document.createElement("span");
    newNode.className = "highlight";
    newNode.appendChild(document.createTextNode(found[i]));
    parent.insertBefore(newNode, target);
    
    start = pos + found[i].length;
  }
  
  if (target.data.length > start) {
    newNode = document.createTextNode(target.data.slice(start, target.data.length));
    parent.insertBefore(newNode, target);
  }
  
  parent.removeChild(target);
  return newNode;
}
//target.insertData(0, "$");

var userSearch = "";

// *********************************************************************************
// recursive function to UNSPSC code table node into HTML DOM
// *********************************************************************************
function buildTree(pn) { // parentNode, tableRow
  "use strict";
    
  var level = tt[tr][3], // BCC hierarchy level 0 to 4.  Analogous to UNSPSC levels 1 to 4.
    cdNode = pn.appendChild(document.createElement("div")), // code and description node
    commNode = null, // comment node
    expCollNode = null, // expand-collapse toggle indicator
    delNode = null, // deleted text -- is this required?
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
    // HTML for descrip
    cdNode.appendChild(document.createTextNode(tt[tr][1]));

    // HTML for comment (if comment exists)
    if (tt[tr][4].trim()) {
      commNode = cdNode.appendChild(document.createElement("div"));
      commNode.className = "l0comment";
      commNode.innerHTML = tt[tr][4];
    }
    break;
      
  case 1:
    // HTML for descrip
    cdNode.appendChild(document.createTextNode(tt[tr][1]));

    // HTML for comment (if comment exists)
    if (tt[tr][4].trim()) {
      commNode = cdNode.appendChild(document.createElement("div"));
      commNode.className = "l1comment";
      commNode.innerHTML = tt[tr][4];
    }

    // HTML for contracts list (which should not exist at level 1)
    if (tt[tr][5] = "Y") {
      contlistNode = cdNode.appendChild(document.createElement("table"));
      contlistNode.className = "contListTable";
      
      while (getCC(tt[tr][0])) {
        contlistRow = contlistNode.insertRow(-1);
        contlistRow.className = "cltrow";
        contlistRow.insertCell(0).innerHTML = cc[ccIndex - 1][1];
        contlistRow.insertCell(1).innerHTML = cc[ccIndex - 1][2];
        contlistRow.insertCell(2).innerHTML = cc[ccIndex - 1][3];
        $(contlistRow).hide();
      }
    }
    break;
      
  case 2:
    // HTML for descrip
    cdNode.appendChild(document.createTextNode(tt[tr][1]));

    // HTML for comment (if comment exists)
    if (tt[tr][4].trim()) {
      commNode = cdNode.appendChild(document.createElement("div"));
      commNode.className = "l2comment";
      commNode.innerHTML = tt[tr][4];
    }

    // HTML for contracts list (which should not exist at level 2)
    if (tt[tr][5] = "Y") {
      contlistNode = cdNode.appendChild(document.createElement("table"));
      contlistNode.className = "contListTable";
      
      while (getCC(tt[tr][0])) {
        contlistRow = contlistNode.insertRow(-1);
        contlistRow.className = "cltrow";
        contlistRow.insertCell(0).innerHTML = cc[ccIndex - 1][1];
        contlistRow.insertCell(1).innerHTML = cc[ccIndex - 1][2];
        contlistRow.insertCell(2).innerHTML = cc[ccIndex - 1][3];
        $(contlistRow).hide();
      }
    }
    break;
      
  case 3:
    // HTML for code and descrip
    cdNode.appendChild(document.createTextNode(tt[tr][0] + "\u00A0\u00A0\u00A0\u00A0" + tt[tr][1]));

    // HTML for comment (if comment exists)
    if (tt[tr][4].trim()) {
      commNode = cdNode.appendChild(document.createElement("div"));
      commNode.className = "l3or4comment";
      commNode.innerHTML = tt[tr][4];
    }

    // HTML for contracts list (if contracts list exists)
    if (tt[tr][5] = "Y") {
      contlistNode = cdNode.appendChild(document.createElement("table"));
      contlistNode.className = "contListTable";
      
      while (getCC(tt[tr][0])) {
        contlistRow = contlistNode.insertRow(-1);
        contlistRow.className = "cltrow";
        contlistRow.insertCell(0).innerHTML = cc[ccIndex - 1][1];
        contlistRow.insertCell(1).innerHTML = cc[ccIndex - 1][2];
        contlistRow.insertCell(2).innerHTML = cc[ccIndex - 1][3];
        $(contlistRow).hide();
      }
    }
    break;
      
  case 4:
    // HTML for code and descrip
    //cdNode.appendChild(document.createElement("del"));
    cdNode.appendChild(document.createTextNode(tt[tr][0] + "\u00A0\u00A0" + tt[tr][1]));

    // HTML for comment (if comment exists)
    if (tt[tr][4].trim()) {
      commNode = cdNode.appendChild(document.createElement("div"));
      commNode.className = "l3or4comment";
      commNode.innerHTML = tt[tr][4];
    }

    // HTML for contracts list (if contracts list exists)
    if (tt[tr][5] = "Y") {
      contlistNode = cdNode.appendChild(document.createElement("table"));
      contlistNode.className = "contListTable";
      
      while (getCC(tt[tr][0])) {
        contlistRow = contlistNode.insertRow(-1);
        contlistRow.className = "cltrow";
        contlistRow.insertCell(0).innerHTML = cc[ccIndex - 1][1];
        contlistRow.insertCell(1).innerHTML = cc[ccIndex - 1][2];
        contlistRow.insertCell(2).innerHTML = cc[ccIndex - 1][3];
        $(contlistRow).hide();
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
      if ($(this).css("border-right-color") === "rgb(0, 0, 255)" || $(this).css("border-right-color") === "blue") {
        $(this).css("border-right-color", "grey");
        $(this).css("border-top-color", "grey");
        //$(this).parent().children("div.l" + (level + 1)).slideDown();
        $(this).parent().children("div.l" + (level + 1)).show();
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
    if (buildTree(cdNode)) {
      childMatchesUserSearch = true;
    }
  }

  $(cdNode).hide();
  return false;
  
}


// ****************************************************************************************
// recursive function traverse UNSPSC hierarchy and highlight text matching the user search
// ****************************************************************************************
function treeHighlight(pn) { // parentNode
  "use strict";
  var node = null,
    fis = null;
  
  for (node = pn.firstChild; node; node = node.nextSibling) {
    if (node.nodeType === 3) { // text nodes only
      fis = node.data.match(new RegExp(userSearch, "gi")); //returns array of matches
      if (fis !== null) {
        node = highlightNode(fis, node, pn); //replace the current node with highlighted node(s)
      }
    }
    else {
      if (node.nodeType === 1 && (node.tagName !== "TABLE" || vendorOptionInput.checked === true)) {
        treeHighlight(node);
      }
    }
  }
  return 1;
}



// ***************
// main function
// ***************
$(document).ready(function () {
  "use strict";
  
  // create search box
  var searchInputNode = document.body.appendChild(document.createElement("input"));
  searchInputNode.setAttribute("type", "text");
  searchInputNode.setAttribute("name", "searchbox");
  searchInputNode.setAttribute("placeholder", "Search product categories, contracts and vendors");
  
  userSearch = "xzxzxzx";   // ******************************************

  // start the table row index at one row prior to the first row of the table
  tr = -1;
  
  // outermostNode
  var outer = document.body.appendChild(document.createElement("div"));
  outer.setAttribute("id", "outermost");
  $(outer).hide(); // hide the code tree while under construction

  while (tr < tt.length - 1) {
    tr += 1;
    buildTree(outer);
  }
  $(outer).show();
  
  vendorOptionInput = document.body.appendChild(document.createElement("input"));
  vendorOptionInput.setAttribute("type", "checkbox");
  vendorOptionInput.setAttribute("name", "searchContracts");
  vendorOptionInput.checked = true;
  document.body.appendChild(document.createTextNode("Include contracts"));

  // respond to search enter key pressed
  $(searchInputNode).keypress(function (e) {
    if (e.which == 10 || e.which == 13) { 
      userSearch = $("input").val();
      
      //hide all nodes and remove highlighting
      $("tr.cltrow:has(span)").hide();
      $("div.l4:has(span)").hide();
      $("div.l3:has(span)").hide();
      $("div.l2:has(span)").hide();
      $("div.l1:has(span)").hide();
      $("div.l0:has(span)").hide();
      $("span.highlight").contents().unwrap();
      outer.normalize();
      
      // highlight nodes and show
//      userSearch = "services"; // ******************************************
      treeHighlight(outer);
      $("tr.cltrow:has(span)").show();
      $("div.l4:has(span)").show();
      $("div.l3:has(span)").show();
      $("div.l2:has(span)").show();
      $("div.l1:has(span)").show();
      $("div.l0:has(span)").show();

      $(outer).show();
      //$("div.l2:has(span)").hide();
  
    }
  });  
  
});

//$("span").css("background-color", "red");

//$("span.highlight").each(function() {
//var div0 = document.querySelector(".highlight").parentElement.nextSibling.childNodes[0];
//div0.firstChild.insertData(2, "$");

// NOT WORKING:
//$("div").filter(":visible").hide();
//$("div span.highlight").show();

