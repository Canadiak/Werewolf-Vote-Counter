if (localStorage.key(0) == null){
	
	let JSONwithArrayOfVoteDicts = {
		
		"dictList" : []
		
	}
	let string_JSONwithArrayOfVoteDicts = JSON.stringify(JSONwithArrayOfVoteDicts)
	localStorage.setItem("Vote Count", string_JSONwithArrayOfVoteDicts);
}
const inpVoter = document.getElementById("inpVoter");
const inpVoted = document.getElementById("inpVoted");
const inpVoteNum = document.getElementById("inpVoteNum");
const submitButton = document.getElementById("submitButton");
const voteCountOutput = document.getElementById("voteCountOutput");
const resetButton = document.getElementById("resetButton");
let output = '';
let entryAlreadyExists = 0;



proposeButton.onclick = function(){
		
	let voterInput = inpProposer.value;
	let votedInput = inpVoted.value;
	let voteNumInput = inpPropNum.value;
	
	//Make sure a valid submission is entered
	if(voterInput && votedInput) {
	
		let submittedVoteDict = {}
		submittedVoteDict.voter = voterInput;
		submittedVoteDict.voted = votedInput;
		submittedVoteDict.voteNum = voteNumInput;
		
		let string_currentJSONwithArrayOfVoteDicts = localStorage.getItem("Vote Count");
		let currentJSONwithArrayOfVoteDicts = JSON.parse(string_currentJSONwithArrayOfVoteDicts);
		
		//Check if voter already voted
		/*for (let counter = 0; counter < currentJSONwithArrayOfVoteDicts["dictList"].length; counter++){
			if (currentJSONwithArrayOfVoteDicts["dictList"][counter].voter == submittedVoteDict.voter) {
				
				currentJSONwithArrayOfVoteDicts["dictList"][counter].voted = submittedVoteDict.voted;
				currentJSONwithArrayOfVoteDicts["dictList"][counter].voteNum += " => " + submittedVoteDict.voteNum;
				entryAlreadyExists = 1;
				break;
			}
			
		} */
		
		if (!entryAlreadyExists){
			currentJSONwithArrayOfVoteDicts["dictList"].push(submittedVoteDict);
		}		
		localStorage.setItem("Vote Count", JSON.stringify(currentJSONwithArrayOfVoteDicts));
		//location.reload();	
	}	
};

resetButton.onclick = function(){
	
	localStorage.clear();
	location.reload();
	
}

importButton.onclick = function(){
	
	import_string_JSONwithArrayOfVoteDicts = inpVoteCode.value;
	localStorage.setItem("Vote Count", import_string_JSONwithArrayOfVoteDicts);
	location.reload();	
}


string_votesToDisplayArrayJSON = localStorage.getItem('Vote Count');
votesToDisplayArrayJSON = JSON.parse(string_votesToDisplayArrayJSON);
array_votesToDisplay =  votesToDisplayArrayJSON["dictList"];

let listOfVotedUsers = [];
let listOfVoteInfo = [];

//listOfVotedUsers creation, it is a list that contains the name of everyone voted. 
//It is just used to add people voting the same person to listOfVotedInfo.

//listOfVoteInfo creation, it contains the actual vote info.
for (let counter = 0; counter < array_votesToDisplay.length; counter++){
	
	let voter = array_votesToDisplay[counter].voter;
	let voted = array_votesToDisplay[counter].voted;
	let voteNum= array_votesToDisplay[counter].voteNum;
	
	
	if (!listOfVotedUsers.includes(voted)){
		listOfVotedUsers.push(voted);
		let propNum = listOfVotedUsers.length;
		listOfVoteInfo.push({	
			"name" : voted,
			"proposalNum" : propNum,
			"voters" : [voter],
			"voterVoteNums" : [voteNum]
		});
	}else{
		
		votedIndex = listOfVotedUsers.indexOf(voted);
		listOfVoteInfo[votedIndex]["voters"].push(voter);
		listOfVoteInfo[votedIndex]["voterVoteNums"].push(voteNum);
	}
}

//Sort algorythm
//Source: https://humanwhocodes.com/blog/2012/11/27/computer-science-in-javascript-quicksort/
//Modified slightly because it's sorted by listOfVoteInfo[index]["voters"].length, instead of just the value at listOfVoteInfo[index].
//But swap stays the same, because you do want to swap listOfVoteInfo[i] and listOfVoteInfo[j]

function swap(items, firstIndex, secondIndex){
    var temp = items[firstIndex];
    items[firstIndex] = items[secondIndex];
    items[secondIndex] = temp;
}

//Give a 1 for sort by votes, 2 for sort by proposal in sortType.
function partition(items, left, right, sortType) {
	let pivot = 0;
	if (sortType == 1){
		console.log(items[Math.floor((right + left) / 2)])
		pivot = items[Math.floor((right + left) / 2)]["voters"].length;
	}else{
		console.log(items[Math.floor((right + left) / 2)])
		pivot = items[Math.floor((right + left) / 2)]["proposalNum"];
	}
	
	
    let i = left;
    let j = right;

	if(sortType == 1){
		while (i <= j) {

			while (items[i]["voters"].length < pivot) {
				i++;
			}

			while (items[j]["voters"].length > pivot) {
				j--;
			}

			if (i <= j) {
				swap(items, i, j);
				i++;
				j--;
			}
		}
	}
	else{
		while (i <= j) {

			while (items[i]["proposalNum"] < pivot) {
				i++;
			}

			while (items[j]["proposalNum"] > pivot) {
				j--;
			}

			if (i <= j) {
				swap(items, i, j);
				i++;
				j--;
			}
		}
				
	}

    return i;
}

//Give a 1 for sort by votes, 2 for sort by proposal in sortType.
function quickSort(items, left, right, sortType) {

    var index;
	

    if (items.length > 1) {

        index = partition(items, left, right, sortType);

        if (left < index - 1) {
            quickSort(items, left, index - 1, sortType);
        }

        if (index < right) {
            quickSort(items, index, right, sortType);
        }

    }

    return items;
}


// first call
voteSortButton.onclick = function(){
	
	quickSort(listOfVoteInfo, 0, listOfVoteInfo.length - 1, 1);
	
}

sortByProposalNumberButton.onclick = function(){
	
	quickSort(listOfVoteInfo, 0, listOfVoteInfo.length - 1, 2);
	
}


output = "<h2>Vote Count: </h2>";
let voteForUser = 0;
for (let counter = listOfVoteInfo.length-1; counter >= 0; counter--){
	let voterListOfVoted = listOfVoteInfo[counter]["voters"];
	let voterListOfVoteNums = listOfVoteInfo[counter]["voterVoteNums"];
	output += `<h4>Proposal Number ${listOfVoteInfo[counter]["proposalNum"]}, ${listOfVoteInfo[counter]["name"]}: ${voterListOfVoted.length}</h4>`
	
	
	for (let counter2 = 0; counter2 < voterListOfVoted.length; counter2 ++){
		//output += `${voterListOfVoted[counter2]} [${voterListOfVoteNums[counter2]}]`;
		output += `${voterListOfVoted[counter2]} [${voterListOfVoteNums[counter2]}]<br>`;
	}
	output += '<br><br>';
	
	
}

output += `${localStorage.getItem("Vote Count")}`
voteCountOutput.innerHTML = output;

let voteSubmissionHTML = '';
for (let counter = listOfVoteInfo.length-1; counter >= 0; counter--){
	
	voteSubmissionHTML += `<input type="checkbox" id="proposal ${listOfVoteInfo[counter]["proposalNum"]}"> `

	voteSubmissionHTML += `<label for="proposal ${listOfVoteInfo[counter]["proposalNum"]}"> ${listOfVoteInfo[counter]["name"]}</label><br>`
}

voteSubmissionDiv.innerHTML = voteSubmissionHTML;

voteButton.onclick = function(){
	
	let voterInput = inpVoter.value;
	//let votedInput = inpVoted.value;
	let voteNumInput = inpVotepNum.value;
	let votedInput = [];
	for (let counter = listOfVoteInfo.length-1; counter >= 0; counter--){
		
		if (eval(`proposal ${listOfVoteInfo[counter]["proposalNum"]}`).checked == true){
			
			votedInput.push(listOfVoteInfo[counter]["name"])
			
		}
		
	}
	
	//Make sure a valid submission is entered
	if(voterInput) {
		for (let counter = listOfVoteInfo.length-1; counter >= 0; counter--){
			let submittedVoteDict = {}
			submittedVoteDict.voter = voterInput;
			submittedVoteDict.voted = votedInput[counter];
			submittedVoteDict.voteNum = voteNumInput;
			
			let string_currentJSONwithArrayOfVoteDicts = localStorage.getItem("Vote Count");
			let currentJSONwithArrayOfVoteDicts = JSON.parse(string_currentJSONwithArrayOfVoteDicts);
			
			//Check if voter already voted
			/*for (let counter = 0; counter < currentJSONwithArrayOfVoteDicts["dictList"].length; counter++){
				if (currentJSONwithArrayOfVoteDicts["dictList"][counter].voter == submittedVoteDict.voter) {
					
					currentJSONwithArrayOfVoteDicts["dictList"][counter].voted = submittedVoteDict.voted;
					currentJSONwithArrayOfVoteDicts["dictList"][counter].voteNum += " => " + submittedVoteDict.voteNum;
					entryAlreadyExists = 1;
					break;
				}
				
			} */
			
			if (!entryAlreadyExists){
				currentJSONwithArrayOfVoteDicts["dictList"].push(submittedVoteDict);
			}		
			localStorage.setItem("Vote Count", JSON.stringify(currentJSONwithArrayOfVoteDicts));
			//location.reload();
		}			
	}	
	
}



let deleteSubmissionHTML = '';
for (let counter = listOfVoteInfo.length-1; counter >= 0; counter--){
	
	deleteSubmissionHTML += `<input type="checkbox" id="proposal ${listOfVoteInfo[counter]["proposalNum"]}" value="${listOfVoteInfo[counter]["name"]}"> `

	deleteSubmissionHTML += `<label for="proposal ${listOfVoteInfo[counter]["proposalNum"]}"> ${listOfVoteInfo[counter]["name"]}</label><br>`
}

deleteSubmissionDiv.innerHTML = deleteSubmissionHTML;

deleteButton.onclick = function(){
	
	let voterDelete = inpVoteDelete.value;
	
	let deleteInput = [];
	for (let counter = listOfVoteInfo.length-1; counter >= 0; counter--){
		
		if (eval(`proposal ${listOfVoteInfo[counter]["proposalNum"]}`).checked == true){
			
			deleteInput.push(listOfVoteInfo[counter]["name"])
			
		}
		
	}
	
	let string_currentJSONwithArrayOfVoteDicts = localStorage.getItem("Vote Count");
	let currentJSONwithArrayOfVoteDicts = JSON.parse(string_currentJSONwithArrayOfVoteDicts);
	//Edited to add a voted section to the deleted
	for (let counter = 0; counter < currentJSONwithArrayOfVoteDicts["dictList"].length; counter++){
		for (let counter = listOfVoteInfo.length-1; counter >= 0; counter--){
			if (currentJSONwithArrayOfVoteDicts["dictList"][counter].voter == voterDelete && currentJSONwithArrayOfVoteDicts["dictList"][counter].voted == deleteInput[counter]) {
				//console.log("Check");
				currentJSONwithArrayOfVoteDicts["dictList"].splice(counter, 1);
				//console.log(currentJSONwithArrayOfVoteDicts["dictList"][counter].voter);
			}
		}
	}	
	localStorage.setItem("Vote Count", JSON.stringify(currentJSONwithArrayOfVoteDicts));
	location.reload();	
}

