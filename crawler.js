var utils = {
  // startで始まって、endで終わる値を持つ配列を返すです
  range: function(start, end) {
    var ar = [];
    for (var i = start; i <= end; i++) {
      ar.push(i);
    }
    return ar;
  },
  // Dateオブジェクトを渡すと、yyyy-mm-dd形式の文字列にして返すです
  dateStr: function(d) {
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  }
};

var wiki = {
  // 作品のリンクにbaseURIがないので補完用
  baseURI: 'http://ja.wikipedia.org',
  // 年代別の作品一覧ページ
  // url: 年代別ページのURL
  // type: year => アニメのテーブルが年別に分かれてる, quarter => アニメのテーブルが4半期別に分かれてる
  // yearList: その年代ページで扱っている範囲
  urlList: [
    {
      url: 'http://ja.wikipedia.org/wiki/%E6%97%A5%E6%9C%AC%E3%81%AE%E3%83%86%E3%83%AC%E3%83%93%E3%82%A2%E3%83%8B%E3%83%A1%E4%BD%9C%E5%93%81%E4%B8%80%E8%A6%A7_(1960%E5%B9%B4%E4%BB%A3)',
      type: 'year',
      yearList: utils.range(1960, 1969)
    },
    {
      url: 'http://ja.wikipedia.org/wiki/%E6%97%A5%E6%9C%AC%E3%81%AE%E3%83%86%E3%83%AC%E3%83%93%E3%82%A2%E3%83%8B%E3%83%A1%E4%BD%9C%E5%93%81%E4%B8%80%E8%A6%A7_(1970%E5%B9%B4%E4%BB%A3)',
      type: 'year',
      yearList: utils.range(1970, 1979)
    },
    {
      url: 'http://ja.wikipedia.org/wiki/%E6%97%A5%E6%9C%AC%E3%81%AE%E3%83%86%E3%83%AC%E3%83%93%E3%82%A2%E3%83%8B%E3%83%A1%E4%BD%9C%E5%93%81%E4%B8%80%E8%A6%A7_(1980%E5%B9%B4%E4%BB%A3)',
      type: 'year',
      yearList: utils.range(1980, 1989)
    },
    {
      url: 'http://ja.wikipedia.org/wiki/%E6%97%A5%E6%9C%AC%E3%81%AE%E3%83%86%E3%83%AC%E3%83%93%E3%82%A2%E3%83%8B%E3%83%A1%E4%BD%9C%E5%93%81%E4%B8%80%E8%A6%A7_(1990%E5%B9%B4%E4%BB%A3)',
      type: 'quarter',
      yearList: utils.range(1990, 1999)
    },
    {
      url: 'http://ja.wikipedia.org/wiki/%E6%97%A5%E6%9C%AC%E3%81%AE%E3%83%86%E3%83%AC%E3%83%93%E3%82%A2%E3%83%8B%E3%83%A1%E4%BD%9C%E5%93%81%E4%B8%80%E8%A6%A7_(2000%E5%B9%B4%E4%BB%A3_%E5%89%8D%E5%8D%8A)',
      type: 'quarter',
      yearList: utils.range(2000, 2004)
    },
    {
      url: 'http://ja.wikipedia.org/wiki/%E6%97%A5%E6%9C%AC%E3%81%AE%E3%83%86%E3%83%AC%E3%83%93%E3%82%A2%E3%83%8B%E3%83%A1%E4%BD%9C%E5%93%81%E4%B8%80%E8%A6%A7_(2000%E5%B9%B4%E4%BB%A3_%E5%BE%8C%E5%8D%8A)',
      type: 'quarter',
      yearList: utils.range(2005, 2009)
    },
    {
      url: 'http://ja.wikipedia.org/wiki/%E6%97%A5%E6%9C%AC%E3%81%AE%E3%83%86%E3%83%AC%E3%83%93%E3%82%A2%E3%83%8B%E3%83%A1%E4%BD%9C%E5%93%81%E4%B8%80%E8%A6%A7_(2010%E5%B9%B4%E4%BB%A3_%E5%89%8D%E5%8D%8A)',
      type: 'quarter',
      yearList: utils.range(2010, 2014)
    },
    {
      url: 'http://ja.wikipedia.org/wiki/%E6%97%A5%E6%9C%AC%E3%81%AE%E3%83%86%E3%83%AC%E3%83%93%E3%82%A2%E3%83%8B%E3%83%A1%E4%BD%9C%E5%93%81%E4%B8%80%E8%A6%A7_(2010%E5%B9%B4%E4%BB%A3_%E5%BE%8C%E5%8D%8A)',
      type: 'quarter',
      yearList: utils.range(2015, 2019)
    },
  ],
  // 年代別ページからそのページにあるアニメのオブジェクト一覧を作って返すです
  parse: function(html, urlObj) {
    var that = this, objList = [], i = 0;

    // 一旦tableごとに回して下記の年を補完するです
    $(html).find('table.wikitable').each(function() {
      // 放送開始/終了日で年がないのでそれを補完するための儀式です
      var year = urlObj.yearList[urlObj.type == 'year' ? i : Math.floor(i / 4)];

      // tr1つごとに1作品分のアニメの情報が入ってるです
      $(this).find('tr:has(td)').each(function() {
        // 最低限文字列として扱えるようにしてから、日付とか話数とかうまいこと取得するです
        var dateText = $(this).find('td:eq(0)').text().replace('\n', '').replace(/\s+/g, ' ').trim(),
          titleText = $(this).find('td:eq(1)').text().replace('\n', '').replace(/\s+/g, ' ').trim(),
          wikiUrl = $(this).find('td:eq(1) a[class!="new"]').attr('href'),
          productionsText = $(this).find('td:eq(2)').text().replace('\n', '').replace(/\s+/g, ' ').trim(),
          chapterText = $(this).find('td:eq(4)').text().replace('\n', '').replace(/\s+/g, ' ').trim(),
          date = that.dateParse(dateText, year),
          obj = {
            title: titleText,
            start: date.start,
            end: date.end,
            chapter: chapterText.match(/全(\d+)話/) ? RegExp.$1 : null,
            productions: productionsText.split(/、\s?/),
            wikiUrl: that.baseURI + wikiUrl,
          };

        objList.push(obj);
      });

      i++;
    });

    return objList;
  },
  // クソみたいな日付のテキストをうまいことやって日付の文字列x2の入ったオブジェクトを返すです
  dateParse: function(dateText, year) {
    var dateObj = {start: null, end: null};

    // クソ書式の判定
    if (dateText.match(/^(\d+)年(\d+)月(\d+)日\s-\s(\d+)年(\d+)月(\d+)日$/)) {
      // yyyy年mm月dd日 - yyyy年mm月dd日
      dateObj.start = new Date(RegExp.$1, RegExp.$2 - 1, RegExp.$3);
      dateObj.end = new Date(RegExp.$4, RegExp.$5 - 1, RegExp.$6);
    } else if (dateText.match(/^(\d+)年(\d+)月(\d+)日\s-\s(\d+)月(\d+)日$/)) {
      // yyyy年mm月dd日 - mm月dd日
      dateObj.start = new Date(RegExp.$1, RegExp.$2 - 1, RegExp.$3);
      dateObj.end = new Date(RegExp.$1, RegExp.$4 - 1, RegExp.$5);
    } else if (dateText.match(/^(\d+)月(\d+)日\s-\s(\d+)年(\d+)月(\d+)日$/)) {
      // mm月dd日 - yyyy年mm月dd日
      dateObj.start = new Date(year, RegExp.$1 - 1, RegExp.$2);
      dateObj.end = new Date(RegExp.$3, RegExp.$4 - 1, RegExp.$5);
    } else if (dateText.match(/^(\d+)月(\d+)日\s-\s(\d+)月(\d+)日$/)) {
      // mm月dd日 - mm月dd日
      dateObj.start = new Date(year, RegExp.$1 - 1, RegExp.$2);
      dateObj.end = new Date(year, RegExp.$3 - 1, RegExp.$4);
    } else if (dateText.match(/^(\d+)年(\d+)月(\d+)日/)) {
      // yyyy年mm月dd日 (たぶん、1話完結系とか。)
      dateObj.start = new Date(RegExp.$1, RegExp.$2 - 1, RegExp.$3);
    } else if (dateText.match(/^(\d+)月(\d+)日/)) {
      // mm月dd日 (たぶん、1話完結系とか。)
      dateObj.start = new Date(year, RegExp.$1 - 1, RegExp.$2);
    }

    return {
      start: dateObj.start ? utils.dateStr(dateObj.start) : null,
      end: dateObj.end ? utils.dateStr(dateObj.end) : null
    };
  },
};

$(function() {
  var ajaxList = [], json = [];

  wiki.urlList.forEach(function(v, i, ar) {
    // 各URLに対してガンガン非同期で投げちゃうです
    var ajax = $.ajax({
      url: v.url,
      obj: v,
      type: 'GET',
    }).then(function(res) {
      Array.prototype.push.apply(json, wiki.parse(res.results[0], this.obj));
    });
    ajaxList.push(ajax);
  });

  // 全部終わるまで待つです
  $.when.apply($, ajaxList).done(function() {
    // ファイルとリンク作るです
    var blob = new Blob([JSON.stringify(json, null, '  ')], {type: "text/plain"}),
      a = document.createElement("a");

    // ダウンロードさせるです
    a.href = URL.createObjectURL(blob);
    a.target = '_blank';
    a.download = 'anime_list.json';
    a.click();
  });
});
