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
                gl_FragColor = vec4(fragColor, 1.0); // R,G,B, opacity
            }
        `
        
        const mat4 = glMatrix.mat4;
        let Triangle = function () {
            let canvas = document.getElementById('main-canvas');
            let gl = canvas.getContext('webgl');

            if (!gl) {
                alert('webgl not supported');
            }

            gl.clearColor(0.8, 0.8, 0.8, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            let vertexShader = gl.createShader(gl.VERTEX_SHADER);
            let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

            gl.shaderSource(vertexShader, vertexShaderTxt);
            gl.shaderSource(fragmentShader, fragmentShaderTxt);
            
            gl.compileShader(vertexShader);
            if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
                console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
                return;
            }
            gl.compileShader(fragmentShader);
            
            let program = gl.createProgram();

            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);

            gl.detachShader(program, vertexShader);
            gl.detachShader(program, fragmentShader);

            gl.validateProgram(program);
            let squareVert = [
            //    X     Y     Z        R    G    B
                -0.5,  0.5,  0.0,     0.6, 0.1, 1.0,
                 0.5,  0.8,  0.0,     0.9, 0.2, 0.5, 
                 0.5, -0.5,  0.0,     0.9, 0.7, 0.1, 

                -0.5,  0.5,  0.0,     0.6, 0.1, 1.0, 
                 0.5, -0.5,  0.0,     0.9, 0.7, 0.1,
                -0.5, -0.8,  0.0,     0.0, 0.8, 0.8
            ]

            const squareVertexBufferObject = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBufferObject);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squareVert), gl.STATIC_DRAW);

            const posAttrLocation = gl.getAttribLocation(program, 'vertPosition');
            const colorAttrLocation = gl.getAttribLocation(program, 'vertColor');

            gl.vertexAttribPointer(
                posAttrLocation,
                2,
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
            
            const matWorldUniformLocation = gl.getUniformLocation(program, "mWorld");
            const matViewUniformLocation = gl.getUniformLocation(program, "mView");
            const matProjUniformLocation = gl.getUniformLocation(program, "mProj");
            
            let worldMatrix = mat4.create();
            let viewMatrix = mat4.create();
            let projMatrix = mat4.create();
            
            gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
            gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
            gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
            
            let identityMatrix = mat4.create();
            let angle = 0;
            
            const loop = function() {
                angle = performance.now() / 1000 / 8 * 2 * Math.PI;
                
                mat4.rotate(worldMatrix, identityMatrix, angle, [0,1,0]);
                gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
                
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.drawArrays(gl.TRIANGLES, 0, 6);
                
                requestAnimationFrame(loop);
            }
            
            requestAnimationFrame(loop);
        }
