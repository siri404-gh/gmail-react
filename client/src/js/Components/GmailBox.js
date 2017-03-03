var React = require("react");
var LeftNavbar = require('./LeftNavbar');
var TopNavbar = require('./TopNavbar');
var MessageBar = require('./MessageBar');
var ComposeModal = require('./Compose');

module.exports = React.createClass({
  getInitialState: function() {
      return {
          labels: [],
          messages: []
      };
  },
  labelFunc: function(data) {
     this.setState({
         labels: data
     })
  },
  messageFunc: function(data) {
      this.setState({
          messages: data
      });
  },
  render: function(){
    return(
      <div>
        <ComposeModal/>
        <TopNavbar labelFunc={this.labelFunc} messageFunc={this.messageFunc}/>
        <div className='row'>
            <div className='col-md-1 left'>
                <LeftNavbar labels={this.state.labels} messageFunc={this.messageFunc}/>
            </div>
            <div className='col-md-11 right'>
                <div className='container-fluid'>
                    <MessageBar data={this.state.messages} messageFunc={this.messageFunc}/>
                </div>
            </div>
        </div>
      </div>
    );
  }
});
