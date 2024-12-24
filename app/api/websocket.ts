const DEFAULT_PORT = 1547;
let toon: any = null;
let socket: WebSocket | null = null;
let scout: WebSocket | null = null;
let userId: string | null = "";
let contReqInterval: NodeJS.Timeout | null = null;
let scoutAttempts = 0;
const MAX_SCOUT_ATTEMPTS = 10;
const RECONNECT_DELAY = 10000;
const RECONNECT_INTERVAL = 5000;

export const initWebSocket = (
  setIsConnected: (isConnected: boolean) => void,
  setToonData: (data: any) => void,
  id: string
) => {
  userId = id;

  const connectWebSocket = () => {
    socket = new WebSocket(`ws://localhost:${DEFAULT_PORT}`);

    socket.addEventListener("open", (event) => {
      console.log("WebSocket opened");
      if (socket) {
        socket.send(
          JSON.stringify({ authorization: initAuthToken(), name: "ToonScout" })
        );
        socket.send(JSON.stringify({ request: "all" }));
        startContinuousRequests();
      }
    });

    socket.addEventListener("message", (event) => {
      //   toon = JSON.parse(event.data)

      toon = JSON.parse(
        `{"event":"all","data":{"toon":{"id":"TTID-NFSQ-MFDB","name":"Meerkataclysm","species":"cat","headColor":"#a35a44","style":"7405020100991b8c1bc01b080025060104004000000a0500049f00120000024400"},"laff":{"current":61,"max":61},"location":{"zone":"Meerkataclysm's Estate","neighborhood":"Meerkataclysm's Estate","district":"Splat Summit","instanceId":205224},"gags":{"Toon-Up":null,"Trap":{"gag":{"level":3,"name":"Marbles"},"organic":null,"experience":{"current":162,"next":500}},"Lure":null,"Sound":{"gag":{"level":7,"name":"Opera Singer"},"organic":null,"experience":{"current":0,"next":500}},"Throw":{"gag":{"level":7,"name":"Wedding Cake"},"organic":null,"experience":{"current":500,"next":500}},"Squirt":{"gag":{"level":7,"name":"Geyser"},"organic":null,"experience":{"current":52,"next":500}},"Drop":{"gag":{"level":7,"name":"Toontanic"},"organic":null,"experience":{"current":500,"next":500}}},"tasks":[{"objective":{"text":"Defeat 10 Level 8+ Cogs","where":"Anywhere","progress":{"text":"Complete","current":29,"target":10}},"from":{"name":"Lil Oldman","building":"The Blizzard Wizard","zone":"Walrus Way","neighborhood":"The Brrrgh"},"to":{"name":"Lil Oldman","building":"The Blizzard Wizard","zone":"Walrus Way","neighborhood":"The Brrrgh"},"reward":"Gag training","deletable":false}],"invasion":null,"fish":{"rod":{"id":4,"name":"Gold"},"collection":{"0":{"name":"Balloon Fish","album":{"0":{"name":"Balloon Fish","weight":47},"1":{"name":"Hot Air Balloon Fish","weight":16},"2":{"name":"Weather Balloon Fish","weight":76},"3":{"name":"Water Balloon Fish","weight":68},"4":{"name":"Red Balloon Fish","weight":61}}},"2":{"name":"Cat Fish","album":{"0":{"name":"Cat Fish","weight":94},"1":{"name":"Siamese Cat Fish","weight":77},"2":{"name":"Alley Cat Fish","weight":105},"3":{"name":"Tabby Cat Fish","weight":85},"4":{"name":"Tom Cat Fish","weight":169}}},"4":{"name":"Clown Fish","album":{"0":{"name":"Clown Fish","weight":125},"1":{"name":"Sad Clown Fish","weight":122},"2":{"name":"Party Clown Fish","weight":125},"3":{"name":"Circus Clown Fish","weight":105}}},"6":{"name":"Frozen Fish","album":{"0":{"name":"Frozen Fish","weight":190}}},"8":{"name":"Star Fish","album":{"0":{"name":"Star Fish","weight":79},"1":{"name":"Five Star Fish","weight":94},"2":{"name":"Rock Star Fish","weight":156},"3":{"name":"Shining Star Fish","weight":76},"4":{"name":"All Star Fish","weight":77}}},"10":{"name":"Holey Mackerel","album":{"0":{"name":"Holey Mackerel","weight":126}}},"12":{"name":"Dog Fish","album":{"0":{"name":"Dog Fish","weight":235},"1":{"name":"Bull Dog Fish","weight":317},"2":{"name":"Hot Dog Fish","weight":65},"3":{"name":"Dalmatian Dog Fish","weight":104},"4":{"name":"Puppy Dog Fish","weight":31}}},"14":{"name":"Amore Eel","album":{"0":{"name":"Amore Eel","weight":93},"1":{"name":"Electric Amore Eel","weight":82}}},"16":{"name":"Nurse Shark","album":{"0":{"name":"Nurse Shark","weight":188},"1":{"name":"Clara Nurse Shark","weight":173},"2":{"name":"Florence Nurse Shark","weight":149}}},"18":{"name":"King Crab","album":{"0":{"name":"King Crab","weight":62},"1":{"name":"Alaskan King Crab","weight":119},"2":{"name":"Old King Crab","weight":93}}},"20":{"name":"Moon Fish","album":{"0":{"name":"Moon Fish","weight":93},"2":{"name":"Half Moon Fish","weight":105},"3":{"name":"New Moon Fish","weight":16},"4":{"name":"Crescent Moon Fish","weight":81},"5":{"name":"Harvest Moon Fish","weight":219}}},"22":{"name":"Sea Horse","album":{"0":{"name":"Sea Horse","weight":251},"1":{"name":"Rocking Sea Horse","weight":283},"2":{"name":"Clydesdale Sea Horse","weight":289},"3":{"name":"Arabian Sea Horse","weight":310}}},"24":{"name":"Pool Shark","album":{"0":{"name":"Pool Shark","weight":173},"1":{"name":"Kiddie Pool Shark","weight":128},"2":{"name":"Swimming Pool Shark","weight":168},"3":{"name":"Olympic Pool Shark","weight":152}}},"26":{"name":"Bear Acuda","album":{"0":{"name":"Brown Bear Acuda","weight":282},"1":{"name":"Black Bear Acuda","weight":258},"2":{"name":"Koala Bear Acuda","weight":263},"3":{"name":"Honey Bear Acuda","weight":268},"4":{"name":"Polar Bear Acuda","weight":296},"5":{"name":"Panda Bear Acuda","weight":314},"6":{"name":"Kodiac Bear Acuda","weight":294},"7":{"name":"Grizzly Bear Acuda","weight":283}}},"28":{"name":"Cutthroat Trout","album":{"0":{"name":"Cutthroat Trout","weight":152},"1":{"name":"Captain Cutthroat Trout","weight":86},"2":{"name":"Scurvy Cutthroat Trout","weight":87}}},"30":{"name":"Piano Tuna","album":{"0":{"name":"Piano Tuna","weight":269},"1":{"name":"Grand Piano Tuna","weight":295},"2":{"name":"Baby Grand Piano Tuna","weight":245},"3":{"name":"Upright Piano Tuna","weight":274},"4":{"name":"Player Piano Tuna","weight":279}}},"32":{"name":"Peanut Butter & Jellyfish","album":{"0":{"name":"Peanut Butter & Jellyfish","weight":79},"1":{"name":"Grape PB&J Fish","weight":74},"2":{"name":"Crunchy PB&J Fish","weight":70},"3":{"name":"Strawberry PB&J Fish","weight":70}}},"34":{"name":"Devil Ray","album":{"0":{"name":"Devil Ray","weight":271}}}}},"flowers":{"shovel":{"id":0,"name":"Tin Shovel"},"collection":{"49":{"name":"Daisy","album":{"0":"School Daisy","1":"Lazy Daisy"}},"51":{"name":"Carnation","album":{"0":"What-in Carnation","1":"Instant Carnation"}},"52":{"name":"Lily","album":{"0":"Lily-of-the-Alley","1":"Lily Pad"}},"53":{"name":"Daffodil","album":{"0":"Laff-o-dil","1":"Daffy Dill"}},"54":{"name":"Pansy","album":{"0":"Dandy Pansy","1":"Chim Pansy"}}}},"cogsuits":{"c":{"department":"Bossbot","hasDisguise":true,"suit":{"id":"mh","name":"Big Cheese"},"version":1,"level":23,"promotion":{"current":0,"target":1310}},"l":{"department":"Lawbot","hasDisguise":true,"suit":{"id":"mh","name":"Legal Eagle"},"version":1,"level":23,"promotion":{"current":1310,"target":1310}},"m":{"department":"Cashbot","hasDisguise":true,"suit":{"id":"mh","name":"Robber Baron"},"version":1,"level":50,"promotion":{"current":0,"target":1310}},"s":{"department":"Sellbot","hasDisguise":true,"suit":{"id":"mh","name":"Mr. Hollywood"},"version":1,"level":23,"promotion":{"current":0,"target":1310}}},"golf":[{"name":"Courses Completed","num":0},{"name":"Courses Under Par","num":0},{"name":"Hole In One Shots","num":0},{"name":"Eagle Or Better Shots","num":0},{"name":"Birdie Or Better Shots","num":0},{"name":"Par Or Better Shots","num":0},{"name":"Multiplayer Courses Completed","num":0},{"name":"Walk In The Par Wins","num":0},{"name":"Hole Some Fun Wins","num":0},{"name":"The Hole Kit And Caboodle Wins","num":0}],"racing":[{"name":"Speedway Wins","num":0},{"name":"Rural Wins","num":0},{"name":"Urban Wins","num":0},{"name":"Total Wins","num":0},{"name":"Speedway Qualify Count","num":0},{"name":"Rural Qualify Count","num":0},{"name":"Urban Qualify Count","num":0},{"name":"Total Qualify Count","num":0},{"name":"Tournament Race Wins","num":0},{"name":"Tournament Race Qualify Count","num":0},{"name":"Unique race tracks completed","num":0}]}}`
      );
      setToonData(toon.data);
      setIsConnected(true);
    });

    socket.addEventListener("error", (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    });

    socket.addEventListener("close", (event) => {
      console.log("WebSocket closed:", event);
      setIsConnected(false);
      stopContinuousRequests();
      setTimeout(connectWebSocket, RECONNECT_DELAY);
    });
  };

  function startContinuousRequests() {
    if (contReqInterval) {
      clearInterval(contReqInterval);
    }

    contReqInterval = setInterval(async () => {
      if (userId && socket && socket.readyState === WebSocket.OPEN && toon) {
        try {
          await sendData(userId, toon);
          socket.send(JSON.stringify({ request: "all" }));
          setIsConnected(true);
        } catch (error) {
          console.error("Error in continuous request:", error);
        }
      }
    }, RECONNECT_INTERVAL);
  }

  function stopContinuousRequests() {
    if (contReqInterval) {
      clearInterval(contReqInterval);
      contReqInterval = null;
    }
  }

  connectWebSocket();
};

function connectScoutWebSocket() {
  scout = new WebSocket("wss://api.scouttoon.info");

  scout.onopen = () => {
    console.log("Scout WebSocket connection established");
    scoutAttempts = 0;
  };

  scout.onerror = (error) => {
    console.error("Scout WebSocket error:", error);
  };

  scout.onclose = (event) => {
    console.log("Scout WebSocket connection closed:", event);
    handleScoutReconnection();
  };
}

function handleScoutReconnection() {
  if (scoutAttempts < MAX_SCOUT_ATTEMPTS) {
    scoutAttempts++;
    console.log(
      `Attempting to reconnect to scout WebSocket in ${RECONNECT_DELAY} ms...`
    );

    setTimeout(() => {
      connectScoutWebSocket();
    }, RECONNECT_DELAY);
  } else {
    console.log(
      "Max reconnection attempts for scout WebSocket reached. Stopping attempts."
    );
  }
}

async function sendData(userId: string, data: any) {
  if (scout && scout.readyState === WebSocket.OPEN) {
    scout.send(JSON.stringify({ userId, data }));
  } else {
    console.error("WebSocket connection is not open.");
    handleScoutReconnection();
  }
}

connectScoutWebSocket();

export default initWebSocket;

function initAuthToken() {
  const length = 16;
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters[randomIndex];
  }
  return token;
}
