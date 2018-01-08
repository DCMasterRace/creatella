import React from 'react';
import Select from 'react-select';

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
			this.state.value = val;
		}
		fetch(`http://localhost:3000/api/products?_sort=${this.state.value}&_page=${this.state.page}&_limit=30`)
		.then(res => res.json())
		.then((res) => {
			console.log(res);
			this.setState({
				isLoaded: true,
				items: res,
				value: this.state.value,
				loading: false
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
			data: null,
			method: "GET",
			success: function(data, textStatus, jqXHR) {
				var data = this.getData(this.state.items.length);
				var newData = this.state.items.concat(data);
				this.setState({data: newData, requestSent: false});
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
		var	val = this.refs.dropValue.value
		this.setState({
			value: this.refs.dropValue.value
		});
		this.getData(val);
	}
	render() {
		const { error, isLoaded, items } = this.state;
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
				</div>
			))}
			</div>
			</div>
		);
	}
}

export default App;

