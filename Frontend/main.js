async function fetchUsers() {
  try {
    const response = await fetch("http://localhost:3001/api/users");
    if (!response.ok) throw new Error("Failed to fetch users");
    const users = await response.json();
    const nameArray = users.map(user => user.username);
    console.log(nameArray);
    startRaffleDraw(nameArray, users);  // Pass the full users array to use later for updating the winner
  } catch (err) {
    console.error(err);
  }
}


function showWinner(winner) {
  let winnerName = "🎉" + " " + winner + " " + "🎉";

  // Display winner
  $("#world").addClass("open");
  $("#winner").addClass("open");
  $("#close").addClass("open");
  $("#winner").text(winnerName);


  $("#close").click(function () {
    $("#world").removeClass("open");
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
  let cycling = true; // Flag to control cycling
  let winnerSelected = false;
  let interval;

  const startCycling = () => {
    $("#world").removeClass("open");
    $("#winner").removeClass("open");
    $("#close").removeClass("open");
    cycling = true;
    winnerSelected = false;
    interval = setInterval(() => {
      if (cycling) {
        header.textContent = nameArray[index];
        index = (index + 1) % nameArray.length;
      }
    }, intervalTime);
  };

  const stopCycling = () => {
    clearInterval(interval);
    cycling = false;
  };

  startCycling();

  document.addEventListener("keydown", async (event) => {
    if (event.key === "Enter" && cycling && !winnerSelected) {
      winnerSelected = true;
      setTimeout(async () => {
        stopCycling();
        const winner = nameArray[Math.floor(Math.random() * nameArray.length)];
        header.textContent = winner;
        showWinner(header.textContent);

        const winnerUser = users.find(user => user.username === winner);
        if (winnerUser) {
          await updateUserWinnerStatus(winnerUser.userId);
        }
      }, 3000);
    }

    if (event.key === "p" && !cycling) {
      startCycling();
    }
  });
}

async function updateUserWinnerStatus(userId) {
  try {
    const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isWinner: true }),
    });
    if (response.ok) {
      console.log(`User with ID ${userId} is marked as winner.`);
    } else {
      console.error("Failed to update winner status.");
    }
  } catch (err) {
    console.error("Error updating winner status:", err);
  }
}

// Fetch users and start the process
fetchUsers();
