import React, {Component} from 'react'
import axios from 'axios'
import {Select, Button, message, Alert} from 'antd'
const { Option } = Select

class Lend extends Component {
	state = {
		allLendables: [],
		selectedLndble: undefined,
		alert: false,
		alertRoom: ''
	}

	componentDidMount() {
		axios.get('/db/get/lendables').then(res => {
			this.setState({ allLendables: res.data })
		})
	}

	lendEquipment = () => {
		if (!this.state.selectedLndble || this.state.selectedLndble.length === 0) {
			message.error('You must select something to lend!')
			return
		}

		axios.post('/db/set/lendable/room', {
			lid: this.state.selectedLndble,
			rid: this.props.rid
		}).then(res => {
			this.setState({
				selectedLndble: undefined,
				alert: false,
				alertRoom: ''
			})

			this.props.actions.getAllLendables()
			this.props.actions.hideAddEqOrLend()
		})
	}

	tryToLend = () => {
		if (!this.state.selectedLndble || this.state.selectedLndble.length === 0) {
			message.error('You must select something to lend!')
			return
		}

		// check if it is in a room already and warn
		axios.post('/db/get/lendable', { lid: this.state.selectedLndble }).then(res => {
			const lndble = res.data

			if (lndble.rid) {
				this.setState({ alert: true, alertRoom: lndble.rid })
			} else {
				this.lendEquipment()
			}
		})
	}

	renderButtons = () => {
		if (this.state.alert) {
			return (
				<Button.Group style={{ marginTop: 16, float: 'right' }}>
					<Button
						onClick={() => this.setState({
							selectedLndble: undefined,
							alert: false,
							alertRoom: ''
						})}
					>
						Cancel
					</Button>
					<Button
						type='danger'
						onClick={this.lendEquipment}
					>
						Force
					</Button>
				</Button.Group>
			)
		}

		return (
			<Button
				style={{ marginTop: 16, float: 'right' }}
				type='primary'
				onClick={this.tryToLend}
			>
				Confirm
			</Button>
		)
	}

	render() {
		return (
			<div>
				<Select
					style={{ width: '100%' }}
					value={this.state.selectedLndble}
					onChange={selectedLndble => this.setState({ selectedLndble })}
					placeholder='Select Equipment to Lend'
					disabled={this.state.alert}
					showSearch
					filterOption={(val, e) => e.props.children.toLowerCase().indexOf(val.toLowerCase()) > -1}
				>
					{this.state.allLendables.map(lndble => (
						<Option key={lndble.lid}>{lndble.lid + ' - ' + lndble.ltype}</Option>
					))}
				</Select>
				{this.state.alert && (
					<Alert
						style={{ marginTop: 16 }}
						message={'Override the current room assignment of ' + this.state.alertRoom + '?'}
						type='error'
					/>
				)}
				{this.renderButtons()}
			</div>
		)
	}
}

export default Lend
