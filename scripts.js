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

submitButton.onclick = function(){
		
	let voterInput = inpVoter.value;
	let votedInput = inpVoted.value;
	let voteNumInput = inpVoteNum.value;
	
	//Make sure a valid submission is entered
	if(voterInput && votedInput && voteNumInput) {
	
		let submittedVoteDict = {}
		submittedVoteDict.voter = voterInput;
		submittedVoteDict.voted = votedInput;
		submittedVoteDict.voteNum = voteNumInput;
		
		let string_currentJSONwithArrayOfVoteDicts = localStorage.getItem("Vote Count");
		let currentJSONwithArrayOfVoteDicts = JSON.parse(string_currentJSONwithArrayOfVoteDicts);
		
		//Check if voter already voted
		for (let counter = 0; counter < currentJSONwithArrayOfVoteDicts["dictList"].length; counter++){
			if (currentJSONwithArrayOfVoteDicts["dictList"][counter].voter == submittedVoteDict.voter) {
				
				currentJSONwithArrayOfVoteDicts["dictList"][counter].voted = submittedVoteDict.voted;
				currentJSONwithArrayOfVoteDicts["dictList"][counter].voteNum += " => " + submittedVoteDict.voteNum;
				entryAlreadyExists = 1;
				break;
			}
			
		}
		
		if (!entryAlreadyExists){
			currentJSONwithArrayOfVoteDicts["dictList"].push(submittedVoteDict);
		}		
		localStorage.setItem("Vote Count", JSON.stringify(currentJSONwithArrayOfVoteDicts));
		location.reload();	
	}	
};

resetButton.onclick = function(){
	
	localStorage.clear();
	location.reload();
	
}

deleteButton.onclick = function(){
	
	let voteDelete = inpVoteDelete.value;
	
	let string_currentJSONwithArrayOfVoteDicts = localStorage.getItem("Vote Count");
	let currentJSONwithArrayOfVoteDicts = JSON.parse(string_currentJSONwithArrayOfVoteDicts);
	for (let counter = 0; counter < currentJSONwithArrayOfVoteDicts["dictList"].length; counter++){
		if (currentJSONwithArrayOfVoteDicts["dictList"][counter].voter == voteDelete) {
			//console.log("Check");
			currentJSONwithArrayOfVoteDicts["dictList"].splice(counter, 1);
			//console.log(currentJSONwithArrayOfVoteDicts["dictList"][counter].voter);
		}
		
	}	
	localStorage.setItem("Vote Count", JSON.stringify(currentJSONwithArrayOfVoteDicts));
	location.reload();	
}


string_votesToDisplayArrayJSON = localStorage.getItem('Vote Count');
votesToDisplayArrayJSON = JSON.parse(string_votesToDisplayArrayJSON);
array_votesToDisplay =  votesToDisplayArrayJSON["dictList"];

let listOfVotedUsers = [];
let listOfVoteInfo = [];

for (let counter = 0; counter < array_votesToDisplay.length; counter++){
	
	let voter = array_votesToDisplay[counter].voter;
	let voted = array_votesToDisplay[counter].voted;
	let voteNum= array_votesToDisplay[counter].voteNum;
	
	if (!listOfVotedUsers.includes(voted)){
		listOfVotedUsers.push(voted);
		listOfVoteInfo.push({	
			"name" : voted,
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

function partition(items, left, right) {

    var pivot   = items[Math.floor((right + left) / 2)]["voters"].length,
        i       = left,
        j       = right;


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

    return i;
}

function quickSort(items, left, right) {

    var index;

    if (items.length > 1) {

        index = partition(items, left, right);

        if (left < index - 1) {
            quickSort(items, left, index - 1);
        }

        if (index < right) {
            quickSort(items, index, right);
        }

    }

    return items;
}


// first call
sortedListOfVotedUsers = quickSort(listOfVotedUsers, 0, listOfVotedUsers.length - 1);


output = "<h2>Voted Count: </h2>";
let voteForUser = 0;
for (let counter = listOfVotedUsers.length-1; counter >= 0; counter--){
	let voterListOfVoted = listOfVoteInfo[counter]["voters"];
	let voterListOfVoteNums = listOfVoteInfo[counter]["voterVoteNums"];
	output += `<h4>${listOfVoteInfo[counter]["name"]}: ${voterListOfVoted.length}</h4>`
	
	
	for (let counter2 = 0; counter2 < voterListOfVoted.length; counter2 ++){
		//output += `${voterListOfVoted[counter2]} [${voterListOfVoteNums[counter2]}]`;
		output += `${voterListOfVoted[counter2]} [${voterListOfVoteNums[counter2]}]<br>`;
	}
	output += '<br><br>';
	
}


voteCountOutput.innerHTML = output;