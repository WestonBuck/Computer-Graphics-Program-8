/////////////////////////////////////////////////////////
//
// Weston Buck  
// Program 8
// Bugs/problems : does not have a texture on a face of any cube
//
/////////////////////////////////////////////////////////
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'uniform mat4 u_MvpMatrix;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = u_MvpMatrix * a_Position;\n' +
  '  v_Color = a_Color;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';

//variables used for buttons
  var eyeX = 0;
  var eyeY = 0;
  var eyeZ = 10;
  var lookatX = 0;
  var lookatY = 0;
  var lookatZ = 0;
  var isPerspective = true;
  var fov = 30;
  var aspectRatio = 1.0;
  var nearPlane = 1;
  var farPlane = 100;
  var sizeChanger = 0

  var ANGLE_STEP = 45.0;

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  var currentAngle = 0.0;
  
    var tick = function() {
      currentAngle = rotate(currentAngle);  // Update the rotation angle
      drawShapes(gl,currentAngle);
      requestAnimationFrame(tick, canvas);   // Request that the browser calls tick
    };
  
    tick();

}

function drawShapes(gl,currentAngle)
{
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);  
  gl.enable(gl.DEPTH_TEST);  
  drawcube1(gl,currentAngle);
  drawcube2(gl,currentAngle);  
  drawcube3(gl,currentAngle);
  drawcube4(gl,currentAngle);
  drawcube5(gl,currentAngle); 
  drawcube6(gl,currentAngle); 
  
}

//all drawing functions are the same except for their starting positions.
function drawcube1(gl,currentAngle)
{
  
  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3

  var vertices = new Float32Array([   // Vertex coordinates
    1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,  // v0-v1-v2-v3 front
    1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,  // v0-v3-v4-v5 right
    1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,  // v0-v5-v6-v1 up
   -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,  // v1-v6-v7-v2 left
   -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,  // v7-v4-v3-v2 down
    1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0   // v4-v7-v6-v5 back
 ]);

 var colors = new Float32Array([     // Colors
   0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  // v0-v1-v2-v3 front(blue)
   0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  // v0-v3-v4-v5 right(green)
   1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  // v0-v5-v6-v1 up(red)
   1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  // v1-v6-v7-v2 left
   1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v7-v4-v3-v2 down
   0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0   // v4-v7-v6-v5 back
 ]);

 var indices = new Uint8Array([       // Indices of the vertices
    0, 1, 2,   0, 2, 3,    // front
    4, 5, 6,   4, 6, 7,    // right
    8, 9,10,   8,10,11,    // up
   12,13,14,  12,14,15,    // left
   16,17,18,  16,18,19,    // down
   20,21,22,  20,22,23     // back
 ]);


 var m = initVertexBuffers(gl,vertices,colors,indices);
 if (m < 0) {
   console.log('Failed to set the vertex information');
   return;
 }

 //set either type of projection based on user's choice and use user's choice of values. This is the same in all drawing instances.
  var mvpMatrix = new Matrix4();
  if (isPerspective == true)
  {
    mvpMatrix.setPerspective(fov, aspectRatio, nearPlane, farPlane);    
  }
  else
  {
    mvpMatrix.setOrtho(-3,3,-3.0,3.0,nearPlane,farPlane);
  }
  mvpMatrix.lookAt(eyeX, eyeY, eyeZ, lookatX, lookatY, lookatZ, 0, 1, 0);
  mvpMatrix.rotate(-currentAngle*2.0,0,0,1); 
  
  //move all the cubes to different places
  mvpMatrix.scale(.3,.3,.3);
  mvpMatrix.translate(-2.0,-4.0,0.0);

  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix'); 
  if (!u_MvpMatrix) { 
    console.log('Failed to get the storage location of u_MvpMatrix');
    return;
  } 
 
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);  
  gl.drawElements(gl.TRIANGLES, m, gl.UNSIGNED_BYTE, 0);
  
}

function drawcube2(gl,currentAngle)
{
  
  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3

  var vertices = new Float32Array([   // Vertex coordinates
    1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,  // v0-v1-v2-v3 front
    1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,  // v0-v3-v4-v5 right
    1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,  // v0-v5-v6-v1 up
   -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,  // v1-v6-v7-v2 left
   -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,  // v7-v4-v3-v2 down
    1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0   // v4-v7-v6-v5 back
 ]);

 var colors = new Float32Array([     // Colors
   1.0, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  // v0-v1-v2-v3 front(blue)
   0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  // v0-v3-v4-v5 right(green)
   1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  // v0-v5-v6-v1 up(red)
   1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  // v1-v6-v7-v2 left
   1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v7-v4-v3-v2 down
   0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0   // v4-v7-v6-v5 back
 ]);

 var indices = new Uint8Array([       // Indices of the vertices
    0, 1, 2,   0, 2, 3,    // front
    4, 5, 6,   4, 6, 7,    // right
    8, 9,10,   8,10,11,    // up
   12,13,14,  12,14,15,    // left
   16,17,18,  16,18,19,    // down
   20,21,22,  20,22,23     // back
 ]);


 var m = initVertexBuffers(gl,vertices,colors,indices);
 if (m < 0) {
   console.log('Failed to set the vertex information');
   return;
 }
 
  var mvpMatrix = new Matrix4();
  if (isPerspective == true)
  {
    mvpMatrix.setPerspective(fov, aspectRatio, nearPlane, farPlane);    
  }
  else
  {
    mvpMatrix.setOrtho(-3,3,-3.0,3.0,nearPlane,farPlane);
  }
  mvpMatrix.lookAt(eyeX, eyeY, eyeZ, lookatX, lookatY, lookatZ, 0, 1, 0);
  mvpMatrix.rotate(currentAngle,0,0,1);  
  mvpMatrix.scale(.25,.25,.25);  
  mvpMatrix.translate(6.0,7.0,1.0);

  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix'); 
  if (!u_MvpMatrix) { 
    console.log('Failed to get the storage location of u_MvpMatrix');
    return;
  } 
 
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);  
  gl.drawElements(gl.TRIANGLES, m, gl.UNSIGNED_BYTE, 0);
  
}

function drawcube3(gl,currentAngle)
{
  
  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3

  var vertices = new Float32Array([   // Vertex coordinates
    1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,  // v0-v1-v2-v3 front
    1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,  // v0-v3-v4-v5 right
    1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,  // v0-v5-v6-v1 up
   -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,  // v1-v6-v7-v2 left
   -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,  // v7-v4-v3-v2 down
    1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0   // v4-v7-v6-v5 back
 ]);

 var colors = new Float32Array([     // Colors
   1.0, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  // v0-v1-v2-v3 front(blue)
   0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  // v0-v3-v4-v5 right(green)
   1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  // v0-v5-v6-v1 up(red)
   1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  // v1-v6-v7-v2 left
   1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v7-v4-v3-v2 down
   0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0   // v4-v7-v6-v5 back
 ]);

 var indices = new Uint8Array([       // Indices of the vertices
    0, 1, 2,   0, 2, 3,    // front
    4, 5, 6,   4, 6, 7,    // right
    8, 9,10,   8,10,11,    // up
   12,13,14,  12,14,15,    // left
   16,17,18,  16,18,19,    // down
   20,21,22,  20,22,23     // back
 ]);


 var m = initVertexBuffers(gl,vertices,colors,indices);
 if (m < 0) {
   console.log('Failed to set the vertex information');
   return;
 }
 
  var mvpMatrix = new Matrix4();
  if (isPerspective == true)
  {
    mvpMatrix.setPerspective(fov, aspectRatio, nearPlane, farPlane);    
  }
  else
  {
    mvpMatrix.setOrtho(-3,3,-3.0,3.0,nearPlane,farPlane);
  }
  mvpMatrix.lookAt(eyeX, eyeY, eyeZ, lookatX, lookatY, lookatZ, 0, 1, 0);
  mvpMatrix.rotate(currentAngle*3,0,0,1);  
  mvpMatrix.scale(.15,.15,.15);  
  mvpMatrix.translate(3.0,3.0,1.0);

  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix'); 
  if (!u_MvpMatrix) { 
    console.log('Failed to get the storage location of u_MvpMatrix');
    return;
  } 
 
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);  
  gl.drawElements(gl.TRIANGLES, m, gl.UNSIGNED_BYTE, 0);
  
}

function drawcube4(gl,currentAngle)
{
  
  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3

  var vertices = new Float32Array([   // Vertex coordinates
    1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,  // v0-v1-v2-v3 front
    1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,  // v0-v3-v4-v5 right
    1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,  // v0-v5-v6-v1 up
   -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,  // v1-v6-v7-v2 left
   -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,  // v7-v4-v3-v2 down
    1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0   // v4-v7-v6-v5 back
 ]);

 var colors = new Float32Array([     // Colors
   1.0, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  // v0-v1-v2-v3 front(blue)
   0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  // v0-v3-v4-v5 right(green)
   1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  // v0-v5-v6-v1 up(red)
   1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  // v1-v6-v7-v2 left
   1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v7-v4-v3-v2 down
   0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0   // v4-v7-v6-v5 back
 ]);

 var indices = new Uint8Array([       // Indices of the vertices
    0, 1, 2,   0, 2, 3,    // front
    4, 5, 6,   4, 6, 7,    // right
    8, 9,10,   8,10,11,    // up
   12,13,14,  12,14,15,    // left
   16,17,18,  16,18,19,    // down
   20,21,22,  20,22,23     // back
 ]);


 var m = initVertexBuffers(gl,vertices,colors,indices);
 if (m < 0) {
   console.log('Failed to set the vertex information');
   return;
 }
 
  var mvpMatrix = new Matrix4();
  if (isPerspective == true)
  {
    mvpMatrix.setPerspective(fov, aspectRatio, nearPlane, farPlane);    
  }
  else
  {
    mvpMatrix.setOrtho(-3,3,-3.0,3.0,nearPlane,farPlane);
  }
  mvpMatrix.lookAt(eyeX, eyeY, eyeZ, lookatX, lookatY, lookatZ, 0, 1, 0);
  mvpMatrix.rotate(currentAngle*3,currentAngle,currentAngle,1);  
  mvpMatrix.scale(.2,.2*sizeChanger/100,.2);  
  mvpMatrix.translate(8.0,3.0,1.0);

  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix'); 
  if (!u_MvpMatrix) { 
    console.log('Failed to get the storage location of u_MvpMatrix');
    return;
  } 
 
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);  
  gl.drawElements(gl.TRIANGLES, m, gl.UNSIGNED_BYTE, 0);
  
}

function drawcube5(gl,currentAngle)
{
  
  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3

  var vertices = new Float32Array([   // Vertex coordinates
    1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,  // v0-v1-v2-v3 front
    1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,  // v0-v3-v4-v5 right
    1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,  // v0-v5-v6-v1 up
   -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,  // v1-v6-v7-v2 left
   -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,  // v7-v4-v3-v2 down
    1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0   // v4-v7-v6-v5 back
 ]);

 var colors = new Float32Array([     // Colors
   1.0, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  // v0-v1-v2-v3 front(blue)
   0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  // v0-v3-v4-v5 right(green)
   1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  // v0-v5-v6-v1 up(red)
   1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  // v1-v6-v7-v2 left
   1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v7-v4-v3-v2 down
   0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0   // v4-v7-v6-v5 back
 ]);

 var indices = new Uint8Array([       // Indices of the vertices
    0, 1, 2,   0, 2, 3,    // front
    4, 5, 6,   4, 6, 7,    // right
    8, 9,10,   8,10,11,    // up
   12,13,14,  12,14,15,    // left
   16,17,18,  16,18,19,    // down
   20,21,22,  20,22,23     // back
 ]);


 var m = initVertexBuffers(gl,vertices,colors,indices);
 if (m < 0) {
   console.log('Failed to set the vertex information');
   return;
 }
 
  var mvpMatrix = new Matrix4();
  if (isPerspective == true)
  {
    mvpMatrix.setPerspective(fov, aspectRatio, nearPlane, farPlane);    
  }
  else
  {
    mvpMatrix.setOrtho(-3,3,-3.0,3.0,nearPlane,farPlane);
  }
  mvpMatrix.lookAt(eyeX, eyeY, eyeZ, lookatX, lookatY, lookatZ, 0, 1, 0);
  mvpMatrix.rotate(currentAngle*3,-currentAngle,-currentAngle,1);  
  mvpMatrix.scale(.2,.2,.2*sizeChanger/150);  
  mvpMatrix.translate(-8.0,-3.0,1.0);

  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix'); 
  if (!u_MvpMatrix) { 
    console.log('Failed to get the storage location of u_MvpMatrix');
    return;
  } 
 
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);  
  gl.drawElements(gl.TRIANGLES, m, gl.UNSIGNED_BYTE, 0);
  
}

function drawcube6(gl,currentAngle)
{
  
  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3

  var vertices = new Float32Array([   // Vertex coordinates
    1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,  // v0-v1-v2-v3 front
    1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,  // v0-v3-v4-v5 right
    1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,  // v0-v5-v6-v1 up
   -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,  // v1-v6-v7-v2 left
   -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,  // v7-v4-v3-v2 down
    1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0   // v4-v7-v6-v5 back
 ]);

 var colors = new Float32Array([     // Colors
   1.0, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  // v0-v1-v2-v3 front(blue)
   0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  // v0-v3-v4-v5 right(green)
   1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  // v0-v5-v6-v1 up(red)
   1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  // v1-v6-v7-v2 left
   1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v7-v4-v3-v2 down
   0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0   // v4-v7-v6-v5 back
 ]);

 var indices = new Uint8Array([       // Indices of the vertices
    0, 1, 2,   0, 2, 3,    // front
    4, 5, 6,   4, 6, 7,    // right
    8, 9,10,   8,10,11,    // up
   12,13,14,  12,14,15,    // left
   16,17,18,  16,18,19,    // down
   20,21,22,  20,22,23     // back
 ]);


 var m = initVertexBuffers(gl,vertices,colors,indices);
 if (m < 0) {
   console.log('Failed to set the vertex information');
   return;
 }
 
  var mvpMatrix = new Matrix4();
  if (isPerspective == true)
  {
    mvpMatrix.setPerspective(fov, aspectRatio, nearPlane, farPlane);    
  }
  else
  {
    mvpMatrix.setOrtho(-3,3,-3.0,3.0,nearPlane,farPlane);
  }
  mvpMatrix.lookAt(eyeX, eyeY, eyeZ, lookatX, lookatY, lookatZ, 0, 1, 0);
  mvpMatrix.rotate(currentAngle*3,-currentAngle,-currentAngle,1);  
  mvpMatrix.scale(.2*sizeChanger/200,.2*sizeChanger/100,.2);  
  mvpMatrix.translate(-8.0,7.0,1.0);

  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix'); 
  if (!u_MvpMatrix) { 
    console.log('Failed to get the storage location of u_MvpMatrix');
    return;
  } 
 
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);  
  gl.drawElements(gl.TRIANGLES, m, gl.UNSIGNED_BYTE, 0);
  
}

function initVertexBuffers(gl,vertices,colors,indices) {
  

  // Create a buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) 
    return -1;

  // Write the vertex coordinates and color to the buffer object
  if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position'))
    return -1;

  if (!initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_Color'))
    return -1;

  // Write the indices to the buffer object
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}

function initArrayBuffer(gl, data, num, type, attribute) {
  var buffer = gl.createBuffer();   // Create a buffer object
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  // Write data into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

  return true;
}


var g_last = Date.now();
var goingUp = true;

//calculates how much the cubes should rotate, also changes the sizing variable of some of the cubes.
function rotate(angle) {
  // Calculate the elapsed time
  var now = Date.now();
  var elapsed = now - g_last;
  g_last = now;
  if (sizeChanger == 200)
  {
    goingUp = false;
  }
  if (sizeChanger == 0)
  {
    goingUp = true;
  }
  if (goingUp == true)
  {
    sizeChanger +=1;    
  }
  if (goingUp == false)
  {
    sizeChanger -=1;    
  }
  // Update the current rotation angle (adjusted by the elapsed time)
  var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
  return newAngle %= 360;
}

//functions for buttons to change eye location and look at location
function eyeXUp()
{
  eyeX +=1;
}
function eyeXDown()
{
  eyeX -=1;
}
function eyeYUp()
{
  eyeY +=1;
}
function eyeYDown()
{
  eyeY -=1;
}
function eyeZUp()
{
  eyeZ +=1;
}
function eyeZDown()
{
  eyeZ -=1;
}
function atXUp()
{
  lookatX +=1;
}
function atXDown()
{
  lookatX -=1;
}
function atYUp()
{
  lookatY +=1;
}
function atYDown()
{
  lookatY -=1;
}
function atZUp()
{
  lookatZ +=1;
}
function atZDown()
{
  lookatZ -=1;
}

//changes the type of projection used.
function changeView()
{
  if (isPerspective)
  {
    isPerspective = false;
  }
  else
  isPerspective = true;
}


//slider for fov
var fovSlider = document.getElementById("fovRange");
var output = document.getElementById("Demo");
output.innerHTML = fovSlider.value; // Display the default slider value

fovSlider.oninput = function() {
  fov = this.value;
  output.innerHTML = this.value;
}

//slider for aspect ratio
var aspectSlider = document.getElementById("aspectRange");
var output2 = document.getElementById("aspectDemo");
output2.innerHTML = aspectSlider.value; // Display the default slider value

aspectSlider.oninput = function() {
  aspectRatio = this.value;
  output2.innerHTML = this.value;
}