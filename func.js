
var apiURL = "https://bad-api-assignment.reaktor.com";
var proxyURL = "https://cors-anywhere.herokuapp.com/"; //Is this a problem? Dependency on 3rd party

var productlistURL = '/v2/products/';
var availabilityURL = '/v2/availability/';

var listHTML = document.getElementById('list');

var productData;
var availabilityData;

function loadData() {
    listHTML.innerHTML = "Loading, please wait...";

    let manufacturerURLs = [];
    let productURLs = [(proxyURL + apiURL + productlistURL + "gloves"),
    (proxyURL + apiURL + productlistURL + "facemasks"),
    (proxyURL + apiURL + productlistURL + "beanies")];

    Promise.all(productURLs.map(url => fetch(url)
        .then(response => response.json())
        .catch(err => console.error(err))
    )).then(products => {
        productData = products;
        return productData;
    }).then(item => {
        let manufacturers = [];
        for (x in item) {
            manufacturers.push(item[x].map(maker => maker.manufacturer).filter((value, index, self) => self.indexOf(value) === index));
        }
        var merged = [].concat.apply([], manufacturers).filter((value, index, self) => self.indexOf(value) === index);
        return merged;
    }).then(makers => {
        for (x in makers) {
            manufacturerURLs.push(proxyURL + apiURL + availabilityURL + makers[x]);
        }
        return manufacturerURLs;
    }).then(data => getAvailabilityData(data))
        .catch(err => console.error(err));
}

function getAvailabilityData(manuURLs) {
    console.log("getAvailabilityData function entered");
    Promise.all(manuURLs.map(url => fetch(url)
        .then(response => response.json())
        .catch(err => console.error(err))
    ))/*.then(manufacturers => { //Check if any fetch failed and redo it
        for (x in manufacturers) {
            if (manufacturers[x].response == "[]") {
                fetch(manuURLs[x])
                    .then(response => response.json())
                    .then(data => {
                        return JSON.parse(manufacturers).push(data);
                    })
                    .catch(err => console.error(err));
            }
        }
    })*/.then(manufacturers => {
        console.log(manufacturers);
        let mergedManufacturers = [].concat.apply([], manufacturers).map(x => x.response);
        //console.log(mergedManufacturers);
        let mergedAvailabilityData = [].concat.apply([], mergedManufacturers).filter(x => x != "[]");
        listHTML.innerHTML = "Ready to choose category";
        availabilityData = mergedAvailabilityData;
    }).catch(error => error.serverGetSearchError);
}

function chooseProduct(categoryIndex) {
    if (categoryIndex) {
        listHTML.innerHTML = "Finding products...";
        displayData(availabilityData, categoryIndex);
    } else {
        listHTML.innerHTML = "Choose a product category";
    }
}

function displayData(availabilityData, categoryIndex) {
    let products = productData[categoryIndex];
    console.log(availabilityData);
    console.log(products.length);
    var text = "<table border='1' frame='void' rules='rows' class='productTable'><tr><th>Name</th><th>Color</th><th>Price</th><th>Manufacturer</th><th>Availability</th></tr>"
    for (n = 0; n < products.length; n++) {
        console.log("ID found");
        listHTML.innerHTML = "Getting products: " + (n + 1) + "/" + products.length;
        let findAvailableID = availabilityData.filter(x => x.id.toString() === products[n].id.toString().toUpperCase()); //The availability data for the one specific ID of the product
        if (findAvailableID.length > 0) {
            text += "<tr>";
            text += "<td>" + products[n].name.toString() + "</td>";
            if (products[n].color.length == 1) {
                text += "<td>" + products[n].color.toString().charAt(0).toUpperCase() + products[n].color.toString().slice(1) + "</td>";
            } else {
                //Käytä string.replace()
                text += "<td>"
                for (x in products[n].color) {
                    text += products[n].color[x].toString().charAt(0).toUpperCase() + products[n].color.toString().slice(1);
                }
                text += "</td>"
            }

            text += "<td>" + products[n].price.toString() + "</td>";
            text += "<td>" + products[n].manufacturer.toString().charAt(0).toUpperCase() + products[n].manufacturer.toString().slice(1) + "</td>";
            if (findAvailableID[0].DATAPAYLOAD.toString() === "<AVAILABILITY>\n  <CODE>200</CODE>\n  <INSTOCKVALUE>INSTOCK</INSTOCKVALUE>\n</AVAILABILITY>") {
                text += '<td class="greenCell">Available</td>';
            } else if (findAvailableID[0].DATAPAYLOAD.toString() === "<AVAILABILITY>\n  <CODE>200</CODE>\n  <INSTOCKVALUE>LESSTHAN10</INSTOCKVALUE>\n</AVAILABILITY>") {
                text += '<td class="yellowCell">Less than 10</td>';
            } else if (findAvailableID[0].DATAPAYLOAD.toString() === "<AVAILABILITY>\n  <CODE>200</CODE>\n  <INSTOCKVALUE>OUTOFSTOCK</INSTOCKVALUE>\n</AVAILABILITY>") {
                text += '<td class="redCell">Unavailable</td>';
            } else {
                text += "<td>No data</td>";
            }
            text += "</tr>";
        } else {
            console.log("No ID found");
            continue;
        }
    }
    text += "</table>"
    listHTML.innerHTML = text;
}



//TODO:
//Deal with it not finding all availability data
//Make a less ugly UI








//Example product data
/*
[
    {
        "id": "a248ed63d2598c6eedceacc9",
        "type": "gloves",
        "name": "HEMDAL RAIN",
        "color": [
            "purple"
        ],
        "price": 86,
        "manufacturer": "hennex"
    },
    {
        "id": "f766297eff58dbb06da461c",
        "type": "gloves",
        "name": "KOLUP ALPINE LIGHT",
        "color": [
            "grey"
        ],
        "price": 45,
        "manufacturer": "hennex"
    }
]
*/

//Example availability data
/*
{
    "code": 200,
        "response": [
            {
                "id": "50CA669520ABB25C5F9",
                "DATAPAYLOAD": "<AVAILABILITY>\n  <CODE>200</CODE>\n  <INSTOCKVALUE>INSTOCK</INSTOCKVALUE>\n</AVAILABILITY>"
            },
            {
                "id": "2CD129BC0C4BE590A6BD6",
                "DATAPAYLOAD": "<AVAILABILITY>\n  <CODE>200</CODE>\n  <INSTOCKVALUE>INSTOCK</INSTOCKVALUE>\n</AVAILABILITY>"
            }
        ]
}
*/