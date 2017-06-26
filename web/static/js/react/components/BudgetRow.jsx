import React, { PropTypes } from 'react';

export default class BudgetRow extends React.Component {
    constructor(props) {
        super(props);
        //this.handleClick = this.handleClick.bind(this);
        //this.sukaClick = this.sukaClick.bind(this);
    }

    /*
    handleClick(event) {
        this.props.actions.showDetail(true);
        this.props.actions.setDetail(this.props.data);
    }

    sukaClick(event) {
        var csrf = document.querySelector("meta[name=csrf]").content;
         $.ajax({
            url: "suka/",
            dataType: 'json',
            type: 'POST',
            headers: {
                "X-CSRF-TOKEN": csrf 
            },
            data: {
                is_suka: 1,
                foto_id: this.props.data.id,
                user_id: this.props.general.login_id,
            },
            success: function(data) {
                this.props.actions.setSuka(this.props.data.id, data);
            }.bind(this),
            error: function(xhr, status, err) {
                alert('Ooops, terjadi kesalahan.. silahkan ulangi lagi!');
                console.log(xhr.responseText)
            }.bind(this)
        });
    }
    */

    render() {
        return ( 
            <tr data-toggle="collapse" data-target="#<%= n %>" class="accordion-toggle">
                <td><input type="checkbox" /></td>
                <td>{this.props.detail.bulan} {this.props.detail.tahun}</td>
                <td>{this.props.detail.title}</td>
                <td>{this.props.detail.budget}</td>
                <td>{this.props.detail.expense}</td>
                <td>
                <span class="description-percentage text-green"><i class="fa fa-caret-up"></i> {this.props.detail.availabel}</span>
                <span class="description-percentage text-red"><i class="fa fa-caret-down"></i> {this.props.detail.availabel}</span>
                </td>
                <td>
                <a class="btn btn-default btn-sm toggle-event" href="#" data-id="addtransaction"><i class="fa fa-plus-square-o"></i> Add Transaction</a>
                <a class="btn btn-default btn-sm toggle-event" href="#" data-id="detail"><i class="fa fa-search"></i> Detail</a>
                </td>
            </tr>
        ) 
    }
}

PhotoBox.propTypes= {
    detail: PropTypes.object.isRequired,
    //general: PropTypes.object.isRequired,
    //actions: PropTypes.object.isRequired,
};