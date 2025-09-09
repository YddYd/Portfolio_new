let ranges = 50;
let canvas;
let myWidth = 0, myHeight = 0;

let currentX = 200;
let currentY = 200;
let targetX = 200;
let targetY = 200;

// —— 暴露：目标点的半径与角速度（可直接改数值）——
let orbitRadius = 50;    // 圆周半径（px）
let orbitSpeed = 0.05;  // 角速度（弧度/帧）
let orbitAngle = 0;      // 当前角度

// 位置历史（避免同引用的 fill() 问题，用独立对象）
let positionHistory = Array.from({ length: 50 }, () => ({ x: targetX, y: targetY }));

// 金色渐变（前景）
let gold1, gold2;

// 把画布挂到 16:9 容器 #webSample 上，并以容器尺寸而不是 window 尺寸来创建
const __STAGE_ID__ = 'webSample';
function __stageSize() {
    const el = document.getElementById(__STAGE_ID__);
    if (!el) return [window.innerWidth, window.innerHeight];
    const r = el.getBoundingClientRect();
    return [Math.round(r.width), Math.round(r.height)];
}


function setup() {
    // —— 关键：以容器尺寸创建，并挂到容器上 ——
    [myWidth, myHeight] = __stageSize();
    canvas = createCanvas(myWidth, myHeight);
    canvas.parent(__STAGE_ID__);

    frameRate(30);

    gold1 = color(255, 232, 150);
    gold2 = color(210, 160, 70);
}

function windowResized() {
    [myWidth, myHeight] = __stageSize();
    resizeCanvas(myWidth, myHeight);
}

function draw() {
    // 背景纯黑
    background(0);

    noFill();
    strokeWeight(2);

    // 隐形目标点：围绕画布中心缓慢圆周运动
    const cx = width * 0.5;
    const cy = height * 0.5;
    targetX = cx + cos(orbitAngle) * orbitRadius;
    targetY = cy + sin(orbitAngle) * orbitRadius;
    orbitAngle += orbitSpeed;

    // 缓动靠近目标点
    const easing = 0.05;
    currentX = lerp(currentX, targetX, easing);
    currentY = lerp(currentY, targetY, easing);

    // 画多条历史“波纹”——颜色随历史索引做金色渐变，并带透明度衰减
    for (let i = 0; i < positionHistory.length; i++) {
        const thisX = positionHistory[i].x;
        const thisY = positionHistory[i].y;

        // 渐变 + 透明度
        const t = map(i, 0, positionHistory.length - 1, 0, 1);
        const col = lerpColor(gold1, gold2, t);
        col.setAlpha(120 - t * 110);  // 前亮后淡
        stroke(col);

        beginShape();
        for (let x = -10; x < width + 11; x += 20) {
            let area = abs(thisX - x) / 50;
            if (area > PI) {
                area = 0;
            } else {
                area = cos(area) + 1;
            }
            area = map(area, 0, 2, 0, width / 5);
            const mapY = map(thisY, 0, height, 0, 2);
            const n = noise((area + x) * 0.001, i * 0.04, (frameCount / 20) * 0.04) + mapY;
            const y = map(n, 0, 3, 0, height);
            vertex(x, y);
        }
        endShape();
    }

    // 推入历史（保持长度 50）
    positionHistory.push({ x: currentX, y: currentY });
    if (positionHistory.length > 50) positionHistory.shift();
}

// 自适应窗口
function windowResized() {
    myHeight = windowHeight;
    myWidth = windowWidth;
    resizeCanvas(myWidth, myHeight);
}
