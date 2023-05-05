main();

function main() {
  const canvas = document.querySelector("#glcanvas");
  const gl = canvas.getContext("webgl");

  if (gl === null) {
    return;
  }

  gl.drawArrays(gl.TRIANGLES, 0, 4)
}
