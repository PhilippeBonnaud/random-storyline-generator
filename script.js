const requestURL = "criteriasTables.json"
const request = new XMLHttpRequest()
let criteriasTables

request.open('GET', requestURL)
request.responseType = 'json'
request.send()
request.onload = () => {
	criteriasTables = request.response
}

function whichDataShouldGenerate(htmlCollection) {
	let desired = {}
	//iterating through the elements to get an object {"dataDesired": "howMuchShouldGenerate"}
	for (let i = 0; i < htmlCollection.length; i++) {

		if (htmlCollection[i]["id"] === "characterFunction" && htmlCollection[i]["checked"] === true) {
			desired["characterFunction"] = desired["characterType"]

		} else if (htmlCollection[i]["id"] === "characterFunction" && htmlCollection[i]["checked"] === false) {
			desired["characterFunction"] = 0

		} else if (htmlCollection[i]["type"] !== "button") {

			if (htmlCollection[i]["value"] === "") {
				desired[htmlCollection[i]["id"]] = 0

			} else {
				desired[htmlCollection[i]["id"]] = htmlCollection[i]["valueAsNumber"]
			}
		}
	}
	return desired
}

function getRequestedData(desiredDataObject, storyGenetorTables) {
	let selected = []

	for (table in desiredDataObject) {

		if (desiredDataObject[table] != 0) {
			selected[table] = getXElements(shuffleArray(storyGenetorTables[table]), desiredDataObject[table])
		}
	}
	console.log(selected)
	return selected
}

function shuffleArray(array) {

	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]]
	}

	return array
}

function getXElements(shuffledArray, nbOfElements) {
	return shuffledArray.splice(0, nbOfElements)
}

function organizeRequestedData(selectedDataArray) {
	let currentData = selectedDataArray
	let organizedData = {
		character: []
	}

	for (key in currentData) {
		if (key.includes("character")) {
			for (let i = 0; i < currentData[key].length; i++) {
				if (!organizedData["character"][i]) {
					organizedData["character"][i] = []
				}

				organizedData["character"][i].push(currentData[key][i])
			}
		} else {
			organizedData[key] = currentData[key]
		}
	}

	return organizedData
}

function populateHTML(orderedDataObject) {
	let storySection = document.createElement('section')
	storySection.id = "result"

	for (key in orderedDataObject) {
		let articleBody = document.createElement('article')
		let listTitle = document.createElement('h3')
		listTitle.textContent = shapeTitle(key)
		let listBody = document.createElement("ol")
		let array = orderedDataObject[key]

		//program does not build li elements (????)
		if (array[0].constructor === Array) {
			console.log("What is in array ?", array)
			for (let j = 0; j < array.length; j++) {
				let listItem = document.createElement("li")
				listItem.textContent = array[j].join(' ')
				listBody.appendChild(listItem)
			}
		} else {
			for (let k = 0; k < array.length; k++) {
				let listItem = document.createElement("li")
				listItem.textContent = array[k]
				listBody.appendChild(listItem)
			}
		}
		console.log(listBody)
		articleBody.appendChild(listTitle)
		articleBody.appendChild(listBody)
		storySection.appendChild(articleBody)
	}

	document.body.appendChild(storySection)
}

function shapeTitle(string) {
	return string.charAt(0).toUpperCase() + string.slice(1).split(/(?=[A-Z])/).join(" ")
}

function generateStory() {
	const userInputs = document.querySelectorAll("input")

	let dataToGenerate = whichDataShouldGenerate(userInputs)
	let selectedData = getRequestedData(dataToGenerate, criteriasTables)
	let orderedData = organizeRequestedData(selectedData)
	console.log(orderedData)
	populateHTML(orderedData)
}