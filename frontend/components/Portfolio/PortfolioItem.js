import { useState } from 'react';
import { ExpansionPanel, ExpansionPanelDetails, Paper} from '@material-ui/core';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import TradeStockForm from './TradeStockForm';

const ColorBox = styled(Paper)`
  background-color: ${({ theme }) => `${theme.turquoise}`};
  color: white;
  min-height: 5rem;
  padding: 1rem 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const StyledDiv = styled.div`
  display: flex;
`;

const StyledTypography = styled(Typography)`
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
`;

const StyledPaper = styled(Paper)`
  margin: ${({ theme }) => `${theme.mui.spacing(2)}px`} 0;
`;

const ExpansionPanelSummary = withStyles({
    root: {
      backgroundColor: 'rgba(0, 0, 0, .03)',
      borderBottom: '1px solid rgba(0, 0, 0, .125)',
      marginBottom: -1,
      minHeight: 56,
      '&$expanded': {
        minHeight: 56,
      },
    },
    content: {
      '&$expanded': {
        margin: '12px 0',
      },
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    expanded: {},
  })(MuiExpansionPanelSummary);

const PortfolioItem = (props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { primary, secondary } = props;

  const handleChange =  e => {
    e.preventDefault();
    setIsExpanded(!isExpanded);
  }; 

  return (
    <StyledPaper>
      <ExpansionPanel expanded={isExpanded}>
          <ExpansionPanelSummary
          // expandIcon={<ExpandMoreIcon onClick={handleChange}/>}
          aria-controls="panel1a-content"
          id="panel1a-header"
          >
              <Typography >Expansion Panel 1 </Typography>
              <StyledDiv>
                <TradeStockForm/>
                <IconButton  onClick={handleChange}>
                 {isExpanded? (<ExpandLessIcon/>):(<ExpandMoreIcon/>)}
                </IconButton>
              </StyledDiv>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
              <ColorBox>                  
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                sit amet blandit leo lobortis eget.
              </ColorBox>
          </ExpansionPanelDetails>
      </ExpansionPanel>
    </StyledPaper>
  );
};



export default PortfolioItem;
