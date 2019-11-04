import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import Skeleton from '@material-ui/lab/Skeleton';

const getGraphProps = (xLabels, dataLabel, dataPoints) => ({
  labels: xLabels,
  datasets: [
    {
      label: dataLabel,
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: dataPoints,
    },
  ],
});

const LineGraph = props => {
  const { xLabels, dataLabel, dataPoints, loading } = props;
  if (loading) return <Skeleton variant="rect" height={400} />;
  const graphData = getGraphProps(xLabels, dataLabel, dataPoints);
  return <Line data={graphData} />;
};

LineGraph.defaultProps = {
  loading: false,
};

LineGraph.propTypes = {
  dataLabel: PropTypes.string.isRequired,
  xLabels: PropTypes.array.isRequired,
  dataPoints: PropTypes.array.isRequired,
  loading: PropTypes.bool,
};

export default LineGraph;
