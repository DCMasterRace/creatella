import React from 'react';

class App extends React.Component {
	constructor(props) {
		super(props),
		this.state = {
			error: null,
			isLoaded: false,
			items: []
		};
	}
	componentDidMount() {
		fetch('http://localhost:3000/api/products')
		.then(res => res.json())
		.then((res) => {
			this.setState({
				isLoaded: true,
				items: res
			})
		}),
		(error) => {
			this.setState({
				isLoaded: true,
				error
			});
		}
	}
	render() {
		const { error, isLoaded, items } = this.state;
		return (
			<div className="col-md-5">
			hellow
			<ul>
			{items.map(item => (
				<li key={item.id}>
				{item.name} {item.price}
				</li>
			))}
			</ul>
			</div>
		);
	}
}

export default App;

