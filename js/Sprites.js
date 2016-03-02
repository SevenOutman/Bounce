/**
 * Created by Doma on 16/1/10.
 */
var G = 0.48;
var Gz = 0.2;

function Ball(ground) {
    this.radius = 20;
    this.position = {x: 75, y: ground - this.radius};
    this.vy = -10;
    this.dashing = false;
}
Ball.prototype.dash = function() {
    this.vy = 30;
    this.dashing = true;
};
Ball.prototype.update = function(ground, movex) {
    if (this.position.y >= ground - this.radius) {
        this.vy = -10;
        this.dashing = false;
    } else {
        if (!this.dashing) {
            this.vy += G;
        }
    }
    this.position.y = Math.min(ground - this.radius, this.position.y + this.vy);
    if (movex) {
        this.position.x += 5;
    }
};
Ball.prototype.circle = function() {
    return {
        x: this.position.x,
        y: this.position.y,
        r: this.radius
    };
};

Ball.prototype.hitSpikes = function(spikes) {
    for (var i = 0; i < spikes.length && spikes[i].position.x <= this.position.x + this.radius; i++) {
        if (Math.pow((this.position.x - spikes[i].position.x), 2) +
            Math.pow((this.position.y - spikes[i].position.y + spikes[i].height), 2) < Math.pow(this.radius, 2)) {
            return true;
        }
    }
    return false;
};

function Spike(x, y) {
    this.position = {x: x, y: y};
    this.width = 15;
    this.height = 20;
}

function Dust(x, y) {
    this.position = {x: x, y: y};
    this.size = Math.random() * 6 + 2;
    this.vx = Math.random() + 5;
    this.vy = 0;
}

Dust.prototype.update = function() {
    this.position.x += this.vx;
    this.position.y -= this.vy;
    this.vy += Gz;
};

Dust.prototype.rect = function() {
    return {
        x: this.position.x - this.size / 2,
        y: this.position.y - this.size / 2,
        w: this.size,
        h: this.size
    };
};