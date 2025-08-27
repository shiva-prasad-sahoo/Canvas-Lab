window.addEventListener("load", () => {
  const canvas = document.querySelector("#canva");
  const ctx = canvas.getContext("2d"); //the paintbrush to use

  // resizing
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // variables
  let isclicked = false;
  let crntcolour = "black";
  let crntsize = 5;
  let currentStroke = null; // means user is currently not drawing

  let state = {
    action: [],
    redoStack: [],
    bckcolor: "#ffffff",
  };

  const colourdrop = document.getElementById("colour");
  const sizesslider = document.getElementById("size");
  const clearbtn = document.querySelector("#clear");
  const savebtn = document.querySelector("#save");
  const bginput = document.getElementById("bgcolour");
  const undoBtn = document.getElementById("undo");
  const redoBtn = document.getElementById("redo");

  // color + size
  colourdrop.addEventListener("change", (e) => {
    crntcolour = e.target.value;
  });

  sizesslider.addEventListener("change", (e) => {
    crntsize = e.target.value;
  });

  // clear
  clearbtn.addEventListener("click", () => {
    fillbackground(state.bckcolor);
    state.action = [];
    saveState();
  });

  // save as PNG
  savebtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "myDrawing.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });

  // background fill
  function fillbackground(color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  bginput.addEventListener("input", (e) => {
    state.bckcolor = e.target.value;
    fillbackground(state.bckcolor);
    saveState();
  });

  // undo
  function undo() {
    if (state.action.length > 0) {
      state.redoStack.push(state.action.pop());
      reDraw();
      saveState();
    }
  }

  // redo
  function redo() {
    if (state.redoStack.length > 0) {
      state.action.push(state.redoStack.pop());
      reDraw();
      saveState();
    }
  }

  undoBtn.addEventListener("click", undo);
  redoBtn.addEventListener("click", redo);

  // persistence
  function saveState() {
    localStorage.setItem("drawing", JSON.stringify(state));
  }

  function loadState() {
    const data = localStorage.getItem("drawing");
    if (!data) return;
    state = JSON.parse(data);
    reDraw();
  }

  // drawing functions
  function start(e) {
    isclicked = true;
    currentStroke = { color: crntcolour, size: crntsize, points: [] };
    currentStroke.points.push({ x: e.clientX, y: e.clientY });
  }

  function end(e) {
    if (currentStroke) {
      state.action.push(currentStroke);
      currentStroke = null;
      state.redoStack = []; // reset redo on new draw
    }
    isclicked = false;
    saveState();
  }

  function draw(e) {
    if (!isclicked) return; // only draw if mouse is pressed
    currentStroke.points.push({ x: e.clientX, y: e.clientY });
    reDraw();
  }

  function reDraw() {
    // fill background
    ctx.fillStyle = state.bckcolor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let strokes = [...state.action];

    // add the current one if exists
    if (currentStroke) strokes.push(currentStroke);

    // loop over strokes
    strokes.forEach((stroke) => {
      if (stroke.points.length === 0) return;

      ctx.lineWidth = stroke.size;
      ctx.strokeStyle = stroke.color;

      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

      for (let i = 1; i < stroke.points.length; i++) {
        const p = stroke.points[i];
        ctx.lineTo(p.x, p.y);
      }

      ctx.stroke();
    });
  }

  // events
  canvas.addEventListener("mousedown", start);
  canvas.addEventListener("mouseup", end);
  canvas.addEventListener("mousemove", draw);

  // load saved state on refresh
  loadState();
});
