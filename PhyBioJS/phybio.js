'use strict';

function runSim(model, tsteps, Lx, Ly, cell_radius){

    let phi;

    if (model=='droplet();'){
        phi = anArray.Circle(Lx, Ly, cell_radius);
    }
    else{
        phi = anArray.Random(Lx, Ly);
    }

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


    integrate(model, phi, tsteps, outPeriod, dt, Lx, Ly, layout, cell_radius);

}

function integrate(model, phi, tsteps, outPeriod, dt, Lx, Ly, layout, cell_radius){
    var nsteps = 0;
    var iPersistency = 0.0;

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

    function cahn_hilliard(){

        let phi_o = anArray.Zeros(Lx, Ly);
        let mu = anArray.Zeros(Lx, Ly);
        var niter = outPeriod;

        while (niter-- && nsteps<=tsteps ) {
            //for (var nstep = 0; nstep <= tsteps; nstep++) {
            phi_o = phi.slice();
            for (var i = 0; i < Lx; i++) {
                for (var j = 0; j < Ly; j++) {
                    mu[i][j] = laplacian(phi_o, i, j, Lx, Ly) + 8.0 * phi_o[i][j] * (1.0 - phi_o[i][j]) * (phi_o[i][j] - 0.5);
                }
            }


            for (var i = 0; i < Lx; i++) {
                for (var j = 0; j < Ly; j++) {
                    phi[i][j] = phi_o[i][j] - dt * (laplacian(mu, i, j, Lx, Ly));
                }
            }
            nsteps++;
        }
        if (nsteps <= tsteps) {
            console.log(nsteps);
            Plotly.animate('plotDiv',{
                data:{z: phi},
                type:'heatmap', colorscale: 'Electric', zsmooth: 'best'}, layout);
            setTimeout(cahn_hilliard, 1);
        }
    }


    function droplet(){

        let phi_o = anArray.Zeros(Lx, Ly);
        var volume;
        var niter = outPeriod;
        var persistency_time = 10000;
        var chi = 10;
        let noise = [0.0, 0.0];
        let grad = [0.0, 0.0];
        const volume_target = Math.PI*Math.pow(cell_radius,2);

        while (niter-- && nsteps<=tsteps ) {
            //for (var nstep = 0; nstep <= tsteps; nstep++) {
            phi_o = phi.slice();
            volume = sum(phi, Lx, Ly);

            if( iPersistency >= persistency_time){
                noise = [1-2*Math.random(), 1-2*Math.random()];
                iPersistency =0.0;
            }
            for (var i = 0; i < Lx; i++) {
                for (var j = 0; j < Ly; j++) {
                    grad = gradient(phi_o, i, j, Lx, Ly);
                    phi[i][j] = phi_o[i][j] + dt * (
                        -chi*(grad[0]*noise[0] + grad[1]*noise[1])
                        +laplacian(phi_o, i, j, Lx, Ly)
                        + phi_o[i][j] * (1.0 - phi_o[i][j]) * (phi_o[i][j] - 0.5 + (volume_target-volume)));
                }
            }
            nsteps++;
            iPersistency++;
        }
        if (nsteps <= tsteps) {
            console.log(nsteps);
            Plotly.animate('plotDiv',{
                data:{z: phi},
                type:'heatmap', colorscale: 'Electric', zsmooth: 'best'}, layout);
            setTimeout(droplet, 1);
        }
    }
    eval(model);
    //cahn_hilliard();
    //allen_cahn();
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

function sum(phi, Lx, Ly){
    let _sum = 0.0;

    for (var i = 0; i < Lx; i++) {
        for (var j = 0; j < Ly; j++) {
            _sum += phi[i][j];
        }

    }
    return _sum;
}

function gradient(fn, x1, x2, Lx, Ly){
    // compute the laplacian of fn at the point (x1, x2)
    var yh = 0.0;
    var yl = 0.0;
    let s = [x1, x2];
    let gradient_value = [0.0, 0.0];

    for (var k = 0; k <= 1; k++) {
        s[k] += 1;
        yh = fn[b(s[0], Lx)][b(s[1], Ly)];
        s[k] -= 2;
        yl = fn[b(s[0], Lx)][b(s[1], Ly)];
        s[k] +=1;
        gradient_value[k] = (yh - yl)/2.0;
    }

    return gradient_value;

}

