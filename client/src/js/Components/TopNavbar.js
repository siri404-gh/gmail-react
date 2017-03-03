var React = require('react');
var config = require('../config');

module.exports = React.createClass({
    getInitialState: function() {
        return {
           loginText: 'Sign In',
           logged: false
        };
    },
    gmailLogin: function() {
        if(this.state.logged) {
            localStorage.clear();
            this.setState({
               loginText: 'Sign In',
               logged: false
            });
            this.props.labelFunc([]);
            this.props.messageFunc([]);
            return;
        }
        var acToken, tokenType, expiresIn;
        var _url        =   config.OAUTHURL + 'scope=' + config.SCOPE + '&client_id=' + config.CLIENTID + '&redirect_uri=' + config.REDIRECT + '&response_type=' + config.TYPE;
        var win         =   window.open(_url, "windowname1", 'width=300, height=600');
        var pollTimer   =   window.setInterval(function() {
            try {
                if (win.document.URL.indexOf(config.REDIRECT) != -1) {
                    window.clearInterval(pollTimer);
                    var url =   win.document.URL;
                    acToken =   gup(url, 'access_token');
                    tokenType = gup(url, 'token_type');
                    expiresIn = gup(url, 'expires_in');
                    localStorage.setItem('gToken', acToken);
                    localStorage.setItem('gTokenType', tokenType);
                    localStorage.setItem('gExprireIn', expiresIn);
                    function gup(url, name) {
                        name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
                        var regexS = "[\\#&]"+name+"=([^&#]*)";
                        var regex = new RegExp( regexS );
                        var results = regex.exec( url );
                        if( results == null )  return "";
                        else {
                            return results[1];
                        }
                    }
                    win.close();
                }
            }
            catch(e) {
              console.log(e);
            }
        }, 500);
        this.allLabels();
    },
    allLabels: function() {
        var accessToken = localStorage.getItem('gToken');
        var userId = localStorage.getItem('emailId');
        var self = this;
        $.ajax({
            url: 'https://www.googleapis.com/gmail/v1/users/me/profile?key='+config.key,
            type: 'GET',
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", "Bearer "+accessToken);
            },
            success: function(data) {
                userId = data.emailAddress;
                localStorage.setItem('emailId', userId);
                $.ajax({
                    url: 'https://www.googleapis.com/gmail/v1/users/'+userId+'/labels?key='+config.key,
                    dataType: 'json',
                    type: 'GET',
                    beforeSend: function (request) {
                        request.setRequestHeader("Authorization", "Bearer "+accessToken);
                    },
                    success: function(data) {
                        self.setState({
                            loginText: 'Sign Out',
                            logged: true
                        });
                        self.props.labelFunc(data.labels);
                    },
                    error: function(xhr, status, err) {
                        console.error(err.toString());
                    }
                });
            }
        });
    },
    render: function() {
        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <a className="navbar-brand" href="/"><img className='logo-img' src='images/logo.png'/> </a>
                    </div>
                    <button id="authorize-button" onClick={this.gmailLogin} className="btn btn-danger pull-right m-t-5">{this.state.loginText}</button>
              </div>
            </nav>
        );
    }
})
