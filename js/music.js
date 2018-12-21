var iaudio = document.getElementById("iaudio");
var mis = 0;
function Music(json_data) {
    this.json_data = json_data; // 数据
    this.sign = 1; //标记
    this.playsign = true;
    this.jsonLength = getJsonLength(json_data);
  }
  

  function getJsonLength(json_data) {
    let jsonLength = 0;
    for (var item in json_data) {
      jsonLength++;
    }
    return jsonLength;
  }

  // 进度条控制：https://blog.csdn.net/qq_36358134/article/details/78196411
  function TimeSpan() {
    //在音频播放时调用这个函数
    setInterval("process()", 1000);
  }
  //进度条主函数
  function process() {
    $("#imusic-bar").css(
      "width",
      (iaudio.currentTime / iaudio.duration) * 100 + "%"
    );
  }

  // 播放
  Music.prototype.play = function () {
    $("#imusic-bar").css("width", "0");
    if (this.playsign) {
      $("#btn-play,#btn-pause").toggle();
      $(".btn-forward,.btn-backward").css("pointer-events", "auto");
      $("#btn-download").css("display", "block");
    } else {
      $("#btn-stop").hide();
      $("#btn-pause").show();
    }
    let ititle = json_data[this.sign].name + " - " + json_data[this.sign].artist_name;
    let iurl = json_data[this.sign].url;
    // 修改src
    $("#iaudio").attr("src", iurl);
    // 修改封面
    $("#top-cover")
      .attr("src", json_data[this.sign].album_picUrl)
      .addClass("rot");
    // 修改标题
    $("#inf").html(ititle);
    // 修改下载信息
    $("#btn-download").attr({
      "href": iurl,
      "download": ititle
    });
    iaudio.play();
    TimeSpan();
    console.log("正在播放");
    console.log("当前列表长度：" + this.jsonLength);
  };
  // 停止
  Music.prototype.stop = function () {
    this.playsign = false;
    $("#btn-stop,#btn-pause").toggle();
    $("#top-cover").removeClass("rot");
    iaudio.pause();
    console.log("停止" + this.sign);
  };

  // 继续
  Music.prototype.keep = function () {
    $("#btn-stop,#btn-pause").toggle();
    // 修改封面
    $("#top-cover").addClass("rot");
    iaudio.play();
    console.log("继续" + this.sign);
  };
  // 上一首
  Music.prototype.last = function () {
    if (this.sign === 1) {
      this.sign = this.jsonLength;
    } else {
      this.sign--;
    }
    this.playsign = false;
    this.play();
    console.log("上一首" + this.sign);
  };

  // 下一首
  Music.prototype.next = function () {
    if (this.sign === this.jsonLength) {
      this.sign = 1;
    } else {
      this.sign++;
    }
    this.playsign = false;
    this.play();
    console.log("下一首" + this.sign);
  };

  // 播放
  $("#btn-play").on("click", function () {
    music.play();
  });
  // 继续
  $("#btn-stop").on("click", function () {
    music.keep();
  });

  // 暂停
  $("#btn-pause").on("click", function () {
    music.stop();
  });
  // 上一首
  $("#btn-backward").on("click", function () {
    music.last();
  });
  // 下一首
  $("#btn-forward").on("click", function () {
    music.next();
  });

  $("#top-cover").on("click", function () {
    window.open(url = "https://music.163.com/artist?id=" + json_data[music.sign].artist_id);
  });

  // 监测完成事件
  iaudio.onended = function () {
    console.log("当前音乐播放完毕，正在切换到第" + music.sign);
    music.next();
    console.log("切换完成！当前音乐：" + music.sign);
  };
  iaudio.onerror = function () {
    console.log("该音乐可能由于网络波动或者版权限制导致播放失败了，已自动跳至下一首！");
    music.next();
  };

  $('.mini-imusic').on('click', function(){
    if(mis===0){
      music.play();
      mis = 1;
    }
    //关闭
    else if (mis===1){
      music.stop();
      mis = 2;
    }
    else{
      music.keep();
      mis = 1;
    }
  });
