$(function () {
    //加载歌曲
    $audio=$("audio");
    var player=new Player($audio);
    var lyric;
    $.ajax({
        url:"./source/musiclist.json",
        dataType:"json",
        success:function (data) {
            player.musicList=data;
            $.each(data,function (index,value) {
                createMusicList(index,value);
            });
            //初始化歌曲信息
            initMusicInfo(data[0]);
            //加载歌词
            initLyricInfo(data[0]);
        },
        error:function (e) {
            console.log(e);
        }
    });
    function initLyricInfo(music) {
        //清空前一首歌曲歌词
        $(".song_lyric").html("");
        lyric=new Lyric(music);
        lyric.loadLyric(function () {
            $.each(lyric.lyrArr,function (index,ele) {
                var $lyric=$("<li>"+ele+"</li>");
                $(".song_lyric").append($lyric);
            });
        });
    }
    //监听鼠标点击进度条
    var $musicProcessBar=$(".music_process_bar");
    var $musicProcessLine=$(".music_process_line");
    var $musicProcessDot=$(".music_process_dot");
    var musicProcess=new Process($musicProcessBar,$musicProcessLine,$musicProcessDot);
    musicProcess.processClick(function (value) {
        player.musicSeekTo(value);
    });
    musicProcess.processMove(function (value) {
        player.musicSeekTo(value);
    });


    var $voiceProcessBar=$(".music_volume_bar");
    var $voiceProcessLine=$(".music_volume_line");
    var $voiceProcessDot=$(".music_volume_dot");
    var voiceProcess=new Process($voiceProcessBar,$voiceProcessLine,$voiceProcessDot);
    voiceProcess.processClick(function (value) {
        player.voiceSeekTo(value);
    });
    voiceProcess.processMove(function (value) {
        player.voiceSeekTo(value);
    });

    //同步音乐播放时间、进度条和歌词
    player.musicTimeUpdate(function (duration,currentTime,timeStr) {
        $(".music_process_time").text(timeStr);
        var value=currentTime / duration *100;
        musicProcess.processTo(value);
        //歌词高亮
        var index=lyric.currentIndex(currentTime);
        var $curLrc=$(".song_lyric>li").eq(index);
        $curLrc.addClass("curLyr");
        $curLrc.siblings().removeClass("curLyr");
        //歌词滚动
        if(index>6)
        {
            $(".song_lyric").css({
                marginTop: (-index + 6) * 30
            })
        }
        else
        {
            $(".song_lyric").css({
                marginTop: 0
            })
        }
    });
    //监听鼠标移入歌曲列表
    $(".content_list").delegate(".music_list","mouseenter",function () {
        //显示子菜单
        $(this).find(".list_menu").css("display","block");
        $(this).find(".list_time>a").css("display","inline-block");
        //隐藏时长
        $(this).find(".list_time>span").css("display","none");
    });
    //监听鼠标移出歌曲列表
    $(".content_list").delegate(".music_list","mouseleave",function () {
        //隐藏子菜单
        $(this).find(".list_menu").css("display", "none");
        $(this).find(".list_time>a").css("display", "none");
        //隐藏时长
        $(this).find(".list_time>span").css("display", "inline");
    });
    //监听勾选
    $(".content_list").delegate(".list_check>i","click",function () {
        if($(this).parent(".list_check").hasClass("list_checked"))
        {
            $(this).css("opacity",0.5);
            $(this).parent(".list_check").removeClass("list_checked");
        }
        else
        {
            $(this).css("opacity",1);
            $(this).parent(".list_check").addClass("list_checked");
        }
    });
    //监听子菜单播放按钮点击
   $(".content_list").delegate(".list_play","click",function () {
       $item=$(this).parents(".music_list");
       $(this).toggleClass("list_playing");
       $item.siblings().find(".list_play").removeClass("list_playing");
       // 添加序号动画
       $item.find(".list_num").toggleClass("list_num_play");
       $item.siblings().find(".list_num").removeClass("list_num_play");
       if($(this).hasClass("list_playing"))
       {
           // 当前子菜单是播放状态
           $(".footer_in>.music_play").addClass("music_playing");
           //当前行高亮
           $item.find("div").css("color","rgba(255, 255, 255, 1)");
           //其他行透明
           $item.siblings().find("div").css("color","rgba(255, 255, 255, 0.5)");
           //切换歌词信息
           initLyricInfo($item.get(0).music);
       }
       else
       {
           // 当前子菜单不是播放状态
           $(".footer_in>.music_play").removeClass("music_playing");
           //当前行不高亮
           $item.find("div").css("color","rgba(255, 255, 255, 0.5)");
       }
       //播放当前音乐
       player.playMusic($item.get(0).index,$item.get(0).music);
       //切换歌曲信息
       initMusicInfo($item.get(0).music);
   });
    //监听底部播放按钮点击
    $(".footer_in>.music_play").click(function () {
        $(this).toggleClass("music_playing");
        //判断是否播放过音乐
        if(player.currentIndex===-1)
        {
            //没有播放过音乐
            // player.playMusic($(".music_list").eq(0).get(0).index,$(".music_list").eq(0).get(0).music);
            $(".music_list").eq(0).find(".list_play").trigger("click");
        }
        else
        {
            //播放过音乐
            $(".music_list").eq(player.currentIndex).find(".list_play").trigger("click");
        }
    });
    //监听底部前一首播放按钮点击
    $(".footer_in>.music_pre").click(function () {
        $(".music_list").eq(player.preIndex()).find(".list_play").trigger("click");
    });
    //下一首按钮点击
    $(".footer_in>.music_next").click(function () {
        $(".music_list").eq(player.nextIndex()).find(".list_play").trigger("click");
    });
    //歌曲删除
    $(".content_list").delegate(".list_del","click",function () {
        //删除对应元素
        $(this).parents(".music_list").remove();
        //删除歌曲
        player.delMusic($(this).parents(".music_list").get(0).index);
        //重新排序
        $(".music_list").each(function (index,ele) {
            ele.index=index;
            $(ele).find(".list_num").text(index+1);
        });
        //是否删除当前播放的歌曲
        if($(this).parents(".music_list").get(0).index===player.currentIndex)
        {
            //播放下一首歌曲
            player.currentIndex-=1;
            $(".footer_in>.music_next").trigger("click");
        }
        else if($(this).parents(".music_list").get(0).index<player.currentIndex)
        {
            //删除当前播放歌曲之前的歌曲
            player.currentIndex-=1;
        }
    });
    function createMusicList(index,value)
    {
        $musicList=$("<li class=\"music_list\">\n" +
            "                        <div class=\"list_check\"><i></i></div>\n" +
            "                        <div class=\"list_num\">"+(index+1)+"</div>\n" +
            "                        <div class=\"list_name\">"+value.name+"\n" +
            "                            <div class=\"list_menu\">\n" +
            "                                <a href=\"javascript:;\" class=\"list_play\"></a>\n" +
            "                                <a href=\"javascript:;\" class=\"list_add\"></a>\n" +
            "                                <a href=\"javascript:;\" class=\"list_down\"></a>\n" +
            "                                <a href=\"javascript:;\" class=\"list_share\"></a>\n" +
            "                            </div>\n" +
            "                        </div>\n" +
            "                        <div class=\"list_singer\">"+value.singer+"</div>\n" +
            "                        <div class=\"list_time\">\n" +
            "                            <span>"+value.time+"</span>\n" +
            "                            <a href=\"javascript:;\" class=\"list_del\"></a></div>\n" +
            "                    </li>");
        $(".content_list>ul").append($musicList);
        $musicList.get(0).index=index;
        $musicList.get(0).music=value;
    }
    function initMusicInfo(music)
    {
        var $songPic=$(".song_info_pic>img");
        var $songName=$(".song_info_name>a");
        var $songSinger=$(".song_info_singer>a");
        var $songAlbum=$(".song_info_album>a");
        var $songProcessName=$(".music_process_name");
        var $songProcessTime=$(".music_process_time");
        var $maskBgPic=$(".mask_bg");

        $songPic.attr("src",music.cover);
        $songName.text(music.name);
        $songSinger.text(music.singer);
        $songAlbum.text(music.album);
        $songProcessName.text(music.name+' / '+music.singer);
        $songProcessTime.text("00:00 / "+music.time);
        $maskBgPic.css({
            background:"url('"+music.cover+"')"
        });
    }
});