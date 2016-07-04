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
    optionsDiv = null,
    vendorOptionInput = null,
    vendorOptionLabel = null,
    expandAllOptionInput = null,
    expandAllOptionLabel = null,
    showMarkupOptionInput = null,
    showMarkupOptionLabel = null;

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
// recursive function to write UNSPSC code table node into HTML DOM
// *********************************************************************************
function buildTree(pn) { // parentNode, tableRow
  "use strict";
    
  var level = tt[tr][3], // BCC hierarchy level 0 to 4.  Same as UNSPSC levels 1 to 4.
    cdNode = pn.appendChild(document.createElement("div")), // code and description node
    commNode = null, // comment node
    expCollNode = null, // expand-collapse toggle indicator for tree
    showHideContracts = null, // expand-collapse toggle indicator for contracts
    goToDetails = null, // go-to-details button for this UNSPSC
    goToDetailsLink = null, // go-to-details button link for this UNSPSC
    editNode = null, // three letter code: NEW/DEL/HID/CHG = new,deleted,hidden,changed
    delNode = null, // deleted text
    contlistNode = null, // contracts list table node
    contlistRow = null, // contracts list table row

    // code, description, comment, edit strings
    codeDesc = "",
//    descrip = null,
    comment = null,
    editCode = null,

    // search results
    foundInCode = null,
    foundInDescrip = null,
    foundInComment = null,
    foundInContractsList = null,
    ci = 0, // counter to move through contracts list
    childMatchesUserSearch = false;

  cdNode.className = "l" + level;
  
  // code and description
  if (level >= 3) { // only disply the code for levels 3&4
    codeDesc = tt[tr][0] + "\u00A0\u00A0"; // follow with padding spaces
    if (level === 3) {
      codeDesc = codeDesc + "\u00A0\u00A0";  // more padding for level 3
    }
  }
  codeDesc = codeDesc + tt[tr][1];
  
  // HTML for NEW/DEL/HID/CHG markers
  if (tt[tr][6].trim() && false) {
    editCode = tt[tr][6].trim();
    editNode = cdNode.appendChild(document.createElement("span"));
    editNode.className = "cd" + editCode;
    editNode.appendChild(document.createTextNode("\u00a0:" + editCode + "\u00a0"));      

    // HTML for code and descrip (for deleted codes)
    if (editCode === "DEL") {
      // deleted code and descripition are placed inside HTML <del> tags
      delNode = cdNode.appendChild(document.createElement("del"));
      delNode.appendChild(document.createTextNode(codeDesc));
    }
  }

  // HTML for code and descrip (excluding deleted codes)
  if (editCode !== "DEL") {
    cdNode.appendChild(document.createTextNode(codeDesc));
  }
  
  // HTML for a contracts-exist indicator control
  if (tt[tr][5].trim() === "Y") {
    showHideContracts = cdNode.appendChild(document.createElement("div"));
    showHideContracts.className = "expCollContracts";
    showHideContracts.appendChild(document.createTextNode("Contracts"));
    $(showHideContracts).click(function () {
      if ($(this).css("background-color") === "rgb(50, 205, 50)" || $(this).css("background-color") === "limegreen") {
        $(this).css("background-color", "grey");
        $(this).parent().children("table.contListTable").show();
        $(this).parent().children("table.contListTable").children().children().show();
      } else {
        $(this).css("background-color", "limegreen");
        $(this).parent().children("table.contListTable").hide();
        $(this).parent().children("table.contListTable").children().children().hide();        $(this).parent().children("table.contListTable").children().children("tr:has(span.highlight)").show();        $(this).parent().children("table.contListTable").children().children("tr:has(span.highlight)").parent().parent().show();
      }
    });    
  
    // HTML for details link
    goToDetails = document.createElement("div");
    goToDetails.className = "launch";
    goToDetails.appendChild(document.createTextNode("Go To Details"));
    
    goToDetailsLink = cdNode.appendChild(document.createElement("a"));
    goToDetailsLink.appendChild(goToDetails);
    goToDetailsLink.href = "ProdCat.html";
  }
  
  /*
  // HTML for details link
  goToDetails = document.createElement("div");
  goToDetails.className = "launch";
  goToDetails.appendChild(document.createTextNode("Go To Details"));
  
  goToDetailsLink = cdNode.appendChild(document.createElement("a"));
  goToDetailsLink.appendChild(goToDetails);
  goToDetailsLink.href = "ProdCat.html";
*/  
  // HTML for comment (if comment exists)
  if (tt[tr][4].trim()) {
    if (editCode !== "DEL") {
      commNode = cdNode.appendChild(document.createElement("div"));
    } else {
      // deleted code's comment also placed inside HTML <del> tags
      commNode = delNode.appendChild(document.createElement("div"));
    }
    
    // choose appropriate comment class
    if (level <= 2) {
      commNode.className = "l" + level + "comment";
    } else {
      commNode.className = "l3or4comment";
    }
    commNode.innerHTML = tt[tr][4];
  }        

  // HTML for contracts list (if contracts list exists)
  if (tt[tr][5] = "Y") {
    contlistNode = cdNode.appendChild(document.createElement("table"));
    contlistNode.className = "contListTable";
    $(contlistNode).hide();

    while (getCC(tt[tr][0])) {
      contlistRow = contlistNode.insertRow(-1);
      contlistRow.className = "cltrow";
      contlistRow.insertCell(0).innerHTML = cc[ccIndex - 1][1];
      contlistRow.insertCell(1).innerHTML = cc[ccIndex - 1][2];
      contlistRow.insertCell(2).innerHTML = cc[ccIndex - 1][3];
      $(contlistRow).hide();
    }
  }  
    
  // HTML for expand/collapse indicator control
  if (tr < tt.length - 1 && level < tt[tr + 1][3]) {
    expCollNode = cdNode.appendChild(document.createElement("div"));
    expCollNode.className = "expColl";
    $(expCollNode).click(function () {
      if ($(this).css("border-right-color") === "rgb(0, 0, 255)" || $(this).css("border-right-color") === "blue") {
        $(this).css("border-right-color", "grey");
        $(this).css("border-top-color", "grey");
        $(this).parent().children("div.l" + (level + 1)).show();
      } else {
        $(this).css("border-right-color", "blue");
        $(this).css("border-top-color", "blue");
        $(this).parent().children("div.l" + (level + 1)).hide();
        //$(this).parent().children("div.l" + (level + 1) + ":has(span.highlight)").css("background-color", "grey");
        $(this).parent().children("div.l" + (level + 1) + ":has(span.highlight)").show();
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
  
  userSearch = "build";   // ******************************************

  optionsDiv = document.body.appendChild(document.createElement("div"));
  optionsDiv.className = "optionsBox";
  
  vendorOptionInput = optionsDiv.appendChild(document.createElement("input"));
  vendorOptionInput.setAttribute("type", "checkbox");
  vendorOptionInput.setAttribute("name", "searchContracts");
  vendorOptionInput.checked = false;
  vendorOptionLabel = optionsDiv.appendChild(document.createElement("label"));
  vendorOptionLabel.setAttribute("for", "searchContracts");
  vendorOptionLabel.appendChild(document.createTextNode("Include Contracts \u00A0\u00A0"));
  
  expandAllOptionInput = optionsDiv.appendChild(document.createElement("input"));
  expandAllOptionInput.setAttribute("type", "checkbox");
  expandAllOptionInput.setAttribute("name", "expandAll");
  expandAllOptionInput.checked = false;
  expandAllOptionLabel = optionsDiv.appendChild(document.createElement("label"));
  expandAllOptionLabel.setAttribute("for", "expandAll");
  expandAllOptionLabel.appendChild(document.createTextNode("Expand All \u00A0\u00A0"));

  showMarkupOptionInput = optionsDiv.appendChild(document.createElement("input"));
  showMarkupOptionInput.setAttribute("type", "checkbox");
  showMarkupOptionInput.setAttribute("name", "markup");
  showMarkupOptionInput.setAttribute("disabled", "disabled");
  showMarkupOptionInput.checked = false;
  showMarkupOptionInput.className = "draft";
  showMarkupOptionLabel = optionsDiv.appendChild(document.createElement("label"));
  showMarkupOptionLabel.setAttribute("for", "markup");
  showMarkupOptionLabel.appendChild(document.createTextNode("Show Markup \u00A0\u00A0"));
  
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
 
  // respond to search enter key pressed
  $(searchInputNode).keypress(function (e) {
    if (e.which == 10 || e.which == 13) { 
      userSearch = $("input").val();
      
      //hide all nodes, expand-collapse buttons and remove highlighting
      $("tr.cltrow").hide();
      $("table.contListTable").hide();
      $("div.l4").hide();
      $("div.l3").hide();
      $("div.l2").hide();
      $("div.l1").hide();
      $("div.l0").hide();
      $("span.highlight").contents().unwrap();
      outer.normalize();
      $("div.expColl").css("display", "none");
  //    $("div.expCollContracts").css("display", "none");
      
      // highlight nodes and show
      if (userSearch.trim()) {
        treeHighlight(outer);
      }
      
      if (expandAllOptionInput.checked === false) {
        //initialise all expand-collapse buttons to blue
        $("div.expColl").css("border-right-color", "blue");
        $("div.expColl").css("border-top-color", "blue");
        //internet explorer 8 seems slow to filter span.highlight
        //consider replacing span with another element type
        $("tr.cltrow:has(span.highlight)").show();
        $("table.contListTable:has(span.highlight)").show();
        $("div.l4:has(span.highlight)").show();
        $("div.l3:has(span.highlight)").show();
        $("div.l2:has(span.highlight)").show();
        $("div.l1:has(span.highlight)").show();
        $("div.l0:has(span.highlight)").show();
      }
      else {
        if (vendorOptionInput.checked === true) {
          $("table.contListTable").show();
          $("tr.cltrow").show();
        }
        $("div.l4").show();
        $("div.l3").show();
        $("div.l2").show();
        $("div.l1").show();
        $("div.l0").show();
        //initialise all expand-collapse buttons to gray
        $("div.expColl").css("border-right-color", "gray");
        $("div.expColl").css("border-top-color", "gray");        
      }

      // display expand-collapse buttons for any div with child divs containing span.
$("div.l1:not(:has(span.highlight))").parent().children("div.expColl").css("display", "block");
//$("tr.cltrow > td:not(:has(span.highlight))").parent().parent().parent().parent().css("background-color", "red");
  
      $("div.l2:not(:has(span.highlight))").parent().children("div.expColl").css("display", "block");
      $("div.l3:not(:has(span.highlight))").parent().children("div.expColl").css("display", "block");
      $("div.l4:not(:has(span.highlight))").parent().children("div.expColl").css("display", "block");
      
      $(outer).show();
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
