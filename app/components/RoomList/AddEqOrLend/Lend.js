import React, {Component} from 'react'
import axios from 'axios'
import {Select, Button, message, Alert, Icon} from 'antd'
const { Option } = Select

const status = {
	G: <Icon style={{ color: '#52c41a', marginRight: 8 }} type='check' />,
	Y: <Icon style={{ color: '#faad14', marginRight: 8 }} type='exclamation' />,
	R: <Icon style={{ color: '#f5222d', marginRight: 8 }} type='close' />
}

class Lend extends Component {
	state = {
		allLendables: [],
		selectedLndble: undefined,
		alert: false,
		alertRoom: ''
	}

  getAllLendables = () => axios.get('/db/get/lendables').then(res => {
    this.setState({ allLendables: res.data })
  })

	componentDidMount() {
		this.getAllLendables()
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

			this.getAllLendables()
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
						<Option key={lndble.lid}>{status[lndble.lstatus]}{`${lndble.lid} - ${lndble.ltype} from ${lndble.rid ? lndble.rid : 'Storage'}`}</Option>
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
