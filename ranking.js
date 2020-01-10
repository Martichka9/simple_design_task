var timer;
var interval;
var sorted = false; // is the list currently sorted

$(document).ready(function(){
    loadRankList(0,1); //Initially load unsorted rank list

    //Close error message
    document.getElementById("close").addEventListener("click", (e) => {
        document.querySelector('#error').classList.remove('showError');
    });

    document.getElementById("btn").addEventListener("click", (e) => {
        e.target.setAttribute('disabled', true);
        clearList();// Clear list before load ordered records
        document.getElementById('progress-bar').classList.add('timer');
        let tempTimer = 10;
        interval = setInterval(() => {
            tempTimer -= 1;
            document.getElementById('time').innerHTML = `00:00:0${tempTimer}`;
        },1000);
        timer = setTimeout(() => {
            loadRankList(1,1);// load ordered list after timer ends counting
            e.target.removeAttribute('disabled');
            document.getElementById('progress-bar').classList.remove('timer');
            clearTimer();
        }, 10000);
        
        document.getElementById('time').innerHTML = '00:00:10'; //reset doc timer to default value
    });
});

//Load sorted or unsorted rank list
function loadRankList(sort = 0,page) {
    let firstRecord = (page * 5)  - 5;//calc first record on page
    let lastRecord = (page * 5); // calc last record on page
    $.ajax({url: "ranking.json", success: (data) => {
        if (data.status === 1 && sort === 0) {
            let result = Object.values(data.ranking).map(value => value);
            printRecords(result,firstRecord,lastRecord);
            addPages(result.length,page);
        }
        else if (data.status === 1 && sort === 1) {
            sorted = true;
            let result = Object.values(data.ranking).map(value => value);  
            let resultSort = result.sort((player1, player2) => Number(player2.experience) - Number(player1.experience));
            printRecords(resultSort,firstRecord,lastRecord);
            addPages(result.length,page);
        }
        else if (data.status != 1)  {
            document.querySelector('#error').classList.add('showError');
        }
    }});
}

//Print loaded records
function printRecords(recordsArr,start,end) {
    recordsArr = recordsArr.slice(start,end);
    recordsArr.forEach((elem, index) => {
        $("#list").append(`                                    
            <li class="player-record">
                <span class="rank">${index+start+1}</span>
                <span class="name"><span class="profile-pic"><img src="./img/profile-pic.png" alt="profile picture"></span>${elem.name}</span>
                <span class="club">${elem.club}</span>
                <span class="level">${elem.level}</span>
                <span class="experience">${elem.experience}</span>
                <span class="message"><a href="#"><img src="./img/envelop.png" alt="message"></a></span>
            </li>
        `);
    });
}

//Clear loaded records befre reload / load next
function clearList(){
    let clearArr = Array.from(document.querySelectorAll('.player-record'));
    let clearPages = Array.from(document.querySelectorAll('.page'));

    clearArr.forEach(function(playerRecord) {
        playerRecord.parentNode.removeChild(playerRecord);
    });
    clearPages.forEach(function(page) {
        page.parentNode.removeChild(page);
    });
}

//Clear timer and interval
function clearTimer(){
    clearTimeout(timer);
    clearInterval(interval);
}

//Pagination
function addPages(all,current){
    let pages = Math.ceil(all / 5);//calc the number of pages depending on the count of records
    for (let i = 0; i < pages; i++) {
        $("#pages").append(`                                    
        <li class="page" onClick="changePage(${i+1})">${i+1}</li>
    `);
    }
    document.getElementsByClassName('page')[current-1].classList.add('current');
}

function changePage(page) {
    document.getElementsByClassName('current')[0].classList.remove('current');//remove current mark from previous page
    clearList();//refresh list
    if (sorted) {
        loadRankList(1,page);
    } else {
        loadRankList(undefined,page);
    }
}

//Ranking tab show hide list
function showHideRanking () {
    if (!!document.querySelector('.opened')) {
        document.getElementById('ranking-container').classList.remove('opened');
        document.getElementById('ranking-container').classList.add('closed');
        document.querySelector('.arrow-up').classList.remove('arrow-open');
        document.querySelector('.arrow-up').classList.add('arrow-close');
    } else {
        document.getElementById('ranking-container').classList.remove('closed');
        document.getElementById('ranking-container').classList.add('opened');
        document.querySelector('.arrow-up').classList.remove('arrow-close');
        document.querySelector('.arrow-up').classList.add('arrow-open');
        
    }
}
