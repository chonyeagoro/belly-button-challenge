//const sample_json = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";
const sample_json = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"; 

// Function to retrieve demographic information
function getDemoInformation(samples) {
    // Assuming sample_json is a global variable containing the JSON data
    d3.json(sample_json).then(function(data) {
        // Extract metadata from the JSON data
        let info = data.metadata;
        // Filter metadata for the specified sample ID
        let metadataArray = info.filter(infoObject => infoObject.id == samples);
        // Get the first matching metadata object
        let metaResult = metadataArray[0];
        // Assuming there's an HTML element with the id "sample-metadata" to display the demographic info
        let demographicInfo = d3.select("#sample-metadata");
        // Clear any existing content in the HTML element
        demographicInfo.html("");
        // Iterate over the key-value pairs in the metadata object and display them
        for (key in metaResult) {
            demographicInfo.append("h6").text(`${key.toUpperCase()}: ${metaResult[key]}`);
          };
        Gauge(shareResult.wfreq);
    });
};

function buildCharts(sample) {
    d3.json(sample_json).then((data) => {
      let samples = data.samples;
      let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      let result = resultArray[0];
      let otu_ids = result.otu_ids;
      let otu_labels = result.otu_labels;
      let sample_values = result.sample_values;

      let xticks = sample_values.slice(0, 10).reverse();
      //Creates labels for the y-axis of the bar chart by taking the first 10 OTU IDs, formatting them as "OTU <ID>", and reversing their order.
      let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

//Then here we are deining the data for the bar chart
    let barTrace = [{
        x: xticks, 
        y: yticks,
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation : "h"
    }];
    let barLayout = {
      title: "Top 10 OTU IDs", 
      margin: {
        t: 30, 
        l: 150 
      }
    };

    let barData = barTrace; 

    let bubbleTrace = [{
        x: otu_ids,
        y: sample_values,
        text: otu_labels, 
        type: "bubble", 
        mode: 'markers',
        marker: {
            size: sample_values, 
            color: otu_ids
        }
    }]; 
    let bubbleLayout = {
        title: "Top 10 OTU IDs",
        showlegend: false,
        xaxis: {title: "OTU ID"},
        yaxis: {title: 'sample count'}
    };

    let bubbleData = bubbleTrace;

//Here you then instruct Plotly to create a new bar chart using the prepared data and layout.
    Plotly.newPlot("bar", barData, barLayout);
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
});
}


//Update all the plots when a new sample is selected. 
//Additionally, you are welcome to create any layout 
//that you would like for your dashboard. 
function updatePlotList(selectList) {
    buildCharts(selectList); 
    getDemoInformation(selectList); 
}; 

// create the function for the initial data rendering
function init() {
    let dropMenu = d3.select("#selDataset");
    d3.json(sample_json).then(function(data) {
        let subjectNames = data.names; 
        for (let i = 0; i < subjectNames.length; i++) {
            // dropdown and chain
            dropMenu.append('option').text(subjectNames[i]).property('value', subjectNames[i]);
            
        };
        let subjectIDnumber= subjectNames[0];
        buildCharts(subjectIDnumber);
        getDemoInformation(subjectIDnumber); 
      
    });
    
}

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample); 
    getDemoInformation(newSample);
}; 

init(); 





