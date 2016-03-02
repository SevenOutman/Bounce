/**
 * Created by Doma on 15/12/27.
 */
function Renderer() {
    this.canvas = document.getElementById("canvas");
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight * 0.55;
    this.context = this.canvas.getContext("2d");
    this.translation = 0;
    this.panel = document.querySelector(".panel");
    this.bestContainer = document.querySelector(".highscore .numeric");
    this.playedContainer = document.querySelector(".played .numeric");
}

Renderer.prototype.render = function(gameData) {
    var self = this;
    requestAnimationFrame(function() {
        self.context.translate(self.translation - gameData.movedx, 0);
        self.translation = gameData.movedx;
        self.clearCanvas();
        self.renderScore(gameData.score);
        self.renderGround();
        self.renderBall(gameData.ball);
        self.renderSpikes(gameData.spikes);
        self.renderDusts(gameData.dusts);
    });
};

Renderer.prototype.clearCanvas = function() {
    this.context.clearRect(this.translation, 0, this.width, this.height);
};

Renderer.prototype.renderScore = function(score) {
    this.context.fillStyle = '#EAE9E9';
    this.context.font = "200px sans-serif";
    this.context.textAlign = "center";
    this.context.fillText(score + "", this.translation + this.width / 2, 200);
};

Renderer.prototype.renderGround = function() {
    this.context.fillStyle = '#EAE9E9';
    this.context.fillRect(this.translation, this.height - 25, this.width, 25);
};

Renderer.prototype.renderBall = function(ball) {
    var circle = ball.circle();
    this.context.beginPath();
    this.context.arc(circle.x, circle.y, circle.r - 4, 0, Math.PI * 2, true);
    this.context.closePath();
    this.context.fillStyle = '#D96070';
    this.context.strokeStyle = "#EF6678";
    this.context.lineWidth = 8;
    this.context.fill();
    this.context.stroke();
};

Renderer.prototype.renderSpikes = function(spikes) {
    for (var i = 0; i < spikes.length; i++) {
        this.renderSpike(spikes[i]);
    }
};

Renderer.prototype.renderSpike = function(spike) {
    this.context.beginPath();
    this.context.moveTo(spike.position.x, spike.position.y - spike.height);
    this.context.lineTo(spike.position.x - spike.width / 2, spike.position.y);
    this.context.lineTo(spike.position.x, spike.position.y);
    this.context.closePath();
    this.context.fillStyle = '#45BCD5';
    this.context.fill();

    this.context.beginPath();
    this.context.moveTo(spike.position.x, spike.position.y - spike.height);
    this.context.lineTo(spike.position.x + spike.width / 2, spike.position.y);
    this.context.lineTo(spike.position.x, spike.position.y);
    this.context.closePath();
    this.context.fillStyle = '#49A0B2';
    this.context.fill();
};

Renderer.prototype.renderDusts = function(dusts) {
    for (var i = 0; i < dusts.length; i++) {
        this.renderDust(dusts[i]);
    }
};

Renderer.prototype.renderDust = function(dust) {
    var rect = dust.rect();

    this.context.fillStyle = '#45BCD5';
    this.context.fillRect(rect.x, rect.y, rect.w, rect.h);
};

Renderer.prototype.clearMessage = function() {
    this.panel.classList.remove("gameover");
    this.panel.classList.add("starting");
};

Renderer.prototype.showResult = function(best, played) {
    this.bestContainer.innerHTML = best + "";
    this.playedContainer.innerHTML = played + "";
    this.panel.classList.add("gameover");
};
Renderer.prototype.hideTip = function() {
    this.panel.classList.remove("starting");
};
