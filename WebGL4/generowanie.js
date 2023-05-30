const vertexShaderTxt = `
    precision mediump float;

    attribute vec3 vertPosition;
    attribute vec3 vertColor;

    varying vec3 fragColor;

    uniform mat4 mWorld;
    uniform mat4 mView;
    uniform mat4 mProj;

    void main()
    {
        fragColor = vertColor;
        gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
    }

`
const fragmentShaderTxt = `
    precision mediump float;

    varying vec3 fragColor;

    void main()
    {
        gl_FragColor = vec4(fragColor, 1.0);
    }
`
const mat4 = glMatrix.mat4;

let cubeGeneration = function(Side, r, g, b) {
    Side /= 2;
    
    var V = [];
    
    let currentX, currentY, currentZ; 
    let currentColor = [];
    
    currentX = -Side;
    currentY = -Side;
    currentZ = -Side;
    currentColor = [r, g, b];
    
    let cA = 0;
    let cB = 0;
    let cC = 0;
    for(let i = 0; i < 8; i++) {
        V.push(currentX);
        V.push(currentY);
        V.push(currentZ);
        V = V.concat(currentColor);
        
        switch(cA) {
            case 0:
                currentX *= (-1);
                cA++;
                break;
            case 1:
                currentZ *= (-1);
                cA = 0;
        }        
        
        cB++;
        if(cB == 4) {
            cB = 0;
            currentY *= (-1);
        }
        
        cC++;
        if(cC == 4) {
            cC = 0;
            currentColor[0] -= 0.05;
            currentColor[1] -= 0.05;
            currentColor[2] -= 0.05;
        }
    }
    
    cA = 0;
    cB = 0;
    cC = 0;
    for(let i = 0; i < 8; i++) {
        V.push(currentX);
        V.push(currentY);
        V.push(currentZ);
        V = V.concat(currentColor);
        
        switch(cA) {
            case 0:
                currentY *= (-1);
                cA++;
                break;
            case 1:
                currentX *= (-1);
                cA = 0;
        }        
        
        cB++;
        if(cB == 4) {
            cB = 0;
            currentZ *= (-1);
        }
        
        cC++;
        if(cC == 4) {
            cC = 0;
            currentColor[0] -= 0.05;
            currentColor[1] -= 0.05;
            currentColor[2] -= 0.05;
        }
    }
    
    cA = 0;
    cB = 0;
    cC = 0;
    for(let i = 0; i < 8; i++) {
        V.push(currentX);
        V.push(currentY);
        V.push(currentZ);
        V = V.concat(currentColor);
        
        switch(cA) {
            case 0:
                currentZ *= (-1);
                cA++;
                break;
            case 1:
                currentY *= (-1);
                cA = 0;
        }        
        
        cB++;
        if(cB == 4) {
            cB = 0;
            currentX *= (-1);
        }
        
        cC++;
        if(cC == 4) {
            cC = 0;
            currentColor[0] -= 0.05;
            currentColor[1] -= 0.05;
            currentColor[2] -= 0.05;
        }
    }

    return V;
}

let Cube = function () {
    let canvas = document.getElementById('main-canvas');
    let gl = canvas.getContext('webgl');

    if (!gl) {
        alert('webgl not supported');
    }

    gl.clearColor(0.8, 0.8, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);


    let vertexShader = gl.createShader(gl.VERTEX_SHADER);
    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderTxt);
    gl.shaderSource(fragmentShader, fragmentShaderTxt);
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);
    
    let program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    gl.detachShader(program, vertexShader);
    gl.detachShader(program, fragmentShader);

    gl.validateProgram(program);

    var boxIndices =
	[
		// Top
		0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
		22, 20, 23
	];

    var boxVertices = cubeGeneration(2.0, 0.3, 0.2, 0.05);
    console.log(boxVertices);

    const squareVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

    const cubeIndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

    const posAttrLocation = gl.getAttribLocation(program, 'vertPosition');
    const colorAttrLocation = gl.getAttribLocation(program, 'vertColor');

    gl.vertexAttribPointer(
        posAttrLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT,
        0,
    );

    gl.vertexAttribPointer(
        colorAttrLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT,
        3 * Float32Array.BYTES_PER_ELEMENT,
    );

    gl.enableVertexAttribArray(posAttrLocation);
    gl.enableVertexAttribArray(colorAttrLocation);

    gl.useProgram(program);

    const matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    const matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    const matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

    let worldMatrix = mat4.create();
    
    let viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, [0,0,-8], [0,0,0], [0,1,0]);
    
    let projMatrix = mat4.create();
    mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.width/canvas.clientHeight, 0.05, 1000.0);
    
    let identityMatrix = mat4.create();

    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

    let angle = 0;
    const loop = function() {
        angle = performance.now() / 1000 / 8 * 3 * Math.PI;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        mat4.rotate(worldMatrix, identityMatrix, angle, [0,1,2]);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

        gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);

        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}
