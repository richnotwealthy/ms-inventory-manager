import React, {Component} from 'react'
import axios from 'axios'
import {Input, Select, Button, message} from 'antd'
const { Option } = Select

class AddEqpmt extends Component {
	state = {
		etype: '',
		estatus: undefined
	}

	addEquipment = () => {
		const { etype, estatus } = this.state

		if (etype.length === 0 || !estatus) {
			message.error('All fields required!')
			return
		}

		let newRoomStatus = estatus

		// if we are changing something to red, room is red at best
		if (newRoomStatus !== 'R' && this.props.currentEqpmt) {
			for (let i = 0; i < this.props.currentEqpmt.length; i++) {
				if (this.props.currentEqpmt[i].estatus === 'Y' && newRoomStatus !== 'R')
					newRoomStatus = 'Y'
				else if (this.props.currentEqpmt[i].estatus === 'R') {
					newRoomStatus = 'R'
					break // red found, can break
				}
			}
		}

		axios.post('/db/new/equipment', {
			etype,
			estatus,
			rid: this.props.rid
		}).then(res => {
			axios.post('/db/set/room', {
				rid: this.props.rid,
				rstatus: newRoomStatus
			}).then(res => {
				this.setState({
					etype: '',
					estatus: undefined
				})

				this.props.actions.getAllRooms()
				this.props.actions.getAllEquipment()
				this.props.actions.hideAddEqOrLend()
			})
		})
	}

	render() {
		return (
			<div>
				<Input
					placeholder='Type (ex. Projector, Lav Mic...)'
					value={this.state.etype}
					onChange={e => this.setState({ etype: e.target.value })}
				/>
				<Select
					placeholder='Status'
					value={this.state.estatus}
					style={{ width: '100%', marginTop: 16 }}
					onChange={estatus => this.setState({ estatus })}
				>
					<Option key='G'>Healthy</Option>
					<Option key='Y'>Working</Option>
					<Option key='R'>Broken</Option>
				</Select>
				<Button
					style={{ marginTop: 16, float: 'right' }}
					type='primary'
					onClick={this.addEquipment}
				>
					Confirm
				</Button>
			</div>
		)
	}
}

export default AddEqpmt
