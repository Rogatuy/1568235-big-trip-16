import SmartView from './smart-view.js';
import {TYPE_OF_POINT} from '../const';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {countEventsMoney} from '../utils/event.js';
import {countEventsQuantityByType} from '../utils/event.js';
import {countEventsTimeByType} from '../utils/event.js';
import {generateMinutesInAllTime} from '../utils/event.js';

const renderMoneyChart = (moneyCtx, events) => {
  const eventsMoneyCounts = TYPE_OF_POINT.map((type) => countEventsMoney(events, type));
  const sortedEventsMoneyCounts = eventsMoneyCounts.sort(({totalMoney: moneyA}, {totalMoney: moneyB}) => moneyB - moneyA);

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: sortedEventsMoneyCounts.map(({eventType}) => eventType.toUpperCase()),
      datasets: [{
        data: sortedEventsMoneyCounts.map(({totalMoney}) => totalMoney),
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
        barThickness: 44,
        minBarLength: 50,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `€ ${val}`,
        },
      },
      title: {
        display: true,
        text: 'MONEY',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderTypeChart = (typeCtx, events) => {
  const tripEventsQuantityCounts = TYPE_OF_POINT.map((type) => countEventsQuantityByType(events, type));
  const sortedEventsQuantityCounts = tripEventsQuantityCounts.sort(({totalQuantity: quantityA}, {totalQuantity: quantityB}) => quantityB - quantityA);

  return new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: sortedEventsQuantityCounts.map(({eventType}) => eventType.toUpperCase()),
      datasets: [{
        data: sortedEventsQuantityCounts.map(({totalQuantity}) => totalQuantity),
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
        barThickness: 44,
        minBarLength: 50,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${val}x`,
        },
      },
      title: {
        display: true,
        text: 'TYPE',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderTimeChart = (timeCtx, events) => {
  const eventsTimeCounts = TYPE_OF_POINT.map((type) => countEventsTimeByType(events, type));
  const sortedEventsTimeCounts = eventsTimeCounts.sort(({totalTime: timeA}, {totalTime: timeB}) => timeB - timeA);

  return new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: sortedEventsTimeCounts.map(({eventType}) => eventType.toUpperCase()),
      datasets: [{
        data: sortedEventsTimeCounts.map(({totalTime}) => totalTime),
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
        barThickness: 44,
        minBarLength: 50,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${generateMinutesInAllTime(val)}`,
        },
      },
      title: {
        display: true,
        text: 'TIME',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatisticsTemplate = () => (
  `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>
    <div class="statistics__item">
      <canvas class="statistics__chart" id="money" width="900"></canvas>
    </div>
    <div class="statistics__item">
      <canvas class="statistics__chart" id="type" width="900"></canvas>
    </div>
    <div class="statistics__item">
      <canvas class="statistics__chart" id="time" width="900"></canvas>
    </div>
  </section>`
);

export default class StatisticsView extends SmartView {
  #moneyChart = null;
  #typeChart = null;
  #timeChart = null;

  constructor(events) {
    super();

    this._data = events;

    this.#setCharts();
  }

  get template() {
    return createStatisticsTemplate();
  }

  removeElement = () => {
    super.removeElement();

    if (this.#moneyChart) {
      this.#moneyChart.destroy();
      this.#moneyChart = null;
    }

    if (this.#typeChart) {
      this.#typeChart.destroy();
      this.#typeChart = null;
    }

    if (this.#timeChart) {
      this.#timeChart.destroy();
      this.#timeChart = null;
    }
  }

  restoreHandlers = () => this.#setCharts();

  #setCharts = () => {
    const moneyCtx = this.element.querySelector('#money');
    const typeCtx = this.element.querySelector('#type');
    const timeCtx = this.element.querySelector('#time');

    const BAR_HEIGHT = 55;
    const chartHeight = BAR_HEIGHT * TYPE_OF_POINT.length;
    moneyCtx.height = chartHeight;
    typeCtx.height = chartHeight;
    timeCtx.height = chartHeight;

    this.#moneyChart = renderMoneyChart(moneyCtx, this._data);
    this.#typeChart = renderTypeChart(typeCtx, this._data);
    this.#timeChart = renderTimeChart(timeCtx, this._data);
  }
}
