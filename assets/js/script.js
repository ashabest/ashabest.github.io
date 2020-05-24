$(document).ready(function() {

  const NAVEL_DATA = [130, 2, 6, 11, 6];
  const CARA_CARA_DATA = [150, 30, 2, 25, 7];
  const BLOOD_ORANGE_DATA = [110, 8, 4, 11, 5];

  const navelColor = function(alpha) {
    return "rgba(230, 114, 43, " + alpha + ")";
  }

  const caraCaraColor = function(alpha) {
    return "rgba(240, 72, 60, " + alpha + ")";
  }

  const bloodOrangeColorInner = function(alpha) {
    return "rgba(180, 21, 70, " + alpha + ")";
  }

  const bloodOrangeColorOuter = function(alpha) {
    return "rgba(160, 21, 70, " + alpha + ")";
  }

  const chart = new Chart($("#barchart"), {
    type: "bar",

    // start up
    data: {
      labels: ["Vitamin C", "Vitamin A", "Calcium", "Dietary Fiber", "Carbohydrates"],
      datasets: [{
        label: null,
        data: [0,0,0,0,0],
        fill: false,
        backgroundColor: navelColor(0.2), // default to navel
        borderColor: navelColor(1),
        borderWidth: 1
      }
    ]},

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
            labelString: "% Daily Value",
            fontSize: 14
          }
        }
      ]},
      legend: {
          display: false
      },
    }
  });

  const updateChart = function(data, bgColor, borderColor) {
    chart.data.datasets.forEach(function(dataset) {
      dataset.data = data;
      dataset.backgroundColor = bgColor;
      dataset.borderColor = borderColor;
    })
    chart.update();
  }

  const updateSelected = function(type, elem) {
    type.removeClass("selected");
    elem.addClass("selected");
  }

  /*************************/

  let firstTime2 = true;
  let firstTime3 = true;

  $("#tree-selection").hide();

  $(window).scroll(function() {
    let position = $(document).scrollTop();
    if (firstTime2 && position >= $("#nutrition").offset().top - 80) {
      firstTime2 = false;
      updateChart(NAVEL_DATA, navelColor(0.2), navelColor(1));

    } else if (firstTime3 && position >= $("#treestats").offset().top - 80) {
      firstTime3 = false;
      $("#tree-selection").fadeIn(400);
      $("#graph1").fadeIn(800);
    }
  });

  $("#landing-scroll-section .scroll-btn").click(function() {
    $("body, html").animate({
      scrollTop: $("#nutrition").offset().top,
      duration: 600
    });
    if (firstTime2) {
      firstTime2 = false;
      setTimeout(function() {
        updateChart(NAVEL_DATA, navelColor(0.2), navelColor(1));
      }, 600)
    }
  });

  $("#nutrition-scroll-section .scroll-btn").click(function() {
    $("body, html").animate({
      scrollTop: $("#treestats").offset().top,
      duration: 600
    });
    if (firstTime3) {
      firstTime3 = false;
      setTimeout(function() {
        $("#tree-selection").fadeIn(400);
        $("#graph1").fadeIn(800); // default selection
      }, 600)
    }
  });

  $("#navel-btn").click(function() {
    updateSelected($(".radio-btn"), $(this));
    updateChart(NAVEL_DATA, navelColor(0.2), navelColor(1));
  });

  $("#cara-cara-btn").click(function() {
    updateSelected($(".radio-btn"), $(this));
    updateChart(CARA_CARA_DATA, caraCaraColor(0.2), caraCaraColor(1));
  });

  $("#blood-orange-btn").click(function() {
    updateSelected($(".radio-btn"), $(this));
    updateChart(BLOOD_ORANGE_DATA, bloodOrangeColorInner(0.2), bloodOrangeColorOuter(1));
  });

  $(".tree-btn").click(function() {
    updateSelected($(".tree-btn"), $(this))
    const toShowID = "#graph" + $(this).attr("id").slice(-1);
    $("#graph-img-section img").fadeOut();
    $(toShowID).fadeIn();
  });
})
