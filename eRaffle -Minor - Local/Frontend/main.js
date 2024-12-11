let participants = []

async function fetchUsers() {
  try {
    const response = await fetch("http://localhost:3001/api/users");
    if (!response.ok) throw new Error("Failed to fetch users");
    const users = await response.json();
    participants = users;  // Store the full users array for later use
    const nameArray = users.map(user => user.Username);
    // console.log(nameArray.length)
    // console.log('users', users);
    startRaffleDraw(nameArray, users);  // Pass the full users array to use later for updating the winner
  } catch (err) {
    console.error(err);
  }
}


function showWinner(winner) {
  let winnerName = winner;

  // Display winner
  $("#world").addClass("open");
  $("#confetti").addClass("open");
  $("#congrats").addClass("open");
  $("#winner").addClass("open");
  $("#close").addClass("open");
  $("#winner").text(winnerName);


  $("#close").click(function () {
    $("#world").removeClass("open");
    $("#confetti").removeClass("open");
    $("#congrats").removeClass("open");
    $("#winner").removeClass("open");
    $("#close").removeClass("open");
  });
}

// Confetti
(function () {
  var COLORS, Confetti, NUM_CONFETTI, PI_2, canvas, confetti, context, drawCircle, i, range, resizeWindow, xpos;

  NUM_CONFETTI = 350;

  COLORS = [[85, 71, 106], [174, 61, 99], [219, 56, 83], [244, 92, 68], [248, 182, 70]];

  PI_2 = 2 * Math.PI;

  canvas = document.getElementById("world");

  context = canvas.getContext("2d");

  window.w = 0;

  window.h = 0;

  resizeWindow = function () {
    window.w = canvas.width = window.innerWidth;
    return window.h = canvas.height = window.innerHeight;
  };

  window.addEventListener('resize', resizeWindow, false);

  window.onload = function () {
    return setTimeout(resizeWindow, 0);
  };

  range = function (a, b) {
    return (b - a) * Math.random() + a;
  };

  drawCircle = function (x, y, r, style) {
    context.beginPath();
    context.arc(x, y, r, 0, PI_2, false);
    context.fillStyle = style;
    return context.fill();
  };

  xpos = 0.5;

  document.onmousemove = function (e) {
    return xpos = e.pageX / w;
  };

  window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
      // return window.setTimeout(callback, 1000 / 60);
      return window.setTimeout(callback, 1000 / 60);
    };
  })();

  Confetti = class Confetti {
    constructor() {
      this.style = COLORS[~~range(0, 5)];
      this.rgb = `rgba(${this.style[0]},${this.style[1]},${this.style[2]}`;
      this.r = ~~range(2, 6);
      this.r2 = 2 * this.r;
      this.replace();
    }

    replace() {
      this.opacity = 0;
      this.dop = 0.03 * range(1, 4);
      this.x = range(-this.r2, w - this.r2);
      this.y = range(-20, h - this.r2);
      this.xmax = w - this.r;
      this.ymax = h - this.r;
      this.vx = range(0, 2) + 8 * xpos - 5;
      return this.vy = 0.7 * this.r + range(-1, 1);
    }

    draw() {
      var ref;
      this.x += this.vx;
      this.y += this.vy;
      this.opacity += this.dop;
      if (this.opacity > 1) {
        this.opacity = 1;
        this.dop *= -1;
      }
      if (this.opacity < 0 || this.y > this.ymax) {
        this.replace();
      }
      if (!((0 < (ref = this.x) && ref < this.xmax))) {
        this.x = (this.x + this.xmax) % this.xmax;
      }
      return drawCircle(~~this.x, ~~this.y, this.r, `${this.rgb},${this.opacity})`);
    }

  };

  confetti = (function () {
    var j, ref, results;
    results = [];
    for (i = j = 1, ref = NUM_CONFETTI; (1 <= ref ? j <= ref : j >= ref); i = 1 <= ref ? ++j : --j) {
      results.push(new Confetti);
    }
    return results;
  })();

  window.step = function () {
    var c, j, len, results;
    requestAnimationFrame(step);
    context.clearRect(0, 0, w, h);
    results = [];
    for (j = 0, len = confetti.length; j < len; j++) {
      c = confetti[j];
      results.push(c.draw());
    }
    return results;
  };

  step();

}).call(this);


function startRaffleDraw(nameArray, users) {
  const header = document.getElementById("headerNames");
  if (!header) {
    console.error("Element with id 'headerNames' not found!");
    return;
  }

  let index = 0;
  const intervalTime = 100; // Speed of cycling names
  let cycling = false; // Flag to control cycling
  let interval;
  let winnerSelected = false;
  let drawCount = 0;
  let isSpacePressed = false;

  const startCycling = () => {
    if (cycling) return; // Prevent starting again if already cycling
    $("#world").removeClass("open");
    $("#confetti").removeClass("open");
    $("#congrats").removeClass("open");
    $("#winner").removeClass("open");
    $("#close").removeClass("open");
    cycling = true;
    // interval = setInterval(() => {
    //   header.textContent = nameArray[index];
    //   index = (index + 1) % nameArray.length;
    // }, intervalTime);

    interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * nameArray.length);
      header.textContent = nameArray[randomIndex];
    }, intervalTime);
  };

  const stopCycling = () => {
    if (!cycling) return; // Prevent stopping if not cycling
    clearInterval(interval);
    cycling = false;
  };

  // const resetCycle = () => {
  //   $("#world").removeClass("open");
  //   $("#confetti").removeClass("open");
  //   $("#congrats").removeClass("open");
  //   $("#winner").removeClass("open");
  //   $("#close").removeClass("open");
  //   stopCycling();
  //   header.textContent = "Start the draw";
  //   winnerSelected = false;
  // };


  document.addEventListener("keydown", async (event) => {
    if (event.key === " " && !isSpacePressed) {
      isSpacePressed = true; // Prevent further handling until key is released

      if (!cycling && drawCount === 0) {
        startCycling();
      } else if (drawCount === 0 && cycling) {
        let winner = participants[Math.floor(Math.random() * participants.length)];
        header.textContent = winner.Username;
        let winnerName = winner.Username;

        showWinner(winnerName);
        await updateUserWinnerStatus(winner.Id);
        drawCount++;
        stopCycling();
        header.textContent = winnerName
        winnerSelected = true;
        console.log(drawCount)
      }
      // `drawCount--` is removed since it was causing state inconsistencies
      // console.log('drawCount', drawCount);
    }

    if (event.key === "Enter") {
      //   // resetCycle();
      //   $("#world").removeClass("open");
      //   $("#confetti").removeClass("open");
      //   $("#congrats").removeClass("open");
      //   $("#winner").removeClass("open");
      //   $("#close").removeClass("open");
      //   stopCycling();
      //   header.textContent = "Start the draw";
      //   clearInterval(interval);
      //   cycling = false;
      //   drawCount = 0; // Ensure drawCount resets here

    }
  });

  // Reset the `isSpacePressed` flag on keyup
  document.addEventListener("keyup", (event) => {
    if (event.key === " ") {
      isSpacePressed = false;
    }
  });
}

async function updateUserWinnerStatus(Id) {
  // console.log('Id', Id)
  try {
    const response = await fetch(`http://localhost:3001/api/users/${Id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ IsWinner: true }),
    });
    if (response.ok) {
      fetchUsers();
      console.log(`User with ID ${Id} is marked as winner.`);
    } else {
      console.error("Failed to update winner status.");
    }
  } catch (err) {
    console.error("Error updating winner status:", err);
  }
}

// Fetch users and start the process
fetchUsers();
