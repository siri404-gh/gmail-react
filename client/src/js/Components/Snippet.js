var React = require('react');
var config = require('../config');

module.exports = React.createClass({
    delete: function(el) {
        var val = el.target.value;
        console.log(val);
        this.props.deleteFunc(val);
    },
    send: function() {
        var accessToken = localStorage.getItem('gToken');
        var email = localStorage.getItem('emailId');
        var url = 'https://www.googleapis.com/gmail/v1/users/'+email+'/messages/send?key='+config.key;
        var recepient = this.props.from; // to email address
        var body = this.refs.mailText.value; // body of the email
        var subject = this.props.subject;
        var b64 = btoa("Date: Thu, 1 Jan 1970 12:00:00 -0000\n" +"From: "+email+"\n" +"To: "+recepient+"\n" +"Subject: "+subject+"\n\n" +body).replace(/\+/g, '-').replace(/\//g, '_');
        var data = JSON.stringify({
            raw: b64
        });
        $.ajax({
            type: 'POST',
            url: url,
            data: data,
            contentType: 'application/json',
            dataType: 'json',
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", "Bearer "+accessToken);
            },
            success: function(data) {
                console.log(data);
            },
            error: function(err) {
                console.log(err);
            }
        });
    },
    render: function() {
        console.log('rendering snippet');
        return (
            <div>
                <div id={'reply-modal-'+this.props.index} className="modal fade" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">X</button>
                            <h4 className="modal-title">{this.props.subject}</h4>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label htmlFor="usr">{this.props.from}</label><br/>
                                    <i>{this.props.snippet}</i>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="usr">Reply:</label>
                                    <textarea className="form-control" ref='mailText' rows="5" id="comment"></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                            <button type='button' className='btn btn-default' onClick={this.send}>Send</button>
                            <button type="button" className="btn btn-default"  data-dismiss="modal">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row messageRow'>
                    <div className='col-md-2'>
                        {this.props.from}
                    </div>
                    <div className='col-md-5'>
                        {this.props.subject}
                    </div>
                    <div className='col-md-3'>
                        {this.props.date}
                    </div>
                    <div className='col-md-2'>
                        <button className='btn btn-default m-t-3 m-r-3 pull-right' value={this.props.index} onClick={this.delete} id={'reply-'+this.props.index}><span className='glyphicon glyphicon-remove'></span></button>
                        <button className='btn btn-default m-t-3 m-r-3 pull-right' data-toggle="modal" data-target={'#reply-modal-'+this.props.index}><span className='glyphicon glyphicon-share-alt'></span></button>
                    </div>
                </div>
            </div>
        );
    }
})
