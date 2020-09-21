# Markos Assignment

In is branch exists my implementation of a Highcharts chart with two data series displayed as a line and a column chart.

Features implemented include, visualisation of the data deries with the ability to show/hide each one of them at any point
using checkboxes with corresponding names and colors. There is also the ability to add a new pseudo-random value to the chart
30 seconds after the last (for consistency with the rest of the data). The generated value follows a normal distribution skewed
to the left so that the end user can see an immediate change to the graph. The logic is that as the CPU values increase/decrease 
so do the instances after 30s (the next data point). When the instances increase then the CPU load should decrease as the load is
spread over more instances. For styling I used clarity, an angular oriented component/theming librabry. For the design a mockup was
given but it was in a form of an image, so the sizes and spacings may differ slightly from the ones provided.

Future improvements could include a different view when both checkboxes are unchecked and a smoother distribution of the generated data
in order to make it seem more realistic.
