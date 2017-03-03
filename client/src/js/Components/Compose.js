var React = require('react');
var config = require('../config');

module.exports = React.createClass({
    send: function() {
        var accessToken = localStorage.getItem('gToken');
        var email = localStorage.getItem('emailId');
        var url = 'https://www.googleapis.com/gmail/v1/users/'+email+'/messages/send?key='+config.key;
        var recepient = this.refs.email.value; // to email address
        var body = this.refs.mailText.value; // body of the email
        var subject = this.refs.subject.value;
        var b64 = btoa("Date: Thu, 1 Jan 1970 12:00:00 -0000\n" +"From: "+email+"\n" +"To: "+recepient+"\n" +"Subject: "+subject+"\n\n" +body).replace(/\+/g, '-').replace(/\//g, '_');
        var data = JSON.stringify({
            raw: b64
        });
        console.log('data='+data);
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
        return (
            <div id="composeModal" className="modal fade" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal">X</button>
                        <h4 className="modal-title">Compose Mail</h4>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="usr">To:</label>
                                <input type="email" ref='email' className="form-control" id="usr"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="usr">Subject:</label>
                                <input type="text" ref='subject' className="form-control" id="usr"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="usr">Body:</label>
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
        );
    }
});
