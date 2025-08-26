window.addEventListener("load", () => {
  const canvas = document.querySelector("#canva");
  const ctx = canvas.getContext("2d"); //the paintbrush to use

  //resizing
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //   ctx.strokeStyle = "red";
  //   ctx.strokeRect(50, 50, 200, 200);

  console.log(canvas);

  //variable
  let isclicked = false;
  let crntcolour = "black";
  let crntsize = 5;
  let bckcolor = "#ffffff";
  let action = [];
  let redoStack = [];
  let currentStroke = null; //means user is currently not drawing

  const colourdrop = document.getElementById("colour");
  const sizesslider = document.getElementById("size");
  const clearbtn = document.querySelector("#clear");
  const savebtn = document.querySelector("#save");
  const bginput = document.getElementById("bgcolour");
  const undoBtn = document.getElementById("undo");
  const redoBtn = document.getElementById("redo");

  colourdrop.addEventListener("change", (e) => {
    crntcolour = e.target.value;
  });

  sizesslider.addEventListener("change", (e) => {
    crntsize = e.target.value;
  });

  clearbtn.addEventListener("click", () => {
    fillbackground(bckcolor);
    action = [];
  });

  savebtn.addEventListener("click", () => {
    //link creation
    const link = document.createElement("a");
    link.download = "myDrawing.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });

  function fillbackground(color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  bginput.addEventListener("input", (e) => {
    bckcolor = e.target.value;
    fillbackground(bckcolor);
  });

  function undo() {
    if (action.length > 0) {
      redoStack.push(action.pop()); //store the top element
      reDraw();
    }
  }

  function redo() {
    if (redoStack.length > 0) {
      action.push(redoStack.pop());
      reDraw();
    }
  }

  undoBtn.addEventListener("click", undo);
  redoBtn.addEventListener("click", redo);

  function start(e) {
    isclicked = true;
    currentStroke = { color: crntcolour, size: crntsize, points: [] };
    currentStroke.points.push({ x: e.clientX, y: e.clientY });
  }

  function end(e) {
    if (currentStroke) {
      action.push(currentStroke);
      currentStroke = null;
      redoStack = []; //to avoid ambiguos case when we draw a new one after undo
    }
    isclicked = false;
  }

  function draw(e) {
    if (!isclicked) return; //only draw if mouse is pressed
    currentStroke.points.push({ x: e.clientX, y: e.clientY });
    reDraw();
  }

  function reDraw() {
    //first fill the background just once
    ctx.fillStyle = bckcolor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // action = [{c,s,p:[]},{}]
    let strokes = [...action];

    //add the current one if exist
    if (currentStroke) strokes.push(currentStroke);

    //loop over strokes
    strokes.forEach((stroke) => {
      if (stroke.points.length === 0) return; // skip empty

      ctx.lineWidth = stroke.size;
      ctx.strokeStyle = stroke.color;

      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y); //move to the first point

      // Loop from the *second* point to draw lines (Slight optimization)
      for (let i = 1; i < stroke.points.length; i++) {
        const p = stroke.points[i];
        ctx.lineTo(p.x, p.y);
      }

      ctx.stroke();
    });
  }

  //events
  canvas.addEventListener("mousedown", start);
  canvas.addEventListener("mouseup", end);
  canvas.addEventListener("mousemove", draw);
});
