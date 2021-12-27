import React from 'react';
import Card from './card.jsx';
import styles from './app.module.css';
import Game from './game.jsx';
import CSVToArray from './parsecsv.js';

function shuffle(array) {
	let currentIndex = array.length,  randomIndex;

	// While there remain elements to shuffle...
	while (currentIndex != 0) {

	    // Pick a remaining element...
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex--;
	
	    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}

	return array;
}

class App extends React.Component {
	constructor(props) {
		super(props);
		this.key = -1;
		this.cards = [];

		fetch('/static/wordlist.csv').then(r => r.text()).then(r => {
			r = CSVToArray(r);
			console.log(r)
			r.pop()
			this.cards = [];
			for (let i = 0; i < r.length - 1; i += 2) {
				this.cards.push(this.createCards(r[i][0], r[i][1], r[i+1][0], r[i+1][1]))
			}
			this.cards = shuffle(this.cards);
			this.forceUpdate();
		});
		
		this.cards = shuffle(this.cards);
		window.addEventListener('keydown', (e) => {
			if (e.key == ' ') {
				this.num = this.num + 1 > this.cards.length ? 0 : this.num + 1;
				this.render();
			}
			
		})
		//setTimeout(() => {this.cards.splice(0, 1); this.forceUpdate()}, 1000);
		this.state = {circles: {green: 0, yellow: 0, red: 0}};
		this.gameRef = React.createRef();
		this.points = 0;
	}

	componentDidMount() {
	}

	createCards (a,b,c,d) {
		this.key = this.key + 1;
		return <Card red = {{ first: a, second: b }} grey = {{ first: c, second: d }} onMove = { this.moveHandler }  onPoint = { this.pointHandler } parent = {this} key = { this.key }/>
	}

	moveHandler(direction, percent) {
		if (direction === 'left') {
			this.setState({...this.state, circles: {green: percent, yellow: 0, red: 0}});
		} else if (direction === 'down') {
			this.setState({...this.state, circles: {green: 0, yellow: 0, red: percent}});
		} else if (direction === 'right') {
			this.setState({...this.state, circles: {green: 0, yellow: percent, red: 0}});
		}
	}

	pointHandler(points) {
		setTimeout(() => {
			this.cards.pop();
			if (this.cards.length < 1) {
				this.gameRef.current.gameOver();
			}
		}, 500);
		this.points = points;
		this.forceUpdate();
	}
			
	render () {
		return (
			<div>
				<Game ref = { this.gameRef } points = {
					(() => {
						const x = this.points;
						this.points = 0;
						return x;
					})()
				}/>
				<div className = { styles.leftCircle } style = {{ opacity: this.state ? this.state.circles.green : 0 }}/>
				<div className = { styles.rightCircle } style = {{ opacity: this.state ? this.state.circles.yellow : 0 }}/>
				<div className = { styles.bottomCircle } style = {{ opacity: this.state ? this.state.circles.red : 0 }}/>
				<button className = { styles.goRight }>
					<div className = { styles.goText }>1 point </div>
					<div className = { styles.arrow + ' ' + styles.right}/>
				</button>
				<button className = { styles.goLeft }>
					<div className = { styles.arrow + ' ' + styles.left}/>
					<div className = { styles.goText }>3 points </div>
				</button>
				<button className = { styles.goDown }>
					<div className = { styles.goText }>Mess Up / Skip</div>
					<div className = { styles.arrow + ' ' + styles.down}/>
				</button>
				<div className = { styles.container }>
					{ this.cards }
				</div>
			</div>
		);
	}
}

export default App;