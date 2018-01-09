import React from 'react';
import Select from 'react-select';
import moment from 'moment';

class App extends React.Component {
	constructor(props) {
		super(props),
		this.state = {
			error: null,
			isLoaded: false,
			items: [],
			value: 'id',
			page: 0,
			loading: false
		};
		this.handleScroll = this.handleScroll.bind(this);
		this.getDataOnScroll = this.getDataOnScroll.bind(this);
		this.doQuery = this.doQuery.bind(this);
	}
	componentDidMount(val) {
		window.addEventListener('scroll', this.handleScroll, false);
		this.getData();
	}
	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll, false);
	}
	getData(val) {
		if(val){
		}
		var oldData = this.state.items;
		fetch(`http://localhost:3000/api/products?_sort=${this.state.value}&_page=${this.state.page}&_limit=30`)
		.then(res => res.json())
		.then((res) => {
			var newData = this.state.items.concat(res);
			this.setState({
				isLoaded: true,
				items: newData,
				value: this.state.value,
				loading: false,
				requestSent: false
			})
		}),
		(error) => {
			this.setState({
				isLoaded: true,
				error
			});
		}
	}
	getDataOnScroll() {
		if (this.state.requestSent) {
			return;
		}
		this.setState({
			page: this.state.page + 1
		});

		// enumerate a slow query
		setTimeout(this.doQuery, 2000);

		this.setState({requestSent: true});
	}
	doQuery() {
		// use jQuery
		$.ajax({
			url: "#",
			data: '',
			method: "GET",
			success: function(data, textStatus, jqXHR) {
				var data = this.getData();
			}.bind(this),
			error: function(jqXHR, textStatus, errorThrown) {
				this.setState({requestSent: false});
			}.bind(this)

		});
	}
	handleScroll() {
		var scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
		var scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
		var clientHeight = document.documentElement.clientHeight || window.innerHeight;
		var scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;

		if (scrolledToBottom) {
			this.getDataOnScroll();
		}
	}
	handleChange() {
		this.setState({requestSent: true});
		var	val = this.refs.dropValue.value
		this.setState({
			value: this.refs.dropValue.value,
			items: []
		});
		this.getData(val);
	}
	convertDate(dates) {
		var newDate = moment(dates).fromNow();
		var date1 = newDate.split(" ");
		console.log(newDate);
		if(date1[1] == "days" && date1[0] > 7) {
			newDate = moment(dates).format("DD-MM-YYYY");
		}
		return newDate;
	}
	render() {
		const { error, isLoaded, items } = this.state;
		var keys = 0;
		var aDay = 24*60*60*1000
		console.log({ items });
		return (
			<div className="col-md-12">
				<div className="col-md-12">
					SORT BY: <select ref="dropValue" onChange={(e) => {this.handleChange();} } value={this.state.value}>
						<option value="id">ID</option>
						<option value="size">Size</option>
							<option value="price">Price</option>
					</select>
				</div>
				<div className="col-md-12">
					{items.map(item => (
					<div className="col-md-3 product-items" key={item.id}>
						<div className="prod-face">
							{item.face}
						</div>
						<div className="prod-price">
							Price: ${item.price}
						</div>
						<div className="prod-size">
							Size: {item.size}kb
						</div>
						<div className="prod-size">
							Date: {this.convertDate(item.date)}
						</div>
					</div>
					))}
				</div>
        {(() => {
			// for loading bar
          if (this.state.requestSent) {
            return(
              <div className="data-loading">
				<div id="floatingBarsG">
					<div class="blockG" id="rotateG_01"></div>
					<div class="blockG" id="rotateG_02"></div>
					<div class="blockG" id="rotateG_03"></div>
					<div class="blockG" id="rotateG_04"></div>
					<div class="blockG" id="rotateG_05"></div>
					<div class="blockG" id="rotateG_06"></div>
					<div class="blockG" id="rotateG_07"></div>
					<div class="blockG" id="rotateG_08"></div>
				</div>
              </div>
            );
          } else {
            return(
              <div className="data-loading"></div>
            );
          }
        })()}
			</div>
		);
	}
}

export default App;

