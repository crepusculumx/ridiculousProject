var s = "<img src='img/hua_ji1.png' height='' weight='' alt='' />";
var s1 = document.documentElement.clientHeight;
var s2 = document.documentElement.clientWidth;

class BallObject {
    constructor(id, imageFilePath, height, width, posx, posy, velx, vely, mass) {
        this.img = document.createElement("img");
        this.img.id = id;
        this.img.src = imageFilePath;
        this.img.style.position = 'absolute';
        this.height = height;
        this.width = width;
        this.img.style.height = height + 'px';
        this.img.style.width = width + 'px';
        this.img.style.float = 'inherit';

        this.posx = posx;
        this.posy = posy;
        this.velx = velx;
        this.vely = vely;
        this.mass = mass;

        this.winHeight = parseInt(document.documentElement.clientHeight);
        this.winWidth = parseInt(document.documentElement.clientWidth);
    }

    print() {

        this.img.style.left = this.posx + 'px';
        this.img.style.top = this.posy + 'px';
        document.body.appendChild(this.img);
    }

    del() {
        var imgs = document.getElementsByTagName("img");
        for (var i = 0; i < imgs.length; i++)
            imgs[i].parentNode.removeChild(imgs[i]);
    }

    updateMove(interval) {
        this.posx += this.velx * interval;
        this.posy += this.vely * interval;
    }

    updateBoundary(interval) {
        this.winHeight = parseInt(document.documentElement.clientHeight);
        this.winWidth = parseInt(document.documentElement.clientWidth);

        if ((this.posx < 0 && this.velx < 0) || (this.posx + this.width > this.winWidth && this.velx > 0)) {
            this.velx = -this.velx;
            while (this.posx < 0 || this.posx + this.width > this.winWidth) {
                this.updateMove(interval);
            }
        }

        if ((this.posy < 0 && this.vely < 0) || (this.posy + this.height > this.winHeight && this.vely > 0)) {
            this.vely = -this.vely;
            while (this.posy < 0 || this.posy + this.height > this.winHeight) {
                this.updateMove(interval);
            }
        }
    }
}

function updateCollision(ball1, ball2) {
    var sox, soy, sr, iox, ioy, ir, sm, im, svx, svy, ivx, ivy;

    function reNewDate() {
        sox = ball2.posx + ball2.width / 2;
        soy = ball2.posy + ball2.height / 2;
        sr = ball2.height / 2;
        iox = ball1.posx + ball1.width / 2;
        ioy = ball1.posy + ball1.height / 2;
        ir = ball1.height / 2;
        sm = ball2.mass;
        im = ball1.mass;
        svx = ball2.velx;
        svy = ball2.vely;
        ivx = ball1.velx;
        ivy = ball1.vely;
    }

    function checkCollision() {
        if ((sox - iox) * (sox - iox) + (soy - ioy) * (soy - ioy) < (sr + ir) * (sr + ir)) {
            return true;
        }
        return false;
    }

    reNewDate();

    if (checkCollision()) {
        var vec_sv = [svx, svy];  // s的速度向量
        var vec_iv = [ivx, ivy];  // i的速度向量
        var vec_si = [iox - sox, ioy - soy];  // 对心si向量
        temp1 = (vec_sv[0] * vec_si[0] + vec_sv[1] * vec_si[1]);
        temp2 = (vec_si[0] * vec_si[0] + vec_si[1] * vec_si[1]);
        lam1 = temp1 / temp2; // 系数1
        temp1 = (vec_iv[0] * vec_si[0] + vec_iv[1] * vec_si[1]);
        temp2 = (vec_si[0] * vec_si[0] + vec_si[1] * vec_si[1]);
        lam2 = temp1 / temp2; // 系数2
        lam_ans1 = ((sm - im) * lam1 + 2 * im * lam2) / (sm + im);
        lam_ans2 = ((im - sm) * lam2 + 2 * sm * lam1) / (sm + im);
        sx_ans = vec_sv[0] - lam1 * vec_si[0] + vec_si[0] * lam_ans1;
        sy_ans = vec_sv[1] - lam1 * vec_si[1] + vec_si[1] * lam_ans1;
        ix_ans = vec_iv[0] - lam2 * vec_si[0] + vec_si[0] * lam_ans2;
        iy_ans = vec_iv[1] - lam2 * vec_si[1] + vec_si[1] * lam_ans2;

        ball2.velx = sx_ans;
        ball2.vely = sy_ans;
        ball1.velx = ix_ans;
        ball1.vely = iy_ans;

        while (checkCollision()) {
            ball1.updateMove(1000 / frameRate);
            ball2.updateMove(1000 / frameRate);
            reNewDate();
        }
    }
}

var cnt = 0;
var objCurSize = 70;
function clickFunction(event) {
    var temp = new BallObject(cnt, 'img/hua_ji1.png', objCurSize, objCurSize, event.offsetX, event.offsetY, Math.random() * 2 - 1, Math.random() * 2 - 1, 1);
    ballArr.push(temp);
    cnt++;
}
 
function keypressFunction(event) {
    console.log(event.keyCode);
    if (event.keyCode == 99) {
        for (var i = 0; i < ballArr.length; i++) {
            ballArr[i].del();
        }
        ballArr.length = 0;
    }
    if (event.keyCode == 107) {
        objCurSize += 10;
    }
    if (event.keyCode == 109) {
        objCurSize -= 10;
    }
}


document.body.addEventListener('click', clickFunction, false);
document.body.addEventListener('keypress', keypressFunction, false);
var ballArr = [];
var frameRate = 60;


function main() {
    for (var i = 0; i < ballArr.length; i++) {
        ballArr[i].updateMove(1000 / frameRate);
        ballArr[i].updateBoundary(1000 / frameRate);
    }

    for (var i = 0; i < ballArr.length; i++) {
        for (var j = i + 1; j < ballArr.length; j++) {
            updateCollision(ballArr[i], ballArr[j]);
        }
    }

    for (var i = 0; i < ballArr.length; i++) {
        ballArr[i].print();
    }
}

main();
setInterval(main, 1000 / frameRate);