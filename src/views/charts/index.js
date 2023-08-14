import Chart from "chart.js/auto";

export const lineGraph = (dom, x, y, title) => {

    const data = {
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

    const config = {
        type: 'line',
        data: data,
        options: options
    };

    const LINE = new Chart(document.getElementById(dom), config)
}

export const barGraph = () => {
    const labels = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
    ];

    const data = {
        labels: labels,
        datasets: [{
            label: 'My First dataset',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [0, 10, 5, 2, 20, 30, 45],
        }]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {}
    };

    const BAR = new Chart(document.getElementById('categorias'), config)
}

const getColors = (opacity) => {
    // definiendo colores para poder ponerle a la gráfica
    const colors = ['#b4b0af'];
    return colors.map(color => opacity ? `${color + opacity}` : color)
}
