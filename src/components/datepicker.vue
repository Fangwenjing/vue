<template>
  <div class="datepicker input-group">
    <input class="form-control" type="text" :placeholder="placeholder"
        :value="time" readonly/>
    <div class="datepicker-popup" v-show="displayDayView">
      <div class="datepicker-inner">
        <div class="datepicker-body">
          <collapse :show="!showTime">
            <div slot="content">
              <div class="datepicker-ctrl">
                <span class="datepicker-preBtn glyphicon glyphicon-chevron-left" aria-hidden="true" @click="preNextMonthClick(0)"></span>
                <span class="datepicker-nextBtn glyphicon glyphicon-chevron-right" aria-hidden="true" @click="preNextMonthClick(1)"></span>
                <p @click="switchMonthView">{{stringifyDayHeader(currDate)}}</p>
              </div>
              <div class="datepicker-weekRange">
                <span v-for="w in text.daysOfWeek">{{w}}</span>
              </div>
              <div class="datepicker-dateRange">
                <span v-for="d in dateRange" :class="d.sclass" @click="daySelect(d.date, d.sclass)">{{d.text}}</span>
              </div>
            </div>
          </collapse>
          <collapse :show="showTime" classes="timeView">
            <div class="datepicker-switch">
              <span @click="timeClk"><i class="glyphicon glyphicon-time"></i></span>
              <span @click="clear"><i class="glyphicon glyphicon-trash"></i></span>
            </div>
            <div slot="content">
              <div class="timepicker-picker" v-show="displayTimepicker">
                <div class="up">
                  <span @click="addHour(1)"><i class="glyphicon glyphicon-chevron-up"></i></span>
                  <span @click="addMinute(1)"><i class="glyphicon glyphicon-chevron-up"></i></span>
                  <span @click="addSecond(1)"><i class="glyphicon glyphicon-chevron-up"></i></span>
                </div>
                <div class="time">
                  <span @click="hourClk">{{hours}}</span>
                  <span class="symbol">:</span>
                  <span @click="minuteClk">{{minutes}}</span>
                  <span class="symbol">:</span>
                  <span @click="secondClk">{{seconds}}</span>
                </div>
                <div class="down">
                  <span @click="addHour(-1)"><i class="glyphicon glyphicon-chevron-down"></i></span>
                  <span @click="addMinute(-1)"><i class="glyphicon glyphicon-chevron-down"></i></span>
                  <span @click="addSecond(-1)"><i class="glyphicon glyphicon-chevron-down"></i></span>
                </div>
              </div>
              <div class="timepicker-hours" v-show="displayHourspicker">
                <span v-for="i in hourDict" @click="selectHour(i)">{{i}}</span>
              </div>
              <div class="timepicker-minutes" v-show="displayMinutespicker">
                <span v-for="m in minuteDict" @click="selectMinute(m)">{{m}}</span>
              </div>
              <div class="timepicker-seconds" v-show="displaySecondspicker">
                <span v-for="s in minuteDict" @click="selectSecond(s)">{{s}}</span>
              </div>
            </div>
          </collapse>
        </div>
      </div>
    </div>
    <div class="datepicker-popup" v-show="displayMonthView">
      <div class="datepicker-inner">
        <div class="datepicker-body">
          <div class="datepicker-ctrl">
            <span class="datepicker-preBtn glyphicon glyphicon-chevron-left" aria-hidden="true" @click="preNextYearClick(0)"></span>
            <span class="datepicker-nextBtn glyphicon glyphicon-chevron-right" aria-hidden="true" @click="preNextYearClick(1)"></span>
            <p @click="switchDecadeView">{{stringifyYearHeader(currDate)}}</p>
          </div>
          <div class="datepicker-monthRange">
            <template v-for="m in text.months">
              <span   :class="{'datepicker-dateRange-item-active':
                  (text.months[parse(value).getMonth()]  === m) &&
                  currDate.getFullYear() === parse(value).getFullYear()}"
                  @click="monthSelect($index)"
                >{{m.substr(0,3)}}</span>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="datepicker-popup" v-show="displayYearView">
      <div class="datepicker-inner">
        <div class="datepicker-body">
          <div class="datepicker-ctrl">
            <span class="datepicker-preBtn glyphicon glyphicon-chevron-left" aria-hidden="true" @click="preNextDecadeClick(0)"></span>
            <span class="datepicker-nextBtn glyphicon glyphicon-chevron-right" aria-hidden="true" @click="preNextDecadeClick(1)"></span>
            <p>{{stringifyDecadeHeader(currDate)}}</p>
          </div>
          <div class="datepicker-monthRange decadeRange">
            <template v-for="decade in decadeRange">
              <span :class="{'datepicker-dateRange-item-active':
                  parse(this.value).getFullYear() === decade.text}"
                  @click.stop="yearSelect(decade.text)"
                >{{decade.text}}</span>
            </template>
          </div>
        </div>
      </div>
    </div>
    <span class="input-group-addon" @click="iconClick"><i class="glyphicon glyphicon-calendar"></i></span>
  </div>
</template>

<script>
import translations from '../utils/translations.js'
import EventListener from '../utils/EventListener.js'
import Collapse from './collapse'

export default {
  components: {
    Collapse
  },
  props: {
    value: {
      type: String
    },
    timeStr: {
      type: String
    },
    format: {
      default: 'yyyy/MM/dd'
    },
    rangeStart: {
      type: String,
      default: null
    },
    rangeEnd: {
      type: String,
      default: null
    },
    disabledPast: {
      type: Boolean,
      default: false
    },
    disabledFuture: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String
    }
  },
  ready () {
    this._blur = (e) => {
      if (!this.$el.contains(e.target)) this.close()
    }
    this.$dispatch('child-created', this)
    this.currDate = this.parse()
    this.today = new Date(this.currDate.getFullYear(), this.currDate.getMonth(), this.currDate.getDate())
    this.setRange()
    this._clickEvent = EventListener.listen(window, 'click', this._blur)
    this.initDict()
  },
  beforeDestroy () {
    if (this._clickEvent) this._clickEvent.remove()
  },
  data () {
    return {
      currDate: new Date(),
      dateRange: [],
      decadeRange: [],
      displayDayView: false,
      displayMonthView: false,
      displayYearView: false,
      displayTimepicker: false,
      displayHourspicker: false,
      displayMinutespicker: false,
      displaySecondspicker: false,
      rangeMin: null,
      rangeMax: null,
      today: null,
      hour: 0,
      minute: 0,
      second: 0,
      showTime: false,
      hourDict: [],
      minuteDict: []
    }
  },
  watch: {
    rangeStart () {
      this.setRangeMin()
    },
    rangeEnd () {
      this.setRangeMax()
    },
    currDate () {
      this.getDateRange()
    },
    hour () {
      if (!this.value) this.setNowValue()
    },
    minute () {
      if (!this.value) this.setNowValue()
    },
    second () {
      if (!this.value) this.setNowValue()
    }
  },
  computed: {
    text () {
      return translations()
    },
    hours () {
      return ('0' + this.hour).slice(-2)
    },
    minutes () {
      return ('0' + this.minute).slice(-2)
    },
    seconds () {
      return ('0' + this.second).slice(-2)
    },
    time () {
      let array = []
      if (this.value) {
        array.push(this.value)
        array.push(' ')
        array.push(this.hours)
        array.push(':')
        array.push(this.minutes)
        array.push(':')
        array.push(this.seconds)
      }
      this.timeStr = array.join('')
      return this.timeStr
    }
  },
  events: {
    'datapicker:set' (str) {
      this.currDate = this.parse(str)
      this.hour = this.currDate.getHours()
      this.minute = this.currDate.getMinutes()
      this.second = this.currDate.getSeconds()
      this.value = this.stringify(this.currDate)
    }
  },
  methods: {
    initDict () {
      for (let i = 0; i < 24; i++) {
        this.hourDict.push(('0' + i).slice(-2))
      }
      for (let i = 0; i < 60; i += 5) {
        this.minuteDict.push(('0' + i).slice(-2))
      }
    },
    close () {
      this.displayDayView = this.displayMonthView = this.displayYearView = false
    },
    iconClick () {
      this.currDate = this.parse(this.value)
      if (this.displayMonthView || this.displayYearView) {
        this.displayDayView = false
      } else {
        this.displayDayView = !this.displayDayView
      }
    },
    timeClk () {
      this.showTime = !this.showTime
      this.displayTimepicker = true
    },
    addHour (count) {
      this.hour += count
      if (this.hour > 23) {
        this.hour = 0
      }
      if (this.hour < 0) {
        this.hour = 23
      }
    },
    addMinute (count) {
      this.minute += count
      if (this.minute > 59) {
        this.minute = 0
      }
      if (this.minute < 0) {
        this.minute = 59
      }
    },
    addSecond (count) {
      this.second += count
      if (this.second > 59) {
        this.second = 0
      }
      if (this.seconds < 0) {
        this.second = 59
      }
    },
    hourClk (flag = true) {
      this.displayHourspicker = flag
      this.displayTimepicker = !flag
    },
    minuteClk (flag = true) {
      this.displayMinutespicker = flag
      this.displayTimepicker = !flag
    },
    secondClk (flag = true) {
      this.displaySecondspicker = flag
      this.displayTimepicker = !flag
    },
    selectHour (hour) {
      this.hour = parseInt(hour)
      this.hourClk(false)
    },
    selectMinute (minute) {
      this.minute = parseInt(minute)
      this.minuteClk(false)
    },
    selectSecond (second) {
      this.second = parseInt(second)
      this.secondClk(false)
    },
    clear () {
      this.currDate = new Date()
      this.value = ''
    },
    setNowValue () {
      this.value = this.stringify(this.currDate)
    },
    preNextDecadeClick (flag) {
      const year = this.currDate.getFullYear()
      const months = this.currDate.getMonth()
      const date = this.currDate.getDate()

      if (flag === 0) {
        this.currDate = new Date(year - 10, months, date)
      } else {
        this.currDate = new Date(year + 10, months, date)
      }
    },
    preNextMonthClick (flag) {
      const year = this.currDate.getFullYear()
      const month = this.currDate.getMonth()
      const date = this.currDate.getDate()

      if (flag === 0) {
        const preMonth = this.getYearMonth(year, month - 1)
        this.currDate = new Date(preMonth.year, preMonth.month, date)
      } else {
        const nextMonth = this.getYearMonth(year, month + 1)
        this.currDate = new Date(nextMonth.year, nextMonth.month, date)
      }
    },
    preNextYearClick (flag) {
      const year = this.currDate.getFullYear()
      const months = this.currDate.getMonth()
      const date = this.currDate.getDate()

      if (flag === 0) {
        this.currDate = new Date(year - 1, months, date)
      } else {
        this.currDate = new Date(year + 1, months, date)
      }
    },
    yearSelect (year) {
      this.displayYearView = false
      this.displayMonthView = true
      this.currDate = new Date(year, this.currDate.getMonth(), this.currDate.getDate())
    },
    daySelect (date, sclass) {
      if (sclass.indexOf('datepicker-item-disable') > -1) {
        return false
      } else {
        this.currDate = date
        this.displayDayView = false
        this.setNowValue()
      }
    },
    switchMonthView () {
      this.displayDayView = false
      this.displayMonthView = true
    },
    switchDecadeView () {
      this.displayMonthView = false
      this.displayYearView = true
    },
    monthSelect (index) {
      this.displayMonthView = false
      this.displayDayView = true
      this.currDate = new Date(this.currDate.getFullYear(), index, this.currDate.getDate())
    },
    getYearMonth (year, month) {
      if (month > 11) {
        year++
        month = 0
      } else if (month < 0) {
        year--
        month = 11
      }
      return {year: year, month: month}
    },
    stringifyDecadeHeader (date) {
      const yearStr = date.getFullYear().toString()
      const firstYearOfDecade = yearStr.substring(0, yearStr.length - 1) + 0
      const lastYearOfDecade = parseInt(firstYearOfDecade, 10) + 10
      return firstYearOfDecade + '-' + lastYearOfDecade
    },
    stringifyDayHeader (date) {
      return this.text.months[date.getMonth()] + ' ' + date.getFullYear()
    },
    parseMonth (date) {
      return this.text.months[date.getMonth()]
    },
    stringifyYearHeader (date) {
      return date.getFullYear()
    },
    stringify (date, format = this.format) {
      if (!date) return ''
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const monthName = this.parseMonth(date)

      return format
      .replace(/yyyy/g, year)
      .replace(/MMMM/g, monthName)
      .replace(/MMM/g, monthName.substring(0, 3))
      .replace(/MM/g, ('0' + month).slice(-2))
      .replace(/dd/g, ('0' + day).slice(-2))
      .replace(/yy/g, year)
      .replace(/M(?!a)/g, month)
      .replace(/d/g, day)
    },
    parse (str = this.value) {
      if (!str) str = new Date()
      let date
      if (str.length === 10 && (this.format === 'dd-MM-yyyy' || this.format === 'dd/MM/yyyy')) {
        date = new Date(str.substring(6, 10), str.substring(3, 5), str.substring(0, 2))
      } else {
        date = new Date(str)
      }
      return isNaN(date.getFullYear()) ? new Date() : date
    },
    getDayCount (year, month) {
      const dict = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
      if (month === 1) {
        if ((year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0)) {
          return 29
        }
      }
      return dict[month]
    },
    setRangeMin () {
      this.rangeStart && (this.rangeMin = new Date(this.rangeStart))
      if (this.disabledPast) {
        if (this.rangeMin) {
          if (this.today > this.rangeMin) this.rangeMin = this.today
        } else {
          this.rangeMin = this.today
        }
      }
    },
    setRangeMax () {
      this.rangeEnd && (this.rangeMax = new Date(this.rangeEnd))
      if (this.disabledFuture) {
        if (this.rangeMax) {
          if (this.today < this.rangeMax) this.rangeMax = this.today
        } else {
          this.rangeMax = this.today
        }
      }
    },
    setRange () {
      this.setRangeMin()
      this.setRangeMax()
    },
    isBetween (value) {
      let isGte = this.rangeMin ? value >= this.rangeMin : true
      let isLte = this.rangeMax ? value <= this.rangeMax : true
      return isGte && isLte
    },
    getSclass (date) {
      let sclass = this.today - date === 0 ? 'today ' : ''
      sclass += this.isBetween(date) ? 'datepicker-item-gray' : 'datepicker-item-disable'
      return sclass
    },
    getDateRange () {
      this.dateRange = []
      this.decadeRange = []
      const time = {
        year: this.currDate.getFullYear(),
        month: this.currDate.getMonth(),
        day: this.currDate.getDate()
      }
      const yearStr = time.year.toString()
      const firstYearOfDecade = (yearStr.substring(0, yearStr.length - 1) + 0) - 1
      for (let i = 0; i < 12; i++) {
        this.decadeRange.push({
          text: firstYearOfDecade + i
        })
      }

      const currMonthFirstDay = new Date(time.year, time.month, 1)
      let firstDayWeek = currMonthFirstDay.getDay() + 1
      if (firstDayWeek === 0) {
        firstDayWeek = 7
      }
      const dayCount = this.getDayCount(time.year, time.month)
      if (firstDayWeek > 1) {
        const preMonth = this.getYearMonth(time.year, time.month - 1)
        const prevMonthDayCount = this.getDayCount(preMonth.year, preMonth.month)
        for (let i = 1; i < firstDayWeek; i++) {
          const dayText = prevMonthDayCount - firstDayWeek + i + 1
          let date = new Date(preMonth.year, preMonth.month, dayText)
          this.dateRange.push({
            text: dayText,
            date: date,
            sclass: this.getSclass(date)
          })
        }
      }

      for (let i = 1; i <= dayCount; i++) {
        const date = new Date(time.year, time.month, i)
        let sclass = this.today - date === 0 ? 'today ' : ''
        if (!this.isBetween(date)) {
          sclass += 'datepicker-item-disable'
        }
        if (i === time.day) {
          if (this.value) {
            const valueDate = this.parse(this.value)
            if (valueDate) {
              if (valueDate.getFullYear() === time.year && valueDate.getMonth() === time.month) {
                sclass += ' datepicker-dateRange-item-active'
              }
            }
          }
        }
        this.dateRange.push({
          text: i,
          date: date,
          sclass: sclass
        })
      }

      if (this.dateRange.length < 42) {
        const nextMonthNeed = 42 - this.dateRange.length
        const nextMonth = this.getYearMonth(time.year, time.month + 1)

        for (let i = 1; i <= nextMonthNeed; i++) {
          let date = new Date(nextMonth.year, nextMonth.month, i)
          this.dateRange.push({
            text: i,
            date: date,
            sclass: this.getSclass(date)
          })
        }
      }
    }
  }
}
</script>

<style lang="less">
@import '../less/mixin.less';

.datepicker {
  input {
    background-color: white !important;
  }

  .input-group-addon {
    cursor: pointer;
    border-left: 0;
  }

  .datepicker-popup{
    position: absolute;
    border: 1px solid #ccc;
    border-radius: 5px;
    background: #fff;
    margin-top: 36px;
    z-index: 10;
    box-shadow: 0 6px 12px rgba(0,0,0,0.175);

    &:before, &:after {
      content: '';
      display: inline-block;
      position: absolute;
    }

    &:before {
      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
      border-bottom: 7px solid #cccccc;
      border-bottom-color: rgba(0, 0, 0, 0.2);
      top: -7px;
      left: 7px;
    }

    &:after {
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-bottom: 6px solid white;
      top: -6px;
      left: 8px;
    }
  }

  .datepicker-inner {
    width: 267px;
  }

  .datepicker-body{
    padding: 10px 10px;
  }

  .datepicker-ctrl p,
  .datepicker-ctrl span,
  .datepicker-body span{
    display: inline-block;
    width: 35px;
    line-height: 35px;
    height: 35px;
    border-radius: 4px;
  }

  .datepicker-ctrl {
    position: relative;
    height: 30px;
    line-height: 30px;
    font-weight: bold;
    text-align: center;
    p {
      width: 65%;
    }
    span {
      position: absolute;
    }
  }

  .datepicker-body {
    span {
      text-align: center;
    }
  }

  .datepicker-monthRange {
    margin-top: 10px;
    span {
      width: 49px;
      height: 50px;
      line-height: 45px;
    }
  }

  .datepicker-dateRange {
    .today {
      position: relative;

      &:before {
        content: '';
        display: inline-block;
        border: solid transparent;
        border-width: 0 0 7px 7px;
        border-bottom-color: #337ab7;
        border-top-color: rgba(0, 0, 0, 0.2);
        position: absolute;
        bottom: 4px;
        right: 4px;
      }

      &.datepicker-dateRange-item-active:before{
        border-bottom-color: white;
      }
    }
  }

  .timeView {
    max-height: 226px;
  }

  .datepicker-switch {
    span {
      width: 48%;
      height: 39px;
      line-height: 39px;
    }
  }

  .timepicker-picker {
    .user-select(none);

    .up, .down {
      span{
        width: 61px;
        height: 61px;
        line-height: 61px;
        margin: 10px 26px 10px 0px;

        &:last-child {
          margin-right: 0;
        }
        
      }
    }

    .time {
      span {
        width: 61px;
        height: 61px;
        line-height: 61px;
        font-weight: bold;
      }

      .symbol {
        width: 22px;
        height: 64px;
      }
    }
  }

  .timepicker-hours {
    span {
      width: 61px;
      height: 31px;
      line-height: 31px;
    }
  }

  .timepicker-minutes, .timepicker-seconds {
    span {
      width: 61px;
      height: 61px;
      line-height: 61px;
    }
  }

  .datepicker-item-disable {
    background-color: white!important;
    cursor: not-allowed!important;
  }
  .decadeRange span:first-child,
  .decadeRange span:last-child,
  .datepicker-item-disable {
    color: rgba(153,153,153,0.4);
  }
  .datepicker-item-gray{
    color: #999;
  }

  .datepicker-dateRange-item-active:hover,
  .datepicker-dateRange-item-active {
    background: rgb(50, 118, 177)!important;
    color: white!important;
  }

  .datepicker-monthRange span,
  .datepicker-ctrl span,
  .datepicker-ctrl p,
  .datepicker-dateRange span,
  .datepicker-switch span,
  .timepicker-picker span:not(.symbol),
  .timepicker-hours span,
  .timepicker-minutes span,
  .timepicker-seconds span {
    cursor: pointer;
  }

  .datepicker-monthRange span:hover,
  .datepicker-ctrl p:hover,
  .datepicker-ctrl i:hover,
  .datepicker-dateRange span:hover,
  .datepicker-dateRange-item-hover,
  .datepicker-switch span:hover,
  .timepicker-picker span:not(.symbol):hover,
  .timepicker-hours span:hover,
  .timepicker-minutes span:hover,
  .timepicker-seconds span:hover {
    background-color : #eeeeee;
  }

  .datepicker-weekRange {
    span {
      font-weight: bold;
    }
  }

  .datepicker-label{
    background-color: #f8f8f8;
    font-weight: 700;
    padding: 7px 0;
    text-align: center;
  }

  .month-btn{
    font-weight: bold;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
  }

  .datepicker-preBtn{
    left: 2px;
  }

  .datepicker-nextBtn{
    right: 2px;
  }
}
</style>
