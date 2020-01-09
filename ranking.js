var timer;
var interval;

$(document).ready(function(){
    loadRankList(0);
    document.getElementById("btn").addEventListener("click", function (e) {
        e.target.setAttribute('disabled', true);
        clearList();
        document.getElementById('progress-bar').classList.add('timer');
        let tempTimer = 10;
        interval = setInterval(function (){
            tempTimer -= 1;
            document.getElementById('time').innerHTML = `00:00:0${tempTimer}`;
        },1000);
        timer = setTimeout(function(){
            loadRankList(1);
            e.target.removeAttribute('disabled');
            document.getElementById('progress-bar').classList.remove('timer');
            clearTimer();
        }, 10000);
    });
});

function loadRankList(sort) {
    $.ajax({url: "ranking.json", success: function(data){
        if (data.status === 1 && sort === 0) {
            let result = Object.values(data.ranking).map(value => value);
            printRecords(result);
        }
        else if (data.status === 1 && sort === 1) {
            let result = Object.values(data.ranking).map(value => value);  
            result = result.sort((player1, player2) => Number(player2.experience) - Number(player1.experience));
            printRecords(result);
        }
        else {
            console.log("error");
        }
    }});
}


function printRecords(recordsArr) {
    recordsArr.forEach((elem, index) => {
        $("#list").append(`                                    
            <li class="player-record">
                <span class="rank">${index+1}</span>
                <span class="name"><span class="profile-pic"><img src="./img/profile-pic.png" alt="profile picture"></span>${elem.name}</span>
                <span class="club">${elem.club}</span>
                <span class="level">${elem.level}</span>
                <span class="experience">${elem.experience}</span>
                <span class="message"><a href="#"><img src="./img/envelop.png" alt="message"></a></span>
            </li>
        `);
    }); 
}

function clearList(){
    let clearArr = Array.from(document.querySelectorAll('.player-record'));

    clearArr.forEach(function(playerRecord) {
        playerRecord.parentNode.removeChild(playerRecord);
    });
}

function clearTimer(){
    clearTimeout(timer);
    clearInterval(interval);
}