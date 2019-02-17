function Lyric(music) {
    this.music=music;
    // this.timeArr=[];
    // this.lyrArr=[];
    // this.index=-1;
}

Lyric.prototype = {
    timeArr:[],
    lyrArr:[],
    index:-1,
    loadLyric: function (callBack) {
        var $this = this;
        $.ajax({
            url: $this.music.link_lrc,
            dataType: "text",
            success: function (data) {
                $this.lyricParse(data);
                callBack();
            },
            error: function (e) {
                console.log(e);
            }
        });
    },
    lyricParse: function (data) {
        var $this = this;
        console.log(this);
        this.timeArr = [];
        this.lyrArr = [];
        // $this.index=-1;
        var arr = data.split("\n");
        var res = /\d+:\d+\.\d+/;
        $.each(arr, function (index, ele) {
            var lyr = ele.split("]")[1];
            if (lyr.length > 1) {
                $this.lyrArr.push(lyr);
                var time = res.exec(ele);
                var min = parseInt(time[0].split(":")[0]) * 60;
                var sec = parseFloat(time[0].split(":")[1]);
                var timeSec = parseFloat((min + sec).toFixed(2));
                $this.timeArr.push(timeSec);
            }
        });
        console.log($this.lyrArr);
    },
    currentIndex:function (currentTime) {
        var $this=this;
        if(currentTime>this.timeArr[0])
        {
            // console.log(this);
            $this.index++;
            this.timeArr.shift();
        }
        return this.index;
    }

};