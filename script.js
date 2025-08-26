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

  const colourdrop = document.getElementById("colour");
  const sizesslider = document.getElementById("size");
  const clearbtn = document.querySelector("#clear");
  const savebtn = document.querySelector("#save");
  const bginput = document.getElementById("bgcolour");

  colourdrop.addEventListener("change", (e) => {
    crntcolour = e.target.value;
  });

  sizesslider.addEventListener("change", (e) => {
    crntsize = e.target.value;
  });

  clearbtn.addEventListener("click", () => {
    fillbackground(bckcolor);
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

  function start(e) {
    isclicked = true;
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
  }

  function end(e) {
    isclicked = false;
    ctx.beginPath(); //resets the path so drawings dont connect to old one
  }

  function draw(e) {
    if (!isclicked) return; //only draw if mouse is pressed
    ctx.lineWidth = crntsize;
    ctx.lineCap = "round"; //line ends are round and smooth
    ctx.strokeStyle = crntcolour;

    // ctx.beginPath(); //this will reset the starting pt so dotted lines only

    ctx.lineTo(e.clientX, e.clientY); //draws from old pt to new pt
    ctx.stroke(); //actually paints the line

    ctx.beginPath(); // again reset
    ctx.moveTo(e.clientX, e.clientY); //move the pen to new positon
  }

  //events
  canvas.addEventListener("mousedown", start);
  canvas.addEventListener("mouseup", end);
  canvas.addEventListener("mousemove", draw);
});
