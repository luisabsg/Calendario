class Day extends React.Component {
  constructor(props) {super(props);}
  render() {
    let cls = this.props.selected ? " day-active" : "";
    if (this.props.hasEvents) cls += " has-events";
    if (this.props.hasMatches) cls += " has-matches";

    let day = this.props.day;
    return (
      day > 0 ? /*#__PURE__*/

      React.createElement("div", { className: "day" + cls, onClick: e => this.props.setDay(this.props.day, e) },
      this.props.day) : /*#__PURE__*/


      React.createElement("div", { className: "day day-empty" }));

  }}


class Form extends React.Component {
  constructor(p) {super(p);}
  render() {
    return /*#__PURE__*/(
      React.createElement("form", { onSubmit: e => this.props.submit(e) }, /*#__PURE__*/
      React.createElement("div", { className: "input-group" }, /*#__PURE__*/
      React.createElement("input", { className: "input-main",
        onChange: e => this.props.update(e.target.value),
        type: "text", placeholder: "Planejando algo?",
        value: this.props.value }), /*#__PURE__*/

      React.createElement("button", { type: "submit", class: "btn-main" }, "+"))));



  }}


class Calendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      day: this.props.day,
      month: this.props.month - 1,
      year: this.props.year,
      cursor: "",
      search: "",
      event: "",
      events: {} };

    this.setDay = this.setDay.bind(this);
    this.setDate = this.setDate.bind(this);
    this.resetDate = this.resetDate.bind(this);
    this.prevMonth = this.prevMonth.bind(this);
    this.nextMonth = this.nextMonth.bind(this);

    this.addEvent = this.addEvent.bind(this);
    this.updateEvent = this.updateEvent.bind(this);
    this.saveEvents = this.saveEvents.bind(this);
    this.loadEvents = this.loadEvents.bind(this);
  }

  componentWillMount() {
    window.addEventListener('unload', this.saveEvents);
    this.setDate(this.props.day, this.props.month - 1, this.state.year);
    this.loadEvents();
  }
  componentWillUnmount() {
    window.removeEventListener('unload', this.saveEvents);
    this.saveEvents();
  }

  getMonthName(idx) {
    return ["Janeiro", "Fevereiro", "Março", "Abril",
    "Maio", "Junho", "Julho", "Agosto", "Setembro",
    "Outubro", "Novembro", "Dezembro"][idx];
  }

  formatDate(day, month, year) {
    day = day.toString().length < 2 ? '0' + day : day;
    month += 1;
    month = month.toString().length < 2 ? '0' + month : month;
    return `${day}.${month}.${year}`;
  }

  setDate(day, month, year, e) {
    if (e) e.preventDefault();
    let date = this.formatDate(day, month, year);
    this.setState({ cursor: date });
  }
  setDay(day, e) {
    this.setDate(day, this.state.month, this.state.year, e);
  }
  resetDate(e) {
    e.preventDefault();
    this.setState({ year: this.props.year, month: this.props.month - 1, day: this.props.day });
    this.setDate(this.props.day, this.props.month - 1, this.props.year);
  }
  prevMonth(e) {
    e.preventDefault();
    let m = this.state.month - 1 === -1 ? 11 : this.state.month - 1;
    let y = m === 11 ? this.state.year - 1 : this.state.year;
    this.setState({ year: y, month: m });
  }
  nextMonth(e) {
    e.preventDefault();
    let m = this.state.month + 1 === 12 ? 0 : this.state.month + 1;
    let y = m === 0 ? this.state.year + 1 : this.state.year;
    this.setState({ year: y, month: m });
  }

  saveEvents() {
    localStorage.setItem("events", JSON.stringify(this.state.events));
  }
  loadEvents() {
    let events = localStorage.getItem("events");
    if (events) this.setState({ events: JSON.parse(events) });
  }
  getEvents(key) {
    if (this.state.events[key]) {
      return this.state.events[key];
    }
    return [];
  }
  updateEvent(e) {this.setState({ event: e });}
  addEvent(e) {
    if (e) e.preventDefault();
    let event = this.state.event.trim();
    if (!event) return;
    let events = this.state.events;
    let date = this.state.cursor;
    if (!events[date]) events[date] = [];
    events[date].push(event);
    this.setState({ event: "", events: events });
    this.saveEvents();
  }
  removeEvents(date) {
    let events = this.state.events;
    delete events[date];
    this.setState({ events: events });
  }
  removeEvent(date, idx) {
    if (this.state.events[date]) {
      let events = this.state.events;
      events[date].splice(idx, 1);
      if (!events[date].length) {
        this.removeEvents(date);
      } else {
        this.setState({ events: events });
      }
    }
  }

  render() {
    let date = new Date(this.state.year, this.state.month, 1);
    let weekDay = date.getDay() !== 0 ? date.getDay() : 7;

    date.setMonth(date.getMonth() + 1);
    date.setDate(1);
    date.setDate(date.getDate() - 1);
    let lastDay = date.getDate();

    let calendar = [];
    let start = weekDay - 1,end = weekDay + lastDay - 1;
    for (let i = 0; i < 42; ++i) {
      if (i >= start && i < end) {
        calendar[i] = i - weekDay + 2;
      } else {
        calendar[i] = '';
      }
    }

    let dayNames = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((item, i) => {
      return /*#__PURE__*/React.createElement("div", { className: "day" }, item);
    });
    let cursorDate = this.state.cursor.split('.');

    let days = calendar.map((item, i) => {
      if (item) {
        let date = this.formatDate(item, this.state.month, this.state.year);

        let thisMonth = this.state.month == cursorDate[1] - 1 &&
        this.state.year == cursorDate[2];

        let selected = item == cursorDate[0] && thisMonth;

        let hasEvents = thisMonth &&
        Array.isArray(this.state.events[date]) &&
        this.state.events[date].length;
        let events = hasEvents ? this.state.events[date] : [];

        let hasMatches = false;
        if (hasEvents && this.state.search) {
          for (let i = 0; i < events.length; ++i) {
            if (events[i].includes(this.state.search)) {
              hasMatches = true;break;
            }
          }
        }
        return /*#__PURE__*/(
          React.createElement(Day, { key: i, day: item, selected: selected,
            hasEvents: hasEvents, hasMatches: hasMatches,
            setDay: this.setDay }));


      } else {
        return /*#__PURE__*/React.createElement(Day, { key: i, day: -1 });
      }
    });
    let events = this.getEvents(this.state.cursor).map((item, i) => {
      return /*#__PURE__*/(
        React.createElement("li", { key: i }, item, /*#__PURE__*/
        React.createElement("a", { href: "#", onClick: () => this.removeEvent(this.state.cursor, i) }, "\u2013")));


    });

    return /*#__PURE__*/(
      React.createElement(React.Fragment, null, /*#__PURE__*/
      React.createElement("h1", null, "Calendário"), /*#__PURE__*/


      



      React.createElement("div", { className: "calendar" }, /*#__PURE__*/

      React.createElement("div", { className: "month" }, /*#__PURE__*/
      React.createElement("span", { className: "month-active" }, /*#__PURE__*/
      React.createElement("b", null, this.getMonthName(this.state.month)), " " + this.state.year), /*#__PURE__*/

      React.createElement("span", { className: "month-selector" }, /*#__PURE__*/
      React.createElement("a", { className: "prev", href: "#", onClick: this.prevMonth }, "\u27F5"), /*#__PURE__*/
      React.createElement("a", { className: "reset", href: "#", onClick: this.resetDate }, "\u25CB"), /*#__PURE__*/
      React.createElement("a", { className: "next", href: "#", onClick: this.nextMonth }, "\u27F6"))), /*#__PURE__*/



      React.createElement("div", { className: "weekdays" }, dayNames), /*#__PURE__*/
      React.createElement("div", { className: "days" }, days)), /*#__PURE__*/



      React.createElement("div", { className: "events" }, /*#__PURE__*/
      React.createElement("h2", { className: "date-active" }, this.state.cursor),
      events.length > 0 && /*#__PURE__*/React.createElement("ul", null, events)), /*#__PURE__*/



      React.createElement("div", { className: "event-add" }, /*#__PURE__*/
      React.createElement("h2", null, "Add Evento"), /*#__PURE__*/
      React.createElement(Form, { value: this.state.event, submit: this.addEvent, update: this.updateEvent }))));



  }}


let now = new Date();
ReactDOM.render( /*#__PURE__*/
React.createElement(Calendar, { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() }),
app);