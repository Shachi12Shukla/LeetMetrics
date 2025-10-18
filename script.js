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

        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if(!isMatching){
            alert('Invalid username !');
        }
        return isMatching;
    }
    
    // 4 - Fetch User Data from the API Key
    async function fetchUserDetails(username) {
       const url = `https://leetcode.com/graphql/`;

        try{

            // Change 'Search' to 'Searching'
            searchButton.textContent = 'Searching ..';
            // *** New thing** - Search Button disabled
            searchButton.disabled = true;

            const response = await fetch(url);
            if(response.ok){
                throw new Error('Unable to fetch the user details');
            }

            const data = await response.json();
            console.log('Data we got ', data);
        }

        catch(error){
            statsCont.innerHTML = `<p>No data found</p>`;
        }

        finally{
            searchButton.textContent = 'Search';
            searchButton.disabled = false;
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