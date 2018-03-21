//calendar.js
//获取应用实例
const app = getApp()

Page({
  data: {
    calendar: true,
    calendarMonthName: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
    calendarTR: ['日', '一', '二', '三', '四', '五', '六'],
    calendarLIST: [],
    info: {},
    today: '',//今天的年月日
    currentMonth: '',
    currentYear: '',
    choose: [],
    chooseDate: [],
  },
  //输出选择的日期
  _calendarSubmit: function () {
    if (this.data.choose.length == 0) {
      return false;
    }
    var chooseDate = [];
    for (var i = 0; i < this.data.choose.length; i++) {
      var thisDate = this.data.choose[i];
      var thisMonth = thisDate.substr(5, 2);
      var thisDay = thisDate.substr(8, 2);
      chooseDate.push(parseInt(thisMonth) + '月' + parseInt(thisDay) + '日')
    }
    this.setData({
      // calendar: false,//点击按钮后隐藏日历
      chooseDate: chooseDate,
    })
    console.log(chooseDate);
  },
  //翻页加载
  pageaddload: function () {
    this.createCalendar();
  },
  //选择日期
  chooseCalendar: function (e) {
    var data = this.data.calendarLIST;
    var onetwo = e.target.dataset.whidhmonth.split('-');
    var choose = this.data.choose;
    if (data[onetwo[0]].current > 0 && data[onetwo[0]].arr[onetwo[1] - 1].day < data[onetwo[0]].current) {
      return false;
    }
    if (data[onetwo[0]].arr[onetwo[1] - 1].isCheck == 'isCheck') {
      data[onetwo[0]].arr[onetwo[1] - 1].isCheck = '';
      choose.splice(choose.indexOf(data[onetwo[0]].arr[onetwo[1] - 1].code), 1);
    } else {
      data[onetwo[0]].arr[onetwo[1] - 1].isCheck = 'isCheck';
      choose.push(data[onetwo[0]].arr[onetwo[1] - 1].code)
    }
    choose = choose.sort();
    this.setData({
      calendarLIST: data,
      choose: choose,
    })
    console.log(e.target.dataset, 'isCheck', data[onetwo[0]].arr[onetwo[1] - 1].day, data[onetwo[0]].current)
  },
  //生成单个月份小日历
  createCalendar: function () {
    var calArr = [],
      current = 0;
    if (this.data.currentMonth == '') {
      var today = this.data.today;
      var firstDay = (new Date(today.substr(0, 8) + '01')).getDay(),
        lastDay = (new Date(today.substr(0, 4), today.substr(5, 2), 0)).getDate();
      this.setData({
        currentMonth: today.substr(5, 2),
        currentYear: today.substr(0, 4)
      })
      var nextMonth = parseInt(today.substr(5, 2)),
        nextYear = parseInt(today.substr(0, 4));
      nextMonth += '';
      nextYear += '';
      if (nextMonth.length == 1) {
        nextMonth = '0' + nextMonth;
      }
    } else {
      var nextMonth = parseInt(this.data.currentMonth),
        nextYear = parseInt(this.data.currentYear);
      if (nextMonth == 12) {
        nextMonth = 1;
        nextYear++;
      } else {
        nextMonth++;
      }
      nextMonth += '';
      nextYear += '';
      if (nextMonth.length == 1) {
        nextMonth = '0' + nextMonth;
      }
      this.setData({
        currentMonth: nextMonth,
        currentYear: nextYear
      })
      var firstDay = (new Date(nextYear + '-' + nextMonth + '-01')).getDay(),
        lastDay = (new Date(nextYear, nextMonth, 0)).getDate();
    }
    var calLength = firstDay + lastDay + 1;
    var frontweek = (new Date(nextYear + '-' + nextMonth + '-01')).getDay();
    var weekend = '';
    var whidhMonth = this.data.calendarLIST.length;
    for (var i = 1; i < calLength; i++) {
      if (i <= firstDay) {
        var cell = 0;
      } else {
        frontweek++;
        var cell = i - firstDay;
      }
      if (frontweek % 7 == 0 || frontweek % 7 == 1) {
        weekend = 'weekend';
      } else {
        weekend = '';
      }
      calArr.push({ day: cell, weekend: weekend, code: nextYear + '-' + nextMonth + '-' + ((cell + '').length == 1 ? '0' + (cell + '') : cell), whidhMonth: whidhMonth + '-' + i, isCheck: '' })
    }
    var itoday = (new Date()).getDate() + '';
    itoday = itoday.length == 1 ? '0' + itoday : itoday;
    var nowday = nextYear + '-' + nextMonth + '-' + itoday;
    if (nowday == today) {
      current = today.substr(-2);
    }
    var month = {
      year: nextYear,
      month: this.data.calendarMonthName[parseInt(this.data.currentMonth) - 1] + '月',
      current: current,
      weekend: weekend,
      arr: calArr
    };
    month = this.data.calendarLIST.concat(month);
    this.setData({
      calendarLIST: month,
    })
  },
  onLoad: function (res) {
    var date = new Date();
    var month = date.getMonth() + 1;
    if(month < 10){
      month = month + '';
      month = '0' + month;
    }
    var now = date.getFullYear() + '-' + month + '-' + date.getDate();
    this.setData({
      today: now,
    })
    //根据屏幕大小初始化日历铺满，一个函数输出一个月份
    this.createCalendar();
    this.createCalendar();
    this.createCalendar();
  }
})
