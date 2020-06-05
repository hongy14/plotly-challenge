function init() {
    d3.json("samples.json").then((incomingData) => {
    var data = incomingData;
    var subject_ids = data.names;

    subject_ids.forEach((subject) => {
        var selector = d3.select("#selDataset")
        selector.append("option").text(subject).property("value", subject);
    });

    var firstSample = subject_ids[0];
    buildCharts(firstSample);
    BuildMetadata(firstSample);
});
}

init();

function optionChanged(newSample) {
    buildCharts(newSample);
    BuildMetadata(newSample);
}

//var dropDown = d3.select("#selDataset")
//dropDown.on("change", optionChanged)

function buildCharts(){
    d3.json("samples.json").then((incomingData) => {
        var data = incomingData;
        var subject_ids = data.names;
        var optionSelected = document.getElementById("selDataset")
        var selectedText = optionSelected.options[optionSelected.selectedIndex].text;
        var Index = subject_ids.indexOf(selectedText);

        var otu_ids = data.samples[Index].otu_ids;
        var top10 = otu_ids.slice(0,10).reverse();
        var bar_labels = top10.map(element =>{
            var label = "OTU"
            return label + element;
        });
    
        var sample_value = data.samples[Index].sample_values;
        var top10_sample_values = sample_value.slice(0,10).reverse();
        
        var otu_labels = data.samples[Index].otu_labels;
        var top10_otu_labels = otu_labels.slice(0,10).reverse();

        var bar_trace = {
            y : bar_labels,
            x : top10_sample_values,
            text : top10_otu_labels,
            type: 'bar',
            orientation: 'h'
        };

        Plotly.newPlot("bar", [bar_trace]);

        var pie_trace = {
            values: top10_sample_values,
            labels: bar_labels,
            type: 'pie'
        };

        Plotly.newPlot("gauge", [pie_trace]);

        var bubble_trace = {
            x : otu_ids,
            y : sample_value,
            text : otu_labels,
            mode : 'markers',
            marker : {
                size: sample_value,
                color: otu_ids,
                colorscale: 'earth'
            }
        };

        Plotly.newPlot("bubble", [bubble_trace]);

    });
};

function BuildMetadata(){
    d3.json("samples.json").then((incomingData) => {
        var data = incomingData;
        var optionSelected = document.getElementById("selDataset");
        var selectedText = optionSelected.options[optionSelected.selectedIndex].text;

        var metaData = data.metadata;
        var result = metaData.filter( individual => individual.id == selectedText);
        var resultObj = result[0];

        var resultArray = Object.entries(resultObj);

        var infoBox = d3.select("#sample-metadata");
        infoBox.html("");

        resultArray.forEach(([key,value]) => infoBox.append("h6").text(`${key} : ${value}`))
    });
};