// 1 - Load DOM contents first 

document.addEventListener("DOMContentLoaded" , function() {

    const searchButton = document.getElementById('search-button');
    const usernameInpt = document.getElementById('user-input');

    const statsCont = document.querySelector('.statsContainer');
    const ezprogressCircle = document.querySelector('.easy-progress');
    const mediumprogressCircle = document.querySelector('.medium-progress');
    const hardprogressCircle = document.querySelector('.hard-progress');
    const ezlabel = document.querySelector('.easy-label');
    const medlabel = document.querySelector('.medium-label');
    const hardlabel = document.querySelector('.hard-label');

    const statsCard = document.querySelector('.stats-card');
     
    // 3 - Check Username based on regex. Generate regex using chatgpt
    function checkUsername(username){

        if(username.trim() === ''){
            alert("Username should not be empty");
        }

        const regex = /^[a-zA-Z0-9_-]{1,15}$/;  // *** new ***
        const isMatching = regex.test(username);  // *** new ***
        if(!isMatching){
            alert('Invalid username !');
        }
        return isMatching;
    }
    
    // 4 - Fetch User Data from the API Key
    async function fetchUserDetails(username) {
       
        try{
            // Change 'Search' to 'Searching'
            searchButton.textContent = 'Searching ..';
            // *** New thing** - Search Button disabled
            searchButton.disabled = true;   // *** new ***
            
            const targeturl = `https://leetcode.com/graphql/`;
            const myHeaders = new Headers();
            myHeaders.append("content-type", "application/JSON");

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

            const response = await fetch(targeturl , requestOptions)
            
            if(!response.ok){
                throw new Error("Unable to fetch the user details");
            }

            // convert back the JSON object to JS object
            const data = await response.json();
            console.log("Logging data:" , data);
        }

        catch(error){
            statsCont.innerHTML = `<p>No data found</p>`;
            console.log("ERROR---" , error)
        }

        finally{
            searchButton.textContent = 'Search';
            searchButton.disabled = false;
            // searchButton.enabled = true;  WON'T WORK
        }
    }

    // 2
    searchButton.addEventListener('click' , function() {
        const username = usernameInpt.value;
        console.log(`this username logged in - ${username}`);
        if(checkUsername(username)){
            fetchUserDetails(username);
        }
    })
})