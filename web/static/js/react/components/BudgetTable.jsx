import React, { PropTypes } from 'react';
import BudgetRow from './BudgetRow';

export default class BudgetTable extends React.Component {
    constructor(props) {
        super(props);
    }

    /*
    detailComponent() {
        if (this.props.general.is_show) {
            return <FullPhotoBox detail={this.props.detail} general={this.props.general} actions={this.props.actions} />;
        } else {
            return null;
        }
    }
    */

    componentDidMount() { 
        /*
        $.getJSON("foto/user", (response) => { 
            this.props.actions.setUser(response);
        });
        */
    }

    render() {
        var budgetItems = this.props.budget.datas.map((data,index) =>
            <BudgetRow key={index} detail={data} />
        );
        
        return ( 
            <table class="table table-bordered table-hover table-striped">
                <thead>
                <tr>
                    <th>
                    <button type="button" class="btn btn-default btn-sm checkbox-toggle"><i class="fa fa-square-o"></i>
                    </button>
                    </th>
                    <th></th>
                    <th>Category</th>
                    <th>Budget</th>
                    <th>Expense</th>
                    <th>Available</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {budgetItems}
                </tbody>
            </table>
        ) 
    }
}

BudgetTable.propTypes= {
    budget: PropTypes.object.isRequired,
    detail: PropTypes.object.isRequired,
    //general: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
};
