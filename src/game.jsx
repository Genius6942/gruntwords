import React from 'react';
import styles from './game.module.css';

class Timer extends React.Component {
	constructor(props) {
		super(props);
		this.start.bind(this);
		this.state = {
			time: {
				minutes: 0,
				seconds: 0,
				milliseconds: 0
			}
		}
		this.onDone = typeof this.props.onDone === 'function' ? this.props.onDone : function(){}.bind(this);
	}

	start(time = 60 * 1000) {
		this.state = {
			time: {
				minutes: 0,
				seconds: 0,
				milliseconds: 0
			},

			duration: time,

			startTime: Date.now()
		};
		this.duration = time;
		this.timer = window.setInterval(() => this.tick(), 10);
	}

	tick() {
		const diff = Date.now() - this.state.startTime;
		let remaining = this.state.duration - diff;
	    if (remaining < 0) {
		    remaining = 0;
	    }
	    this.setState({
		    time: this.msToTime(remaining),
			duration: this.state.duration || this.duration || 60 * 1000,
			startTime: this.state.startTime || Date.now()
	    });
	    if (remaining === 0) {
		    window.clearTimeout(this.timer);
		    this.timer = null;
			this.onDone();
	    }
	}
	
	componentDidMount() {}

	msToTime(duration) {
	    let milliseconds = parseInt((duration % 1000));
	    let seconds = Math.floor((duration / 1000) % 60);
	    let minutes = Math.floor((duration / (1000 * 60)) % 60);
	    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
	
	    hours = hours.toString().padStart(2, '0');
	    minutes = minutes.toString().padStart(2, '0');
	    seconds = seconds.toString().padStart(2, '0');
	    milliseconds = milliseconds.toString().padStart(3, '0');
	
	    return {
		    hours,
		    minutes,
		    seconds,
		    milliseconds
	    };
	}

	render() {
		return (
			<>
				{
			        this.state.time.minutes
				}: {
			        this.state.time.seconds
			    }. {
			        this.state.time.milliseconds
				}
			</>
		)
	}
}

class Team extends React.Component {
	constructor(props) {
		super(props);
		this.name = this.props.name || 'Team 1';
		this.points = 0;
		this.active = props.active || false;
	}

	point(points) {
		this.points += points;
		this.forceUpdate();
	}

	render() {
		const activeClassName = this.props.acitve ? ' ' + styles.active : '';
		return (
			<div className = { styles.team + activeClassName }>
				{ this.name + ': ' + this.points.toString() }
			</div>
		);
	}
}

class StartScreen extends React.Component {
	constructor(props) {
		super(props);
		this.inputRef = React.createRef();
		this.startFunc = typeof this.props.onGo === 'function' ? this.props.onGo : () => {};
		this.state = {
			hidden: false
		};
		this.firstTime = true;
	}

	show(teamNum) {
		this.setState({
			hidden: false,
			teamNum: teamNum || 1,
		});
	}

	hide() {
		this.setState({
			hidden: true
		});

		this.firstTime = false;
	}
	
	render() {
		const hiddenClassName = this.state.hidden ? ' ' + styles.hidden : '';
		return (
			<div className = { styles.startContainer + hiddenClassName }>
				<div className = { styles.start }>
					<div className = { styles.header }>
						Poetry For <span style = {{fontSize: 40, color: 'red'}}>Neanderthals</span>
					</div>
					<div className = { styles.contentOuter }>
						<div className = { styles.teams }>
							<div className = { styles.teamsHeader }>
								Teams
							</div>
							<div className = { styles.teamsOuter } style = {{ display: this.firstTime ? 'block' : 'none' }}>
								<button
									onClick = {() => {
										if (this.inputRef.current) {
											this.inputRef.current.value = (Math.max(parseInt(this.inputRef.current.value) - 1, 1)).toString()
										}
									}}
								>-</button>
								<input
									type = 'number'
									max = { '4' }
									min = { '2' }
									defaultValue = { '2' }
									maxLength = { '1' }
									ref = { this.inputRef }
									onInput = {(e) => {
										if (!e.target.onchange) {
											e.target.onchange = () => {
												if (e.target.value.toString().length < 1) {
													e.target.value = '2';
												} else if (parseInt(e.target.value) < 1) {
													e.target.value = '1';
												}
											}
										}
									}}
								/>
								<button
									onClick = {() => {
										if (this.inputRef.current) {
											this.inputRef.current.value = (parseInt(this.inputRef.current.value) + 1).toString()
										}
									}}
								>+</button>
							</div><br/>
							<div>Next Up: Team { this.state.teamNum || 1 }</div>
						</div>
						<div className = { styles.goOuter }>
							<button
								className = { styles.go }
								onClick = { () => this.startFunc(parseInt(this.inputRef.current.value)) }
							>
								<img src = { '/static/club.png' }/>
								<br/>
								GO!
							</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.timerRef = React.createRef();
		this.timer = <Timer onDone = { () => {
			this.teamNum += 1;
			this.teamNum = this.teamNum >= this.teams.length ? 0 : this.teamNum;
			this.startScreenRef.current.show(this.teamNum + 1);
		} } ref ={ this.timerRef }/>;
		this.numberOfTeams = this.props.teams || 2;
		this.teamNum = 0;
		this.initTeams();
		this.startScreenRef = React.createRef();
		this.roundDuration = 60;
		this.startScreen = <StartScreen onGo = { this.start.bind(this) } ref = { this.startScreenRef }/>;
	}

	initTeams() {
		this.teamRefs = [...Array(this.numberOfTeams).fill()].map(x => React.createRef());
		this.teams = Object.keys([...Array(this.numberOfTeams).fill(0)]).map(x => parseInt(x)).map(x => {
			return (
				<Team
					name = { 'Team ' + (x + 1).toString()}
					ref = { this.teamRefs[x] }
					key = { x }
					active = {
						(() => {
							return x === this.teamNum ? true : false;
						})
					}
				/>
			)
		});
	}

	onPoint(points) {
		this.teamRefs[this.teamNum].current.point(points)
	}

	UNSAFE_componentWillReceiveProps(props) {
		if (props.points !== 0) this.onPoint(props.points);
	}

	start(numberOfTeams, firstTime = false) {
		this.numberOfTeams = numberOfTeams;
		this.initTeams();
		this.forceUpdate();
		this.timerRef.current.start(this.roundDuration * 1000);
		this.startScreenRef.current.hide();
	}

	gameOver() {
		alert('Game Over!')
	}

	render() {
		return (
			<div className = { styles.game }>
				<div className = { styles.teams }>
					{ this.teams }
				</div>
				<div className = { styles.timer }>
					{ this.timer }
				</div>
				<br/>
				<br/>
				<div className = { styles.how }>
					<span style = {{ whiteSpace: 'pre' }}>
						How to play:&#9;&#9;Simply drag the card when your team scores points (or loses points):
					</span>
					<ul>
						<li>
							3 points: left
						</li>
						<li>
							1 point: right
						</li>
						<li>
							Mess up (-1 point): down
						</li>
					</ul>
				</div>
				{ this.startScreen }
			</div>
		);
	}
}

export default Game;