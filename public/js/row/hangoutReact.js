class pictureContent extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
  	var pictures = this.props.data.filter(function(items) {
  		return items.type=='3';
  	});
  	var pictureNodes = pictures.map(function(picture){
  		return (
	        <picture url={picture.url}></picture>
	      );
  	});
    return (
      <span>
        {commentNodes}
      </span>
    );
  }
}

class picture extends React.Component {

  constructor(props) {
    super(props);
  }

  handlePicture(){
  	getPicture(this.props.url);
  }

  render() {
    return (
	<span>
		<a href="#">
			<img class="image img-rounded" src={this.props.url} style="width:20%" onClick={this.handlePicture.bind(this)}>
		</a>
	</span>
    );
  }
}

ReactDOM.render(
  <pictureContent />,
  document.getElementById('pictureContenter')
);
