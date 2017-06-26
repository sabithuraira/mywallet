import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import BudgetBox from '../components/BudgetBox';
import * as appActions from '../actions/appActionCreators';

const Budget = ({photoReducer, detailReducer, generalReducer, actions}) => (
  <div>
    <BudgetBox  actions={actions} budget={budgetReducer} 
        detail={detailReducer} />
  </div>
)

App.propTypes = {
    budgetReducer: PropTypes.object.isRequired,
    detailReducer: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    budgetReducer: state.budgetReducer,
    detailReducer: state.detailReducer,
    //generalReducer: state.generalReducer
});


const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(appActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
