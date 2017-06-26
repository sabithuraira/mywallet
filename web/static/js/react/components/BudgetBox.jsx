import React, { PropTypes } from 'react';
import BudgetTable from './BudgetTable';

export default class BudgetBox extends React.Component {
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
        return ( 
            <div class="col-md-12">
                <div class="box box-info">
                    <div class="mailbox-controls">
                        <div class="btn-group">
                        <button type="button" class="btn btn-default btn-sm"><i class="fa fa-trash-o"></i></button>
                        <button type="button" class="btn btn-default btn-sm"><i class="fa fa-reply"></i></button>
                        <button type="button" class="btn btn-default btn-sm"><i class="fa fa-share"></i></button>
                        </div>
                        <button type="button" class="btn btn-default btn-sm"><i class="fa fa-refresh"></i></button>
                        <a class="btn btn-default btn-sm toggle-event" href="#" data-id="adddata"><i class="fa fa-plus"></i> Add Budget</a>
                        <div class="pull-right">
                        1-50/200
                        <div class="btn-group">
                            <button type="button" class="btn btn-default btn-sm"><i class="fa fa-chevron-left"></i></button>
                            <button type="button" class="btn btn-default btn-sm"><i class="fa fa-chevron-right"></i></button>
                        </div>
                        </div>
                    </div>

                    <div class="table-responsive mailbox-messages">
                        <BudgetTable budget={this.props.budget} detail={this.props.detail} 
                            actions={this.props.actions} />
                    </div>
                </div>
            </div>
        ) 
    }
}

BudgetBox.propTypes= {
    budget: PropTypes.object.isRequired,
    detail: PropTypes.object.isRequired,
    //general: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
};
