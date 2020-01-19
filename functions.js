var customButtonCount = 0;
var chart
var apiRes
var chartMap = new Map()

function getSelectedCheckboxes() {
  var form = document.getElementById('form');
    var cbResults = 'checkboxes=';
    for (var i = 0; i < form.elements.length; i++ ) {
        if (form.elements[i].type == 'checkbox') {
            if (form.elements[i].checked == true) {
                cbResults += encodeURIComponent(form.elements[i].value) + ";";
            }
        }
    }
  return cbResults.substring(0, cbResults.length - 1);
}

function addNewElementToForm() {
	var id = customButtonCount
	var value = document.getElementById('text_1').value;
    var node = document.createElement('div');        
    node.innerHTML = '<input type="checkbox" name="wordToSearch" id="' + id +'" value="' + value + '" >' + value + '<br>';
    document.getElementById('form').appendChild(node);     
    customButtonCount++
}

function apiReq() {
  var theUrl = "http://localhost:5000/get?" + getSelectedCheckboxes() + '&subreddit=' + document.getElementById("text_from_api").value
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", theUrl, false );
  xmlHttp.send();
  apiRes = xmlHttp.responseText
  generateChart()
}

function generateChart(){
  chartMap.clear()
  fillMapWithData(apiRes)
  newChart()
  chartMap.forEach(function(value, key) {
    chart.options.data[0].dataPoints.push({ y: parseInt(value), label: key});
  });
  chart.render()
}

function newChart() {
    chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,

    title:{
      text:"Most popular programming languages based on reddit posts"
    },
    axisX:{
      interval: 1
    },
    axisY2:{
      interlacedColor: "rgba(1,77,101,.2)",
      gridColor: "rgba(1,77,101,.1)",
      title: "Number of mentions"
    },
    data: [{
      type: "bar",
      name: "words",
      axisYType: "secondary",
      color: "#014D65",
      dataPoints: [
      ]
    }]
  });
  chart.render();
}

function fillMapWithData(inputData) {
  var tmp = inputData.substring(1, inputData.length - 1);
  tmp = tmp.split(',')
  tmp.forEach(arrayEntryToDict)
}

function arrayEntryToDict(item, index) {
  var key = item.split(':')[0]
  key = key.substring(1, key.length - 1);
  var value = item.split(':')[1]
  chartMap.set(key,value)
}

window.onload = function () {
  newChart()
}

