/**
 * Created by Doma on 15/12/27.
 */
function Game() {
    this.renderer = new Renderer();
    this.inputManager = new InputManager();

    this.state = Game.States.Starting;
    this.gameData = {};
    this.best = Storage.getItem("com.ecnu2014.bounce.highscore") || 0;
    this.played = Storage.getItem("com.ecnu2014.bounce.played") || 0;


    this.initConfig();
    this.initEvents();
    this.reset();
}
Game.States = {
    Over: -1,
    Starting: 0,
    Playing: 1
};

Game.prototype.initConfig = function () {
    this.config = {
        vx: 5,
        spikeWidth: 15,
        spikeHeight: 25,
        ground: this.renderer.height - 25,
        safedistance: 90,
        difficulty: 40
    };
    this.best = parseInt(this.best);
    this.played = parseInt(this.played);
};

Game.prototype.initEvents = function () {
    var self = this;
    S("gripper", function () {
        if (self.state == Game.States.Over) {
            self.reset();
        } else {
            self.tapped();
        }
    });

    self.inputManager.on("tapped", function () {
        self.tapped();
    });
    self.inputManager.on("restart", function () {
        self.reset();
    });
};

Game.prototype.tapped = function () {
    if (this.state == Game.States.Starting) {
        this.start();
    }
    this.gameData.ball.dash();
};

Game.prototype.resetGameData = function () {
    var self = this;
    self.gameData = {
        ball: new Ball(self.config.ground),
        spikes: [],
        dusts: [],
        score: 0,
        movedx: 0,
        skip: 0,
        diff: self.config.difficulty,
        safe: self.config.safedistance,
        maxSpike: 1
    };
};
Game.prototype.start = function () {
    this.state = Game.States.Playing;
    this.renderer.hideTip();
    this.played++;
};

Game.prototype.reset = function () {
    this.state = Game.States.Starting;
    this.renderer.clearMessage();
    this.resetGameData();
    this.movedx = 0;
    requestAnimationFrame(this.nextFrame.bind(this));
};
Game.prototype.nextFrame = function () {
    this.renderer.render(this.gameData);
    if (this.state != Game.States.Over) {
        if (this.gameData.ball.hitSpikes(this.gameData.spikes)) {
            return this.gameover();
        }
        this.updateGameData();
        requestAnimationFrame(this.nextFrame.bind(this));
    }
};

Game.prototype.updateGameData = function () {
    if (this.state == Game.States.Playing) {
        this.gameData.ball.update(this.config.ground, true);
        var spikes = this.gameData.spikes;
        while (spikes.length && spikes[0].position.x - this.gameData.movedx < 7.5) {
            var spike = spikes.shift();
            for (var i = 0; i < 4; i++) {
                this.gameData.dusts.push(new Dust(this.gameData.movedx, spike.position.y -
                    spike.height * Math.random()));
            }
            this.gameData.score++;
            if (this.gameData.score % 15 == 0 && (this.gameData.diff < 100 || this.gameData.safe > 50 ||
                this.gameData.maxSpike < 4)) {
                this.gameData.diff = Math.min(100, this.gameData.diff + 5);
                this.gameData.safe = Math.max(50, this.gameData.safe - 5);
                this.gameData.maxSpike = Math.min(4, this.gameData.maxSpike + 1);

            }
        }
        if ((Math.random() < this.gameData.diff / 1000 || this.gameData.movedx == 5) && this.gameData.skip <= 0) {
            var n = Math.floor(Math.random() * this.gameData.maxSpike + 1);
            for (var i = 0; i < n; i++) {
                spikes.push(new Spike(this.renderer.canvas.width + this.gameData.movedx + 15 * i, this.config.ground));
            }
            this.gameData.skip = 15 * n + this.gameData.safe;
        }
        var dusts = this.gameData.dusts;
        while (dusts.length && dusts[0].position.y + dusts[0].size / 2 < 0) {
            dusts.shift();
        }
        for (var i = 0; i < dusts.length; i++) {
            dusts[i].update();
        }
        this.gameData.movedx += 5;
        this.gameData.skip -= 5;
    } else {
        this.gameData.ball.update(this.config.ground, false);
    }
};

Game.prototype.gameover = function () {
    this.state = Game.States.Over;
    if (this.gameData.score > this.best) {
        this.best = this.gameData.score;
    }
    this.renderer.showResult(this.best, this.played);
    Storage.setItem("com.ecnu2014.bounce.highscore", this.best);
    Storage.setItem("com.ecnu2014.bounce.played", this.played);
};