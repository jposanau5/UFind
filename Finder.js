// This is what our customer data looks like.
const customerData = [
  { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
  { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" }
];

//event.target.style.backgroundColor = 'red'; //alert(e.tagName);

var sss = "";
var ddd = document.getElementById("foo");

    for (var i in customerData) {
      ddd.value = customerData[0].name;
    };

function showHide(event) {
    e = event.target.parentElement;
    //alert(e.tagName); // alert(e.innerHTML); // .parentElement.className;

    if (e.className == "l1collapsed") {
      e.className = "l1expanded";
    }
    else if (e.className == "l1expanded"){
      e.className = "l1collapsed";
    }
    else if (e.className == "l2collapsed") {
      e.className = "l2expanded";
    }
    else if (e.className == "l2expanded"){
      e.className = "l2collapsed";
    }
    else if (e.className == "l3collapsed") {
      e.className = "l3expanded";
    }
    else if (e.className == "l3expanded"){
      e.className = "l3collapsed";
    }
    else if (e.className == "l4collapsed") {
      e.className = "l4expanded";
    }
    else if (e.className == "l4expanded"){
      e.className = "l4collapsed";
    };
};