$(document).ready(function() {

  let firstTime2 = true;
  let firstTime3 = true;

  $("#tree-selection").hide();

  $(window).scroll(function() {
    let position = $(document).scrollTop();
    if (firstTime2 && position >= $("#nutrition-section").offset().top - 80) {
      firstTime2 = false;
      updateChart([130, 2, 6, 11, 6], "rgba(230, 114, 43, 0.2)", "rgba(230, 114, 43)");

    } else if (firstTime3 && position >= $("#treestats-section").offset().top - 80) {
      firstTime3 = false;
      $("#tree-selection").fadeIn(400);
      $("#graph1").fadeIn(800);
    }
  });

  const chart = new Chart($("#barchart"), {
    type: "bar",

    // start up
    data: {
      labels: ["Vitamin C","Vitamin A","Calcium","Dietary Fiber","Carbohydrates"],
      datasets: [{
        label: null,
        data: [0,0,0,0,0],
        fill: false,
        backgroundColor: "rgba(230, 114, 43, 0.2)",  // default to navel
        borderColor: "rgba(230, 114, 43)",
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

  $("#landing-scroll-section .scroll-btn").click(function() {
    $("body, html").animate({
      scrollTop: $("#nutrition-section").offset().top,
      duration: 600
    });
    if (firstTime2) {
      firstTime2 = false;
      setTimeout(function() {
        updateChart([130, 2, 6, 11, 6], "rgba(230, 114, 43, 0.2)", "rgba(230, 114, 43)");
      }, 600)
    }
  });

  $("#nutrition-scroll-section .scroll-btn").click(function() {
    $("body, html").animate({
      scrollTop: $("#treestats-section").offset().top,
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

  const updateSelected = function(type, elem) {
    type.removeClass("selected");
    elem.addClass("selected");
  }

  const updateChart = function(data, bgColor, brdColor) {
    chart.data.datasets.forEach(function(dataset) {
      dataset.data = data;
      dataset.backgroundColor = bgColor;
      dataset.borderColor = brdColor;
    })
    chart.update();
  }

  $("#navel-btn").click(function() {
    updateSelected($(".radio-btn"), $(this));
    updateChart([130, 2, 6, 11, 6], "rgba(230, 114, 43, 0.2)", "rgba(230, 114, 43)");
  });

  $("#cara-cara-btn").click(function() {
    updateSelected($(".radio-btn"), $(this));
    updateChart([150, 30, 2, 25, 7], "rgba(240, 72, 60, 0.2)", "rgba(240, 72, 60)")
  });

  $("#blood-orange-btn").click(function() {
    updateSelected($(".radio-btn"), $(this));
    updateChart([110, 8, 4, 11, 5], "rgba(180, 21, 70, 0.2)", "rgba(160, 21, 70)")
  });

  $(".tree-btn").click(function() {
    updateSelected($(".tree-btn"), $(this))
    const toShowID = "#graph" + $(this).attr("id").slice(-1);
    $("#graph-img-section img").fadeOut();
    $(toShowID).fadeIn();
  });
})
