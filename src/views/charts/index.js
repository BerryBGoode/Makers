import Chart from "chart.js/auto";

let line, bar, dough, pie, lineal;

/**
 * Método que define la gráfica de tipo lineal, este método define objetos para la configuración 
 * de la gráfica
 * @param {*} dom elemento html (canvas (id)) donde cargará la gráfica
 * @param {*} x elementos en el eje x 
 * @param {*} y elemento en el eje y, (principal razón de estudio)
 * @param {*} title titulo de la gráfica
 */
export const lineGraph = (dom, x, y, title) => {
    let data = {
        labels: x,
        datasets: [{
            label: title,
            fill: true,
            backgroundColor: getColors(35),
            borderColor: getColors(),
            data: y,
        }]
    };

    let options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
            },
            x: {
                grid: {
                    display: false
                }

            }
        },
        plugins: {
            legend: { position: 'top' }
        }
    }

    let config = {
        type: 'line',
        data: data,
        options: options
    };
    if (document.getElementById(dom).$chartjs) {
        line.destroy();
    }
    line = new Chart(document.getElementById(dom), config)
}

export const linealGraph = (dom, x, y, title) => {
    let data = {
        labels: x,
        datasets: [{
            label: title,
            fill: true,
            backgroundColor: getColors(35),
            borderColor: getColors(),
            data: y,
        }]
    };

    let options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
            },
            x: {
                grid: {
                    display: false
                }

            }
        },
        plugins: {
            legend: { position: 'top' }
        }
    }

    let config = {
        type: 'line',
        data: data,
        options: options
    };
    if (document.getElementById(dom).$chartjs) {
        lineal.destroy();
    }
    lineal = new Chart(document.getElementById(dom), config)
}

export const pieGraph = (dom, title, names, studio, values) => {
    let data = {
        labels: names,
        datasets: [{
            label: studio,
            data: values,
            backgroundColor: getColors(35),
            borderColor: getColors(),
            borderWidth: 1
        }]
    }

    let options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: title
            }
        }
    }

    let config = {
        type: 'pie',
        data: data,
        options: options
    }

    if (document.getElementById(dom).$chartjs) {
        pie.destroy();
    }
    pie = new Chart(document.getElementById(dom), config)
}


export const barGraph = (dom, title, x, y) => {


    let data = {
        labels: x,
        datasets: [{
            label: title,
            backgroundColor: getColors(35),
            borderColor: getColors(),
            data: y,
            borderWidth: 1
        }]
    };

    let config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                },
                x: {
                    grid: {
                        display: false
                    }

                }
            },
            plugins: {
                legend: { position: 'top' }
            }
        }
    };
    if (document.getElementById(dom).$chartjs) {
        bar.destroy();
    }
    bar = new Chart(document.getElementById(dom), config)
}

export const doughnutGraph = (dom, title, studio, names, values) => {

    let data = {
        labels: names,
        datasets: [{
            label: studio,
            data: values,
            backgroundColor: getColors(35),
            borderColor: getColors(),
            borderWidth: 1
        }]
    }

    let options = {
        responsive: true,
        plugins: {

            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: title
            }
        }
    }
    let config = {
        type: 'doughnut',
        data: data,
        options: options
    }

    if (document.getElementById(dom).$chartjs) {
        dough.destroy();
    }
    dough = new Chart(document.getElementById(dom), config)
}

const getColors = (opacity) => {
    // definiendo colores para poder ponerle a la gráfica
    const colors = ['#b4b0af'];
    return colors.map(color => opacity ? `${color + opacity}` : color)
}