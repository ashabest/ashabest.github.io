$(document).ready(function() {

    /***** Initialization and function definitions *****/

    let firstTimeNutrition = true;
    let firstTimeTreestats = true;

    const NAVEL_DATA = [130, 2, 6, 11, 6];
    const CARA_CARA_DATA = [150, 30, 2, 25, 7];
    const BLOOD_ORANGE_DATA = [110, 8, 4, 11, 5];

    const navelColor = function(alpha) {
        return 'rgba(230, 114, 43, ' + alpha + ')';
    }

    const caraCaraColor = function(alpha) {
        return 'rgba(240, 72, 60, ' + alpha + ')';
    }

    const bloodOrangeColorInner = function(alpha) {
        return 'rgba(180, 21, 70, ' + alpha + ')';
    }

    const bloodOrangeColorOuter = function(alpha) {
        return 'rgba(160, 21, 70, ' + alpha + ')';
    }

    const fontSizeStr = window.getComputedStyle(document.body).getPropertyValue('font-size');
    const fontSize = parseFloat(fontSizeStr);
    Chart.defaults.global.defaultFontSize = fontSize;

    const chart = new Chart($('#barchart'), {
        type: 'bar',

        // start up
        data: {
            labels: ['Vitamin C', 'Vitamin A', 'Calcium', 'Dietary Fiber', 'Carbohydrates'],
            datasets: [{
                label: null,
                data: [0,0,0,0,0],
                fill: false,
                backgroundColor: navelColor(0.2), // default to navel
                borderColor: navelColor(1),
                borderWidth: 1
            }]
        },

        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        max: 160,
                        stepSize: 20
                    },
                    scaleLabel: {
                        display: true,
                        labelString: '% Daily Value',
                        fontSize: fontSize + 2
                    }
                }]
            },
            legend: {
                display: false
            },
            maintainAspectRatio: false
        }
    });

    const updateChart = function(data, bgColor, borderColor) {
        chart.data.datasets.forEach(function(dataset) {
            dataset.data = data;
            dataset.backgroundColor = bgColor;
            dataset.borderColor = borderColor;
        });
        chart.update();
    }

    const updateSelected = function(btnsAll, btn) {
        btnsAll.removeClass('selected');
        btn.addClass('selected');
    }

    const checkScrollAndShowNutrition = function(position, threshold) {
        const initializeFirstTime = firstTimeNutrition && position >= $('#nutrition').offset().top - threshold;
        if (initializeFirstTime) {
            firstTimeNutrition = false;
            updateChart(NAVEL_DATA, navelColor(0.2), navelColor(1)); // default to navel the first time
        }
        return initializeFirstTime;
    }

    const checkScrollAndShowTreestats = function(position, threshold) {
        const initializeFirstTime = firstTimeTreestats && position >= $('#treestats').offset().top - threshold;
        if (initializeFirstTime) {
            firstTimeTreestats = false;
            $('#graph1').fadeIn(800);
            $('#tree-selection').fadeIn(400);
        }
        return initializeFirstTime;
    }

    const checkScrollAndShowOnPageLoad = function(thresholdNutrition, thresholdTreestats) {
        const position = $(document).scrollTop();
        checkScrollAndShowNutrition(position, thresholdNutrition);
        checkScrollAndShowTreestats(position, thresholdTreestats);
    }

    const checkScrollAndShowOnScroll = function(thresholdNutrition, thresholdTreestats) {
        const position = $(document).scrollTop();
        const nutritionShownForFirstTime = checkScrollAndShowNutrition(position, thresholdNutrition);
        if (!nutritionShownForFirstTime) {
            checkScrollAndShowTreestats(position, thresholdTreestats);
        }
    }

    /***** Hide/show elements on page load *****/

    $('#tree-selection').hide();

    // do scroll position check on page load to account for saved position upon page refresh
    checkScrollAndShowOnPageLoad(document.body.clientHeight * 3 / 4, document.body.clientHeight / 2);

    $(window).scroll(function() {
        checkScrollAndShowOnScroll(80, document.body.clientHeight / 3);
    });

    /***** Event handlers *****/

    $('#landing-scroll-section .scroll-btn').click(function() {
        $('body, html').animate({
            scrollTop: $('#nutrition').offset().top,
            duration: 600
        });
        if (firstTimeNutrition) {
            firstTimeNutrition = false;
            setTimeout(function() {
                updateChart(NAVEL_DATA, navelColor(0.2), navelColor(1));
            }, 600)
        }
    });

    $('#nutrition-scroll-section .scroll-btn').click(function() {
        $('body, html').animate({
            scrollTop: $('#treestats').offset().top,
            duration: 600
        });
        if (firstTimeTreestats) {
            firstTimeTreestats = false;
            setTimeout(function() {
                $('#tree-selection').fadeIn(400);
                $('#graph1').fadeIn(800); // default selection
            }, 600)
        }
    });

    $('#navel-btn').click(function() {
        updateSelected($('.radio-btn'), $(this));
        updateChart(NAVEL_DATA, navelColor(0.2), navelColor(1));
    });

    $('#cara-cara-btn').click(function() {
        updateSelected($('.radio-btn'), $(this));
        updateChart(CARA_CARA_DATA, caraCaraColor(0.2), caraCaraColor(1));
    });

    $('#blood-orange-btn').click(function() {
        updateSelected($('.radio-btn'), $(this));
        updateChart(BLOOD_ORANGE_DATA, bloodOrangeColorInner(0.2), bloodOrangeColorOuter(1));
    });

    $('.tree-btn').click(function() {
        updateSelected($('.tree-btn'), $(this))
        const toShowID = '#graph' + $(this).attr('id').slice(-1);
        $('#graph-img-section img').fadeOut();
        $(toShowID).fadeIn();
    });

    /***** Event listeners to detect when using mouse/keyboard, used for button styling on focus *****/

    // keep track of whether shift or tab keys are currently pressed down
    const keysdown = { 'Shift': false, 'Tab': false }

    $('body').keydown(function(evt) {
        // add class using-keyboard
        $('body').addClass('using-keyboard');

        // record pressed key if shift or tab
        if (evt.key in keysdown) {
            keysdown[evt.key] = true;
        }
        // if using tab and reached nutrition section scroll button, simulate scroll button click to reveal
        // elements in treestats section and thus enable focus on tree selection buttons
        // allows users to reach all buttons just with tab
        // however, do not simulate the scroll down behavior if doing shift+tab, which is used to 
        // traverse up the document to focus on previous buttons
        if (keysdown['Tab'] && !keysdown['Shift'] && $(':focus')[0] === $('#nutrition-scroll-section .scroll-btn')[0]) {
            $('#nutrition-scroll-section .scroll-btn').click();
        }
    }).keyup(function(evt) {
        // reset pressed key record on keyup
        if (evt.key in keysdown) {
            keysdown[evt.key] = false;
        }
    });

    $('body').mousedown(function() {
        $('body').removeClass('using-keyboard');
    });
})
