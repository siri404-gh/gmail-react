var React = require('react');
var Snippet = require('./snippet');

module.exports = React.createClass({
    delete: function(i) {
        var data = this.props.data;
        data.splice(i, 1);
        this.props.messageFunc(data);
    },
    render: function() {
        var data = this.props.data;
        var rows = [];
        var self = this;
        var i = 0;
        data.forEach(function(d) {
            rows.push(<Snippet from={d.from} to={d.to} date={d.date} subject={d.subject} key={i} index={i} snippet={d.snippet} deleteFunc={self.delete}/>);
            i++;
        });
        return (
            <div>
                {rows}
            </div>
        )
    }
});
