//function to get the id of the professor on rmp for their page's url
function getProfID (url) {
    return new Promise((resolve, reject) => {
        const proxyurl = "https://cors-server-rmp.herokuapp.com/";
        fetch(proxyurl + url)
        .then(function (response) {
            switch (response.status) {
                // status "OK"
                case 200:
                    return response.text();
                // status "Not Found"
                case 404:
                    throw response;
            }
        })
        .then(function (template) {
            var index = template.indexOf("listing PROFESSOR");
            var fID = template.indexOf('<a href="', index) + 9;
            var eID = template.indexOf('">', fID);
            var id = template.substring(fID, eID);
            // console.log(id);
            // return id;
            resolve(id)
        })
        .catch((err) => {
            // "Not Found"
            console.log(err);
        }
        );
    });
}

async function createButtons(j, instructorElem, profName) {
    // Create padding
    // var space = document.createElement("span");
    // space.innerHTML = "  ";

    // Create button
    var button = document.createElement("a");
    button.innerHTML = "RMP!";

    var bLink = document.createAttribute("href");

    // Append link
    let nameArr = profName.split(" ");
    var queryURL = "https://www.ratemyprofessors.com/search.jsp?query=Cornell+"
    for (var i = 0; i < nameArr.length; i++) {
        queryURL = queryURL + nameArr[i] + "+";
    }
    let queryID = await getProfID(queryURL);
    let url = "https://www.ratemyprofessors.com" + queryID;
    console.log(url);

    bLink.value = url;
    button.setAttributeNode(bLink);

    var bClass = document.createAttribute("class");
    bClass.value = "button";
    button.setAttributeNode(bClass);

    var bTarget = document.createAttribute("target");
    bTarget.value = "_blank";
    button.setAttributeNode(bTarget);

    //Append to DOM 
    if (url.includes("ShowRatings.jsp?tid")) {
        try {
            // instructorElem[j].insertBefore(space, instructorElem[j].nextSibling);
            instructorElem[j].insertBefore(button, instructorElem[j].nextSibling);
        } catch (err) {
            console.log(err);
        }
    }
    else {
        button.innerHTML = "unrated";
        bLink.value = "https://www.ratemyprofessors.com/search.jsp?query=";
        button.setAttributeNode(bLink);
        // instructorElem[j].insertBefore(space, instructorElem[j].nextSibling);
        instructorElem[j].insertBefore(button, instructorElem[j].nextSibling);
    }
}

var professors = document.getElementsByClassName('instructors');
for (var i = 0, l1 = professors.length; i < l1; i++) {
    var instructorElem = professors.item(i).getElementsByTagName('span');
    for (var j = 0, l2 = instructorElem.length; j < l2; j++) {
        // professors name and netid
        professor = instructorElem[j].getAttribute('data-content');
        var index = professor.indexOf("(") - 1;
        var profName = professor.substring(0, index);
        createButtons (j, instructorElem, profName);
        // console.log(profName);
    }
}
