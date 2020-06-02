'use strict';

class anArray {

    static Zeros(m, n){
        // this functions inits an array filled with zeros
        let newArray = [[]];

        for (var i = 0; i<m; i++){
            for(var j=0; j<n; j++){
                newArray[i].push(0.);
            }
            newArray.push([]);
        }
        return newArray;
    }

    static Random(m, n){
        // this functions inits an array with random elements
        let newArray = [[]];

        for (var i = 0; i<m; i++){
            for(var j=0; j<n; j++){
                newArray[i].push(Math.random());
            }
            newArray.push([]);
        }
        return newArray;

    }
}


function runSim(tsteps, Lx, Ly){

    let phi = anArray.Random(Lx, Ly);
    const dt = 0.001;
    const outPeriod = 1000;
    var layout = {
          font: {
            family: 'Verdana',
            size: 18,
            color: '#372549'
        },
        paper_bgcolor: '#FFF1E3',
        autosize: true,
        align: 'center',
        width: 400,
        height: 400,
        margin: {
            l: 50,
            r: 50,
            b: 100,
            t: 100,
            pad: 4
        }};

    var data = [{
        z: phi,
        type: 'heatmap',
        colorscale: 'Electric',
        zsmooth: 'best'
    }];
    Plotly.newPlot('plotDiv', data, layout);

    integrate(phi, tsteps, outPeriod, dt, Lx, Ly, layout);

}

function integrate(phi, tsteps, outPeriod, dt, Lx, Ly, layout){
    var nsteps = 0;


    function allen_cahn(){

        let phi_o = anArray.Zeros(Lx, Ly);
        var niter = outPeriod;

        while (niter-- && nsteps<=tsteps ) {
            //for (var nstep = 0; nstep <= tsteps; nstep++) {
            phi_o = phi.slice();

            for (var i = 0; i < Lx; i++) {
                for (var j = 0; j < Ly; j++) {
                    phi[i][j] = phi_o[i][j] + dt * (laplacian(phi_o, i, j, Lx, Ly) + phi_o[i][j] * (1.0 - phi_o[i][j]) * (phi_o[i][j] - 0.5));
                }
            }
            nsteps++;
        }
        if (nsteps <= tsteps) {
            console.log(nsteps);
            Plotly.animate('plotDiv',{
                data:{z: phi},
                type:'heatmap', colorscale: 'Electric', zsmooth: 'best'}, layout);
            setTimeout(allen_cahn, 1);
        }
    }

    allen_cahn();
}


function laplacian(fn, x1, x2, Lx, Ly) {
    // compute the laplacian of fn at the point (x1, x2)
    var yh = 0.0;
    var yl = 0.0;
    let s = [];
    var y = fn[x1][x2];
    var laplacian_value = 0.0;
    s = [x1, x2];

    for (var k = 0; k <= 1; k++) {
        s[k] += 1;
        yh = fn[b(s[0], Lx)][b(s[1], Ly)];
        s[k] -= 2;
        yl = fn[b(s[0], Lx)][b(s[1], Ly)];
        s[k] +=1;
        laplacian_value += (yh + yl - 2.0*y);
    }

    return laplacian_value;
}

function b(x, L){
    // check boundary conditions
    // TODO: implement the other conditions
    if (x<0){
        x = L+x;
    }
    else if(x>=L){
        x = x-L;
    }
    return x;
}
