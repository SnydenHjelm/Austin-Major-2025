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
            if (!reqBody.record || !reqBody.team1 || !reqBody.team2 || !reqBody.score) {
                return new Response("Invalid requests, Attributes missing", {status: 400, headers: headersOBJ});
            }

            let obj =  {
                record: reqBody.record,
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
    }

    return new Response("Invalid Request", {status: 400, headers: headersOBJ});
}

Deno.serve(handler);