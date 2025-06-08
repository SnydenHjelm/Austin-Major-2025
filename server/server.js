async function handler(req) {
    const headersOBJ = new Headers();
    headersOBJ.set("Access-Control-Allow-Origin", "*");
    headersOBJ.set("Access-Control-Allow-Methods", "POST, DELETE, OPTIONS");
    headersOBJ.set("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") {
        return new Response(null, {headers: headersOBJ});
    }

    const url = new URL(req.url);

    if (url.pathname === "/stage1") {
        if (req.method === "GET") {
            let teams = Deno.readTextFileSync("../db/stage-1.json");
            headersOBJ.set("Content-Type", "application/json");
            return new Response(teams, {headers: headersOBJ});
        } else if (req.method === "POST") {
            if (req.headers.get("content-type") !== "application/json") {return new Response("Invalid Content-Type, JSON Expected", {status: 405, headers: headersOBJ})};
            let reqBody = await req.json();
            if (!reqBody.team || reqBody.player1.length === 0 || reqBody.player2.length === 0 || reqBody.player3.length === 0 || reqBody.player4.length === 0 || reqBody.player5.length === 0) {
                return new Response("Invalid request body, one or more attributes missing", {status: 400, headers: headersOBJ});
            }

            let obj = {
                team: reqBody.team,
                player1: reqBody.player1,
                player2: reqBody.player2,
                player3: reqBody.player3,
                player4: reqBody.player4,
                player5: reqBody.player5,
            }

            let teams = JSON.parse(Deno.readTextFileSync("../db/stage-1.json"));
            if (teams.length === 16) {return new Response("Can't add more teams", {status: 409, headers: headersOBJ})};
            teams.push(obj);
            Deno.writeTextFileSync("../db/stage-1.json", JSON.stringify(teams));
            return new Response("Team successfully added", {status: 200, headers: headersOBJ});
        }
    } else if (url.pathname === "/stage2") {
        if (req.method === "GET") {
            let teams = Deno.readTextFileSync("../db/stage-2.json");
            headersOBJ.set("Content-Type", "application/json");
            return new Response(teams, {headers: headersOBJ});
        } else if (req.method === "POST") {
            if (req.headers.get("content-type") !== "application/json") {return new Response("Invalid Content-Type, JSON Expected", {status: 405, headers: headersOBJ})};
            let reqBody = await req.json();
            if (!reqBody.team || reqBody.player1.length < 2 || reqBody.player2.length < 2 || reqBody.player3.length < 2 || reqBody.player4.length < 2 || reqBody.player5.length < 2) {
                return new Response("Invalid request body, one or more attributes missing", {status: 400, headers: headersOBJ});
            }

            let obj = {
                team: reqBody.team,
                player1: reqBody.player1,
                player2: reqBody.player2,
                player3: reqBody.player3,
                player4: reqBody.player4,
                player5: reqBody.player5,
            }

            let teams = JSON.parse(Deno.readTextFileSync("../db/stage-2.json"));
            if (teams.length === 16) {return new Response("Can't add more teams", {status: 409, headers: headersOBJ})};
            teams.push(obj);
            Deno.writeTextFileSync("../db/stage-2.json", JSON.stringify(teams));
            return new Response("Team successfully added", {status: 200, headers: headersOBJ});
        }
    } else if (url.pathname === "/stage3") {
        if (req.method === "GET") {
            let teams = Deno.readTextFileSync("../db/stage-3.json");
            headersOBJ.set("Content-Type", "application/json");
            return new Response(teams, {headers: headersOBJ});
        } else if (req.method === "POST") {
            if (req.headers.get("content-type") !== "application/json") {return new Response("Invalid Content-Type, JSON Expected", {status: 405, headers: headersOBJ})};
            let reqBody = await req.json();
            if (!reqBody.team || reqBody.player1.length < 2 || reqBody.player2.length < 2 || reqBody.player3.length < 2 || reqBody.player4.length < 2 || reqBody.player5.length < 2) {
                return new Response("Invalid request body, one or more attributes missing", {status: 400, headers: headersOBJ});
            }

            let obj = {
                team: reqBody.team,
                player1: reqBody.player1,
                player2: reqBody.player2,
                player3: reqBody.player3,
                player4: reqBody.player4,
                player5: reqBody.player5,
            }

            let teams = JSON.parse(Deno.readTextFileSync("../db/stage-3.json"));
            if (teams.length === 16) {return new Response("Can't add more teams", {status: 409, headers: headersOBJ})};
            teams.push(obj);
            Deno.writeTextFileSync("../db/stage-3.json", JSON.stringify(teams));
            return new Response("Team successfully added", {status: 200, headers: headersOBJ});
        }
    } else if (url.pathname === "/stage1/games") {
        if (req.method === "POST") {
            if (req.headers.get("content-type") !== "application/json") {return new Response("Invalid Content-Type, JSON Expected", {status: 405, headers: headersOBJ})};
            headersOBJ.set("content-type", "application/json");
            let reqBody = await req.json();
            if (!reqBody.record || !reqBody.map || !reqBody.team1 || !reqBody.team2 || !reqBody.score) {
                return new Response("Invalid request, Attributes missing", {status: 400, headers: headersOBJ});
            }

            let maps = ["Ancient", "Anubis", "Train", "Inferno", "Dust 2", "Mirage", "Nuke"];
            let records = ["0-0", "0-1", "1-0", "1-1", "1-2", "2-1", "2-2", "2-0", "0-2"];
            let stage1Teams = JSON.parse(Deno.readTextFileSync("../db/stage-1.json"));
            let team1 = stage1Teams.find((x) => x.team.toLowerCase() === reqBody.team1.toLowerCase());
            let team2 = stage1Teams.find((x) => x.team.toLowerCase() === reqBody.team2.toLowerCase());
            if (!team1 || !team2) {
                return new Response("Invalid Team(s)", {status: 406, headers: headersOBJ});
            }

            if (!records.includes(reqBody.record)) {
                return new Response("Invalid Record", {status: 406, headers: headersOBJ});
            } else if (reqBody.map.length > 10) {
                let reqMaps = reqBody.map.split(", ");
                if (!maps.includes(reqMaps[0]) || !maps.includes(reqMaps[1]) || !maps.includes(reqMaps[2])) {
                    return new Response("Invalid Map(s)", {status: 406, headers: headersOBJ});
                }
            } else if (reqBody.map.length < 10) {
                if (!maps.includes(reqBody.map)) {
                    return new Response("Invalid Map(s)", {status: 406, headers: headersOBJ});
                }
            }

            let obj =  {
                record: reqBody.record,
                map: reqBody.map,
                team1: reqBody.team1,
                team2: reqBody.team2,
                score: reqBody.score
            }

            let db = JSON.parse(Deno.readTextFileSync("../db/stage-1-games.json"));
            db.push(obj);
            Deno.writeTextFileSync("../db/stage-1-games.json", JSON.stringify(db));
            return new Response(JSON.stringify(db), {headers: headersOBJ});
        } else if (req.method === "GET") {
            let db = JSON.parse(Deno.readTextFileSync("../db/stage-1-games.json"));
            return new Response(JSON.stringify(db), {headers: headersOBJ});
        }
    } else if (url.pathname === "/stage2/games") {
        if (req.method === "POST") {
            if (req.headers.get("content-type") !== "application/json") {return new Response("Invalid Content-Type, JSON Expected", {status: 405, headers: headersOBJ})};
            headersOBJ.set("content-type", "application/json");
            let reqBody = await req.json();
            if (!reqBody.record || !reqBody.map || !reqBody.team1 || !reqBody.team2 || !reqBody.score) {
                return new Response("Invalid request, Attributes missing", {status: 400, headers: headersOBJ});
            }

            let maps = ["Ancient", "Anubis", "Train", "Inferno", "Dust 2", "Mirage", "Nuke"];
            let records = ["0-0", "0-1", "1-0", "1-1", "1-2", "2-1", "2-2", "2-0", "0-2"];
            let stage2Teams = JSON.parse(Deno.readTextFileSync("../db/stage-2.json"));
            let team1 = stage2Teams.find((x) => x.team.toLowerCase() === reqBody.team1.toLowerCase());
            let team2 = stage2Teams.find((x) => x.team.toLowerCase() === reqBody.team2.toLowerCase());
            if (!team1 || !team2) {
                return new Response("Invalid Team(s)", {status: 406, headers: headersOBJ});
            }

            if (!records.includes(reqBody.record)) {
                return new Response("Invalid Record", {status: 406, headers: headersOBJ});
            } else if (reqBody.map.length > 10) {
                let reqMaps = reqBody.map.split(", ");
                if (!maps.includes(reqMaps[0]) || !maps.includes(reqMaps[1]) || !maps.includes(reqMaps[2])) {
                    return new Response("Invalid Map(s)", {status: 406, headers: headersOBJ});
                }
            } else if (reqBody.map.length < 10) {
                if (!maps.includes(reqBody.map)) {
                    return new Response("Invalid Map(s)", {status: 406, headers: headersOBJ});
                }
            }

            let obj =  {
                record: reqBody.record,
                map: reqBody.map,
                team1: reqBody.team1,
                team2: reqBody.team2,
                score: reqBody.score
            }

            let db = JSON.parse(Deno.readTextFileSync("../db/stage-2-games.json"));
            db.push(obj);
            Deno.writeTextFileSync("../db/stage-2-games.json", JSON.stringify(db));
            return new Response(JSON.stringify(db), {headers: headersOBJ});
        } else if (req.method === "GET") {
            let db = JSON.parse(Deno.readTextFileSync("../db/stage-2-games.json"));
            return new Response(JSON.stringify(db), {headers: headersOBJ});
        }
    } else if (url.pathname === "/stage3/games") {
        if (req.method === "POST") {
            if (req.headers.get("content-type") !== "application/json") {return new Response("Invalid Content-Type, JSON Expected", {status: 405, headers: headersOBJ})};
            headersOBJ.set("content-type", "application/json");
            let reqBody = await req.json();
            if (!reqBody.record || !reqBody.map || !reqBody.team1 || !reqBody.team2 || !reqBody.score) {
                return new Response("Invalid request, Attributes missing", {status: 400, headers: headersOBJ});
            }

            let maps = ["Ancient", "Anubis", "Train", "Inferno", "Dust 2", "Mirage", "Nuke"];
            let records = ["0-0", "0-1", "1-0", "1-1", "1-2", "2-1", "2-2", "2-0", "0-2"];
            let stage2Teams = JSON.parse(Deno.readTextFileSync("../db/stage-3.json"));
            let team1 = stage2Teams.find((x) => x.team.toLowerCase() === reqBody.team1.toLowerCase());
            let team2 = stage2Teams.find((x) => x.team.toLowerCase() === reqBody.team2.toLowerCase());
            if (!team1 || !team2) {
                return new Response("Invalid Team(s)", {status: 406, headers: headersOBJ});
            }

            if (!records.includes(reqBody.record)) {
                return new Response("Invalid Record", {status: 406, headers: headersOBJ});
            } else if (reqBody.map.length > 10) {
                let reqMaps = reqBody.map.split(", ");
                if (!maps.includes(reqMaps[0]) || !maps.includes(reqMaps[1]) || !maps.includes(reqMaps[2])) {
                    return new Response("Invalid Map(s)", {status: 406, headers: headersOBJ});
                }
            } else if (reqBody.map.length < 10) {
                if (!maps.includes(reqBody.map)) {
                    return new Response("Invalid Map(s)", {status: 406, headers: headersOBJ});
                }
            }

            let obj =  {
                record: reqBody.record,
                map: reqBody.map,
                team1: reqBody.team1,
                team2: reqBody.team2,
                score: reqBody.score
            }

            let db = JSON.parse(Deno.readTextFileSync("../db/stage-3-games.json"));
            db.push(obj);
            Deno.writeTextFileSync("../db/stage-3-games.json", JSON.stringify(db));
            return new Response(JSON.stringify(db), {headers: headersOBJ});
        } else if (req.method === "GET") {
            let db = JSON.parse(Deno.readTextFileSync("../db/stage-3-games.json"));
            return new Response(JSON.stringify(db), {headers: headersOBJ});
        }
    } else if (url.pathname === "/playoffs") {
        if (req.method === "GET") {
            let db = JSON.parse(Deno.readTextFileSync("../db/playoffs.json"));
            return new Response(JSON.stringify(db), {headers: headersOBJ});
        } else if (req.method === "POST") {
            if (req.headers.get("content-type") !== "application/json") {return new Response("Invalid Content-Type, JSON Expected", {status: 405, headers: headersOBJ})};
            let reqBody = await req.json();
            if (!reqBody.team || reqBody.player1.length === 0 || reqBody.player2.length === 0 || reqBody.player3.length === 0 || reqBody.player4.length === 0 || reqBody.player5.length === 0) {
                return new Response("Invalid request body, one or more attributes missing", {status: 400, headers: headersOBJ});
            }

            let obj = {
                team: reqBody.team,
                player1: reqBody.player1,
                player2: reqBody.player2,
                player3: reqBody.player3,
                player4: reqBody.player4,
                player5: reqBody.player5,
            }

            let teams = JSON.parse(Deno.readTextFileSync("../db/playoffs.json"));
            if (teams.length === 8) {return new Response("Can't add more teams", {status: 409, headers: headersOBJ})};
            teams.push(obj);
            Deno.writeTextFileSync("../db/playoffs.json", JSON.stringify(teams));
            return new Response("Team successfully added", {status: 200, headers: headersOBJ});
        }
    }

    return new Response("Invalid Request", {status: 400, headers: headersOBJ});
}

Deno.serve(handler);