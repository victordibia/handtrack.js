const LeaderLine = window.LeaderLine;
export const animOptions = { duration: 800, timing: "ease" };
export const greyColor = "rgba(189, 195, 199, 0.5)";
export const blueColor = "rgba(0,98,255, 1)";

export function removeLines(lineHolder) {
  lineHolder.forEach(function (each) {
    each.line.remove();
  });
  lineHolder = [];
}

// console.log(LeaderLine);

export function drawLines(lineHolder, lineParams) {
  // removeLines(lineHolder);
  for (const [i, param] of lineParams.entries()) {
    let line = new LeaderLine(param.startElement, param.endElement, {
      color: param.color,
      startPlug: "disc",
      endPlug: "disc",
      startPlugColor: param.color,
      path: "fluid",
      size: param.size,
      hide: true,
      startSocket: "bottom",
      endSocket: param.endSocket,
      endPlugSize: param.endPlugSize,
      //   startPlugSize: param.startPlugSize,
    });

    animOptions.duration = 800;
    line.show("draw", animOptions);
    lineHolder.push({ line: line, index: i });
  }
  // document.querySelector(".leader-line").style.zIndex = -100;
}
