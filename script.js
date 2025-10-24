// 1 - Load DOM contents first 

document.addEventListener("DOMContentLoaded" , function() {

    const searchButton = document.getElementById('search-button');
    const usernameInpt = document.getElementById('user-input');

    const statsCont = document.querySelector('.statsContainer');
    const ezprogressCircle = document.querySelector('.easy-progress');
    const mediumprogressCircle = document.querySelector('.medium-progress');
    const hardprogressCircle = document.querySelector('.hard-progress');
    const ezlabel = document.querySelector('#easy-label');
    const medlabel = document.querySelector('#medium-label');
    const hardlabel = document.querySelector('#hard-label');

    const statsCard = document.querySelector('.stats-card');
    // remember the container's initial display so we can restore it later
    const initialStatsDisplay = getComputedStyle(statsCont).display;  // *** NEW ***
    console.log("initial display" , initialStatsDisplay);
     
    // 3 - Check Username based on regex. Generate regex using chatgpt
    function checkUsername(username){

        if(username.trim() === ''){
            alert("Username should not be empty");
            return;
        }

        const regex = /^[a-zA-Z0-9_-]{1,15}$/;  // *** new ***
        const isMatching = regex.test(username);  // *** new ***
    
        if((!isMatching)){
            alert('Invalid username !');
        }
        return isMatching;
    }
    
    // 8 - add a flag to track ongoing fetch
    // let isFetching = false;

    // 4 - Fetch User Data 
    async function fetchUserDetails(username) {
       
        try{
            
            // 8
            // avoid concurrent fetches
            // if (isFetching) return;
            // isFetching = true;


            // Change 'Search' to 'Searching'
            searchButton.textContent = 'Searching ..';
            // *** New thing** - Search Button disabled
            searchButton.disabled = true;   // *** new ***

            // 8- hide stats container while fetching
            // statsCont.style.visibility = 'hidden';  // ** NEW **
            // statsCont.setProperty("visibility" , hidden); WON'T WORK
            statsCont.style.display = 'none';  // ** NEW **
 
            const proxyUrl = `https://cors-anywhere.herokuapp.com/`;
            const targeturl = `https://leetcode.com/graphql/`;
            const myHeaders = new Headers();
            myHeaders.append("content-type", "application/JSON");
             
            // COPY the graphql from  the "headers" section in the respective graphql query of the "response" row on the network section of the browser page.
            const graphql = JSON.stringify( {
                query: "\n    query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}\n    " ,
                variables: {"username": `${username}`} 
            })

            // converted the 'graphql' object from js object -> JSON object .
            

            const requestOptions = {
                method : "POST" ,
                headers : myHeaders ,
                body : graphql ,
                redirect : "follow"
            };

            const response = await fetch( proxyUrl + targeturl , requestOptions)
            
            if(!response.ok){
                throw new Error("Unable to fetch the user details");
            }

            // convert back the JSON object to JS object
            const data = await response.json();
            console.log("Logging data:" , data);

            displayUserData(data);
        }

        catch(error){
            statsCont.innerHTML = `<p>${error.message}</p>`;
            console.log("ERROR---" , error)
        }

        finally{
            searchButton.textContent = 'Search';
            searchButton.disabled = false;
            // searchButton.enabled = true;  WON'T WORK

            // isFetching = false;
            // restore visibility after fetch completes
            statsCont.style.display = 'block';

        }
    }
    
    // 6 - update stats
    function updateProgress(solved , total , label , circle){
        const progressDegree = (solved/total)*100;
        circle.style.setProperty("--progress-degree" , `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }

    // 5 - Display User Data
    function displayUserData(parsedData){

        // total 
        const totalQues = parsedData.data.allQuestionsCount[0].count;
        const totalEasyQues = parsedData.data.allQuestionsCount[1].count;
        const totalMediumQues = parsedData.data.allQuestionsCount[2].count;
        const totalHardQues = parsedData.data.allQuestionsCount[3].count;

        // user stats
        const solvedTotalQues = parsedData.data.matchedUser.submitStats.
        acSubmissionNum[0].count;
        const solvedEasyQues = parsedData.data.matchedUser.submitStats.
        acSubmissionNum[1].count;
        const solvedMediumQues = parsedData.data.matchedUser.submitStats.
        acSubmissionNum[2].count;
        const solvedHardQues = parsedData.data.matchedUser.submitStats.
        acSubmissionNum[3].count;

        updateProgress(solvedEasyQues , totalEasyQues , ezlabel , ezprogressCircle);
        updateProgress(solvedMediumQues , totalMediumQues , medlabel , mediumprogressCircle);
        updateProgress(solvedHardQues , totalHardQues , hardlabel , hardprogressCircle);
        

        // 7 - Add submissions card dynamically 
        const cardData = [

            {label : "Overall Submissions" , value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[0].submissions } ,

            {label : "Overall Easy Submissions" , value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[1].submissions } ,

            {label : "Overall Medium Submissions" , value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[2].submissions } ,

            {label : "Overall Hard Submissions" , value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[3].submissions } ,

        ];

        console.log("Card Ka Data " ,cardData);

        statsCard.innerHTML = cardData.map(
            data => 
                    `<div class="sub-js-card">
                       <h4> ${data.label} </h4>
                       <p> ${data.value} </p>
                    </div>`
                    
        ).join("")
    }

    // 2
    searchButton.addEventListener('click' , function() {

        // prevent starting a fetch when one is already running
        // if (isFetching) {
        //     alert('Search already in progress. Please wait.');
        //     return;
        // }

        const username = usernameInpt.value;
        console.log(`this username logged in - ${username}`);
        if(checkUsername(username)){
            fetchUserDetails(username);
        }
    })
})