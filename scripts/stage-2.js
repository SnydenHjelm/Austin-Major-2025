async function addGame() {
    let record = document.querySelector("#team-record");
    let map = document.querySelector("#map");
    let team1 = document.querySelector("#team1");
    let team2 = document.querySelector("#team2");
    let score = document.querySelector("#score");

    let obj = {
        record: record.value,
        map: map.value,
        team1: team1.value,
        team2: team2.value,
        score: score.value
    }
    let req = new Request("http://localhost:8000/stage2/games", optionsGen("POST", obj));
    let resp = await fetch(req);
    if (resp.ok) {
        let reso = await resp.json();
        console.log(reso);
        await displayGames(reso, record);
        record.value = "";
        map.value = "";
        team1.value = "";
        team2.value = "";
        score.value = "";
        return;
    } else {
        let reso = await resp.text();
        document.querySelector("#matches-status").textContent = `${resp.status}: ` + reso;
        return;
    }
}

async function addStage2Team() {
    let team = document.querySelector("#stage2-controls #team").value;
    let player1 = document.querySelector("#stage2-controls #player1").value;
    let player2 = document.querySelector("#stage2-controls #player2").value;
    let player3 = document.querySelector("#stage2-controls #player3").value;
    let player4 = document.querySelector("#stage2-controls #player4").value;
    let player5 = document.querySelector("#stage2-controls #player5").value;
    
    let obj = {
        team: team,
        player1: player1.split(", "),
        player2: player2.split(", "),
        player3: player3.split(", "),
        player4: player4.split(", "),
        player5: player5.split(", ")
    }

    let req = new Request("http://localhost:8000/stage2", optionsGen("POST", obj));
    try {
        let resp = await fetch(req);
        if (resp.status === 200) {
            document.querySelector("#stage2-controls #status").textContent = `${team} added successfully`;
            document.querySelector("#stage2-controls #team").value = "";
            document.querySelector("#stage2-controls #player1").value = "";
            document.querySelector("#stage2-controls #player2").value = "";
            document.querySelector("#stage2-controls #player3").value = "";
            document.querySelector("#stage2-controls #player4").value = "";
            document.querySelector("#stage2-controls #player5").value = "";
            await displayStage2();
        } else {
            let reso = await resp.text();
            if (resp.status === 409) {
                document.querySelector("#stage2-controls #status").textContent = reso
            } else {
                document.querySelector("#stage2-controls #status").textContent = reso;
            }
            return;
        }
    } catch (e) {
        document.querySelector("#stage2-controls #status").textContent = "Network error";
        return;
    }
}

async function displayGames(games, record) {
    await emptyGameDivs();
    for (let game of games) {
        let round = whichRound(game.record);
        let parent = document.querySelector(`#${round}`);

        let div = document.createElement("div");
        div.classList.add("game");
        div.innerHTML = `
        <p class="bigger">${game.record}</p>
        <p>${game.map}</p>
        <img title="${game.team1}" src="../images/${game.team1}.png">
        <p class="bigger">${game.score}</p>
        <img title="${game.team2}" src="../images/${game.team2}.png">
        `
        parent.appendChild(div);
    }
    await hideGames();
    removeUnderlines();
    if (record) {
        let getRound = whichRound(record.value);
        document.querySelector(`#${getRound}`).style.display = "block";
        document.querySelector(`#${getRound}-nav`).style.textDecoration = "underline";
    } else {
        document.querySelector("#round1").style.display = "block";
        document.querySelector("#round1-nav").style.textDecoration = "underline";
    }
}

async function displayStage2() {
    let req = new Request("http://localhost:8000/stage2");
    let resp = await fetch(req);
    let div = document.querySelector("#stage2-qualied-teams");
    div.innerHTML = "";
    if (resp.ok) {
        let reso = await resp.json();
        for (let team of reso) {
            let teamDiv = document.createElement("div");
            teamDiv.classList.add("team");
            teamDiv.innerHTML = `<img title="${team.team}" src="../images/${team.team}.png">
            <ul>
            <li>${await flagFromCountry(team.player1[1])} ${team.player1[0]}</li>
            <li>${await flagFromCountry(team.player2[1])} ${team.player2[0]}</li>
            <li>${await flagFromCountry(team.player3[1])} ${team.player3[0]}</li>
            <li>${await flagFromCountry(team.player4[1])} ${team.player4[0]}</li>
            <li>${await flagFromCountry(team.player5[1])} ${team.player5[0]}</li>
            </ul>`;
            div.appendChild(teamDiv);
        }
    }
}

async function driver() {
    await displayStage2();
    await displayGames(await getDb());
    document.querySelector("#stage2-controls button").addEventListener("click", addStage2Team);
    document.querySelector("#matches-b").addEventListener("click", addGame);
    let rounds = document.querySelectorAll(".rounds p");
    for (let p of rounds) {
        p.addEventListener("click", () => {
            hideGames();
            let lastChar = p.textContent[p.textContent.length - 1];
            document.querySelector(`#round${lastChar}`).style.display = "block";
            removeUnderlines();
            p.style.textDecoration = "underline";
        });
    }
}

async function emptyGameDivs() {
    document.querySelector("#round1").innerHTML = "";
    document.querySelector("#round2").innerHTML = "";
    document.querySelector("#round3").innerHTML = "";
    document.querySelector("#round4").innerHTML = "";
    document.querySelector("#round5").innerHTML = "";
}

async function flagFromCountry(country) {
    let allFlags = flags();
    let theFlag = allFlags.find((x) => x.country.toLowerCase() === country.toLowerCase());
    return theFlag.flag;
}  

function flags() {
    return [
        { country: "Afghanistan", flag: "🇦🇫" },
        { country: "Albania", flag: "🇦🇱" },
        { country: "Algeria", flag: "🇩🇿" },
        { country: "Andorra", flag: "🇦🇩" },
        { country: "Angola", flag: "🇦🇴" },
        { country: "Argentina", flag: "🇦🇷" },
        { country: "Armenia", flag: "🇦🇲" },
        { country: "Australia", flag: "🇦🇺" },
        { country: "Austria", flag: "🇦🇹" },
        { country: "Azerbaijan", flag: "🇦🇿" },
        { country: "Bahamas", flag: "🇧🇸" },
        { country: "Bahrain", flag: "🇧🇭" },
        { country: "Bangladesh", flag: "🇧🇩" },
        { country: "Barbados", flag: "🇧🇧" },
        { country: "Belarus", flag: "🇧🇾" },
        { country: "Belgium", flag: "🇧🇪" },
        { country: "Belize", flag: "🇧🇿" },
        { country: "Benin", flag: "🇧🇯" },
        { country: "Bhutan", flag: "🇧🇹" },
        { country: "Bolivia", flag: "🇧🇴" },
        { country: "Bosnia", flag: "🇧🇦" },
        { country: "Botswana", flag: "🇧🇼" },
        { country: "Brazil", flag: "🇧🇷" },
        { country: "Bulgaria", flag: "🇧🇬" },
        { country: "Burkina Faso", flag: "🇧🇫" },
        { country: "Burundi", flag: "🇧🇮" },
        { country: "Cambodia", flag: "🇰🇭" },
        { country: "Cameroon", flag: "🇨🇲" },
        { country: "Canada", flag: "🇨🇦" },
        { country: "Chile", flag: "🇨🇱" },
        { country: "China", flag: "🇨🇳" },
        { country: "Colombia", flag: "🇨🇴" },
        { country: "Costa Rica", flag: "🇨🇷" },
        { country: "Croatia", flag: "🇭🇷" },
        { country: "Cuba", flag: "🇨🇺" },
        { country: "Cyprus", flag: "🇨🇾" },
        { country: "Czech Republic", flag: "🇨🇿" },
        { country: "Denmark", flag: "🇩🇰" },
        { country: "Dominican Republic", flag: "🇩🇴" },
        { country: "Ecuador", flag: "🇪🇨" },
        { country: "Egypt", flag: "🇪🇬" },
        { country: "El Salvador", flag: "🇸🇻" },
        { country: "Estonia", flag: "🇪🇪" },
        { country: "Ethiopia", flag: "🇪🇹" },
        { country: "Finland", flag: "🇫🇮" },
        { country: "France", flag: "🇫🇷" },
        { country: "Georgia", flag: "🇬🇪" },
        { country: "Germany", flag: "🇩🇪" },
        { country: "Ghana", flag: "🇬🇭" },
        { country: "Greece", flag: "🇬🇷" },
        { country: "Guatemala", flag: "🇬🇹" },
        { country: "Honduras", flag: "🇭🇳" },
        { country: "Hungary", flag: "🇭🇺" },
        { country: "Iceland", flag: "🇮🇸" },
        { country: "India", flag: "🇮🇳" },
        { country: "Indonesia", flag: "🇮🇩" },
        { country: "Iran", flag: "🇮🇷" },
        { country: "Iraq", flag: "🇮🇶" },
        { country: "Ireland", flag: "🇮🇪" },
        { country: "Israel", flag: "🇮🇱" },
        { country: "Italy", flag: "🇮🇹" },
        { country: "Jamaica", flag: "🇯🇲" },
        { country: "Japan", flag: "🇯🇵" },
        { country: "Jordan", flag: "🇯🇴" },
        { country: "Kazakhstan", flag: "🇰🇿" },
        { country: "Kenya", flag: "🇰🇪" },
        { country: "Kuwait", flag: "🇰🇼" },
        { country: "Kyrgyzstan", flag: "🇰🇬" },
        { country: "Latvia", flag: "🇱🇻" },
        { country: "Lebanon", flag: "🇱🇧" },
        { country: "Lithuania", flag: "🇱🇹" },
        { country: "Luxembourg", flag: "🇱🇺" },
        { country: "Madagascar", flag: "🇲🇬" },
        { country: "Malaysia", flag: "🇲🇾" },
        { country: "Maldives", flag: "🇲🇻" },
        { country: "Malta", flag: "🇲🇹" },
        { country: "Mexico", flag: "🇲🇽" },
        { country: "Moldova", flag: "🇲🇩" },
        { country: "Monaco", flag: "🇲🇨" },
        { country: "Mongolia", flag: "🇲🇳" },
        { country: "Montenegro", flag: "🇲🇪" },
        { country: "Morocco", flag: "🇲🇦" },
        { country: "Mozambique", flag: "🇲🇿" },
        { country: "Myanmar", flag: "🇲🇲" },
        { country: "Nepal", flag: "🇳🇵" },
        { country: "Netherlands", flag: "🇳🇱" },
        { country: "New Zealand", flag: "🇳🇿" },
        { country: "Nicaragua", flag: "🇳🇮" },
        { country: "Nigeria", flag: "🇳🇬" },
        { country: "North Korea", flag: "🇰🇵" },
        { country: "North Macedonia", flag: "🇲🇰"},
        { country: "Norway", flag: "🇳🇴" },
        { country: "Oman", flag: "🇴🇲" },
        { country: "Pakistan", flag: "🇵🇰" },
        { country: "Panama", flag: "🇵🇦" },
        { country: "Paraguay", flag: "🇵🇾" },
        { country: "Peru", flag: "🇵🇪" },
        { country: "Philippines", flag: "🇵🇭" },
        { country: "Poland", flag: "🇵🇱" },
        { country: "Portugal", flag: "🇵🇹" },
        { country: "Qatar", flag: "🇶🇦" },
        { country: "Romania", flag: "🇷🇴" },
        { country: "Russia", flag: "🇷🇺" },
        { country: "Rwanda", flag: "🇷🇼" },
        { country: "Saudi Arabia", flag: "🇸🇦" },
        { country: "Senegal", flag: "🇸🇳" },
        { country: "Serbia", flag: "🇷🇸" },
        { country: "Singapore", flag: "🇸🇬" },
        { country: "Slovakia", flag: "🇸🇰" },
        { country: "Slovenia", flag: "🇸🇮" },
        { country: "South Africa", flag: "🇿🇦" },
        { country: "South Korea", flag: "🇰🇷" },
        { country: "Spain", flag: "🇪🇸" },
        { country: "Sri Lanka", flag: "🇱🇰" },
        { country: "Sudan", flag: "🇸🇩" },
        { country: "Sweden", flag: "🇸🇪" },
        { country: "Switzerland", flag: "🇨🇭" },
        { country: "Syria", flag: "🇸🇾" },
        { country: "Taiwan", flag: "🇹🇼" },
        { country: "Tajikistan", flag: "🇹🇯" },
        { country: "Tanzania", flag: "🇹🇿" },
        { country: "Thailand", flag: "🇹🇭" },
        { country: "Tunisia", flag: "🇹🇳" },
        { country: "Turkey", flag: "🇹🇷" },
        { country: "Turkmenistan", flag: "🇹🇲" },
        { country: "Uganda", flag: "🇺🇬" },
        { country: "Ukraine", flag: "🇺🇦" },
        { country: "United Arab Emirates", flag: "🇦🇪" },
        { country: "United Kingdom", flag: "🇬🇧" },
        { country: "United States", flag: "🇺🇸" },
        { country: "Uruguay", flag: "🇺🇾" },
        { country: "Uzbekistan", flag: "🇺🇿" },
        { country: "Venezuela", flag: "🇻🇪" },
        { country: "Vietnam", flag: "🇻🇳" },
        { country: "Yemen", flag: "🇾🇪" },
        { country: "Zambia", flag: "🇿🇲" },
        { country: "Zimbabwe", flag: "🇿🇼" }
      ];      
}

function optionsGen(method, body) {
    return {method: method, body: JSON.stringify(body), headers: {"content-type": "application/json"}};
}

async function hideGames() {
    document.querySelector("#round1").style.display = "none";
    document.querySelector("#round2").style.display = "none";
    document.querySelector("#round3").style.display = "none";
    document.querySelector("#round4").style.display = "none";
    document.querySelector("#round5").style.display = "none";
}

function removeUnderlines() {
    let ps = document.querySelectorAll(".rounds p");
    for (let p of ps) {
        p.style.textDecoration = "none";
    }
}

async function getDb() {
    let req = new Request("http://localhost:8000/stage2/games");
    let resp = await fetch(req);
    let reso = await resp.json();
    return reso;
}

function whichRound(record) {
    if (record === "0-0") {
        return "round1";
    } else if (record === "1-0" || record === "0-1") {
        return "round2";
    } else if (record === "2-0" || record === "0-2" || record === "1-1") {
        return "round3";
    } else if (record === "2-1" || record === "1-2") {
        return "round4";
    } else if (record === "2-2") {
        return "round5";
    }
}

driver();