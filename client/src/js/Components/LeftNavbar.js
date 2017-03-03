var React = require('react');
var config = require('../config');

module.exports = React.createClass({
    getItems: function(el) {
        var label = el.target.value;
        var messages = [];
        var self = this;
        var accessToken = localStorage.getItem('gToken');
        var email = localStorage.emailId;
        var url = 'https://www.googleapis.com/gmail/v1/users/'+email+'/messages?includeSpamTrash=false&labelIds='+label+'&maxResults='+config.totalMessages+'&fields=messages(id)&key='+config.key;
        $.ajax({
            async: false,
            url: url,
            dataType: 'json',
            type: 'GET',
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", "Bearer "+accessToken);
            },
            success: function(data) {
                data.messages.forEach(function(message) {
                    var url = 'https://www.googleapis.com/gmail/v1/users/'+email+'/messages/'+message.id+'?format=metadata&fields=historyId%2Cid%2CinternalDate%2ClabelIds%2Cpayload%2Craw%2CsizeEstimate%2Csnippet%2CthreadId&key='+config.key
                    $.ajax({
                        async: false,
                        url: url,
                        dataType: 'json',
                        type: 'GET',
                        beforeSend: function (request) {
                            request.setRequestHeader("Authorization", "Bearer "+accessToken);
                        },
                        success: function(data) {
                            console.log('data', data);
                            var snippet = data.snippet;
                            var headers =  data.payload.headers;
                            var from='';
                            var data='';
                            var subject='';
                            var to='';
                            headers.filter(function(header) {
                                if(header.name == 'From') {
                                    from = header.value;
                                }
                                if(label == 'SENT') {

                                }
                                if(header.name == 'To') {
                                    to = header.value;
                                    if(label == 'SENT') {
                                        from = header.value;
                                    }
                                }
                                if(header.name=='Subject') {
                                    subject = header.value;
                                }
                                if(header.name=='Date') {
                                    date = header.value;
                                }
                            });
                            messages.push({
                                from: from,
                                to: to,
                                date: date,
                                subject: subject,
                                snippet: snippet
                            });
                        }
                    });
                });
            }
        });
        self.props.messageFunc(messages);
    },
    render: function() {
    var labels = this.props.labels;
    var rows = [];
    var allowedLabels = ['INBOX','SENT','DRAFT','SPAM'];
    var self = this;
    if(labels.length) {
        rows[0] = (<button className='btn btn-danger btn-block m-b-5' data-toggle="modal" data-target="#composeModal" onClick={this.compose} key={Math.random()}><span className='glyphicon glyphicon-envelope'></span></button>);
    }
    labels.forEach(function(data)  {
        if(allowedLabels.indexOf(data.name) !== -1) {
            var index = allowedLabels.indexOf(data.name);
            rows[index+1] = (<div key={Math.random()}><button className='btn btn-primary btn-block m-b-5' onClick={self.getItems} value={data.name} key={Math.random()}>{data.name}</button></div>);
        }
    });
    return (
      <div>
        {rows}
      </div>
    );
    }
});
