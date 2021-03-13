import '../App.css';
import CompanyUpdates from "../components/social/CompanyUpdates";
import BranchUpdates from "../components/social/BranchUpdates";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    updatesSection: {
        width: '80%',
        alignItems: 'center',
        justifyContent: 'space-between',
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center',
        marginLeft: '140px',
        marginTop: '20px'
    }
}));

function Social() {
    const classes = useStyles();

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <div className={classes.updatesSection}>
        <CompanyUpdates>
        </CompanyUpdates>
        <BranchUpdates>
        </BranchUpdates>
       </div>
    </div>
  );
}

export default Social;