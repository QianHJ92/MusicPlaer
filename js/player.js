function Player($audio) {
    this.$audio = $audio;
    this.audio = $audio.get(0);
}
Player.prototype = {
    musicList: [],
    currentIndex: -1,
    playMusic: function (index, music) {
        //播放同一首歌
        if (index === this.currentIndex) {
            if (this.audio.paused) {
                this.audio.play();
            } else {
                this.audio.pause();
            }
        } else {
            //非同一首歌
            this.$audio.attr("src", music.link_url);
            this.audio.play();
            this.currentIndex = index;
        }
    },
    preIndex: function () {
        if (this.currentIndex === -1 || this.currentIndex === 0) {
            var index = this.musicList.length - 1;
        } else {
            var index = this.currentIndex - 1;
        }
        return index;
    },
    nextIndex: function () {
        if (this.currentIndex === this.musicList.length - 1) {
            var index = 0;
        } else {
            var index = this.currentIndex + 1;
        }
        return index;
    },
    delMusic: function (index) {
        this.musicList.splice(index, 1);
    },
    musicTimeUpdate: function (callBack) {
        var $this = this;
        this.$audio.on("timeupdate", function () {
            var duration = $this.audio.duration;
            var currentTime = $this.audio.currentTime;
            var timeStr = $this.timeFormate(currentTime, duration);
            callBack(duration,currentTime,timeStr);
        });
    },
    musicSeekTo: function (value) {
        // console.log(value);
        if (isNaN(this.audio.duration) || isNaN(value)) return;
        // console.log(this.audio.currentTime);
        // console.log(tmp);
        this.audio.currentTime = this.audio.duration * value;
        // console.log(this.audio.duration * value);
        // console.log(this.audio.currentTime);
    },
    voiceSeekTo: function (value) {
        if (isNaN(value) || value < 0 || value > 1) return;
        this.audio.volume = value;
    },
    timeFormate: function (currentTime, duration) {
        if (isNaN(currentTime) || isNaN(duration)) return;
        var curMin = this.handleTime(parseInt(currentTime / 60));
        var curSec = this.handleTime(parseInt(currentTime % 60));

        var durMin = this.handleTime(parseInt(duration / 60));
        var durSec = this.handleTime(parseInt(duration % 60));

        return curMin + ":" + curSec + " / " + durMin + ":" + durSec;
    },
    handleTime: function (time) {
        if (time < 10) return "0" + time;
        else return time;
    }
};