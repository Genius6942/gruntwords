import React from 'react';
import styles from './card.module.css';

class Card extends React.Component {
	constructor(props) {
		super(props);
		this.flip = this.flip.bind(this);
		
		this.state = {
			flipped: false
		}
		this.red = this.props.red || {};
		this.grey = this.props.grey || {};
		this.onMove = this.props.onMove.bind(this.props.parent);
		this.onPoint = this.props.onPoint.bind(this.props.parent);
	}
	
	flip() {
		const currentState = this.state.flipped;
		this.setState({ flipped: !currentState });
	}

	startTouch(e) {
		this.setState({flipped: this.state.flipped, startPos: {x: e.touches[0].clientX, y: e.touches[0].clientY}, useTransition: false});
	}

	endTouch(e) {
		this.onMove('right', 0);
		const dx = this.state.left, dy = this.state.top;
		if (Math.abs(dx) >= Math.abs(dy)) {
			if (Math.abs(this.state.left) > window.innerWidth / 3) {
				if (this.state.left > 0) {
					this.setState({flipped: this.state.flipped, left: window.innerWidth, top: 0, useTransition: true});
					this.onPoint(1);
				} else if (this.state.left < 0) {
					this.setState({flipped: this.state.flipped, left: -window.innerWidth, top: 0, useTransition: true});
					this.onPoint(3);
				}
			} else {
				this.setState({flipped: this.state.flipped, left: 0, top: 0, useTransition: true});
			}
		} else {
			if (Math.abs(this.state.top) > window.innerHeight / 3) {
				if (this.state.top > 0) {
					this.setState({flipped: this.state.flipped, left: 0, top: window.innerHeight, useTransition: true});
					this.onPoint(-1);
				} else {
					this.setState({flipped: this.state.flipped, left: 0, top: 0, useTransition: true});
					this.onPoint(-1);
				}
			} else {
				this.setState({flipped: this.state.flipped, left: 0, top: 0, useTransition: true});
			} 
		}
	}

	moveTouch(e) {
		const dx = e.touches[0].clientX - this.state.startPos.x;
		const dy = e.touches[0].clientY - this.state.startPos.y;
		if (Math.abs(dx) >= Math.abs(dy)) {
			if (dx >= 0) {
				this.onMove('right', Math.min(dx / (window.innerWidth / 3), 1));
			} else {
				this.onMove('left', Math.abs(Math.max(dx / (window.innerWidth / 3), -1)));
			}
			this.setState({
				flipped: this.state.flipped,
				startPos: this.state.startPos,
				left: dx,
				top: dy
			});
		} else {
			this.onMove('down', Math.min(dy / (window.innerHeight / 3), 1));
			this.setState({
				flipped: this.state.flipped,
				startPos: this.state.startPos,
				left: dx,
				top: dy
			});
		}

		this.forceUpdate();
		
	}
	
	render () {
		return (
			<div
				className = { this.state.flipped ? styles.card + ' ' + styles.flip : styles.card }
				/* onClick = { this.flip } */
				onTouchStart = {this.startTouch.bind(this)}
				onTouchMove = {this.moveTouch.bind(this)}
				onTouchEnd = {this.endTouch.bind(this)}
				onTouchCancel = {this.endTouch.bind(this)}
				style = {{
					left: this.state.left || 0,
					top: this.state.top || 0,
					transition: this.state.useTransition ? 'all .4s ease' : 'all .1s linear'
				}}
			>
				<div className = { styles.red }>
					<div className = { styles.num }>
						1
					</div>
	
					<div className = { styles.word }>
						{ this.red.first || 'Pole'}
					</div>
					<div className = { styles.bottom }>
						<div className = { styles.word }>
							{ this.red.second || 'Pole Vault' }
						</div>
						<div className = { styles.num }>
							3
						</div>
					</div>
				</div>
				<div className = { styles.grey }>
					<div className = { styles.num }>
						1
					</div>
	
					<div className = { styles.word }>
							{ this.grey.first || 'Lick' }
					</div>
					<div className = { styles.bottom }>
						<div className = { styles.word }>
							{ this.grey.second || 'Salt Lick' }
						</div>
						<div className = { styles.num }>
							3
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Card;