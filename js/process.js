function Process(processBar, processLine, processDot) {
    this.$processBar = processBar;
    this.$processLine = processLine;
    this.$processDot = processDot;
}

Process.prototype = {
    processClick: function (callBack) {
        var $this = this; // 此时此刻的this是progress
        // 监听背景的点击
        this.$processBar.click(function (event) {
            // 获取背景距离窗口默认的位置
            var normalLeft = $(this).offset().left;
            // 获取点击的位置距离窗口的位置
            var eventLeft = event.pageX;
            // 设置前景的宽度
            $this.$processLine.css("width", eventLeft - normalLeft);
            $this.$processDot.css("left", eventLeft - normalLeft);
            // 计算进度条的比例
            var value = (eventLeft - normalLeft) / $(this).width();
            console.log(value);
            callBack(value);
        });
    },
    processMove: function (callBack) {
        var $this = this;//Process
        //鼠标按下
        this.$processDot.mousedown(function () {
            //鼠标移动
            var $offset;
            $(document).mousemove(function () {
                $offset = event.pageX - $this.$processBar.offset().left;
                if ($offset < 0 || $offset > $this.$processBar.width()) return;
                $this.$processLine.css({
                    width: $offset
                });
                $this.$processDot.css({
                    left: $offset
                });
            });
            //鼠标抬起
            $(document).mouseup(function () {
                $(document).off("mousemove");
                $(document).off("mouseup");
                var value = $offset / $this.$processBar.width();
                console.log(value);
                callBack(value);
            });
        });


    },
    processTo: function (value) {
        if(value < 0 || value > 100) return;
        this.$processLine.css({
            width: value + "%"
        });
        this.$processDot.css({
            left: value + "%"
        });
    }
};